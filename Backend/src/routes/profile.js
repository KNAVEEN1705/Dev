const express= require('express');
const { userauth } = require('../middleware/auth');
const{validateEditProfileData}=require('../utils/validation')
const user = require('../models/user');
const profileRouter=express.Router();

profileRouter.get("/profile/view",userauth,async(req,res)=>{
    try{
        const user=req.user;
        res.send(user)
    }catch(err){
        res.status(400).send("Error: " + err.message);
    }
})
profileRouter.patch("/profile/edit",userauth, async(req,res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request")
        }
        const loggedUser=req.user;
        Object.keys(req.body).forEach((keys)=>loggedUser[keys]=req.body[keys])
        await loggedUser.save();
        res.send(`${loggedUser.firstName} Your Profile Successfully Updated`)
    }catch(err){
        res.status(404).send("Error : " + err.message);
    }
})
module.exports= profileRouter;