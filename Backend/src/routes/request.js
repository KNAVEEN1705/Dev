const express= require('express');
const {userauth} =require("../middleware/auth")

const requestRouter= express.Router();

requestRouter.post("/sendConnectionRequest",userauth,async (req,res)=>{

    const user=req.user;
    console.log("Connection send");
    res.send(user.firstName +  "Sent the connection request");

})
module.exports=requestRouter;