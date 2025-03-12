const express= require('express');
const { userauth } = require('../middleware/auth');
const{validateEditProfileData}=require('../utils/validation')
const user = require('../models/user');
const profileRouter=express.Router();
const bcrypt=require('bcrypt');
const validator = require("validator")
profileRouter.use(express.json());
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


profileRouter.patch("/profile/password", userauth, async (req, res) => {
    try {
        const currentUser = req.user; // Assuming `userauth` attaches the user object to `req.user`
        const { password } = req.body;

        // Ensure the new password is provided
        if (!password) {
            return res.status(400).send("New password is required.");
        }

        // Validate password strength
        if (!validator.isStrongPassword(password)) {
            return res.status(400).send("Password is not strong enough.");
        }
        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(password, 10);

        // Update the password in the database
        currentUser.password = hashedNewPassword;
        await currentUser.save(); // Save the updated user document

        res.status(200).send("Password updated successfully.");
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).send("Error: " + err.message);
    }
});

module.exports= profileRouter;