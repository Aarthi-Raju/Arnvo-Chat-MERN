import React from 'react'
import { Route, Routes } from "react-router-dom"
import Register from './pages/Register'
import Login from './pages/Login'
import Chat from './pages/Chat'
import SetAvatar from './pages/SetAvatar'

function App() {
  return (
    <Routes>
      <Route path='/chatAppRegistration' element={<Register />}/>
      <Route path='/chatAppLogin' element={<Login />}/>
      <Route path='/chatAppAvatarSet' element={<SetAvatar />}/>
      <Route path='/' element={<Chat />}/>
    </Routes>
  )
}

export default App
