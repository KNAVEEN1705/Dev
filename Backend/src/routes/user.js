const express = require("express");
const { userauth } = require("../middleware/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const USER_SAFE_DATA= "firstName lastName photoURL about gender skills age"
const User = require("../models/user");
userRouter.get("/user/request/received", userauth, async (req, res) => {
    try {
        const loggedInUser = req.user;
       

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA)
     
        res.json({
            message: "Data fetched successfully",
            data:connectionRequest
        });
    } catch (err) {
        return res.status(500).send({ message: "Error: " + err.message });
    }
});

userRouter.get("/user/connections",userauth,async(req,res)=>{

    try{
        const loggedInUser= req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId : loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId",USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

    
        const data = connectionRequest.map((row)=> {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId
        });
        res.json({data});
    

    }catch(err){
        res.status(404).send(err.message)
    }
   

});

// userRouter.get("/feed",userauth,async(req,res)=>{

//     try{
//         const loggedInUser = req.user;
//         const connectionRequest = await ConnectionRequest.find({
//         $or:[{fromUserId : loggedInUser._id},{toUserId : loggedInUser._id}],
//             }).select("fromUserId toUserId");

//         const hindeUsersFromFeed = new set();
//         connectionRequest.forEach((req)=>{
//         hindeUsersFromFeed.add(req.fromUserId.toString());
//         hindeUsersFromFeed.add(req.toUserId.toString());})
//         console.log(hindeUsersFromFeed);
//         res.send(connectionRequest);

//     }catch(err){
//         res.status(404).send(err.message)
//     }
// })

userRouter.get("/feed", userauth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);
        limit = limit >50 ? 50 : limit;

        const skip =(page-1) * limit;

        // Get connection requests related to the logged-in user
        const connectionRequest = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
        }).select("fromUserId toUserId");

        // Store users to hide from the feed
        const hideUsersFromFeed = new Set();
        connectionRequest.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        // Fetch users for feed, excluding those in the connection request
        // const feedUsers = await User.find({ _id: { $nin: Array.from(hideUsersFromFeed) } });

        const feedUsers= await User.find({
            $and:[
                {_id:{$nin : Array.from(hideUsersFromFeed)}},
                {_id:{$ne : loggedInUser._id}}
            ]
        }).select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);
        res.status(200).json(feedUsers);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


module.exports =userRouter;