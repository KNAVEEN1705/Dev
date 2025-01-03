const express = require('express');
const connectdb=require("./config/database")
const app = express();
const User= require('./models/user');
const validator=require("validator")
const {validateSignupData}=require("./utils/validation")
const bcrypt=require("bcrypt")
const cookieParsar=require("cookie-parser")
const jwt= require("jsonwebtoken");

const {userauth}=require('./middleware/auth')

app.use(express.json());
app.use(cookieParsar());
app.post("/signup", async (req, res) => {
    try {
        // Validate user data
        validateSignupData(req);

        const { firstName, lastName, emailId, password } = req.body;

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });

        await user.save();
        res.status(201).send("User successfully registered");

    } catch (err) {
        // Handle validation errors or other errors
        res.status(400).send("Error: " + err.message);
    }
});

//Login api

app.post("/login",async(req,res)=>{
    try{
        const{emailId,password}=req.body;
        //User means 
        const user= await User.findOne({emailId:emailId})
        if(!user){
            throw new Error("Email is not in db")
        }
        const ispassword= await user.validatePassword(password)
        if(ispassword){
            //To generate the token
            const token= await user.getJWT();
            //
            res.cookie("token",token)

            res.send("Login successfull")
        }else{
            throw new Error("Invalid password")
        }
    }catch (err) {
        // Handle validation errors or other errors
        res.status(400).send("Error : " + err.message);
    }
})
app.get("/profile",userauth,async(req,res)=>{
    try{
        const user=req.user;
        res.send(user)
    }catch(err){
        res.status(400).send("Error: " + err.message);
    }
})
 //find a user data with emailid
  app.get("/user",async(req,res)=>{
    try{

        const user= await User.find({emailId:req.body.emailId});
        if(user.length===0){
            res.status(404).send("User not found");
        }else{
        res.send(user);
    }
    }
    catch(err){
        res.status(400).send("Error in finding")
    }
      
  })

  
  // find a user data with userID
  app.get("/user",async(req,res)=>{
    const userId= req.body.userID
    try{
        const user= await User.findById(userId);
        res.send(user)
    }
    catch(err){
        res.status(400).send("Error in finding")
    }
      
  })
  // Get all users with feed api
  app.get("/feed", async(req,res)=>{
    try{

        const user= await User.find({})
        res.send(user);
    }catch(err){
        res.status(404).send("users not found !!!")
    }
  })
  // Delete user by using id 
   app.delete("/user", async(req,res)=>{
     
    const userID=req.body.userID;
    try{
        const user= await User.findByIdAndDelete(userID);
        res.send("User Sucessfully deleted");
    }catch(err){
        res.status(404).send("users not found !!!")
    }
   });
   // update user with userID
app.patch("/user/:userID", async (req, res) => {
    const userId = req.params?.userID;
    const data = req.body;

    try {
        // Allowed fields to update
        const allowedUpdate = ["photoURL", "skills", "gender", "age"];
        
        // Check if all keys in the data are allowed to be updated
        const isUpdateAllowed = Object.keys(data).every((key) => allowedUpdate.includes(key));

        if (!isUpdateAllowed) {
            throw new Error("Not allowed to update one or more fields");
        }
          // Validate skills if present
          if (data.skills) {
            if (!Array.isArray(data.skills)) {
                throw new Error("Skills must be an array.");
            }
            if (data.skills.length > 10) {
                throw new Error("Skills must be 10 or fewer.");
            }
        }
        if(data.photoURL){
            if(!validator.isURL(data.photoURL)){
                throw new Error("Invalid url")
            }
        }
        // Attempt to find and update the user
        const updatedUser = await User.findByIdAndUpdate(userId, data, { new: true });

        // Check if user was found and updated
        if (!updatedUser) {
            return res.status(404).send("User not found");
        }

        res.send("User info successfully updated");

    } catch (err) {
        if (err.message === "Not allowed to update one or more fields") {
            return res.status(400).send(err.message);  // Return 400 for validation errors
        }
        res.status(500).send("Server error: " + err.message);  // Internal server error for other errors
    }
});

connectdb().then(()=>{
    console.log("DataBase connected successfully....")
    // Start the server
    app.listen(8000, () => {
        console.log("Server is listening on port 8000");
    });
    }).catch(err=>{
    console.error("Database not connected successfully...")
    })





