import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Header from "../components/Header";
const Axios = require('axios').default;

const Inscription = () => {
    const [pseudo, setPseudo] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const envoiInscription = (e) => {
        e.preventDefault()
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email)) {

            Axios.post('http://localhost:3001/api/inscription', { pseudo: pseudo, email: email, password: password }).then((response) => {
                console.log(response)
            })
        }
        else {
            alert('Mauvaise saisie')
        }
    }


    return (
        <div className="inscription">
            <Header prop={[<Link to="/connexion">Connexion</Link>,
            <Link to="/">Accueil</Link>]} />
            <h1 className="h1-connexion-inscription">Inscription</h1>

            <div className="form-center">
                <form>
                    <div className='form'>
                        <label>Pseudo</label>
                        <label>Adresse mail</label>
                        <label>Mot de passe</label>

                    </div>
                    <div className='form'>

                        <input type='text' id='pseudo' onChange={(e) => { setPseudo(e.target.value) }} />
                        <input type='text' id='mail' onChange={(e) => { setEmail(e.target.value); console.log(e.target.value) }} />
                        <input type='password' id='password' onKeyUp={(e) => { setPassword(e.target.value) }} />
                        <button type='submit' onClick={(e) => { envoiInscription(e) }}><Link to="/connexion">Valider</Link></button>

                    </div>


                </form>
            </div>
        </div>
    );
}

export default Inscription;