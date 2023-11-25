import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

export default function EditRecipe() {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [steps, setSteps] = useState('');
    const [prepTime, setPrepTime] = useState('');
    const [photo, setPhoto] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:4000/recipe/${id}`)
            .then(response => {
                response.json().then(recipeInfo => {
                    setName(recipeInfo.name);
                    setIngredients(recipeInfo.ingredients.join(', '));
                    setSteps(recipeInfo.steps.join('\n'));
                    setPrepTime(recipeInfo.prepTime);
                });
            });
    }, []);

    async function updateRecipe(ev) {
        ev.preventDefault();

        const data = new FormData();
        data.set('name', name);
        data.set('ingredients', JSON.stringify(ingredients.split(', ').map(item => item.trim())));
        data.set('steps', JSON.stringify(steps.split('\n').map(step => step.trim())));
        data.set('prepTime', prepTime);
        data.set('id', id);

        if (photo?.[0]) {
            data.set('file', photo?.[0]);
        }

        const response = await fetch(`http://localhost:4000/recipe/${id}`, {
            method: 'PUT',
            body: data,
            credentials: 'include',
        });

        if (response.ok) {
            setRedirect(true);
        }
    }

    if (redirect) {
        return <Navigate to={`/recipe/${id}`} />;
    }

    return (
        <form onSubmit={updateRecipe}>
            <input type="text" placeholder={'Recipe Name'} value={name} onChange={ev => setName(ev.target.value)} />
            <input type="text" placeholder={'Preparation Time'} value={prepTime} onChange={ev => setPrepTime(ev.target.value)} />
            <input type="file" onChange={ev => setPhoto(ev.target.files)} />

            <div>
                <label>Ingredients:</label>
                <textarea placeholder="Enter ingredients (comma-separated)" value={ingredients} onChange={ev => setIngredients(ev.target.value)}></textarea>
            </div>

            <div>
                <label>Steps:</label>
                <textarea placeholder="Enter steps (each on a new line)" value={steps} onChange={ev => setSteps(ev.target.value)}></textarea>
            </div>

            <button style={{ marginTop: '5px' }}>Update Recipe</button>
        </form>
    );
}
