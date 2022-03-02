import React, { useEffect, useState } from 'react';
import Article from '../components/Articles';
import Header from '../components/Header';
import { Routes, Route, Link } from "react-router-dom";

const Axios = require('axios').default;


function Gallerie() {
  const [useData, setData] = useState([])
  const [activeForm, setActiveForme] = useState('')
  const [activeForm2, setActiveForme2] = useState(false)
  const [inputValueNom, setInputValueNom] = useState('')
  const [inputValueDescription, setInputValueDescription] = useState('')
  const [inputImage, setInputImage] = useState('')
  const [verifNom, setVerifNom] = useState(0)
  const [modifyNom, setModifNom] = useState('')
  const [modifyDescription, setModifDescription] = useState('')
  const [addVerif, setAddVerif] = useState(false)

  useEffect(() => {
    let token = localStorage.getItem('token')
    Axios.get('http://localhost:3001/api/get',
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).then((response) => {
      console.log(response.data)
      setData(response.data)
    })
    console.log(useData)

  }, [])

  console.log(useData)



  //------Apparition du formulaire modification -----
  const handleClick = (e, key) => {
    e.preventDefault()
    setActiveForme2(!activeForm2)

    useData.forEach(elem => {
      if (useData[key].id === elem.id) {
        setActiveForme(useData[key].id)
      }
    })

  }
  //------Recupere modification nom article-----

  const modifNom = (e, key) => {
    let value = e.target.value
    setModifNom(value)
  }
  //------Recupere modification description article-----

  const modifDescription = (e, key) => {
    let value = e.target.value
    setModifDescription(value)

  }


  //------Modification article-----

  const validModif = (e, key) => {
    console.log(modifyDescription)
    let nom = modifyNom
    let descriptionFinal = modifyDescription
    if (modifyDescription === '') {
      descriptionFinal = useData[key].description
    }
    if (modifyNom === '') {
      nom = useData[key].name
    }
    let currentName = useData[key].name
    Axios.put('http://localhost:3001/api/modify',
      { newName: nom, currentName: currentName, description: descriptionFinal })
      .then(() => {
        window.location.reload();
      }
      )
  }
  //------Nom article-----
  const addArticle = (e) => {
    const data = e.target.value
    setInputValueNom(data)
  }
  //------Image article-----

  const loadImage = (e) => {
    console.log(e.target.files[0]
    )
    setInputImage(e.target.files[0])
  }

  //------Description article-----

  const addArticleDescription = (e) => {
    const data = e.target.value
    setInputValueDescription(data)
  }

  //------ Envoyer article-----
  const clickEnvoyer = (e) => {
    setVerifNom(0)
    let test = 0
    for (let i = 0; i < useData.length; i++) {
      if (useData[i].name === inputValueNom) {
        test = test + 1;
      }
    }
    setVerifNom(verifNom + 1)

    if (test === 0) {
      console.log(inputImage)
      const formData = new FormData()
      formData.append('name', inputValueNom)
      formData.append('description', inputValueDescription)
      formData.append('image', inputImage)
      
      setData([...useData, { name: inputValueNom, image: inputImage, description: inputValueDescription }])
      let token = localStorage.getItem('token')

      Axios.post('http://localhost:3001/api/insert', formData,
        {
          headers:
          {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${token}`
          }
        }
      )
        .then(() => {
          console.log('sucessfull'); window.location.reload();
        })
    } else {
      test = 0
    }
  }
  //------Supprimer article-----

  const dropArticle = (e, key) => {

    let token = localStorage.getItem('token')
    Axios.delete(`http://localhost:3001/api/delete/${useData[key].id}`, {
      headers:
      {
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
      window.location.reload();
    })

  }
  // Apparition menu ajouter
  const menuAjouter = () => {
    console.log('ok')
    setAddVerif(!addVerif)

  }



  //Condition
  let ajout = null;
  if (addVerif) {
    ajout =
      <div className='ajouter'>
        <p>Nom</p><input type='text' onKeyUp={(e) => addArticle(e)} />
        <p>Image</p><input type='file' name='file' onChange={(e) => loadImage(e)} />
        <p>Description</p><input type='text' onKeyUp={(e) => addArticleDescription(e)} /><br />
        <button onClick={(e) => clickEnvoyer(e)}>Envoyer</button>
      </div>
  }


  const articles = Object.keys(useData).map(key => (
    <Article
      key={key}
      liked={useData[key].liked}
      pseudo={useData[key].pseudo}
      idUser={useData[key].idUser}
      image={useData[key].image}
      id={useData[key].id}
      nom={useData[key].name}
      description={useData[key].description}
      dropArticle={(e) => dropArticle(e, key)}
      handleClick={(e) => handleClick(e, key)}
      activeForm={activeForm}
      activeForm2={activeForm2}
      modifNom={(e) => modifNom(e, key)}
      modifDescription={(e) => modifDescription(e, key)}
      validModif={(e) => validModif(e, key)}
    />

  ))



  return (
    <div className="App">
      <Header prop={[<Link to="/">Deconnexion</Link>]} />
      <div className='publier'>Publier<div onClick={menuAjouter} className='plus'>+</div></div>
      {ajout}

      <div className='main'>

        <div className='rubrique-article'>
          {articles}
        </div>

      </div>

    </div>

  );
}

export default Gallerie;
