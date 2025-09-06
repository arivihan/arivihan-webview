import React, { useEffect, useRef, useState } from 'react';
import { Circles, CirclesWithBar, RotatingLines, ThreeDots, ThreeCircles } from 'react-loader-spinner';
import { effect, signal, useSignal } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import { chatClear, chatIsWaitingForResponse, chatLoadingMessageId, chatReceiveChatMessage, chatSessionId, chatSessions, isGuestUser, showAuthModal, showSidebarMobile, subscriptionActive, userChatsCount } from '../../state/chatState';
import { ReceiveBubble } from '../../components/receiveBubble';
import { smeCustomRequest } from '../../utils/smeCustomRequest';
import { smeDoubtChatSessionId, smeDoubtChatSession, smeDoubtListUserId } from '../../state/smeState';
import { PiStudent, PiThumbsUpDuotone } from 'react-icons/pi';
import moment from 'moment';
import SMEThemeWrapper from './smeThemeWrapper';
import { useParams } from 'react-router-dom';
import { MdDelete, MdEdit, MdMoreVert } from 'react-icons/md';
import { MathJax } from 'better-react-mathjax';
import SmilesRenderer from '../../components/smileRenderer';
import renderMathInElement from 'katex/contrib/auto-render';
import ReactDOM from "react-dom/client";



const messages = signal([]);

const SmeDoubtChatScreen = () => {
    useSignals();
    // const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [userDetail, setUserDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const params = useParams();


    const handleSendMessage = () => {
        setInputText('');
        let webChatMessage = {
            sessionId: smeDoubtChatSessionId.value,
            response: inputText,
            requestType: "TEXT",
            responseType: "TEXT",
            createdAt: new Date()
        }
        smeCustomRequest(`/secure/sme/doubt-chat-new-response`, "POST", webChatMessage).then((res) => {
            // resumeChat();
            messages.value = [...messages.value, webChatMessage]
            // setMessages(prev => [...prev, webChatMessage]);

            // document.getElementById("doubt_message_container").scrollBy({ top: 600 })
        })
    }

    const getUserDetail = () => {
        smeCustomRequest(`/secure/sme/sme-user-detail?userId=${params.userid}`, "GET").then((res) => {
            setUserDetail(res);
        })
    }

    const resumeChat = () => {
        // setIsLoading(true);
        // setMessages(null);
        messages.value = [];
        smeCustomRequest(`/secure/sme/doubt-chat?sessionId=${params.sessionid}`, "GET").then((res) => {
            messages.value = res
            // setMessages(res);
            setIsLoading(false);
        })
    }

    useEffect(() => {
        getUserDetail();
        resumeChat();
    }, [])

    return (
        <SMEThemeWrapper>

            <div className="flex flex-col">
                <div className="flex" style={{ height: "calc(100vh - 104px)" }}>
                    <div className="flex-1 h-full">
                        <div className="mx-auto h-full">
                            <div className="w-full p-4 flex flex-col h-full" >

                                {/* <div id="recaptcha_placeholder"></div> */}
                                <div className="mb-0 overflow-y-auto h-5/6 px-2 sm:px-20 py-2 flex flex-col" id='doubt_message_container'>
                                    {
                                        isLoading
                                            ?
                                            <div className="w-full h-[54vh] flex items-center justify-center">
                                                <ThreeCircles color='#26c6da' />
                                            </div>
                                            :
                                            messages.value === null || messages.value === undefined || messages.value.length === 0
                                                ?
                                                <div className="w-full flex flex-col items-center justify-center h-[58vh]">
                                                    <img src={require("../../assets/chat.png")} className='h-40 w-80 object-contain' />
                                                    <p className='text-sm text-gray-500'>Oops! no any chat found.</p>
                                                </div>
                                                :

                                                messages.value.map((doubt, index) => {
                                                    return (
                                                        <div key={index}>
                                                            {
                                                                doubt.request === undefined || doubt.request === null || doubt.request === ""
                                                                    ?
                                                                    null
                                                                    :
                                                                    <SmeReceiveBubble key={index} doubt={doubt} user={userDetail} message={doubt.request} doubtImage={index === 0 ? smeDoubtChatSession.value === null ? null : smeDoubtChatSession.value.doubtImageUrl : null} />
                                                            }
                                                            {
                                                                // doubt.response === undefined || doubt.response === null || doubt.response === ""
                                                                //     ?
                                                                //     null
                                                                //     :
                                                                <SendBubble key={doubt.id} id={doubt.id} doubt={doubt} message={doubt.response} userId={params.userid} />
                                                            }
                                                        </div>
                                                    )
                                                })
                                    }





                                </div>
                                <div className="w-full h-1/6  px-2 sm:px-20 flex items-center">
                                    <div className="flex items-center flex-1 bg-[#F6F6F6] rounded-lg p-1">
                                        <input
                                            type="text"
                                            value={inputText}
                                            onInput={(e) => { setInputText(e.target.value) }}
                                            className="flex-1 mr-2 px-4 py-2 rounded-lg bg-transparent border-none focus:outline-none"
                                            placeholder="Send your answer..."
                                            onKeyDown={(e) => { if (e.key === "Enter") { handleSendMessage() } }}
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
                                                        visible={true}
                                                    />
                                                    :
                                                    <img src={require("../../assets/send.png")} alt="" className='h-6 w-6' />

                                                // <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                //     <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                                // </svg>

                                            }

                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </SMEThemeWrapper>
    );

}

