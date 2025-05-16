import React, { useState } from 'react';
import { getAuth, COnfirm, signInWithPhoneNumber, RecaptchaVerifier, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { ThreeDots } from 'react-loader-spinner';
import { showAuthModal } from '../state/chatState';
import { effect } from '@preact/signals-react';
import { customFetchRequest } from '../utils/customRequest';
import Cookies from 'js-cookie';


export default function AuthDialog() {
    const [isLoading, setIsLoading] = useState();
    const [isOTPSent, setIsOTPSent] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [err, setErr] = useState("");

    const handlePhoneLogin = () => {
        setIsLoading(true);

        if (!/^\d{10}$/.test(phoneNumber)) {
            setErr("Please enter a valid 10 digit phone number.");
            setIsLoading(false);
            return;
        }

        fetch(`https://platform-prod.arivihan.com:443/arivihan-platform/secure/user/generate/otp?phone=${phoneNumber}&accessKey=4Ae9BRq4AoTvD2y%2FF33Zhg%3D%3D`)
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                setIsLoading(false);
                setIsOTPSent(true);
                setErr("");
            })
            .catch((error) => {
                console.log("Error:" + error);
                setErr(error)
                setIsLoading(false)
            })
    };

    const confirmVerificationCode = () => {
        setIsLoading(true);

        if (!/^\d{6}$/.test(otp)) {
            setErr("Please enter a valid 6 digit OTP.");
            setIsLoading(false);
            return;
        }

        fetch(`https://platform-prod.arivihan.com:443/arivihan-platform/secure/user/website-user-login?phone=${phoneNumber}&otp=${otp}&accessKey=4Ae9BRq4AoTvD2y%2FF33Zhg%3D%3D`)
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                Cookies.set("token", res.token, { expires: 1, path: '' });
                Cookies.set("user", JSON.stringify(res.user), { expires: 1, path: '' })
                setIsLoading(false);
                setErr("");
                showAuthModal.value = false;
                window.location.reload();
            })
            .catch((error) => {
                console.log("Error:" + error);
                setErr(error);
                setIsLoading(false);
                localStorage.clear();
            })
    }

    const getUser = () => {

        customFetchRequest("login", 'POST').then(() => {
            showAuthModal.value = false;
            window.location.reload();
        })

    }

    const handleLogin = () => {
        if (isOTPSent) {
            confirmVerificationCode();
        } else {
            handlePhoneLogin();
        }
    }

    const handleCloseAuthModal = () => {
        showAuthModal.value = false;
    }

    // if (showAuthModal.value === false) {
    //     return <></>
    // }



    return (


        <div className={`${showAuthModal.value === false ? "hidden" : "fixed"}  inset-x-0 inset-y-0 right-0 bottom-0 z-10 bg-black/80`}>


            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg w-[76%] sm:w-2/6">
                <div className="absolute top-0 right-[-44px] bg-white rounded-full p-2 cursor-pointer" onClick={handleCloseAuthModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </div>

                <div className="flex flex-col">
                    <div className="flex items-center justify-center rounded-lg">
                        <img src={require("../assets/logo-full.png")} alt="" className='h-16 object-cover self-center' />
                    </div>
                    <hr className='my-4' />
                    <h2 className='text-2xl font-bold ml-1'>Login</h2>
                    <p className='ml-1 mt-2 mb-2 text-xs text-gray-500'>Enter your phone number to login</p>
                    <input type="text" maxLength={10} value={phoneNumber} onChange={(e) => { setPhoneNumber(e.target.value.replace(/[^0-9]/g, "")); }} className='border py-2 px-2 rounded-lg  outline-none hover:border-gray-300' placeholder='Phone Number' />

                    {
                        isOTPSent
                            ?
                            <div className="flex flex-col mt-2">
                                <label htmlFor="" className='ml-1 text-xs text-gray-500 mb-2'>Enter OTP</label>
                                <input onChange={(e) => { setOtp(e.target.value) }} minLength={6} maxLength={6} type="text" className='border py-2 px-2 rounded-lg outline-none hover:border-gray-300' placeholder='Enter OTP' />
                            </div>
                            : null
                    }

                    <hr className='my-6' />

                    <button onClick={handleLogin} className='px-6 py-2 bg-[#26c6da] text-white rounded-lg ml-auto font-medium flex justify-center'>

                        {
                            isLoading
                                ?
                                <ThreeDots
                                    visible={true}
                                    height="30"
                                    width="30"
                                    color="white"
                                    radius="9"
                                    ariaLabel="three-dots-loading"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                />
                                :
                                isOTPSent ? "Verify OTP" : "Send OTP"
                        }

                    </button>
                    {
                        err !== ""
                            ?
                            <p className='text-red text-center mt-1'>{err.toString()}</p>
                            :
                            null
                    }
                </div>
            </div>
        </div>
    )
}