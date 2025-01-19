import React, { useEffect, useRef } from 'react'
import {v4 as uuidv4} from "uuid";

function Messages({ allMsgs }) {
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" })
  }, [allMsgs])


  return (
    <div id='messagesBlock'>
      {
        allMsgs.map((eachMsg) => {
          return (
            <div id="msgCover" ref={scrollRef} key={uuidv4()}>
              <div className={`message ${eachMsg.senderMsg ? "sent" : "recieved"}`}>{eachMsg.msg}</div>
            </div>
          )
        })
      }
    </div>
  )
}

export default Messages
