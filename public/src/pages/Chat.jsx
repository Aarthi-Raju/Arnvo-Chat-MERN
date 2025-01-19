import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { getallpersonsRoute, host } from '../utils/APIroutes';
import { toast, ToastContainer } from "react-toastify"
import Persons from '../components/Persons';
import WelcomeChat from '../components/WelcomeChat';
import "../global.css"
import ChatContainer from '../components/ChatContainer';

import { io } from "socket.io-client"

function Chat() {
  const socket = useRef();

  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark'
  }

  useEffect(() => {
    if (!currentUser) return;

    // Clean up any existing socket connection
    if (socket.current) {
      socket.current.disconnect();
    }

    // Initialize socket connection
    socket.current = io(host, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      query: { userId: currentUser._id } // Add userId to connection query
    });
    
    socket.current.on("connect", () => {
      socket.current.emit("add-user", currentUser._id);
    });

    socket.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.current.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socket.current.on("msg-receive", (data) => {
      setContacts(prev => {
        return prev.map(contact => {
          if (contact._id === data.from) {
            return {
              ...contact,
              messages: [...(contact.messages || []), { senderMsg: false, msg: data.message }]
            };
          }
          return contact;
        });
      });
    });

    // Cleanup function
    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [currentUser?._id]); // Only depend on currentUser._id

  useEffect(() => {
    const localUser = localStorage.getItem("chat-app-user")
    if (!localUser) {
      navigate("/chatAppLogin")
    }
    else {
      setCurrentUser(JSON.parse(localUser));
    }
  }, [])

  useEffect(() => {
    async function getUser() {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          await axios.get(`${getallpersonsRoute}/${currentUser._id}`)
            .then((res) => {
              setContacts(res.data.users)
            })
            .catch((err) => {
              toast.error(err, toastOptions)
            })
        }
        else {
          navigate("/chatAppAvatarSet")
        }
      }
    }
    getUser()
  }, [currentUser])

  // Function to update last message for a contact
  const updateLastMessage = (contactId, message) => {
    console.log("Updating last message for contact:", contactId, "Message:", message);
    setContacts(prevContacts => {
      const newContacts = prevContacts.map(contact => {
        if (contact._id === contactId) {
          console.log("Found contact to update:", contact.username);
          return {
            ...contact,
            lastMsg: message
          };
        }
        return contact;
      });
      console.log("Updated contacts:", newContacts);
      return newContacts;
    });
  };

  useEffect(() => {
    if (!socket.current) return;

    const handleReceivedMessage = (data) => {
      console.log("Received message in Chat:", data);
      updateLastMessage(data.from, data.message);
    };

    socket.current.on("msg-receive", handleReceivedMessage);

    return () => {
      if (socket.current) {
        socket.current.off("msg-receive", handleReceivedMessage);
      }
    };
  }, [socket.current]);

  // Function to handle sending messages
  const handleSendMessage = (message) => {
    if (currentChat) {
      console.log("Updating last message for current chat:", currentChat._id);
      updateLastMessage(currentChat._id, message);
    }
  };

  const handleCurrentChat = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <div id='chatBlock'>
      <Persons 
        contacts={contacts} 
        currentUser={currentUser} 
        changeCurrentChat={handleCurrentChat} 
      />
      {
        currentChat === null ? (
          <WelcomeChat currentUser={currentUser} />
        ) : (
          <ChatContainer 
            currentChat={currentChat} 
            currentUser={currentUser} 
            socket={socket} 
            handleSendMessage={handleSendMessage}
          />
        )
      }
      <ToastContainer />
    </div>
  )
}

export default Chat
