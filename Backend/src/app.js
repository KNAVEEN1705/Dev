const express = require('express');
const { adminauth,userauth } = require('./middleware/auth'); // Import the middleware

const app = express();

// Apply adminauth middleware to /admin routes
app.use("/admin", adminauth);
app.use("/user",userauth)

// Define an example route
app.get("/admin/getAllData", (req, res) => {
    res.send("All data sent");
});

app.get("/user/getAllData",(req,res)=>{

    res.send("all user data send")
})

// Start the server
app.listen(8000, () => {
    console.log("Server is listening on port 8000");
});