const SendBubble = ({ doubt, message, userId }) => {

    const [showDropdown, setShowDropdown] = useState(false);
    const [editChat, setEditChat] = useState(false);

    const deleteResponse = (responseId) => {
        smeCustomRequest("/secure/sme/delete-chat-response?responseId=" + responseId, "GET").then((res) => {
            messages.value = messages.value.filter(item => item.id !== responseId);
        })
    }

    const handleSaveResponse = (notify) => {
        let obj = doubt;
        obj['response'] = document.getElementById("responseText_" + doubt.id).innerText;
        smeCustomRequest(`/secure/sme/doubt-chat-new-response?userId=${userId}&sendNotification=${notify}`, "POST", obj).then((res) => {
            setEditChat(false);
        })
    }

    const handleCancelEdit = () => {
        setEditChat(!editChat);
        document.getElementById("responseText_" + doubt.id).innerText = doubt.response;
    }

    const initializeVideo = () => {
        if (document.getElementById("my-video")) {
            // let player = videojs('my-video');
            // player.load();
            // player.play();
        }
    }

    useEffect(() => {
        document.getElementById("doubt_message_container").scrollBy({ top: 6000, behavior: "smooth" })
        initializeVideo();
    }, [])

    return (
        <div className={`relative text-right mb-3 bg-[#E8FBFC] ml-auto p-2 rounded-lg w-4/5 sm:w-3/5`}>
            <div className="flex items-center">
                <div className="flex items-center">
                    <img src={require("../../assets/user.png")} alt="" className="rounded-full bg-white h-9 w-9 object-contain" />
                    <h4 className='font-bold ml-2'>You</h4>
                </div>

                <div className="relative ml-auto">
                    <div className="rounded bg-white p-1 border border-primary/30 ml-auto cursor-pointer" onClick={() => { setShowDropdown(!showDropdown) }}>
                        <MdMoreVert className='text-xl' />
                    </div>
                    <div className={showDropdown ? "absolute right-0 top-8 rounded border flex flex-col bg-white" : "hidden absolute right-0 top-8 rounded border flex-col bg-white"}>
                        <div className="flex items-center p-2 border-b hover:bg-primary/20 cursor-pointer" onClick={() => { setEditChat(!editChat); setShowDropdown(!showDropdown) }}>
                            <MdEdit />
                            <span className="text-xs ml-1">Edit</span>
                        </div>
                        <div className="flex items-center p-2 hover:bg-primary/20 cursor-pointer" onClick={() => { deleteResponse(doubt.id) }}>
                            <MdDelete />
                            <span className="text-xs ml-1">Delete</span>
                        </div>

                    </div>
                </div>
            </div>
            <hr className='ml-11 my-2' />
            <div className={`ml-12 text-gray-800 text-start text-sm`}>
                {
                    doubt.responseType === "TEXT_OPTION"
                        ?
                        <div>
                            <p dangerouslySetInnerHTML={{ __html: doubt.response == null ? "" : doubt.response.replace("(bold)<b>", "</b>") }}></p>
                            {
                                doubt.optionResponse.map((item, index) => {
                                    return (
                                        <div key={index} className="border p-2 rounded my-1 bg-white" dangerouslySetInnerHTML={{ __html: item.title.replace("(bold)<b>", "</b>") }}></div>
                                    )
                                })
                            }
                        </div>
                        :

                        doubt.responseType === "VIDEO"
                            ?
                            <div className='flex flex-col'>
                                <p className='mb-1'>{doubt.optionResponse[0].title}</p>
                                <video controls height="290" width="100%" src={doubt.optionResponse[0].contentUrl}></video>

                                <a href={doubt.optionResponse[0].contentUrl} target='_blank' className="px-2 py-1 rounded bg-primary text-white my-2 ml-auto">Open In New Tab</a>
                                <p className='pt-1' dangerouslySetInnerHTML={{ __html: doubt.response == null ? "" : doubt.response.replace("(bold)<b>", "</b>") }}></p>
                            </div>
                            :
                            <div className="flex flex-col">
                                <MathJax contentEditable={editChat} id={`responseText_` + doubt.id} className={`${editChat ? "bg-white p-3" : ""}`} dangerouslySetInnerHTML={{ __html: doubt.response ? doubt.response.replaceAll("(bold)<b>", "</b>").replaceAll("\n", "</br>") : "" }}></MathJax>
                                {
                                    editChat
                                        ?
                                        <div className="flex items-center my-2 ml-auto">
                                            <div className="px-2 py-1 text-xs rounded-lg bg-red-500/10 text-red-500 cursor-pointer" onClick={handleCancelEdit}>Cancel</div>
                                            <div className="px-2 py-1 text-xs text-white rounded-lg bg-primary cursor-pointer ml-2" onClick={() => handleSaveResponse(false)}>Save</div>
                                            <div className="px-2 py-1 text-xs text-white rounded-lg bg-primary cursor-pointer ml-2" onClick={() => handleSaveResponse(true)}>Save & Notify</div>

                                        </div>
                                        :
                                        null
                                }
                            </div>
                }


            </div>

            <div className="flex items-center justify-end mt-2">
                {/* <span className="text-xs text-gray-400">{moment(doubt.createdAt).format("h:m a DD/MM/YY")}</span> */}
                {
                    doubt.thumbsUp
                        ?
                        <div className=" p-1 rounded-full bg-primary/50 ml-2"><PiThumbsUpDuotone className='text-yellow' /></div>
                        :
                        null
                }
            </div>
        </div>
    )
}


