import React from 'react'
import anrvoLogo from "../assets/arnvo.png"
import "../global.css"

function LogoPanel() {
  return (
    <div id="logoPanel">
        <img src={anrvoLogo} alt="" />
        <span>Arnvo</span>
    </div>
  )
}

export default LogoPanel
