import { signal } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import React, { useEffect, useState } from 'react';
import { getAuth, COnfirm, signInWithPhoneNumber, RecaptchaVerifier, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { chatClear, chatSessionId, chatSessions, isGuestUser, loggedInUser, showAuthModal, showSidebarMobile, subscriptionActive } from '../state/chatState';
import { v4 } from 'uuid';
import { customFetchRequest } from '../utils/customRequest';
import { BiLogOut, BiSubdirectoryRight } from 'react-icons/bi';
import { PiHouse, PiStudent } from 'react-icons/pi';
import { CgNotes } from 'react-icons/cg';
import { currentViewCompoent, smeCurrentViewCompoent } from '../state/smeState';
import { useLocation, useNavigate } from 'react-router-dom';



const SMESidebar = ({ onCreateNewChat }) => {
    useSignals();
    const location = useLocation();
    const [isShowActionsCard, setIsShowActionsCard] = useState(false);
    const navigate = useNavigate();


    const getUser = () => {
        if (localStorage.getItem("token")) {

            customFetchRequest('login').then((res) => {
                loggedInUser.value = res.body;
                isGuestUser.value = false;
                subscriptionActive.value = res.body.subscriptionActive;
                localStorage.setItem('id', res.body.id)
            })
        }
        customFetchRequest(`chat-sessions`, 'GET').then((res) => {
            chatSessions.value = res;
        })
    }

    const handleLogout = () => {
        isGuestUser.value = true;
        loggedInUser.value = null;
        setIsShowActionsCard(!isShowActionsCard);
        localStorage.clear();
        navigate("/login")
    }

    useEffect(() => {
        getUser()
    }, [])


    return (
        <div className={`bg-[#F6F6F6] shadow w-60 fixed sm:relative flex-col z-10 ${showSidebarMobile.value ? "flex" : "hidden"}`} style={{ height: "calc(100vh - 64px)" }}>
            <div className="p-4 ">
                {/* <div className='flex items-center hover:bg-white/20 rounded-lg p-2 cursor-pointer' onClick={handleCreateNewChat}>
                    <img className='w-11 h-11 object-contain bg-white rounded-full' src={require("../assets/logo.png")} alt="" />
                    <h1 className="font-bold ml-2">New Chat</h1>
                    <button className="text-white ml-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>

                    </button>
                    {
                        showSidebarMobile.value
                            ?
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-2 block sm:hidden cursor-pointer" onClick={handleShowSidebarMobile}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                            :
                            null
                    }
                </div> */}
                <div className={`flex items-center px-3 bg-white border py-2 rounded-lg mt-auto my-1 cursor-pointer ${location.pathname.includes("/sme-home") ? "border-primary/50 bg-primary/10" : ""} `} onClick={() => { navigate("/sme-home") }}>
                    <h5 className='text-sm flex items-center'> <PiHouse className='mr-2' />Home</h5>
                </div>
                <div className={`flex items-center px-3 bg-white border py-2 rounded-lg mt-auto my-1 cursor-pointer ${location.pathname.includes("/sme-student-list") ? "border-primary/50 bg-primary/10" : ""} `} onClick={() => { navigate("/sme-student-list") }}>
                    <h5 className='text-sm flex items-center'> <PiStudent className='mr-2' />Students</h5>
                </div>
                <div className="flex flex-col">
                    <div className={`flex items-center px-3 bg-white border py-2 rounded-lg mt-auto my-1 cursor-pointer ${location.pathname.includes("/sme-doubt-list") ? "border-primary/50 bg-primary/10" : ""} `} onClick={() => { navigate("/sme-doubt-list/latest") }}>
                        <h5 className='text-sm flex items-center'> <CgNotes className='mr-2' />All Doubts</h5>
                    </div>
                    {/* <div className={`ml-6 flex items-center px-3 bg-white border py-2 rounded-lg mt-auto my-1 cursor-pointer ${location.pathname.includes("/sme-doubt-list/new") ? "border-primary/50 bg-primary/10" : ""} `} onClick={() => { navigate("/sme-doubt-list/latest") }}>
                        <h5 className='text-sm flex items-center'> <BiSubdirectoryRight className='mr-2' />New Doubts</h5>
                    </div>
                    <div className={`ml-6 flex items-center px-3 bg-white border py-2 rounded-lg mt-auto my-1 cursor-pointer ${location.pathname.includes("/sme-doubt-list/all") ? "border-primary/50 bg-primary/10" : ""} `} onClick={() => { navigate("/sme-doubt-list/latest") }}>
                        <h5 className='text-sm flex items-center'> <BiSubdirectoryRight className='mr-2' />All Doubts</h5>
                    </div> */}
                </div>
            </div>


            <div className="flex items-center justify-center bg-white border py-2 rounded-lg mt-auto my-4 mx-4 cursor-pointer" onClick={handleLogout}>
                <h5 className='text-sm flex items-center'> <BiLogOut className='mr-2' /> Logout </h5>
            </div>

        </div>
    );
};

export default SMESidebar;
