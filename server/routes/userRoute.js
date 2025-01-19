import express from "express";
import { getAllUsers, setUserAvatar, userLogin, userRegister } from "../controller/userController.js"

const userRouter = express.Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.post("/chatappavatar", setUserAvatar);
userRouter.get("/getallpersons/:userId", getAllUsers)

export default userRouter;