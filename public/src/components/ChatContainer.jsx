import React, { useEffect, useRef, useState } from 'react'
import ChatHeader from './ChatHeader'
import ChatInput from './ChatInput'
import Messages from './Messages'
import { getAllMsgs } from '../utils/APIroutes'
import axios from 'axios'

function ChatContainer({ currentChat, currentUser, socket, handleSendMessage }) {
    const [allMsgs, setAllMsgs] = useState([])

    useEffect(() => {
        async function getAllMessages() {
            try {
                const response = await axios.post(getAllMsgs, {
                    fromUser: currentUser._id,
                    toUser: currentChat._id
                });
                setAllMsgs(response.data.retrievedMsgs || []);
            } catch (err) {
                console.error("Error fetching messages:", err);
            }
        }
        if (currentChat && currentUser) {
            getAllMessages();
        }
    }, [currentChat, currentUser]);

    useEffect(() => {
        if (!socket.current) return;
        const handleReceiveMsg = (data) => {
            if (currentChat && data.from === currentChat._id) {
                const newMsg = { senderMsg: false, msg: data.message };
                setAllMsgs(prevMsgs => [...prevMsgs, newMsg]);
            }
        };
        socket.current.on("msg-receive", handleReceiveMsg);
        return () => {
            socket.current.off("msg-receive", handleReceiveMsg);
        };
    }, [currentChat, socket.current]);

    const handleSocketMsgs = (msgs) => {
        setAllMsgs(msgs);
    };

    const handleSocketSetMessages = (newMsg) => {
        setAllMsgs(prevMsgs => [...prevMsgs, newMsg]);
        if (handleSendMessage && newMsg.msg) {
            handleSendMessage(newMsg.msg);
        }
    };

    useEffect(() => {
        console.log(allMsgs)
    }, [allMsgs])

    return (
        <div id='chatContainerBlock'>
            <ChatHeader currentChat={currentChat} />
            <Messages allMsgs={allMsgs} />
            <ChatInput
                currentUser={currentUser}
                currentChat={currentChat}
                socket={socket}
                allMsgs={allMsgs}
                handleSocketMsgs={handleSocketMsgs}
                handleSocketSetMessages={handleSocketSetMessages}
            />
        </div>
    )
}

export default ChatContainer
