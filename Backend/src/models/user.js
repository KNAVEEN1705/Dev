const mongoose= require('mongoose');
const validator=require("validator")
const userSchema= new mongoose.Schema({
    firstName:{
        type : String,
        required: true,
        minLength:3,
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
        trim:true,
        validate(email){
            if(!validator.isEmail(email)){
                throw new Error("Invalid email address")
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(password){
            if(!validator.isStrongPassword(password)){
                throw new Error("Please enter strong Password"+password);
            }
        }
    },
    age:{
        type:Number,
        minLength:18
    },
    gender:{
        type:String,
        enum:["male","female","other"]
    },
    about:{
        type:String,
        default:"This default about "
    },
    photoURL:{
        type:String,
        validate(url){
            if(!validator.isURL(url)){
                throw new Error("Make your url right")
            }
        }
    },
    skills: {
        type: [String],
        validate(value) {
            if (value.length > 10) {
                throw new Error("skills must have 10 or fewer items");
            }
        }
    }
      
},
{
    timestamps:true
})
module.exports=mongoose.model("User",userSchema);