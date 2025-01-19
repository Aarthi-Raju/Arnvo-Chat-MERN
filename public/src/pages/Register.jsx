import React, { useEffect, useState } from 'react'
import "../global.css"
import LogoPanel from '../components/LogoPanel'
import { Link } from 'react-router-dom'
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import { registerRoute } from '../utils/APIroutes'
import { useNavigate } from "react-router-dom"

function Register() {
  const [values, setValues] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
    confirmPassword: ""
  })
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark'
  }
  const navigate = useNavigate();

  useEffect(() => {
    const userExistence = localStorage.getItem("chat-app-user");
    if (userExistence) {
      return navigate("/");
    }
    return navigate("/chatAppRegistration");
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const { userPassword, userEmail, userName } = values;
      // password converting to string
      const stringPassword = userPassword.toString()
      axios.post(registerRoute, {
        userName,
        userEmail,
        userPassword
      })
        .then((res) => {
          if (res.data.status === false) {
            toast.error(res.data.msg, toastOptions)
          }
          else if (res.data.status === true) {
            localStorage.setItem("chat-app-user", JSON.stringify(res.data.user))
            navigate("/chatAppAvatarSet")
          }
        })
        .catch((err) => {
          toast.error(err, toastOptions)
        })
    }
  }
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleValidation = () => {
    const { userName, userEmail, userPassword, confirmPassword } = values;
    if (userPassword !== confirmPassword) {
      toast.error("password and confirm password should be same", toastOptions);
      return false;
    }
    else if (userName.length < 3) {
      toast.error("Username should be greater than 3 characters", toastOptions);
      return false;
    }
    else if (userEmail === "") {
      toast.error("Email is Required", toastOptions);
      return false;
    }
    else if (userPassword.length < 8) {
      toast.error("password should be atleast 8 characters", toastOptions);
      return false;
    }
    return true;
  }
  return (
    <div id="registerBlock">
      <LogoPanel />
      <form action="" id="registrationForm" onSubmit={(e) => handleSubmit(e)}>
        <input type="text" name='userName' placeholder='Account Name' required onChange={(e) => handleChange(e)} />
        <input type="email" name='userEmail' placeholder='Email Address' required onChange={(e) => handleChange(e)} />
        <input type="password" name='userPassword' placeholder='Password' required onChange={(e) => handleChange(e)} />
        <input type="password" name='confirmPassword' placeholder='Confirm Password' required onChange={(e) => handleChange(e)} />
        <button>Create User</button>
      </form>
      <div id="loginBlock">
        Already have an Account? <span><Link to="/chatAppLogin">Login</Link></span>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Register
