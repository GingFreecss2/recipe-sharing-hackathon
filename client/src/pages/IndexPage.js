import { useEffect, useState } from "react";
import Recipe from "../Recipe";
import { Link } from "react-router-dom"; // Import Link from React Router

export default function IndexPage() {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/recipe').then(response => {
            response.json().then(recipes => {
                const updatedRecipes = recipes.map(recipe => ({
                    ...recipe,
                    photo: `http://localhost:4000/${recipe.photo}`
                }));
                setRecipes(updatedRecipes);
            });
        });
    }, []);

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {recipes.length > 0 && recipes.map(recipe => (
                <div key={recipe._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <Link to={`/recipe/${recipe._id}`} style={{ textDecoration: 'none' }}>
                        <img src={recipe.photo} alt={recipe.name} style={{ maxWidth: '100%', maxHeight: '500px', marginRight: '20px' }} />
                    </Link>
                    <div>
                        <Link to={`/recipe/${recipe._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <h2>{recipe.name}</h2>
                        </Link>
                        <p>Author: {recipe.author.username}</p>
                        <p>Prep Time: {recipe.prepTime} minutes</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
