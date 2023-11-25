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
            <div className="author-date">
                <div className="author">{recipeInfo.author.username}</div>
                <time>{format(new Date(recipeInfo.createdAt), 'MMM d, yyyy')}</time>
            </div>
            {userInfo.id === recipeInfo.author._id && (
                <div className="edit-row">
                    <Link className="edit-btn" to={`/edit/${recipeInfo._id}`} >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        Edit this Recipe
                    </Link>
                </div>
            )}
        </div>
    );
}
