import React from 'react'
import "../global.css"
import Robo from "../assets/Hi.png"

function WelcomeChat({ currentUser }) {

    return (
        <div id='welcomeBlock'>
            <img src={Robo} alt="" />
            <div id='hi'>Hi👋🏻 {currentUser ? currentUser.username : ""}</div>
            <div id='hiText'>Select a chat to continue</div>
        </div>
    )
}

export default WelcomeChat
