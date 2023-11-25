import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function CreateRecipe() {
    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [steps, setSteps] = useState([]);
    const [prepTime, setPrepTime] = useState('');
    const [photo, setPhoto] = useState('');
    const [redirect, setRedirect] = useState(false);

    async function createNewRecipe(ev) {
        ev.preventDefault();

        const data = new FormData();
        data.set('name', name);
        data.set('ingredients', JSON.stringify(ingredients));
        data.set('steps', JSON.stringify(steps));
        data.set('prepTime', prepTime);
        data.set('file', photo);

        const response = await fetch('http://localhost:4000/recipe', {
            method: 'POST',
            body: data,
            credentials: 'include',
        });

        if (response.ok) {
            setRedirect(true);
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />;
    }

    return (
        <form onSubmit={createNewRecipe}>
            <input type="text" placeholder={'Recipe Name'} value={name} onChange={ev => setName(ev.target.value)} />
            <input type="text" placeholder={'Preparation Time (in minutes)'} value={prepTime} onChange={ev => setPrepTime(ev.target.value)} />
            <input type="file" onChange={ev => setPhoto(ev.target.files[0])} />
            
            <div>
                <label>Ingredients:</label>
                <textarea placeholder="Enter ingredients (comma-separated)" value={ingredients} onChange={ev => setIngredients(ev.target.value.split(','))}></textarea>
            </div>

            <div>
                <label>Steps:</label>
                <textarea placeholder="Enter steps (each on a new line)" value={steps} onChange={ev => setSteps(ev.target.value.split('\n'))}></textarea>
            </div>

            <button style={{ marginTop: '5px' }}>Create Recipe</button>
        </form>
    );
}
