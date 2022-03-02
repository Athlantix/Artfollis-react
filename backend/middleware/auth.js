const jwt=require('jsonwebtoken');
require('dotenv').config()

module.exports=(req,res,next)=>{
    try{
        let token=req.headers.authorization.split(' ')[1];
        req.token=jwt.verify(token,process.env.JWT_SECRET)
        next()
    }
    catch{
        res.status(404).json({message:'erreur authentification'})
    }

}