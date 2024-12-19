const mongoose = require("mongoose");

const connectdb= async()=>{
    mongoose.connect("mongodb+srv://naveen:naveen@dev.ux1re.mongodb.net/devTinder")
}

module.exports=connectdb;
 

 
