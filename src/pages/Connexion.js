import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Header from "../components/Header";
const Axios = require('axios').default;

const Connexion = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const envoiConnexion = (e) => {
        e.preventDefault()
        const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!reg.test(email)) { alert('Mauvaise saisie') }
        else {
            Axios.post('http://localhost:3001/api/connexion', { email: email, password: password }).then((response) => {
                localStorage.setItem('token', response.data.token);
                document.location.href = "http://localhost:3000/gallerie";
            })
        }

    }

    return (
        <div className="connexion">
            <Header prop={[<Link to="/inscription">Inscription</Link>,
            <Link to="/">Accueil</Link>]} />
            <h1 className="h1-connexion-inscription">Connexion</h1>

            <div className="form-center">
                <form>
                    <div className='form'>
                        <label>Adresse mail</label>
                        <label>Mot de passe</label>

                    </div>
                    <div className='form'>
                        <input type="email" id='email' onChange={(e) => { setEmail(e.target.value) }} />
                        <input type='password' id='password' onChange={(e) => { setPassword(e.target.value) }} />
                        <button type='submit' onClick={(e) => { envoiConnexion(e) }}>Valider</button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default Connexion;