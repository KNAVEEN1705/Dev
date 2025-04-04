const express= require('express');
const bcrypt=require('bcrypt')
const User=require("../models/user")
const{ validateSignupData}= require("../utils/validation");
const authRouter= express.Router();
const validatePassword= require("../models/user");
const { now } = require('mongoose');


//Signup Api
authRouter.post("/signup", async (req,res)=>{
    try {
        // Validate user data
        validateSignupData(req);

        const { firstName, lastName, emailId, password} = req.body;

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });
        const savedUser = await user.save();
        const token= await savedUser.getJWT();
        //
        res.cookie("token",token ,{
            expires: new Date(Date.now()+ 8 * 3600000)
        })

        res.json({message:"User successfully registered",data:savedUser})
    } catch (err) {
        // Handle validation errors or other errors
        res.status(400).send("Error: " + err.message);
    }
});






module.exports = authRouter;


//Login Api
authRouter.post("/login",async(req,res)=>{
    try{
        const{emailId,password}=req.body;
        //User means 
        const user= await User.findOne({emailId:emailId})
        if(!user){
            throw new Error("User not found");
        }
        const ispassword= await user.validatePassword(password)
        if(ispassword){
            //To generate the token
            const token= await user.getJWT();
            //
            res.cookie("token",token ,{
                expires: new Date(Date.now()+ 8 * 3600000)
            })

            res.send(user)
        }else{
            throw new Error("Invalid password")
        }
    }catch (err) {
        // Handle validation errors or other errors
        res.status(400).send("Error : " + err.message);
    }
})
//LogOut Api
authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now())
    });
    res.send("User Logout successfully")
});
module.exports= authRouter;