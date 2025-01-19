import React, { useEffect, useRef, useState } from 'react'
import EmojiPicker from "emoji-picker-react";
import { MdAddReaction, MdSend } from "react-icons/md"
import axios from 'axios';
import { sendMessages } from '../utils/APIroutes';


function ChatInput({ currentUser, currentChat, socket, allMsgs, handleSocketMsgs, handleSocketSetMessages }) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [msg, setMsg] = useState("")
    const [arrivalMsg, setArrivalMsg] = useState(null);

    const handleShowEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker)
    }

    const handleEmojiClick = (emoji) => {
        let message = msg;
        message += emoji.emoji;
        setMsg(message)
    }

    const handleInput = (e) => {
        setMsg(e.target.value)
    }
    const handleInputOff = () => {
        showEmojiPicker && handleShowEmojiPicker()
    }

    const sendChat = (e) => {
        e.preventDefault();
        if (msg.length > 0) {
            handleSendMsg(msg);
            setMsg("")
        }
    }

    const handleSendMsg = async (msg) => {
        try {
            // First save to database
            await axios.post(sendMessages, {
                fromUser: currentUser._id,
                toUser: currentChat._id,
                msg: msg
            });

            // Then emit via socket
            const messageData = {
                to: currentChat._id,
                from: currentUser._id,
                message: msg
            };
            if (socket.current && socket.current.connected) {
                socket.current.emit("send-msg", messageData);
                const newMsg = { senderMsg: true, msg: msg };
                handleSocketSetMessages(newMsg);
            } else {
                console.error("Socket not connected when trying to send message");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }


    useEffect(() => {
        if (socket.current) {
            socket.current.on("msg-recieve", (msg) => {
                setArrivalMsg({ fromSelf: false, message: msg } );
            });
        }
    }, []);


    useEffect(() => {
        arrivalMsg && handleSocketSetMessages(arrivalMsg)
    }, [arrivalMsg])


    return (
        <div id='chatInputBlock' >
            <button id="emoji">
                <MdAddReaction onClick={handleShowEmojiPicker} />
                {
                    showEmojiPicker && (
                        <div id='emojiPallet'>
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                    )
                }
            </button>
            <form action="" onSubmit={(e) => { sendChat(e) }}>
                <input type="text" placeholder='Type a message' autoFocus value={msg} onChange={handleInput} onClick={handleInputOff} />
                <button id="send" type='submit'>
                    <MdSend />
                </button>
            </form>
        </div>
    )
}

export default ChatInput