const SmeReceiveBubble = ({ doubt, message, doubtImage, user }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            renderMathInElement(containerRef.current, {
                delimiters: [
                    { left: "\\[", right: "\\]", display: true },
                    { left: "\\(", right: "\\)", display: false },
                    { left: "$$", right: "$$", display: true },
                    { left: "$", right: "$", display: false }
                ]
            });

            const el = containerRef.current;
            if (!el) return;

            setTimeout(() => {
                const nodes = Array.from(el.querySelectorAll("smiles"));
                nodes.forEach((node, i) => {
                    const smiles = (node.textContent || node.getAttribute("value") || "").trim();
                    const mount = document.createElement("span");
                    node.replaceWith(mount);
                    console.log(smiles);
                    ReactDOM.createRoot(mount).render(<SmilesRenderer key={Math.random()} smiles={smiles} />);
                });

            }, 200)

        }
    }, [doubt]);


    return (
        <div className={`text-right mb-3 bg-[#E8FBFC] mr-auto p-2 rounded-lg w-4/5 sm:w-3/5`}>
            <div className="flex items-center">
                <div className="rounded-full bg-white h-9 w-9 object-contain flex items-center justify-center" >
                    <PiStudent className='text-xl' />
                </div>
                <div className="flex flex-col ml-2 items-start">
                    <h4 className='font-bold text'>{user.name}</h4>
                    <span className="text-xs">Class: {user.className}</span>
                </div>
            </div>

            <hr className="mt-2 ml-11" />

            <div className={`ml-12 text-gray-800 text-start word mt-2`} id="typer">
                <pre className='text-wrap whitespace-break-spaces text-sm'>
                    {
                        doubtImage === null && doubt.requestType !== "IMAGE" && doubt.requestType !== "IMAGE_HTML"
                            ?
                            null
                            :
                            <img src={doubtImage === null ? doubt.request : doubtImage} className="mb-2" />
                    }
                    <p ref={containerRef} dangerouslySetInnerHTML={{ __html: message.replace("(bold)<b>", "</b>") }} className='break-words'></p>
                </pre>
            </div>
            {/* <span className="text-xs text-gray-400">{moment(doubt.createdAt).format("h:m a DD/MM/YY")}</span> */}
        </div>
    )
}



export default SmeDoubtChatScreen;
