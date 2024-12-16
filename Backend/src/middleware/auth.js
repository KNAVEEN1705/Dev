const adminauth=(req,res,next)=>{
    console.log("Admin auth is checked");
    const token="xyz";
    const isAdminAuthorized=token==="xyz";

    if(!isAdminAuthorized){
        res.status(400).send("Unauthorized request");
    }
else{
    next();
}
}

const userauth=(req,res,next)=>{
    console.log("User auth is checked");
    const token="xz";
    const isUserAuthorized= token==="xyz"
    if(!isUserAuthorized){
        res.status(400).send("Unauthorized user");
    }
    else{
        next()
    }
}

module.exports={
    adminauth,
    userauth
}