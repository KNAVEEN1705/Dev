const validator = require("validator");

const validateSignupData=(req)=>{

    const{firstName,lastName,emailId,password}=req.body;
    if(!firstName || !lastName){
        throw new Error(  "Enter your Firstname and Lastname");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Please enter valid email id"+emailId)
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter valid password")
        
    }

}
const validateEditProfileData=(req)=>{

    const allowedEditFields=[
        "firstName",
        "lastName",
        "emailId",
        "gender",
        "age",
        "skills",
        "photoURL",
        "about",
    ];
    if (req.body.firstName && (req.body.firstName.trim() === "" || !validator.isLength(req.body.firstName, { min: 3, max: 50 }))) {
        throw new Error("First name length should be between 3 and 50 characters.");
    }
    
    if (req.body.lastName && (req.body.lastName.trim() === "" || !validator.isLength(req.body.lastName, { min: 3, max: 50 }))) {
        throw new Error("Last name length should be between 3 and 50 characters.");
    }
    
    if (req.body.skills && req.body.skills > 10) {
        throw new Error("Skills must be less than 10.");
    }
    
    if (req.body.photoURL && !validator.isURL(req.body.photoURL)) {
        throw new Error("Invalid URL.");
    }
    
    if (req.body.emailId && !validator.isEmail(req.body.emailId)) {
        throw new Error("Invalid Email.");
    }
    
    if (req.body.about) {
        const wordCount = req.body.about.trim().split(/\s+/).length; // Count words
        if (wordCount >= 300) {
            throw new Error("The 'about' section must have less than 300 words.");
        }
    }
    
    
    const isEditAllowed=Object.keys(req.body).every(field=>(allowedEditFields).includes(field))

    return isEditAllowed;
}
module.exports={
    validateSignupData,
    validateEditProfileData
}