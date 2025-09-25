import React, { useEffect, useState } from "react";
import {
    bottomSuggestedQuestion,
    callClassifier,
    chatHistory,
    chatSessionId,
    chatType,
    doubtText,
    imageViewUrl,
    indexOfOptionSelection,
    isFirstDoubt,
    isStepWiseSolution,
    lastUserQuestion,
    showChatLoadShimmer,
    showDoubtChatLoader,
    showMicListentingUI,
    showWhatsappBottomSheet,
    suggestedDoubtAsked,
    suggestionAdded,
    waitingForResponse,
} from "../../state/instantGuruState";
import {
    changeSelectedCourse,
    chatClassifier,
    chatImageRequest,
    getChatHistory,
    loadSuggestedQuestions,
    openFilePicker,
    openNewChat,
    openVideo,
    postNewChat,
    saveDoubtChat,
    scrollToBottom,
    setChatSessionIdInActivity,
    showToast,
    watchLectureNowTextClickAction,
} from "../../utils/webInstantGuruUtils";
import { useSignals } from "@preact/signals-react/runtime";
import { PulseLoader } from "react-spinners";
import { ChatLoadShimmer } from "../../components/chatLoadShimmer";
import MicListeningUI from "../../components/micListeningUi";
import { ImageViewModal } from "../../components/imageViewModal";
import OpenWhatsAppSheet from "../../components/openWhatsappSheet";
import { useTranslation } from "react-i18next";
import { Tooltip } from 'react-tooltip';
import { HTMLResponseBubble, TextOptionBubble } from "../../components/instant-guru/websiteChatBubble";
import suggestedQuestions from "../../assets/suggested_question.json";
import { CirclesWithBar } from "react-loader-spinner";
import WebSidebar from "../../components/webSidebar";
import AuthDialog from "../../components/authDialog";
import { alertDialogContent, chatLimits, chatSessions, showAuthModal, showLandingUi, showSidebarMobile, subscriptionActive } from "../../state/chatState";
import Cookies from 'js-cookie';
import AlertDialog from "../../components/alertModal";
import { onValue, ref, remove } from "firebase/database";
import { db } from "../../firebase";


