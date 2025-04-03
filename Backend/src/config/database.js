const mongoose = require("mongoose");

const connectdb= async()=>{
    mongoose.connect(process.env.DB_CONNECTION_SECRET)
}

module.exports=connectdb;
 

 
