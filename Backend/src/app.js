const express = require('express');
const connectdb=require("./config/database")
const app = express();
const User= require('./models/user');

app.use(express.json());
 app.post("/signup",async(req,res)=>{
    const user = new User(req.body);
    try{
       await user.save();
        res.send("Data saved")
    }
    catch(err){
        res.status(400).send("Error"+err.message)
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
//update the user by using PATCH method
app.patch("/user",async(req,res)=>{
    const userId=req.body.userID;
    const data=req.body
    try{
        await User.findByIdAndUpdate(userId,data);
        res.send("User info sucessfully updated");
    }catch(err){
        res.status(404).send("users not found !!!")
    }
})
connectdb().then(()=>{
    console.log("DataBase connected successfully....")
    // Start the server
    app.listen(8000, () => {
        console.log("Server is listening on port 8000");
    });
    }).catch(err=>{
    console.error("Database not connected successfully...")
    })

// app.post("/signup",async(req,res)=>{
//     const user= new User({
//         firstName:"Naveen",
//         lastName:"K",
//         emailId:"naveennavi1711@gmail.com",
//         password:"naveen1117" 
//     })
//     try{
//         await user.save()
//         res.send("Data stored sucessfully")
//     }catch(err){
//         res.status(400).send("Error while saving user info.."+err.massage)
//     }
// }) 



