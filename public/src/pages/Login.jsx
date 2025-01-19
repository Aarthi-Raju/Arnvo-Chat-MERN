import React, { useEffect, useState } from 'react'
import LogoPanel from '../components/LogoPanel'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from "react-toastify"
import axios from 'axios'
import { loginRoute } from '../utils/APIroutes'

function Login() {
  const [values, setValues] = useState({
    userNameOrMail: "",
    userPassword: ""
  })
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark'
  }
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    const userExistence = localStorage.getItem("chat-app-user");
    if(userExistence){
      return navigate("/");
    }
    return navigate("/chatAppLogin");
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const { userNameOrMail, userPassword } = values;
      axios.post(loginRoute, {
        userNameOrMail,
        userPassword
      })
        .then((res) => {
          console.log(res.data)
          if (res.data.status === false) {
            toast.error(res.data.msg, toastOptions)
          }
          else if (res.data.status === true) {
            localStorage.setItem("chat-app-user", JSON.stringify(res.data.user));
            navigate("/")
          }
        })
        .catch((err) => {
          toast.error(err, toastOptions)
        })
    }
  }
  const handleValidation = () => {
    const { userNameOrMail, userPassword } = values;
    if (userNameOrMail.trim() === "") {
      toast.error("Username is required", toastOptions)
      return false;
    }
    if (userPassword.trim() === "") {
      toast.error("Password is required", toastOptions)
      return false;
    }
    return true;
  }
  return (
    <div id="registerBlock">
      <LogoPanel />
      <form action="" id="registrationForm" onSubmit={(e) => handleSubmit(e)}>
        <input type="text" name='userNameOrMail' placeholder='Username / Email id' onChange={(e) => handleChange(e)} />
        <input type="password" name='userPassword' placeholder='Password' onChange={(e) => handleChange(e)} />
        <button>Login</button>
      </form>
      <div id="loginBlock">
        Don't have an Account? <span><Link to="/chatAppRegistration">Register</Link></span>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Login
