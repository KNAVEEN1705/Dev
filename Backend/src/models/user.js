const mongoose= require('mongoose');
const userSchema= new mongoose.Schema({
    firstName:{
        type : String,
        required: true,
        minLength:4,
        maxLength:50
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        minLength:18
    },
    gender:{
        type:String,
        enum:["male","female","other"]
        // validate:(value)=>{
        //     if(!["male","female","other"].includes(value)){
        //         throw("Invalide gender")
        //     }
        // }
    }
},{
    timestamps:true
})
module.exports=mongoose.model("User",userSchema);