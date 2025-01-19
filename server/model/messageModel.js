import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    message: {
        text: {
            type: String,
            required: true,
        }
    },
    users: Array, // to store fromUser and toUser of a message
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    }
}, { timestamps: true })

const messageModel = new mongoose.model("message", messageSchema)

export default messageModel;