const WebInstantGuru = () => {
    useSignals();
    const [listening, setListening] = useState(false);
    const recognition = new window.webkitSpeechRecognition();
    const { i18n, t } = useTranslation();
    const [showTooltips, setShowTooltips] = useState(false);
    const [showTooltipNumber, setShowTooltipNumber] = useState(0);

    const handleImageIconClick = (e) => {
        if (waitingForResponse.value === true || showDoubtChatLoader.value === true || showChatLoadShimmer.value === true) {
            showToast('Waiting for response')
            return;
        }

        if (isFirstDoubt.value !== true) {
            showToast('Click new chat to ask doubt using image')
            return;
        }
        openFilePicker();
    }


    const openMicInput = () => {
        setListening(true);

        recognition.start(); // Start the speech recognition

        recognition.onstart = () => {
            console.log("Speech recognition started.");
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            doubtText.value = transcript;
            console.log("Recognized Speech: ", transcript);
            setListening(false); // Stop listening after result is received.
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error: ", event.error);
            setListening(false); // Stop listening in case of error
        };

        recognition.onend = () => {
            console.log("Speech recognition ended.");
            setListening(false); // Ensure to stop listening once recognition ends
        };
    };

    const handleImageInput = (e) => {

        if (subscriptionActive.value === false && chatSessions.value.list.length >= chatLimits.value.sessionsLimitPerUser) {
            alertDialogContent.value = "You don't have any active subscription please download app and subscribe.";
            return;
        }


        let userChatCount = chatHistory.value.filter(item => item.userQuery).length;
        if ((subscriptionActive.value === false && userChatCount >= chatLimits.value.messageLimitPerSession) || (subscriptionActive.value === true && userChatCount >= chatLimits.value.messageLimitPerSessionForSubscribedUser)) {
            alertDialogContent.value = "Message limit reached";
            return;
        }


        let file = e.target.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onloadend = () => {
                let base64Image = reader.result;
                isFirstDoubt.value = true;
                chatType.value = "subject_based"
                chatHistory.value = [...chatHistory.value, { "requestType": "IMAGE_HTML", "userQuery": base64Image }]
                scrollToBottom();

                // const chatContainer = document.getElementById("chat-container");
                // chatContainer.innerHTML += `<div class='max-w-[44%] p-2 bg-[#d2f8f9] ml-auto text-lg rounded-[12px]'>
                // <img src="${base64Image}" alt="Uploaded" className="h-full" />
                // </div>`;
                // chatContainer.scrollTop = chatContainer.scrollHeight;
                chatImageRequest(base64Image);
            };
            reader.readAsDataURL(file);
        } else {
            console.error("No file selected");
        }
    };

    useEffect(() => {
        if (Cookies.get("user")) {
            try {
                let userDetails = JSON.parse(Cookies.get("user"));
                const userId = userDetails.userId;
                const query = ref(db, `users/doubt_chat_refresh/${userId}`);
                const unsubscribe = onValue(query, (snapshot) => {
                    const data = snapshot.val();
                    if (snapshot.exists()) {
                        Object.keys(data).forEach((key) => {
                            if (key === chatSessionId.value && data[key] === "yes") {
                                chatHistory.value = []
                                getChatHistory();
                            }
                        });
                    }
                }, (err) => {
                    console.log(err);
                });

                return () => unsubscribe();
            } catch (error) {
                console.error(error);
            }
        }
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        let uLanguage = urlParams.get("language");
        i18n.changeLanguage(uLanguage);
        if (Cookies.get("user")) {
            loadSuggestedQuestions();
            getChatHistory();
        }
    }, []);

    useEffect(() => {
        if (chatSessionId.value !== null || chatSessionId.value !== "") {
            setChatSessionIdInActivity();
        }
    }, [chatSessionId.value])

    useEffect(() => {
        if (showMicListentingUI.value === false) {
            recognition.stop();
        }
    }, [showMicListentingUI.value])

    const newQuestion = () => {
        if (Cookies.get("user") === undefined) {
            showAuthModal.value = true;
            return;
        }
        const chatContainer = document.getElementById("chat-container");
        if (subscriptionActive.value == null || chatSessions.value == null) {
            alertDialogContent.value = "Waiting for subscription check.";
            return;
        }

        if (subscriptionActive.value === false && chatSessions.value.list.length >= chatLimits.value.sessionsLimitPerUser) {
            alertDialogContent.value = "You don't have any active subscription please download app and subscribe.";
            return;
        }


        let userChatCount = chatHistory.value.filter(item => item.userQuery).length;
        if ((subscriptionActive.value === false && userChatCount >= chatLimits.value.messageLimitPerSession) || (subscriptionActive.value === true && userChatCount >= chatLimits.value.messageLimitPerSessionForSubscribedUser)) {
            alertDialogContent.value = "Message limit reached";
            return;
        }

        if (waitingForResponse.value === true || showDoubtChatLoader.value === true || showChatLoadShimmer.value === true) {
            alertDialogContent.value = "Waiting for response";
            return;
        }

        if (isFirstDoubt.value === true) {
            chatSessions.value.list.unshift({ "sessionId": chatSessionId.value, "title": doubtText.value });
        }

        if (doubtText.value.split(" ").length > 2 || isStepWiseSolution.value === true) {
            suggestedDoubtAsked.value = true;
            chatHistory.value = [...chatHistory.value, { "requestType": "HTML", "userQuery": doubtText.value }]
            // chatContainer.innerHTML += `<div class='px-3 py-2 bg-[#d2f8f9] ml-auto text-sm rounded-[8px] max-w-[64%]'><p>${doubtText}</p></div>`;
            chatContainer.scrollTop = chatContainer.scrollHeight;
            if ((chatType.value === null || chatType.value !== "subject_based") && callClassifier.value == true) {
                chatClassifier(doubtText.value);
            } else if (chatType.value === "subject_based") {
                postNewChat(doubtText.value);
            }
            lastUserQuestion.value = doubtText.value;
            doubtText.value = "";
        } else {
            showToast("Write your doubt in detail...")
        }
    };

    const handleNewChat = () => {
        openNewChat();
    }

    useEffect(() => {
        if (showTooltips) {
            const tooltipInterval = setInterval(() => {
                setShowTooltipNumber((prev) => {
                    if (prev === 4) {
                        clearInterval(tooltipInterval);
                    }
                    return prev <= 4 ? prev + 1 : 0
                })
            }, 3000)
        } else {
            setShowTooltipNumber(0);
        }
    }, [showTooltips])

    useEffect(() => {
        const interval = setInterval(() => {
            const courseSelectionText = document.getElementById("courseSelectionText");
            const watchLectureNowText = document.getElementById("watchLectureNowText");

            if (courseSelectionText) {
                courseSelectionText.addEventListener("click", changeSelectedCourse);

            }
            if (watchLectureNowText) {
                watchLectureNowText.addEventListener("click", watchLectureNowTextClickAction);
                clearInterval(interval);
            }

        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        const chatContainer = document.getElementById("chat-container");
        chatContainer.scrollTop = chatContainer.scrollHeight + 800;
    }, [chatHistory.value, showDoubtChatLoader.value]);


    return (

        <div className="flex flex-col h-screen">
            <div className="hidden">
                {showAuthModal.value}
                {alertDialogContent.value}
            </div>

            <div className="flex items-center h-[64px] px-6 py-2 shadow bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 cursor-pointer" onClick={() => { showSidebarMobile.value = !showSidebarMobile.value; }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>

                <img src={require("../../assets/logo-full.png")} alt="" className='h-9' />

                <nav className='ml-auto  hidden sm:flex'>
                    <ul className='flex  items-center text-sm'>
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
                <WebSidebar />

                <div id="parent-chat-container" className={`font-sans h-full overflow-hidden ${showSidebarMobile.value === true ? 'w-[calc(100%-240px)]' : 'left-0 w-full'} `} onClick={() => { if (showTooltips) { setShowTooltipNumber(showTooltipNumber + 1) } }}>

                    {
                        showWhatsappBottomSheet.value === true && <OpenWhatsAppSheet />
                    }

                    {
                        imageViewUrl.value !== null && <ImageViewModal />
                    }

                    {
                        showMicListentingUI.value === true && <MicListeningUI />
                    }

                    <div
                        className={`p-4 overflow-y-auto  ${isFirstDoubt.value === false || suggestedDoubtAsked.value === true || bottomSuggestedQuestion.value.length < 1 || suggestionAdded.value === true ? 'h-[calc(100%-94px)]' : 'h-[calc(100%-94px-64px)]'} flex flex-col scroll-smooth gap-2`}
                        id="chat-container"
                    >

                        {chatHistory.value !== null && Array.isArray(chatHistory.value) && chatHistory.value.length > 0 && chatHistory.value.map((chat, hIndex) => {
                            if (chat.waitingForResponse) {
                                waitingForResponse.value = true;
                            }

                            if (chat.stepWiseSolution) {
                                isStepWiseSolution.value = true;
                            }

                            if (chat.userQuery !== undefined && chat.userQuery !== null && chat.userQuery !== "") {
                                isFirstDoubt.value = false;
                            }

                            if (chat.responseType === "TEXT_OPTION" && indexOfOptionSelection.value != -2) {
                                indexOfOptionSelection.value = hIndex
                            }

                            return (
                                <div className="flex flex-col gap-4 w-full" key={hIndex}>
                                    {(hIndex != indexOfOptionSelection.value + 1) && chat.userQuery !== undefined &&
                                        chat.userQuery !== null &&
                                        chat.userQuery !== "" ? (
                                        chat.requestType === "IMAGE_HTML" ||
                                            chat.requestType === "IMAGE" ? (
                                            <div className="p-2 bg-[#d2f8f9] ml-auto text-lg rounded-[12px] max-w-[44%]">
                                                <img
                                                    src={chat.userQuery}
                                                    alt="Uploaded"
                                                    className="rounded-lg object-contain"
                                                    onClick={() => { imageViewUrl.value = chat.userQuery }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="px-3 py-2 bg-[#d2f8f9] ml-auto text-sm rounded-[12px] max-w-[44%]">
                                                <p className="text-sm">{chat.userQuery}</p>
                                            </div>
                                        )
                                    ) : null}

                                    {
                                        chat.botResponse !== null && chat.responseType === "VIDEO" ?
                                            <div className="flex items-end">
                                                <img
                                                    src={require("../../assets/icons/icon_chat_avatar.png")}
                                                    className="h-11 w-11 object-contain mr-2"
                                                />
                                                <div className="px-3 py-2 bg-[#f6f6f6] mr-auto text-sm rounded-lg w-full" onClick={() => { openVideo(chat.optionResponse[0].contentUrl, chat.optionResponse[0].startPosition, chat.optionResponse[0].endPosition, chatSessionId.value, chat.responseId) }}>
                                                    <img src={require("../../assets/mock_test_video_player_image.png")} className="w-full object-cover rounded-lg" />
                                                </div>
                                            </div>
                                            :
                                            null
                                    }

                                    <TextOptionBubble chat={chat} chatIndex={hIndex} fullWidth={false} />
                                    <HTMLResponseBubble chat={chat} chatIndex={hIndex} fullWidth={false} />

                                </div>
                            );
                        })}

                        {showDoubtChatLoader.value === true ? (
                            <div className="flex items-center mt-6">
                                <img
                                    src={require("../../assets/icons/icon_chat_avatar.png")}
                                    className="h-[40px] w-[40px] object-contain mr-2"
                                />
                                <PulseLoader
                                    color="#26c6da"
                                    loading={true}
                                    size={10}
                                    aria-label="Loading Spinner"
                                    data-testid="loader"
                                />
                            </div>
                        ) : null}

                        {
                            showLandingUi.value === false && showChatLoadShimmer.value === true && <ChatLoadShimmer />
                        }

                        {
                            showLandingUi.value === true &&

                            <div className="w-full h-full flex items-center justify-center">

                                <div className="w-[70vw] flex flex-col items-center justify-center">

                                    <div className="h-[60px] w-[60px] bg-[#26c6da] rounded-full">
                                        <img src={require("../../assets/logo.png")} alt="" className='h-full w-full object-contain invert brightness-0' />
                                    </div>
                                    <p className='mt-4'>How <b>can I help</b> you <b>today?</b></p>
                                    <div className="relative flex flex-col sm:flex-row items-center justify-between w-full my-12">
                                        <img src={require("../../assets/curv.png")} alt="" className='hidden sm:block absolute top-[84%] h-12 -left-[18%] -z-10' />
                                        <img src={require("../../assets/curv.png")} alt="" className='hidden sm:block absolute -top-[42%] h-12 left-[10%] -z-10 rotate-180' />
                                        <img src={require("../../assets/curv.png")} alt="" className='hidden sm:block absolute -top-[42%] h-12 left-[60%] -z-10 rotate-180' />
                                        <img src={require("../../assets/curv.png")} alt="" className='hidden sm:block absolute top-[84%] h-12 left-[36%] -z-10' />
                                        <img src={require("../../assets/curv.png")} alt="" className='hidden sm:block absolute top-[84%] h-12 -right-[0%] -z-10' />

                                        <div className="flex p-3 bg-[#E8FBFC] w-full sm:w-1/4 rounded-lg mr-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                            </svg>
                                            <div className="flex flex-col ml-2">
                                                <div className="flex items-center justify-between">
                                                    <b className='text-xs'>Ask any doubt</b>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                    </svg>
                                                </div>
                                                <p className='text-xs text-gray-500 mt-1'>E.g. Define ‘activation energy’ of a
                                                    reaction.</p>
                                            </div>
                                        </div>
                                        <div className="flex p-3 bg-[#E8FBFC] w-full sm:w-1/4 rounded-lg  my-2 sm:my-0 mr-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                                            </svg>

                                            <div className="flex flex-col ml-2 w-full">
                                                <div className="flex items-center justify-between">
                                                    <b className='text-xs'>Clear your concepts</b>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                    </svg>
                                                </div>
                                                <p className='text-xs text-gray-500 mt-1'>E.g. Explain when to apply Pseudo Force</p>
                                            </div>
                                        </div>

                                        <div className="flex p-3 bg-[#E8FBFC] w-full sm:w-1/4 rounded-lg mr-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                            </svg>

                                            <div className="flex flex-col ml-2 w-full">
                                                <div className="flex items-center justify-between">
                                                    <b className='text-xs'>Revise with us</b>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                    </svg>
                                                </div>
                                                <p className='text-xs text-gray-500 mt-1'>E.g. Which flower blooms once in 12 year</p>
                                            </div>
                                        </div>

                                        <div className="flex p-3 bg-[#E8FBFC] w-full sm:w-1/4 min-h-auto sm:min-h-[75px] my-2 sm:my-0 rounded-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                                            </svg>

                                            <div className="flex flex-col ml-2 w-full">
                                                <div className="flex items-center justify-between">
                                                    <b className='text-xs'>Get deep insights</b>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                    </svg>
                                                </div>
                                                <p className='text-xs text-gray-500 mt-1'>E.g. When to use substitution</p>
                                            </div>
                                        </div>


                                    </div>
                                    <div className="flex p-4 bg-[#F6F6F6] rounded-lg">
                                        <img src={require("../../assets/bot.png")} alt="" className='h-8 w-8 mr-4' />
                                        <div className="flex flex-col text-xs">
                                            <p>Welcome User,</p>
                                            <p className='mt-2'>I am <b>Arivihan’s Tutor Bot</b> - Here to help you with your <b>JEE/NEET</b> and <b>Board</b> exam preparation. Consider me your personalized study companion, guiding you every step of the way.</p>
                                            <p className='mt-2'>When you're ready, feel free to ask me any doubts to clarify your concepts. This marks the beginning of your learning journey, and the real magic is about to unfold! </p>
                                            <p className='mt-2'>Let's start by answering your first query.</p>
                                        </div>
                                    </div>
                                    {/* <img src={require("../assets/chat.png")} alt="" className='h-60 w-96 object-contain' />
                                        <p className='text-center'>Ask your doubts and get response instantly...</p> */}


                                    {/* {
                                            isGuestUser.value
                                                ?
                                                <button className="bg-[#26c6da] rounded p-2 mt-2 text-white text-sm" onClick={handleShowAuthModal}>Login to Start</button>
                                                :
                                                null
                                        } */}

                                </div>
                            </div>

                        }

                    </div>

                    {
                        (isFirstDoubt.value === true && suggestedDoubtAsked.value === false && suggestionAdded.value === false && bottomSuggestedQuestion.value.length > 0)
                        &&
                        <div className="flex flex-row items-center p-2 overflow-x-auto h-[64px]">
                            {
                                bottomSuggestedQuestion.value.map((item, index) => {
                                    return (
                                        <div onClick={() => {
                                            let question = suggestedQuestions.filter((question) => question.question === item.title)[0];
                                            chatHistory.value = [...chatHistory.value, {
                                                "botResponse": question.answer,
                                                "responseType": "HTML",
                                                "showBotAvatar": true,
                                                "userQuery": item.title
                                            }]
                                            isFirstDoubt.value = false;
                                            chatType.value = "subject_based";
                                            suggestedDoubtAsked.value = true;
                                            scrollToBottom();
                                            saveDoubtChat(item.title, question.answer);
                                        }}
                                            key={index} className="white-space-nowrap bg-primary/5 p-2 rounded rounded-lg mx-1 flex-shrink-0">
                                            <p className="text-sm">{item.title}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }


                    <div className="h-[94px] w-full flex items-center justify-center px-4">
                        <div className="border border-[#e8e9eb] rounded-lg bg-white flex items-center w-full overflow-hidden">
                            <Tooltip
                                content={t("type_your_question")}
                                anchorSelect="#text-input-field"
                                isOpen={showTooltipNumber === 1}
                                style={{ backgroundColor: "#211F27", borderRadius: 10 }}
                            />
                            <input
                                type="text"
                                id="text-input-field"
                                className="outline-none px-3 h-12 w-full text-sm"
                                placeholder={t("ask_anything")}
                                value={doubtText.value}
                                onChange={(e) => {
                                    doubtText.value = e.target.value;

                                    if (e.target.value.length > 0) {
                                        suggestedDoubtAsked.value = true;
                                    } else {
                                        suggestedDoubtAsked.value = false;
                                    }

                                }}
                                onKeyDown={(e) => { if (e.key === "Enter") { newQuestion() } }}
                            />
                            <button onClick={openMicInput} className="h-12 px-3 hover:bg-gray-100">

                                {
                                    listening
                                        ?
                                        <CirclesWithBar height={30} width={30} color="#26c6da" />
                                        :
                                        <img
                                            src={require("../../assets/icons/icon_mic_black.png")}
                                            className="h-7 object-contain"
                                            alt="mic"
                                        />
                                }

                            </button>
                            <Tooltip
                                content={t("ask_question_using_image")}
                                anchorSelect="#image-selection-icon"
                                place="top-end"
                                isOpen={showTooltipNumber === 2}
                                style={{ backgroundColor: "#211F27", borderRadius: 10 }}
                            />
                            <input type="file" accept="image/*" className="hidden" id="imageInput" onChange={handleImageInput} disabled={isFirstDoubt.value === false || waitingForResponse.value === true || showDoubtChatLoader.value === true || showChatLoadShimmer.value === true} />
                            <label htmlFor="imageInput" id="image-selection-icon" className="cursor-pointer px-3 h-12 hover:bg-gray-100 flex items-center">
                                <img
                                    src={require("../../assets/icons/icon_camera_black.png")}
                                    className="h-6 object-contain"
                                    alt="camera"
                                />
                            </label>
                            <div className="h-12 px-3 flex items-center justify-center hover:bg-gray-100 cursor-pointer" onClick={newQuestion}>
                                <img
                                    src={require("../../assets/icons/icon_send_msg_teal.png")}
                                    className="h-6"
                                    alt="send"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AuthDialog />
            <AlertDialog />
        </div>
    );
};

export default WebInstantGuru;
