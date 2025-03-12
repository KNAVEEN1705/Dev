const express = require('express');
const connectdb=require("./config/database")
const app = express();
const cookieParsar=require("cookie-parser")
const jwt= require("jsonwebtoken");
const cors = require("cors")


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"] // ✅ Allow PATCH and others
}));

app.options('*', cors()); 
app.use(express.json());
app.use(cookieParsar());


const authRouter=require("./routes/auth");
const profileRouter  =require("./routes/profile");
const requestRouter= require("./routes/request");
const userRouter = require('./routes/user');

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
// Test route
app.get('/test-cors', (req, res) => {
    res.json({ message: 'CORS is working!' });
});

connectdb().then(()=>{
    console.log("DataBase connected successfully....")
    // Start the server
    app.listen(8000, () => {
        console.log("Server is listening on port 8000");
    });
    }).catch(err=>{
    console.error("Database not connected successfully...")
    })





