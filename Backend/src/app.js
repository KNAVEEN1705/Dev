const express=require('express');

const app= express();

app.use("/user",(req,res,next)=>{
    console.log("Routehandler 1");
   
    next()
    //  res.send("one");
},(req,res,next)=>{
    console.log("route 2");
    // res.send("Two")
    next()
},
(req,res,next)=>{
    console.log("route 3");
    next();
},
(req,res,next)=>{
    console.log("route 4");
    next();
},
(req,res,next)=>{
    console.log("route 5");
    res.send("five")
}
);
app.listen(8000,()=>{
    console.log("Server is listing in the port of 8000")
});