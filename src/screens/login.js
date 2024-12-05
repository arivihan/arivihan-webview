import React, { useState } from 'react';
import { CgGoogle } from 'react-icons/cg';
import { FaGoogle } from 'react-icons/fa';
import { smeCustomRequest } from '../utils/smeCustomRequest';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


export default function LoginScreen() {
    const navigate = useNavigate()
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");


    const handleLogin = () => {
        if (username === "" || password === "") {
            alert("Please enter username and password");
            return;
        }
        smeCustomRequest("/auth/authenticate", "POST", { username: username, password: password }).then((res) => {
            if (res.success) {
                localStorage.setItem("token", res.data.accessToken);
                Cookies.set("avToken", res.data.accessToken);
                navigate("/sme-home")
            } else {
                alert(res.message)
            }
        })
    }

    return (
        <div className="w-full h-screen flex">
            <div className="w-1/2 h-full bg-primary flex flex-col items-center justify-center">
                <div className="p-0 bg-white rounded-full h-36 w-36">
                    <img src={require("../assets/logo.png")} class="" />
                </div>

                <h2 className='font-bold text-white text-3xl mt-4'>Arivihan SME Login</h2>
            </div>

            <div className="w-1/2 h-full p-16 flex flex-col">
                <h5 className='text-4xl'>SME Login</h5>
                <span className='text-sm'>Welcome back! Let’s make today productive and impactful together.</span>

                <div className="flex flex-col mt-6">
                    <label htmlFor="email" className='text-sm text-gray-500 ml-1'>Username</label>
                    <input type="text" className="px-3 py-2 border rounded-lg focus:outline-none focus:border-primary" placeholder='Enter username' onInput={(e) => { setUserName(e.target.value) }} />
                </div>

                <div className="flex flex-col mt-4">
                    <label htmlFor="email" className='text-sm text-gray-500 ml-1'>Password</label>
                    <input type="password" className="px-3 py-2 border rounded-lg focus:outline-none focus:border-primary" placeholder='Enter password' onInput={(e) => { setPassword(e.target.value) }} />
                </div>

                <button className="w-full px-8 py-2 bg-primary/10 border border-primary text-black transition-all rounded-lg self-center mt-6 hover:bg-primary/100 hover:text-white" onClick={handleLogin}>Login</button>


                {/* <b className='self-center my-4'>Or</b>

                <div className="self-center border rounded-full border-primary p-4 cursor-pointer bg-primary/10">
                    <FaGoogle className='text-primary'/>
                </div> */}
            </div>


        </div>
    )
}