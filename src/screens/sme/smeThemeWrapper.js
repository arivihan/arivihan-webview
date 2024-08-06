import React, { useEffect, useState } from 'react';
import { chatClear, chatIsWaitingForResponse, chatLoadingMessageId, chatReceiveChatMessage, chatSessionId, chatSessions, isGuestUser, loggedInUser, showAuthModal, showSidebarMobile, subscriptionActive, userChatsCount } from '../../state/chatState';
import SMESidebar from '../../components/smeSidebar';
import { BiUser } from 'react-icons/bi';
import { smeCustomRequest } from '../../utils/smeCustomRequest';
import { useSignals } from '@preact/signals-react/runtime';



const SMEThemeWrapper = ({ children }) => {

    let handleShowSidebarMobile = () => {
        showSidebarMobile.value = !showSidebarMobile.value;
    }

    const getLoggedInUserDetail = () => {
        if (loggedInUser.value === null) {
            smeCustomRequest(`/secure/metrics/users/me?token=${localStorage.getItem("token")}`, "GET").then((res) => {
                localStorage.setItem("username", res.username)
                localStorage.setItem("role", res.role.join(","))
                loggedInUser.value = res;
            })
        }
    }

    useEffect(() => {
        getLoggedInUserDetail();
    }, [])

    return (
        <div className="flex flex-col h-screen">
            {showAuthModal.value}

            <div className="flex items-center h-[64px] px-6 py-2 shadow bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 cursor-pointer" onClick={handleShowSidebarMobile}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>

                <img src={require("../../assets/logo-full.png")} alt="" className='h-9' />

                {/* <nav className='ml-auto hidden sm:flex'>
                    <ul className='flex items-center text-sm'>
                        <li className='mx-2'>
                            <a href="https://arivihan.com/" className=''>Home</a>
                        </li>
                        <li className='mx-2'>
                            <a href="https://arivihan.com/contact/" className=''>Contact</a>
                        </li>
                        <li className='mx-2'>
                            <a href="https://arivihan.com/about/" className=''>About</a>
                        </li>
                        <li className='mx-2'>
                            <a href="#" className='text-[#26c6da] border-b-2 border-[#26c6da]'>Ask Doubt</a>
                        </li>

                    </ul>
                </nav> */}

                <div className="flex items-center ml-auto">
                    <div className="rounded-full bg-gray-200 p-2">
                        <BiUser className='text-xl' />
                    </div>

                    {
                        loggedInUser.value === null
                            ?
                            <div className="flex flex-col ml-3">
                                <strong className='font-bold'>Username</strong>
                                <span className='text-xs text-gray-500'>Role</span>
                            </div>
                            :
                            <div className="flex flex-col ml-3">
                                <strong className='font-bold'>{localStorage.getItem("username")}</strong>
                                <span className='text-xs text-gray-500'>{localStorage.getItem("role")}</span>
                            </div>
                    }

                </div>


            </div>

            <div className="flex" style={{ height: "calc(100vh - 64px)" }}>
                <SMESidebar />
                <div className="flex-1 w-screen h-full">
                    <div className="mx-auto h-full">
                        <div className="w-full p-4 flex flex-col h-full" >

                            <div id="recaptcha_placeholder"></div>
                            <div className="mb-0 overflow-y-auto h-full flex flex-col" id='message_container'>
                                {children}
                            </div>

                        </div>
                    </div>
                </div>

            </div>

        </div>
    );

}



export default SMEThemeWrapper;
