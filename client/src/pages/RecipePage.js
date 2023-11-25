import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import { format } from "date-fns";

export default function RecipePage() {
    const [recipeInfo, setRecipeInfo] = useState(null);
    const { userInfo } = useContext(UserContext);
    const { id } = useParams();

    useEffect(() => {
        fetch(`http://localhost:4000/recipe/${id}`)
            .then(response => {
                response.json().then(recipeInfo => {
                    setRecipeInfo(recipeInfo);
                });
            });
    }, []);

    if (!recipeInfo) return '';

    return (
        <div className="recipe-page">
            <div className="image">
                <img src={`http://localhost:4000/${recipeInfo.photo}`} alt={recipeInfo.name} />
            </div>
            <div className="top-info" style={{ textAlign: 'center', marginTop: '10px' }}>
                <div className="author">
                    Written by {recipeInfo.author.username} 
                </div>
                <time>{format(new Date(recipeInfo.createdAt), 'MMM d, yyyy')}</time>
                {userInfo.id === recipeInfo.author._id && (
                    <div className="edit-row" style={{ textAlign: 'center', marginTop: '10px' }}>
                        <Link className="edit-btn" to={`/edit/${recipeInfo._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            Edit this Recipe
                        </Link>
                    </div>
                )}
            </div>
            <h1>{recipeInfo.name}</h1>
            <div className="prepTime">
                <h3>Time to Prep:</h3>
                <p>{recipeInfo.prepTime} minutes</p>
            </div>
            <div className="ingredients">
                <h3>Ingredients:</h3>
                <ul>
                    {recipeInfo.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                    ))}
                </ul>
            </div>
            <div className="steps">
                <h3>Steps:</h3>
                <ol>
                    {recipeInfo.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                    ))}
                </ol>
            </div>
        </div>
    );
}
