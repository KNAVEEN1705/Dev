const express=require('express');

const app= express();



app.get("/user",(req,res)=>{
    res.send({
        "firsname":"Naveen",
        "Lastname":"K"
    })
});

app.post("/user",(req,res)=>{

    res.send("Data stored successfully in db")
});

app.delete("/user",(req,res)=>{
    res.send("Data deleted from the db")
})

app.use("/",(req,res)=>{
    res.send("I am from / route")
});

app.listen(8000,()=>{
    console.log("Server is listing in the port of 8000")
});