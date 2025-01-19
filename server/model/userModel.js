import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        min: 3,
        max: 20,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false,
    },
    avatarImage: {
        type: String,
        default: "",
    }
}, { timestamps: true })

const userModel = mongoose.model("users", userSchema);

export default userModel;