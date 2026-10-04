const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: "User",
        },
        toUserId: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: "User",
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignored", "accepted", "rejected", "intrested"],
                message: `{values} is incorrect status type`,
            },
        }
    },
    {
        timestamps: true,
    }
)

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
connectionRequestSchema.pre("save", function () {
  const connectionRequest = this;

  // Check if fromUserId is the same as toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You cannot send a connection request to yourself.");
  }
});
const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);
module.exports = {
  ConnectionRequestModel,
};