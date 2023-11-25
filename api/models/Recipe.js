const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const RecipeSchema = new Schema({
    name: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    steps: [{ type:String, required: true }],
    prepTime: [{ type:Number, required: true }],
    photo: String, 
    author: {type:Schema.Types.ObjectId, ref:'User'},
},{
    timestamps: true,
});

const RecipeModel = model('Recipe', RecipeSchema);

module.exports =  RecipeModel;

/*
Store the recipe time for the moment in minutes change it if time allows it
preparationTime: {
    hours: { type: Number, required: true },
    minutes: { type: Number, required: true },
    seconds: { type: Number, required: true }
  }
*/