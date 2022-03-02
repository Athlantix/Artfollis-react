import Header from '../components/Header'
import { Routes, Route, Link } from "react-router-dom";

const Accueil = () => {
  
    return ( 
    
    <div className="Accueil">
      <Header prop={ [<Link to="/inscription">Inscription</Link>,
      <Link to="/connexion">Connexion</Link>]}/>

      <div className='accueil-main'>
        <div className='grey-background'>
          <div className='accueil-presentation'>
            <h1>Bienvenue sur <span>Artfollis</span></h1>
            <p>Partageons nos idées et nos créations</p>
            <p className='border-connect'><Link to="/connexion">Connectez-vous</Link></p>
            <p className='border-connect'><Link to="/inscription">Créer un compte</Link></p>

          </div>
        </div>

      </div>
    </div>
     );
}

export default Accueil ;