const express = require('express');
const connectdb=require("./config/database")
const app = express();
const User= require('./models/user');

app.post("/signup",async(req,res)=>{
    const user= new User({
        firstName:"Naveen",
        lastName:"K",
        emailId:"naveennavi1711@gmail.com",
        password:"naveen1117" 
    })
    try{
        await user.save()
        res.send("Data stored sucessfully")
    }catch(err){
        res.status(400).send("Error while saving user info.."+err.massage)
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

