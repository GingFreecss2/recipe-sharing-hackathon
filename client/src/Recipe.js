import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function Recipe({_id, name, ingredients, steps, prepTime, photo, createdAt, author}) {
    return (
        <div className="recipe">
            <div className="image">
                <Link to={`/recipe/${_id}`}>
                    <img src={'http://localhost:4000/' + photo} alt="" />
                </Link>
            </div>
            <div className="texts">
                <Link to={`/recipe/${_id}`}>
                    <h2>{name}</h2>
                </Link>
                <p className="info">
                    <a className="author">{author.username}</a>
                    <time>{format(new Date(createdAt), 'MMM d, yyyy HH:mm')}</time>
                </p>
                <div className="ingredients">
                    <h3>Ingredients:</h3>
                    <ul>
                        {ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </div>
                <div className="steps">
                    <h3>Steps:</h3>
                    <ol>
                        {steps.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
                <p className="prepTime">
                    <strong>Preparation Time:</strong> {prepTime.join(', ')}
                </p>
            </div>
        </div>
    );
}
