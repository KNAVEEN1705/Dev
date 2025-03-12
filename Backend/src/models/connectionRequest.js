const mongoose= require('mongoose');

const connectionRequestSchema= new mongoose.Schema({

    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignore", "interested","accepted","rejected"],
            message:`{VALUE} is incorrect status type`, 
        },
    }
},
{timestamps:true}
);

connectionRequestSchema.index({fromUserId:1 , toUserId :1})
connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    // Check if fromUserId and toUserId are the same
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Dont sent request to yourself")
    }
    next(); // Proceed to the next middleware or save operation
});


const connectionRequestModel = new mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports=connectionRequestModel;