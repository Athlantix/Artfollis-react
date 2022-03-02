import { useEffect, useState } from 'react';

const Axios = require('axios').default;

const Article = (props) => {
  const [idUserApi, setUserApi] = useState('')
  const [imgEvent, setImgEvent] = useState(false)


  useEffect(() => {
    let token = localStorage.getItem('token')

    Axios.get('http://localhost:3001/api/currentUser',
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).then((response) => {
      setUserApi(response.data[0].id)

    })
  }, [])

  const sendLike = () => {

    let token = localStorage.getItem('token')
    Axios.put('http://localhost:3001/api/like', { idUser: idUserApi, idImg: props.id },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).then((response) => {

      setUserApi(response.data[0].id);
    })

    setTimeout(function () {
      window.location.reload()
    }, 200);
  }

  const imageZoom = () => {
    setImgEvent(!imgEvent)
    console.log(imgEvent)
  }
  //Activer formulaire de modification
  let form = null
  if (props.activeForm === props.id && props.activeForm2) {
    form =
      <div>
        <p>Modifier nom</p>
        <input type='text' maxLength="15" onChange={props.modifNom} />
        <p>Modifier description</p>
        <input type='text' maxLength="30" onChange={props.modifDescription} />
        <button onClick={props.validModif}>valider</button>
      </div>
  }
  const dezoom = () => {
    setImgEvent(!imgEvent)
  }

  //Option de modif/suppr pour le bon utilisateur
  let modifSuppr = null;

  if (props.idUser === idUserApi) {
    modifSuppr =
      <div>
        <button onClick={props.handleClick}>Modifier</button>
        <button onClick={props.dropArticle}>Supprimer</button>
      </div>
  }

  //Fenetre de visualistation de l'image cliauée 
  let imageWindow = null;
  if (imgEvent === true) {
    imageWindow =
      <div className='imageZoom' onClick={dezoom}>
        <img src={props.image} />
      </div>
  }

  return (

    <div className="article">
      {imageWindow}
      <div>
        <p className='pseudo'>{props.pseudo}</p>
        <p className="nom">{props.nom}</p>
        <img src={props.image} onClick={() => imageZoom()} />
        <p className="description">{props.description}</p>
      </div>
      <button className='heart' onClick={() => sendLike()}> 	<span>&hearts;</span> {props.liked}</button>
      {modifSuppr}
      <div className='modifier'> {form}</div>
    </div>
  );
}

export default Article;