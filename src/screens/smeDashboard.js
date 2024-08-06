import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar';
import { Circles, CirclesWithBar, RotatingLines, ThreeDots } from 'react-loader-spinner';
import { effect, signal, useSignal } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import AuthDialog from '../components/authDialog';
import { ReceiveBubble } from '../components/receiveBubble';
import { chatClear, chatIsWaitingForResponse, chatLoadingMessageId, chatReceiveChatMessage, chatSessionId, chatSessions, isGuestUser, showAuthModal, showSidebarMobile, subscriptionActive, userChatsCount } from '../state/chatState';
import { customFetchRequest } from '../utils/customRequest';
import ChatLimtExhausted from '../components/chatLimitExhaustCard';
import SMESidebar from '../components/smeSidebar';
import StudentList from './sme/studentsList';
import DoubtList from './sme/doubtList';
import { smeCurrentViewCompoent } from '../state/smeState';
import SmeDoubtChat from './sme/doubtChat';



const SMEDashboardScreen = () => {
    useSignals();
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isShowExhaustCard, setIsShowExhaustCard] = useState(false);
    const [isShowWelcomeMessage, setIsShowWelcomeMessage] = useState(true);
    const [isLoadingSessionChat, setIsLoadingSessionChat] = useState(false);

    const handleSendMessage = () => {

        if (isGuestUser.value && userChatsCount.value >= 10 && !subscriptionActive.value) {
            setIsShowExhaustCard(true);
            setIsShowWelcomeMessage(false);
            return;
        }

        if (inputText.trim() !== '' && !chatIsWaitingForResponse.value) {

            if (messages.length === 0) {
                startChatSession(inputText)

                // const sessionObj = new Object();
                // sessionObj[chatSessionId.value] = inputText;
                chatSessions.value[chatSessionId.value] = inputText;
            }
            userChatsCount.value = userChatsCount.value + 1;

            setMessages(prev => [...prev, { text: inputText, sender: 'user', type: "send" }]);
            setInputText('');
            chatIsWaitingForResponse.value = true;
            requestChat(inputText)

            let id = Math.random();
            chatLoadingMessageId.value = id;
            setMessages(prev => [...prev, { text: "", sender: 'user', id: id, type: "receive" }]);
        }
    };

    const requestChat = (userPrompt) => {
        chatReceiveChatMessage.value = null;
        let body = {
            "prompt": userPrompt,
            "chatSessionId": chatSessionId.value,
        };

        customFetchRequest(`chat-request?chatSessionId=${body.chatSessionId}&prompt=${body.prompt}`, 'GET').then((res) => {
            chatReceiveChatMessage.value = res.output;
        })
    }


    const startChatSession = (userPrompt) => {
        chatReceiveChatMessage.value = null;
        let body = {
            "prompt": userPrompt,
            "chatSessionId": chatSessionId.value,
        };

        customFetchRequest(`start-session?chatSessionId=${body.chatSessionId}&prompt=${body.prompt}`, 'GET');
    }

    const getSessionChats = () => {
        setMessages([]);
        setIsLoadingSessionChat(true);
        if (chatSessionId) {
            customFetchRequest(`session-chats?sessionId=${chatSessionId.value}`, 'GET').then((res) => {
                res.forEach(chat => {
                    setMessages(prev => [...prev, { text: chat.request, sender: 'user', type: "send" }])
                    setMessages(prev => [...prev, { text: chat.response, sender: 'user', type: "receive", id: "notloading" }])
                })
                setIsLoadingSessionChat(false);
            })
        }
    }

    const handleShowAuthModal = () => {
        showAuthModal.value = true;
    }

    const initRequests = () => {
        let abortController = new AbortController();
        customFetchRequest(`user-chats-count`, 'GET').then((res) => {
            userChatsCount.value = res.count;
        })

        return () => {
            abortController.abort();
        }
    }

    let handleShowSidebarMobile = () => {
        showSidebarMobile.value = !showSidebarMobile.value;
    }


    // const getLoggedInUser = () => {
    //     customFetchRequest(`login`).then((res) => {
    //         localStorage.setItem('user', JSON.stringify(res))
    //     })
    // }

    useEffect(() => {
        // getLoggedInUser()
        initRequests();
    }, [])

    useEffect(() => {
        getSessionChats()
    }, [chatSessionId.value]);

    useEffect(() => {
        if (chatClear.value === true) {
            setMessages([]);
            chatClear.value = false;
        }

    }, [chatClear.value])


    return (
        <div className="flex flex-col h-screen">
            {showAuthModal.value}

            <div className="flex items-center h-[64px] px-6 py-2 shadow bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 cursor-pointer" onClick={handleShowSidebarMobile}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>

                {/* <h1 className="text-2xl font-bold">
                            </h1> */}
                <img src={require("../assets/logo-full.png")} alt="" className='h-9' />

                <nav className='ml-auto hidden sm:flex'>
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
                </nav>

            </div>

            <div className="flex" style={{ height: "calc(100vh - 64px)" }}>
                <SMESidebar />
                <div className="flex-1 w-screen h-full">
                    <div className="mx-auto h-full">
                        <div className="w-full p-4 flex flex-col h-full" >

                            <div id="recaptcha_placeholder"></div>
                            <div className="mb-0 overflow-y-auto h-full flex flex-col" id='message_container'>

                                {
                                    smeCurrentViewCompoent.value === "student"
                                        ?
                                        <StudentList />
                                        :
                                        smeCurrentViewCompoent.value === "doubtlist"
                                            ?
                                            <DoubtList />
                                            :
                                            smeCurrentViewCompoent.value === "doubtchat"
                                                ?
                                                <SmeDoubtChat />
                                                :
                                                null
                                }
                                {/* {
                                    isLoadingSessionChat
                                        ?
                                        <div className="w-full h-full flex items-center justify-center">
                                            <RotatingLines
                                                visible={true}
                                                height="96"
                                                width="96"
                                                color="teal"
                                                strokeWidth="5"
                                                strokeColor="teal"
                                                animationDuration="0.75"
                                                ariaLabel="rotating-lines-loading"
                                                wrapperStyle={{}}
                                                wrapperClass=""
                                                className="self-center"
                                            />
                                        </div>
                                        :
                                        null
                                }

                                {
                                    messages.map((message, index) => {
                                        if (message.type === "send") {
                                            return (<SendBubble key={index} message={message.text} />)
                                        } else {
                                            return (<ReceiveBubble key={index} id={message.id} message={message.text} />)
                                        }
                                    })
                                } */}



                            </div>
                            {/* <div className="w-full h-1/6  px-2 sm:px-20 flex items-center">
                                <div className="flex items-center flex-1 bg-[#F6F6F6] rounded-lg p-1">
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        className="flex-1 mr-2 px-4 py-2 rounded-lg bg-transparent border-none focus:outline-none"
                                        placeholder="Ask me anything..."
                                        onKeyUp={(e) => { if (e.key === "Enter") { handleSendMessage() } }}
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="px-2 py-2 bg-[#26c6da] text-white rounded-lg hover:bg-blue-600 min-h-[36px] min-w-[36px]"
                                    >

                                        {
                                            chatIsWaitingForResponse.value
                                                ?
                                                <Circles
                                                    height="26"
                                                    width="26"
                                                    color="white"
                                                    ariaLabel="circles-loading"
                                                    wrapperStyle={{}}
                                                    wrapperClass=""
                                                    visible={true}
                                                />
                                                :
                                                <img src={require("../assets/send.png")} alt="" className='h-6 w-6' />

                                            // <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            //     <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                            // </svg>

                                        }

                                    </button>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>

            </div>

            <AuthDialog />
        </div>
    );

}

const SendBubble = (props) => {

    useEffect(() => {
        document.getElementById("message_container").scrollBy({ top: 600, behavior: "smooth" })

    }, [])

    return (
        <div className={`text-right mb-3 bg-[#E8FBFC] ml-auto p-2 rounded-lg w-4/5 sm:w-3/5`}>
            <div className="flex items-center">
                <img src={require("../assets/user.png")} alt="" className="rounded-full bg-white h-9 w-9 object-contain" />
                <h4 className='font-bold ml-2'>You</h4>
            </div>
            <div className={`ml-12 text-gray-800 text-start text-sm`}>
                {props.message}
            </div>
        </div>
    )
}


export default SMEDashboardScreen;
