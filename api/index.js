const express = require('express');
const cors = require('cors');
const mongoose  = require('mongoose');
const User = require('./models/User');
const Recipe = require('./models/Recipe');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');

const salt = bcrypt.genSaltSync(10);
const secret = 'B2u7fP5Yj9kMd3x6Tr8vQaXsEc1wZ4oG';

//mongodb password
//P3FO8tuKTCGtxx8p
//wdkcemVedamKZPW7

app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

//mongoose.connect('mongodb+srv://mohamedlaasriexe:NX9kPD1q4zxlCAhf@cluster0.nlkjeyz.mongodb.net/?retryWrites=true&w=majority');
mongoose.connect('mongodb+srv://mohamedlaasriexe:wdkcemVedamKZPW7@cluster0.odtnsqy.mongodb.net/?retryWrites=true&w=majority');

app.post('/register', async (req,res) => {
    const {username, password} = req.body;
    try{
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);

    } catch(e){
        console.log(e);
        res.status(400).json(e);
    }
}); 


app.post('/login', async (req,res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password); 
    if (passOk) {
        //logged in
        jwt.sign({username,id:userDoc._id}, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                id:userDoc._id,
                username,
            });
        });
    } else {
        res.status(400).json('wrong credentials');
    }
});

app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err,info) => {
        if (err) throw err;
        res.json(info);
    });
});

app.post('/logout', (req,res) => {
    res.cookie('token', '').json('ok');
});

 app.post('/recipe', uploadMiddleware.single('file') , async (req,res) => {
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path+'.'+ext ;
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
        if (err) throw err;
        const { name, ingredients, steps, prepTime} = req.body;
        const recipeDoc = await Recipe.create({
            name,
            ingredients: JSON.parse(ingredients), // Parse ingredients as an array
            steps: JSON.parse(steps), // Parse steps as an array
            prepTime: JSON.parse(prepTime), // Parse prepTime as an array
            photo:newPath,
            author:info.id,
        });
    res.json(recipeDoc);
    });
});

app.put('/recipe/:id', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      newPath = path + '.' + ext;
      fs.renameSync(path, newPath);
    }
  
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const { id, name, ingredients, steps, prepTime } = req.body;
      const recipeDoc = await Recipe.findById(id);
      const isAuthor = JSON.stringify(recipeDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json('you are not the author');
      }
  
      await Recipe.updateOne(
        { _id: id },
        {
          name,
          ingredients: JSON.parse(ingredients), // Parse ingredients as an array
          steps: JSON.parse(steps), // Parse steps as an array
          prepTime: JSON.parse(prepTime), // Parse prepTime as an array
          photo: newPath ? newPath : recipeDoc.photo,
        }
      );
  
      const updatedRecipeDoc = await Recipe.findById(id); // Fetch the updated recipe
      res.json(updatedRecipeDoc);
    });
  });

app.get('/recipe', async (req,res) => {
    res.json(
        await Recipe.find()
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(20)
    );
});

app.get('/recipe/:id', async (req,res) => {
    const {id} = req.params;
    const recipeDoc = await Recipe.findById(id).populate('author', ['username']);
    res.json(recipeDoc);
})

// app.get('/recipe/:id', async (req, res) => {
//     const {id} = req.params;
//     const {token} = req.cookies;
 
//     if (token) {
//         jwt.verify(token, secret, {}, async (err, info) => {
//             if (err) {
//                 return res.status(401).json({ error: 'Invalid token' });
//             }
 
//             const recipeDoc = await Recipe.findById(id).populate('author', ['username']);
//             res.json(recipeDoc);
//         });
//     } else {
//         const recipeDoc = await Recipe.findById(id);
//         res.json(recipeDoc);
//     }
//  });
 
 

//Search for Recipes using name, or ingredients or prep time
// Didn't have enough time to implement search functionality
app.get('/recipes/search', async (req, res) => {
    const { query } = req.query;

    // Search for recipes that match the provided query
    try {
        const recipes = await RecipeModel.find({
            $or: [
                { name: { $regex: query, $options: 'i' } }, // Search by name (case-insensitive)
                { ingredients: { $regex: query, $options: 'i' } }, // Search by ingredients (case-insensitive)
                { prepTime: { $regex: query, $options: 'i' } }, // Search by prep time (case-insensitive)
            ],
        })
        .populate('author', ['username']);

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: 'Search failed', error: error.message });
    }
});


app.listen(4000);

//mongoDB
//NX9kPD1q4zxlCAhf

//mongodb+srv://mohamedlaasriexe:NX9kPD1q4zxlCAhf@cluster0.nlkjeyz.mongodb.net/?retryWrites=true&w=majority