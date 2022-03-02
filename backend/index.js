const express=require('express')
const app= express()
const mysql=require('mysql')
const bodyParser= require('body-parser')
const cors=require('cors')
const path = require('path');
const multer=require('./middleware/multer')
const fs = require('fs');
const jwt=require('jsonwebtoken')
const auth=require('./middleware/auth')
const helmet = require("helmet");
const validator = require("email-validator");
const bcrypt = require('bcrypt');
const sha256 = require('sha256');
const { application } = require('express')


require('dotenv').config()

const db=mysql.createPool({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database: process.env.DB,
})
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(helmet());

app.listen(3001,()=>{
    console.log('okkk')
})

app.post('/api/insert',auth,multer,(req,res)=>{
    console.log(req.token)
    const sqlInsert= "INSERT INTO article (name,description,image,idUser) VALUES (?,?,?,?);"
    const name=req.body.name;
    const description=req.body.description;
    const image=`${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    db.query(sqlInsert,[name,description,image,req.token],(err,result)=>{
        res.send(result)
    })
})
app.get('/api/get',auth,(req,res)=>{
    const sqlInsert= " SELECT article.id,image,name,description,user.pseudo ,article.idUser,liked FROM article,user WHERE article.idUser=user.id;"
    db.query(sqlInsert,(err,result)=>{
    res.send(result)
    })
})

app.get('/api/currentUser',auth,(req,res)=>{
    console.log(req.token)
    const sqlInsert= "SELECT * FROM user WHERE id=?;"
    let id=req.token
    db.query(sqlInsert,id,(err,result)=>{
        console.log(result)
    res.send(result)
    })
})

app.delete('/api/delete/:id',auth,(req,res)=>{
    console.log('kopo'+req.token)
    const sqlInsert1= "SELECT image FROM article WHERE idUser=? AND id=?;"
    const idImg=req.params.id
    const idUser=req.token
    console.log(idImg)
    db.query(sqlInsert1,[idUser,idImg],(err,resultat)=>{
        console.log(resultat)
        
        if(resultat){
            const resultImg=resultat[0].image
            const filename = resultImg.split('http://localhost:3001/images/'); 
            
            fs.unlink(`images/${filename[1]}`,(error => {
              if (error) console.log(error);}
              ))
        }else{
            console.log('erreur')           
        }
 
        
        })

    const sqlInsert= "DELETE FROM article WHERE idUser=? AND id=?;"
    db.query(sqlInsert,[idUser,idImg],(err,result)=>{
        if (err) { res.status(400).json({message:'Impossible de supprimer la publication'})}
        else{res.status(200).json({message:'Publication supprimée'})}
    })
})

app.put('/api/modify',(req,res)=>{
    const currentName=req.body.currentName
    const newName=req.body.newName
    const newDescription=req.body.description
    const sqlInsert=  'UPDATE article SET name= ?,description= ? WHERE name=?;'
    console.log(currentName)
    db.query(sqlInsert,[newName,newDescription,currentName],(err,result)=>{
        if(err){res.status(400).json({message:'Modifications non effectuées'})}
        else{res.status(200).json({message:'Modification réussie'})}
        })
})

//----------inscription
app.post('/api/inscription',(req,res)=>{
    const sqlInsert='INSERT INTO user( pseudo,email,password) VALUE (?,?,?);'
    const pseudo=req.body.pseudo;
    const email=req.body.email;
    const password=req.body.password;
    const hashPsd = bcrypt.hashSync(password, 2);
    console.log(req.body)
    if(validator.validate(email)){

        db.query(sqlInsert,[pseudo,sha256(email),hashPsd],(err,result)=>{
            if(err){res.status(400).json({message:'Erreur, valeurs incorrectes'})}
            else{res.status(200).json({message:'Utilisateur crée'})}
            })
    }else{
        res.status(400).json({message:'Erreur, valeurs incorrectes'})
    }
  
})



//---------connexion
app.post('/api/connexion',(req,res)=>{
    const sqlInsert='SELECT email,password,id FROM user WHERE email=?;'
    const email=sha256(req.body.email);
    
    db.query(sqlInsert,[email],(err,result)=>{
       

        if(result[0]===undefined){
           console.log('error')
           res.status(400).json({message:'Valeurs non reconnues'})
        }else {
            let testPsd= bcrypt.compareSync(req.body.password, result[0].password)
            console.log(testPsd)
            if(testPsd === true){
               
            const idUser=result[0].id
            let token=jwt.sign(idUser,process.env.JWT_SECRET)
            res.status(200).json({token})
            }

        }
        })
}
)

//--------Like ou dislike

app.put('/api/like',auth,(req,res)=>{
    console.log(req.body.idUser)
    const sqlInsert='SELECT * FROM liked WHERE idUser=? AND idImg=?;'
    const idUser=req.body.idUser;
    const idImg=req.body.idImg;
    console.log(req.body.idImg)
 db.query(sqlInsert,[idUser,idImg],(err,resultat)=>{
    console.log(resultat[0])
    if(resultat[0]===undefined){  
    const sqlInsert2='INSERT INTO liked VALUES (?,?,?)'
    db.query(sqlInsert2,[idUser,1,idImg],(err,resultat)=>{
    console.log(resultat)
    })

    const sqlInsert3='UPDATE article SET liked=(liked+1) WHERE id=?;'
    db.query(sqlInsert3,idImg,(err,resultat)=>{
        console.log('le resultat'+resultat)
        })
    }
    else{
        const sqlInsert4='UPDATE article SET liked=(liked-1) WHERE id=?;'
        db.query(sqlInsert4,idImg,(err,resultat)=>{
            console.log('le resultat'+resultat)
            })

            const sqlInsert5='DELETE FROM liked WHERE idImg=?;'
            db.query(sqlInsert5,idImg,(err,resultat)=>{
                console.log('le resultat'+resultat)
                })
        console.log('existe deja')
        


    }
 })

})




