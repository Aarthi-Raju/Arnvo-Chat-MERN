import React, { useEffect, useState } from 'react'
import LogoPanel from './LogoPanel';
import "../global.css"
import { MdPowerSettingsNew } from "react-icons/md"

function Persons({ contacts, currentUser, changeCurrentChat }) {
  const [persons, setPersons] = useState([]);
  const [presentUser, setPresentUser] = useState({})
  const [isChatSelected, setIsChatSelected] = useState(null)
  useEffect(() => {
    if (contacts && contacts.length > 0 && currentUser) {
      setPersons(contacts);
      setPresentUser(currentUser);
    }
  }, [contacts, currentUser]);

  const handleSelectedChat = (index, chat) => {
    setIsChatSelected(index);
    changeCurrentChat(chat)
  };

  const handleLogOut = () => {
    localStorage.clear();
    window.location.reload();
  };
  return (
    <div id='contactsBlock'>
      <div id='logo'>
        <LogoPanel />
      </div>
      <div id="allContacts">
        {
          persons.map((person, index) => {
            return (
              <div className={`contact ${isChatSelected === index ? "selected" : ""}`} onClick={() => handleSelectedChat(index, person)} key={index}>
                <img src={`data:image/svg+xml;base64,${person.avatarImage}`} alt="" key={index} />
                <div id="contactText">
                  <div className="contactName">{person.username}</div>
                  <div className='contactMail'>{person.lastMsg || ""}</div>
                </div>
              </div>
            )
          })
        }
      </div>
      <div id="adminContact">
        <div id='adminDetails'>
          <img src={`data:image/svg+xml;base64,${presentUser.avatarImage || ""}`} alt="" />
          <div id="adminName">{presentUser.username || "admin"}</div>
        </div>
        <button id='shutdown' onClick={handleLogOut}><MdPowerSettingsNew /></button>
      </div>
    </div>
  )
}

export default Persons