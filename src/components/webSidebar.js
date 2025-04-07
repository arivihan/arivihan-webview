import { signal } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import React, { useEffect, useState } from 'react';
import { getAuth, COnfirm, signInWithPhoneNumber, RecaptchaVerifier, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { alertDialogContent, chatClear, chatHistoryLoading, chatSessions, isGuestUser, loggedInUser, showAuthModal, showSidebarMobile, subscriptionActive } from '../state/chatState';
import { v4 } from 'uuid';
import { customFetchRequest } from '../utils/customRequest';
import { checkUserSubscrition, getChatHistory, getUserChatSessions } from '../utils/webInstantGuruUtils';
import { chatHistory, chatSessionId, showChatLoadShimmer, showDoubtChatLoader, waitingForResponse } from '../state/instantGuruState';
import Cookies from 'js-cookie';
import { FadeLoader } from 'react-spinners';


const WebSidebar = ({ onCreateNewChat }) => {
    useSignals();
    const [newChatTitle, setNewChatTitle] = useState('');
    const [isShowActionsCard, setIsShowActionsCard] = useState(false);

    const handleCreateNewChat = () => {
        // window.location.reload();
        chatHistory.value = [];
        showChatLoadShimmer.value = true;
        chatSessionId.value = "";
        waitingForResponse.value = false;
        showDoubtChatLoader.value = false;

        const cookieUser = Cookies.get("user");
        
        if (cookieUser !== undefined && cookieUser !== null) {
            getChatHistory();
        }else{
            alertDialogContent.value = "Please login to ask question!";
        }

    };


    const onSelectChat = (chatId) => {
        chatHistory.value = [];
        showChatLoadShimmer.value = true;
        chatSessionId.value = chatId;
        waitingForResponse.value = false;
        showDoubtChatLoader.value = false;
        getChatHistory();
    }

    const getUser = () => {
        if (Cookies.get("token")) {
            // customFetchRequest('login').then((res) => {
            loggedInUser.value = JSON.parse(Cookies.get("user"));
            isGuestUser.value = false;
            // subscriptionActive.value = res.body.subscriptionActive;
            // localStorage.setItem('id', res.body.id)
            // })
            getUserChatSessions();
            checkUserSubscrition();
        }
    }

    const handleLogout = () => {
        isGuestUser.value = true;
        loggedInUser.value = null;
        setIsShowActionsCard(!isShowActionsCard);
        Cookies.remove('token');
        Cookies.remove("user");
        localStorage.clear();
        window.location.reload();
    }

    let handleShowSidebarMobile = () => {
        showSidebarMobile.value = !showSidebarMobile.value;
    }


    useEffect(() => {
        getUser()
    }, [])


    return (
        <div className={`bg-[#F6F6F6] shadow w-[240px] fixed sm:relative flex-col z-10 ${showSidebarMobile.value ? "flex" : "hidden"}`} style={{ height: "calc(100vh - 64px)" }}>

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
                <div className="mt-0">
                    <h1 className="text-sm p-2 font-bold">Chats</h1>
                    <hr />
                    <div className="flex flex-col overflow-y-auto  max-h-[69vh] sm:max-h-[60vh] mt-2 bg">

                        {
                            chatHistoryLoading.value === true
                            &&
                            <div className="w-full h-[69vh] sm:h-[60vh] flex flex-col items-center justify-center">
                                <FadeLoader color='#26c6da' />
                            </div>
                        }



                        {
                            chatSessions.value === null || chatSessions.value === undefined || !chatSessions.value.hasOwnProperty("list")
                                ?
                                null
                                :
                                chatSessions.value.list.map((session, index) => (
                                    <div key={index} className={`${session.sessionId === chatSessionId.value ? 'bg-white/90' : ''} hover:bg-white/90 rounded p-2 cursor-pointer flex items-center`} onClick={() => onSelectChat(session.sessionId)}>
                                        <span className="text-black text-xs break-all">{session.title}</span>
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-auto">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                        </svg> */}
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-auto">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                        </svg> */}
                                    </div>
                                ))

                        }
                    </div>
                </div>


            </div>


            <div className={`absolute left-0 right-0 bottom-16 p-4 items-center justify-center ${isShowActionsCard ? "flex" : "hidden"}`}>
                <div className="block flex flex-col rounded-lg px-4 py-2 bg-white w-full">
                    {
                        isGuestUser.value
                            ?
                            <div className="flex flex-row items-center py-2 cursor-pointer" onClick={() => { showAuthModal.value = true; }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 stroke-black rotate-180">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                                </svg>
                                <p className='text-black ml-2' >Login</p>
                            </div>

                            :
                            <div className="flex flex-col">
                                {/* <div className="flex flex-row items-center py-2 cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 stroke-black">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" />
                                    </svg>

                                    <p className='text-black ml-2' >My Subscription</p>
                                </div>
                                <hr className='my-1' /> */}
                                <div className="flex flex-row items-center py-2 cursor-pointer" onClick={handleLogout}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 stroke-black">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                                    </svg>
                                    <p className='text-black ml-2' >Logout</p>
                                </div>
                            </div>
                    }
                </div>
            </div>
            <div className="flex items-center justify-center bg-white border py-2 rounded-lg mt-auto my-4 mx-4 cursor-pointer" onClick={handleCreateNewChat}>
                <h5 className='text-sm'>New Question</h5>
            </div>
            <div className="flex items-center bg-white/20 p-4" onClick={() => { setIsShowActionsCard(!isShowActionsCard) }}>


                <img src={require("../assets/user.png")} alt="" className="h-10 w-min-10 object-cover rounded-full bg-white" />
                <h2 className='font-bold text-lg ml-4 text-black'>
                    {loggedInUser.value === null ? "Guest User" : !loggedInUser.value.newUser ? loggedInUser.value.username : "Guest User"}
                </h2>

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 ml-auto cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>

            </div>
        </div>
    );
};

export default WebSidebar;
