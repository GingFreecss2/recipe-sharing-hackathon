
import './App.css';
import Header from './Header';
import Layout from './Layout';
import Recipe from './Recipe';
import {Route, Routes} from "react-router-dom";
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { UserContextProvider } from './UserContext';
import CreateRecipe from './pages/CreateRecipe';
import RecipePage from './pages/RecipePage';
import EditRecipe from './pages/EditRecipe';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout/>} > 
          <Route index element={<IndexPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/create' element={<CreateRecipe/>} />
          <Route path='/recipe/:id' element={<RecipePage />} />
          <Route path='/edit/:id' element={<EditRecipe />} />
        </Route>
      </Routes>
    </UserContextProvider>
    
  );
}

export default App;
