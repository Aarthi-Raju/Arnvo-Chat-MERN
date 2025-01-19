import messageModel from "../model/messageModel.js";
import userModel from "../model/userModel.js";
import bcrypt from "bcrypt"

const userRegister = async (req, res, next) => {
    try {
        const userData = {
            username: req.body.userName,
            email: req.body.userEmail,
            password: req.body.userPassword
        }
        const usernameCheck = await userModel.findOne({ username: userData.username })
        if (usernameCheck) {
            return res.json({ status: false, msg: "Username already exists" });
        }
        const emailCheck = await userModel.findOne({ email: userData.email });
        if (emailCheck) {
            return res.json({ status: false, msg: "Email already exists" });
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await userModel.create({
            email: userData.email,
            username: userData.username,
            password: hashedPassword
        });
        delete user.password
        return res.json({ status: true, user: user, msg: "Successfully entered the user!" })
    }
    catch (err) {
        res.json({ status: false, msg: "Something wrong to enter the user! Please retry again." })
        next(err);
    }
}


const userLogin = async (req, res, next) => {
    try {
        const userData = {
            usernameOrMail: req.body.userNameOrMail,
            password: req.body.userPassword
        }
        const usernameCheck = await userModel.findOne({ username: userData.usernameOrMail })
        const emailCheck = await userModel.findOne({ email: userData.usernameOrMail })

        if (usernameCheck) {
            const passwordCheck = await bcrypt.compare(userData.password, usernameCheck.password)

            if (!passwordCheck) {
                return res.json({ status: false, msg: "Invalid Password" })
            }
            delete usernameCheck.password;
            return res.json({ status: true, user: usernameCheck })
        }
        else if (emailCheck) {
            const passwordCheck = await bcrypt.compare(userData.password, emailCheck.password)

            if (!passwordCheck) {
                return res.json({ status: false, msg: "Invalid Password" })
            }
            delete emailCheck.password;
            return res.json({ status: true, user: emailCheck })
        }
        return res.json({ status: false, msg: "Invalid Username or email id" });
    }
    catch (err) {
        res.json({ status: false, msg: "Something went wrong to check the user login" });
        next(err);
    }
}





const setUserAvatar = async (req, res, next) => {
    try {
        const userData = {
            userId: req.body.userId,
            userAvatar: req.body.userAvatar
        }
        const userCheck = await userModel.findByIdAndUpdate(userData.userId, {
            isAvatarImageSet: true,
            avatarImage: userData.userAvatar
        });
        if (userCheck) {
            console.log("Hi")
            return res.json({ status: true, user: userCheck })
        }
        return res.json({ status: false, msg: "Could not find the user! please try again after some time." })
    }
    catch (err) {
        return res.json({ status: false, msg: "Something went wrong to update user avatar" });
        next(err);
    }
}



const getAllUsers = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const users = await userModel.find({ _id: { $ne: userId } }).select({ username: 1, email: 1, avatarImage: 1 });
        const allUsersData = await Promise.all(
            users.map(async (user) => {
                const lastMsg = await messageModel.find({ users: { $all: [userId, user._id.toString()] } }).sort({ updatedAt: -1 }).limit(1);
                return {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    avatarImage: user.avatarImage,
                    lastMsg: (lastMsg.length > 0) ? lastMsg[0].message.text : "Start a conversation"
                }
            })
        )

        if (allUsersData) {
            return res.json({ status: true, users: allUsersData })
        }
        return res.json({ status: false, msg: "Unable to retrieve all users" });
    }
    catch (err) {
        return res.json({ status: false, msg: "Something went wrong in getting all contacts" });
    }
}



export { userRegister, userLogin, setUserAvatar, getAllUsers };