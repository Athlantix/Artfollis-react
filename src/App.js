import './App.css';
import { BrowserRouter, Routes, Route} from "react-router-dom"
import Inscription from './pages/Inscription'
import Connexion from './pages/Connexion'
import Accueil from './pages/Accueil'
import NotFound from './pages/NotFound'
import Gallerie from './pages/Gallerie'





const App = () => {
  
    return (
        <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Accueil/>}/>
          <Route exact path="/inscription" element={<Inscription/>}/>
          <Route exact path="/connexion" element={<Connexion/>}/>
          <Route exact path="/gallerie" element={<Gallerie/>}/>
          <Route element={<NotFound/>}/>
        </Routes>
        </BrowserRouter>
      );

}

export default App ;