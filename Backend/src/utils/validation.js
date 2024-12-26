const validator = require("validator");

const validateSignupData=(req)=>{

    const{firstName,lastName,emailId,password}=req.body;
    console.log(req.body)
    if(!firstName || !lastName){
        throw new Error(  "Enter your Firstname and Lastname");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Please enter valid email id"+emailId)
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter valid password")
        
    }

}
module.exports={
    validateSignupData
}