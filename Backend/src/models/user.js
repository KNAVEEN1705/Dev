const mongoose= require('mongoose');
const validator=require("validator");
const jwt = require("jsonwebtoken");
const bcrypt=require("bcrypt");
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
        default:"https://www.pnrao.com/wp-content/uploads/2023/06/dummy-user-male.jpg",
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




userSchema.methods.getJWT = async function () {
    const user = this; // 'this' refers to the current user document.

    // Create a JWT using the user's unique `_id`.
    // `jwt.sign` generates a token:
    // - The payload contains the `_id` of the user.
    // - The second argument is the secret key for signing the token.
    // - The third argument specifies the token's expiration (7 days in this case).
    const token = await jwt.sign({ _id: user._id }, "Dev@Tinder$1117", { expiresIn: "7d" });

    return token; // Return the generated token.
};
userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this; // 'this' refers to the current user document instance.
    const passwordHash = user.password; // Fetch the stored hashed password from the database.
    
    // Compare the password provided by the user with the hashed password in the database.
    const isPassValid = await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    );
    
    
    return isPassValid; // Return true if the password matches, otherwise false.
};



module.exports = mongoose.model("User", userSchema);