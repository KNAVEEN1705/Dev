const express = require('express');
const connectdb=require("./config/database")
const app = express();
const cookieParsar=require("cookie-parser")
const jwt= require("jsonwebtoken");


app.use(express.json());
app.use(cookieParsar());


const authRouter=require("./routes/auth");
const profileRouter  =require("./routes/profile");
const requestRouter= require("./routes/request");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);

connectdb().then(()=>{
    console.log("DataBase connected successfully....")
    // Start the server
    app.listen(8000, () => {
        console.log("Server is listening on port 8000");
    });
    }).catch(err=>{
    console.error("Database not connected successfully...")
    })





