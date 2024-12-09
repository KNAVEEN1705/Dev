const express=require('express');

const app= express();

app.use("/test",(req,res)=>{
    res.send("I am gost from port 8000");
});

app.listen(8000,()=>{
    console.log("Server is listing in the port of 8000")
});