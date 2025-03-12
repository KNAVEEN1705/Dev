const express= require('express');
const {userauth} =require("../middleware/auth")
const ConnectionRequest = require("../models/connectionRequest");
const User = require('../models/user');
const user = require('../models/user');
const requestRouter= express.Router();

requestRouter.post("/request/sent/:status/:toUserId",
    userauth, async (req, res) => {
        try {
            const fromUserId = req.user._id;
            const toUserId = req.params.toUserId;
            const status = req.params.status;

            const allowedStatus = ["ignore", "interested"];
            if (!allowedStatus.includes(status)) {
                return res.status(400).json({ message: "Invalid Status type: " + status });
            }

            const toUser = await User.findById(toUserId);
            if (!toUser) {
                return res.status(404).send({ message: "User Not found" });
            }

            const existingUserConnection = await ConnectionRequest.findOne({
                $or: [
                    { fromUserId, toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId }
                ]
            });

            if (existingUserConnection) {
                return res.status(400).send({ message: "Connection already Existing" });
            }

            const connectionRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status
            });
            const data = await connectionRequest.save();
            res.json({
                message: `${req.user.firstName} has ${status} the connection request from ${toUser.firstName}.`,
                data
            });
        } catch (err) {
            res.status(500).send("Error: " + err.message);
        }
    });


requestRouter.post("/request/review/:status/:requestId", userauth, async (req, res) => {
    try {
        // Extract the logged-in user, status, and requestId from the request
        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        // Allowed statuses for the request
        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status. Allowed values are 'accepted' or 'rejected'." });
        }

        // Find the connection request based on ID, target user, and status
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        });
      
        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found or already processed." });
        }

        // Update the connection request status
        connectionRequest.status = status;
        await connectionRequest.save();

        // Respond with success message
        res.status(200).json({
            message: `Connection request ${status} successfully.`,
            request: connectionRequest
        });
    } catch (error) {
        // Handle any unexpected errors
        console.error("Error processing connection request:", error.message);
        res.status(500).json({ message: "An error occurred while processing the request." });
    }
});

module.exports=requestRouter;