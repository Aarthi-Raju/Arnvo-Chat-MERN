import messageModel from "../model/messageModel.js";

const addMsg = async (req, res, next) => {
    try {
        const msgData = {
            from: req.body.fromUser,
            to: req.body.toUser,
            msg: req.body.msg
        }
        const msgSet = await messageModel.create({
            message: { text: msgData.msg },
            users: [msgData.from, msgData.to],
            sender: msgData.from
        })
        if (msgSet) return res.json({ msg: "Message sent successfully" });
        return res.json({ msg: "failed to send message" });
    }
    catch (err) {
        next(err);
    }
}

const getAllMsgs = async (req, res, next) => {
    try {
        const usersData = {
            from: req.body.fromUser,
            to: req.body.toUser,
        }
        const retrievedMsgs = [];
        const msgs = await messageModel.find({ users: { $all: [usersData.from, usersData.to] } }).sort({ updatedAt: 1 })
        const gettingMsgs = msgs.map((msg) => {
            if (msg.sender.toString() === usersData.from) {
                retrievedMsgs.push({
                    senderMsg: true,
                    msg: msg.message.text
                })
            }
            else {
                retrievedMsgs.push({
                    senderMsg: false,
                    msg: msg.message.text
                })
            }
        })

        if (gettingMsgs) return res.json({ status: true, retrievedMsgs: retrievedMsgs, statusMsg: "recieved msgs from database" });
        return res.json({ status: false, retrievedMsgs: retrievedMsgs, statusMsg: "not recieved msgs from database" });
    }
    catch (err) {
        next(err)
    }
}



export { addMsg, getAllMsgs };