import axios from 'axios';
import React, { useEffect, useState } from 'react'
// import { Buffer } from 'safe-buffer';
import { toast, ToastContainer } from "react-toastify"
import "../global.css"
import { setAvatarRoute } from '../utils/APIroutes';
import { useNavigate } from 'react-router-dom';

function SetAvatar() {
    const multiAvatarAPI = "https://api.multiavatar.com";
    const [isLoading, setIsLoading] = useState(true)
    const [avatars, setAvatars] = useState([]);
    const [isSelected, setIsSelected] = useState(null);
    const navigate = useNavigate();
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    }
    useEffect(() => {
        async function getAvatars() {
            try {
                const data = [];
                for (let i = 0; i < 4; i++) {
                    const image = await axios.get(`${multiAvatarAPI}/${Math.random() * 1000}`);
                    // image in most of the cases [ based on api returns ]  images will be in binary format ,so to handle those images we use buffer. here, it is not madatory to use buffer because api, we are using returns image in svg format , but not in binary.
                    //const buffer = new Buffer(image.data);
                    data.push(btoa(image.data));
                }
                setAvatars(data)
                setIsLoading(false);
            }
            catch (err) {
                console.log(`Error in fetching avatar : ${err}`)
            }
        }
        getAvatars()
    }, [])


    const checkAvatarSelection = () => {
        if (isSelected == null) {
            toast.error("Please Select an Avatar to proceed", toastOptions)
        }
        else {
            const userId = JSON.parse(localStorage.getItem("chat-app-user"));
            axios.post(setAvatarRoute, {
                userId: userId._id,
                userAvatar: avatars[isSelected]
            })
                .then((res) => {
                    if (res.data.status === false) {
                        toast.error(res.data.msg, toastOptions)
                    }
                    else if (res.data.status === true) {
                        localStorage.setItem("chat-app-user", JSON.stringify(res.data.user))
                        navigate("/")
                    }
                })
                .catch((err) => {
                    toast.error(err, toastOptions)
                })
        }
    }

    if (isLoading) {
        return <div>Loading avatars...</div>;
    }
    return (
        <div id="setAvatarPage">
            <div id="AvatarHeader">Pick an avatar for your profile picture</div>
            <div id="avatarsBlock">
                {
                    avatars.map((avatar, index) => {
                        return (
                            <img
                                id={isSelected === index ? "selectedAvatar" : ""}
                                key={index}
                                src={`data:image/svg+xml;base64,${avatar}`}
                                alt={`Avatar`}
                                onClick={() => setIsSelected(index)}
                            />
                        )
                    })
                }
            </div>
            <button onClick={() => checkAvatarSelection()}>Set As Profile Picture</button>
            <ToastContainer />
        </div>
    )
}

export default SetAvatar
