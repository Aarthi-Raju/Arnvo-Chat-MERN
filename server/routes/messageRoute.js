import express from "express";
import { addMsg, getAllMsgs } from "../controller/messageController.js";

const messageRouter = express.Router();

messageRouter.post("/addmsg", addMsg);
messageRouter.post("/getallmsgs", getAllMsgs);


export default messageRouter;