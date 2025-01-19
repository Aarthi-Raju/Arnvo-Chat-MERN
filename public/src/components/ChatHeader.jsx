import React from 'react'

function ChatHeader({ currentChat }) {
    return (
        <div id='chatHeaderBlock'>
            <img src={`data:image/svg+xml;base64,${currentChat.avatarImage || ""}`} alt="" />
            <div id="activeUser">{currentChat.username || ""}</div>
        </div>
    )
}

export default ChatHeader
