import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  isFirstRequestLoaded,
  isStepWiseSolution,
  lastUserQuestion,
  showChatLoadShimmer,
  showDoubtChatLoader,
  showMicListentingUI,
  showOptionSelection,
  showSuggestions,
  showWhatsappBottomSheet,
  suggestedDoubtAsked,
  suggestionAdded,
  waitingForResponse,
} from "../state/instantGuruState";
import {
  changeSelectedCourse,
  chatClassifier,
  chatImageRequest,
  chatOptionClicked,
  chatRequestVideo,
  chatResponseFeedback,
  getChatHistory,
  loadSuggestedQuestions,
  openDrawer,
  openFilePicker,
  openMicInput,
  openNewChat,
  openVideo,
  postNewChat,
  saveDoubtChat,
  scrollToBottom,
  setChatSessionIdInActivity,
  showDoubtSubscriptionDialog,
  showToast,
  watchLectureNowTextClickAction,
} from "../utils/instantGuruUtilsDev";
import { useSignals } from "@preact/signals-react/runtime";
import { PulseLoader } from "react-spinners";
import { MathJax } from "better-react-mathjax";
import ImageCropModal from "../components/imageCropModal";
import { ChatLoadShimmer } from "../components/chatLoadShimmer";
import MicListeningUI from "../components/micListeningUi";
import { ImageViewModal } from "../components/imageViewModal";
import OpenWhatsAppSheet from "../components/openWhatsappSheet";
import { useTranslation } from "react-i18next";
import Lottie from "react-lottie-player";
import { Tooltip } from 'react-tooltip';
import suggestedQuestions from "../assets/suggested_question.json";
import { set } from "firebase/database";
import Only_Text_Response from "../components/instant_guru_classifier/Only_Text_response-Componenets/Only_Text_response";
import PDF_container_response from "../components/instant_guru_classifier/PDF_container_response";
import Video_Text_response from "../components/instant_guru_classifier/Video_Text_response_Component/Video_Text_response";
// import Multi_Video_response from "../components/instant_guru_classifier/Multi video response/Multi_Video_response";
// import Model_paper_response from "../components/instant_guru_classifier/Model_Paper_response/Model_Paper_response";
// import Multi_Model_paper_response from "../components/instant_guru_classifier/Multi_Model_paper_response/Multi_Model_paper_response";
// import Whatsapp from "../components/instant_guru_classifier/Whatsapp_Query/Whatsapp";
// import Subscription_response from "../components/instant_guru_classifier/Subscription_response/Subscription_response";
// import Question_response from "../components/instant_guru_classifier/Question_response/Question_response";
import tipsData from "../assets/Time_pass_tips.json";
import quotes1 from "../assets/quotes1.png"
import { TextOptionBubble } from "../components/instant-guru/chatBubbleDev";
import Only_Text_button from "../components/instant_guru_classifier/Only_Text_response-Componenets/Only_Text_button";
import AtomImg from "../assets/icons/atom2.png"
import { AiOutlineCamera } from "react-icons/ai";
const InstantGuruUIDev = () => {
  useSignals();
  const [listening, setListening] = useState(false);
  const location = useLocation();
  const recognition = new window.webkitSpeechRecognition();
  const { i18n, t } = useTranslation();
  const [subject, setSubject] = useState("Physics");
  const [course, setCourse] = useState("board");
  const [language, setLanguage] = useState("en");
  const [showTooltips, setShowTooltips] = useState(false);
  const [showTooltipNumber, setShowTooltipNumber] = useState(0);
  const [tooltipTimeout, setTooltipTimeout] = useState(null);
  const [subscriptionExpired, setSubscriptionExpired] = useState(false);
  const [index, setIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const handleImageIconClick = (e) => {

    if (subscriptionExpired) {
      showDoubtSubscriptionDialog();
      return;
    }

    if (waitingForResponse.value === true || showDoubtChatLoader.value === true || showChatLoadShimmer.value === true) {
      showToast('Waiting for response')
      return;
    }

    if (isFirstDoubt.value !== true) {
      showToast(t('newChatForImage'))
      return;
    }
    openFilePicker();
  }
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let uLanguage = urlParams.get("language");
    let uSubject = urlParams.get("subject").toLowerCase();
    const selectedTips =
      tipsData.filter(
        (item) =>
          item.subject === uSubject &&
          item.course === "board" &&
          item.language === uLanguage
      )[0].tips;


    setMessages(selectedTips);
  }, []);




  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4000); // 3 sec hold + 1 sec animation
    return () => clearInterval(interval);
  }, [messages]);

  window.processCroppedImage = (base64Image) => {
    if (base64Image) {
      const chatContainer = document.getElementById("chat-container");
      chatContainer.innerHTML += `<div class='max-w-[64%] p-2 bg-[#d2f8f9] ml-auto text-lg rounded-[12px]'>
      <img src="${"data:image/png;base64," + base64Image}" alt="Uploaded" className="h-full" />
      </div>`;
      chatContainer.scrollTop = chatContainer.scrollHeight;
      setTimeout(() => {
        isFirstDoubt.value = true;
        chatType.value = "subject_based"
        chatImageRequest("data:image/png;base64," + base64Image);
      }, 200)
    }
  }

  window.processCroppedImageWithQuestion = (base64Image, question = "") => {
    if (base64Image) {
      console.log(base64Image);

      suggestedDoubtAsked.value = true;
      const chatContainer = document.getElementById("chat-container");
      chatContainer.innerHTML += `<div class='max-w-[64%] p-2 bg-[#d2f8f9] ml-auto text-lg rounded-[12px]'>
      <img src="${'data:image/png;base64,' + base64Image}" alt="Uploaded" className="w-full" />
      <p className="mt-1 text-sm">${question}</p>
      </div>`;
      chatContainer.scrollTop = chatContainer.scrollHeight;
      setTimeout(() => {
        isFirstDoubt.value = true;
        chatType.value = "subject_based"
        chatImageRequest("data:image/png;base64," + base64Image, question);
      }, 200)
    }
  }

  window.showDoubtSubscriptionDialog = () => {
    setSubscriptionExpired(true);
  }

  window.processMicInput = (input) => {
    doubtText.value = input;
  }

  window.showTooltips = (show) => {
    setShowTooltips(show);
  }

  window.reloadHistoryForNewResponse = () => {
    window.location = window.location.href.replace("chatSessionId=null", "chatSessionId=" + chatSessionId.value);
  }

  window.showSuggestion = () => {
    showSuggestions.value = true;
  }

  useEffect(() => {
    if (isFirstRequestLoaded.value === true && showSuggestions.value === true && suggestionAdded.value === false) {
      setTimeout(() => {
        let options = loadSuggestedQuestions(true);
        chatHistory.value = [...chatHistory.value, {
          "botResponse": t("suggested_question"),
          "optionResponse": options,
          "responseType": "TEXT_OPTION",
          "showBotAvatar": true,
        }]
        suggestionAdded.value = true;
      }, 200)
    }
  }, [showSuggestions.value, isFirstRequestLoaded.value]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let uLanguage = urlParams.get("language");
    i18n.changeLanguage(uLanguage);
    loadSuggestedQuestions();
    getChatHistory();
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

    if (subscriptionExpired) {
      showDoubtSubscriptionDialog();
      return;
    }

    const chatContainer = document.getElementById("chat-container");
    if (waitingForResponse.value === true || showDoubtChatLoader.value === true || showChatLoadShimmer.value === true) {
      showToast(t("waiting_for_response"));
      return;
    }
    if (doubtText.value.split(" ").length > 2 || isStepWiseSolution.value === true) {
      suggestedDoubtAsked.value = true;
      chatContainer.innerHTML += `<div class='px-3 py-2 bg-[#d2f8f9] ml-auto text-sm rounded-[8px] max-w-[64%]'><p>${doubtText}</p></div>`;
      chatContainer.scrollTop = chatContainer.scrollHeight;
      if ((chatType.value === null || chatType.value !== "SectionType.SUBJECT_RELATED") && callClassifier.value == true) {
        chatClassifier(doubtText.value);
      } else if (chatType.value === "SectionType.SUBJECT_RELATED") {
        postNewChat(doubtText.value);
      }
      lastUserQuestion.value = doubtText.value;
      doubtText.value = "";
    } else {
      showToast(t("write_doubt_in_detail"))
    }
  };

  const handleMicIconClick = () => {
    if (subscriptionExpired) {
      showDoubtSubscriptionDialog();
      return;
    }
    openMicInput();
  };

  const handleNewChat = () => {
    openNewChat();
  }


  useEffect(() => {
    if (tooltipTimeout != null) {
      clearTimeout(tooltipTimeout);
    }
    if (showTooltips && showTooltipNumber < 4) {
      setTooltipTimeout(
        setTimeout(() => {
          setShowTooltipNumber(showTooltipNumber + 1);
        }, 3000))
    }
  }, [showTooltips, showTooltipNumber])

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
    <div className="font-sans flex flex-col justify-between h-screen overflow-hidden" onClick={() => { if (showTooltips && showTooltipNumber < 4) { setShowTooltipNumber(showTooltipNumber + 1) } }}>
      <div className="flex items-center px-4 py-2 h-[64px]">
        <Tooltip
          content={t("click_here_for_old_questions")}
          anchorSelect="#open-drawer-btn"
          place="bottom-start"
          isOpen={showTooltipNumber === 3}
          style={{ backgroundColor: "#211F27", borderRadius: 10 }}
        />
        <img id="open-drawer-btn" src={require("../assets/icons/icon_menu_home.png")} className="w-7" onClick={() => { openDrawer() }} />
        <h1 className="ml-4 mt-3 text-lg font-bold">Instant Guru</h1>



        <div className="relative flex items-center justify-center ml-auto" onClick={handleNewChat}>
          {/* <Lottie
            loop
            className="shadow rounded-[10px] overflow-hidden"
            animationData={require("../assets/lottie/new_chat_shimmer.json")}
            play
            style={{ width: 100, height: 32 }}
          /> */}
          <div className="w-[120px] h-[32px] rounded-[10px] animate-pulse overflow-hidden bg-white shadow">
            {
              isFirstDoubt.value === false
                ?
                <div className="absolute rounded-[10px]  inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-shimmer">
                </div>
                : null
            }
          </div>
          <span className="absolute text-sm">{t("newChat")}</span>
        </div>
        {/* <button className="ml-auto bg-[#f6f6f6] text-sm px-4 py-1 rounded-[8px] border border-[#e8e9eb]">
          {t("newChat")}
        </button> */}
      </div>

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
        className={`p-4 overflow-y-auto overflow-x-hidden  ${isFirstDoubt.value === false || suggestedDoubtAsked.value === true || bottomSuggestedQuestion.value.length < 1 || suggestionAdded.value === true ? 'h-[calc(100%-64px-64px)]' : 'h-[calc(100%-64px-94px-64px)]'} flex flex-col scroll-smooth gap-4`}
        id="chat-container"
      >

        {chatHistory.value.length > 0 && chatHistory.value.map((chat, hIndex) => {
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
                  <div className="p-2 bg-[#d2f8f9] ml-auto text-lg rounded-[12px] max-w-[64%]">
                    <img
                      src={chat.userQuery}
                      alt="Uploaded"
                      className="rounded-lg object-contain"
                      onClick={() => { imageViewUrl.value = chat.userQuery }}
                    />
                  </div>
                ) : (
                  <div className="px-3 py-2 bg-[#d2f8f9] ml-auto text-sm rounded-[12px] max-w-[64%]">
                    <p className="text-sm">{chat.userQuery}</p>
                  </div>
                )
              ) : null}

              {
                chat.botResponse !== null && chat.responseType === "VIDEO" ?
                  <div className="flex items-end">
                    <img
                      src={require("../assets/icons/icon_chat_avatar.png")}
                      className="h-11 w-11 object-contain mr-2"
                    />
                    <div className="px-3 py-2 bg-[#f6f6f6] mr-auto text-sm rounded-lg w-full" onClick={() => { openVideo(chat.optionResponse[0].contentUrl, chat.optionResponse[0].startPosition, chat.optionResponse[0].endPosition, chatSessionId.value, chat.responseId) }}>
                      <img src={require("../assets/mock_test_video_player_image.png")} className="w-full object-cover rounded-lg" />
                    </div>
                  </div>
                  :
                  null
              }

              {/* <TextOptionBubble chat={chat} chatIndex={hIndex} /> */}
              {/* <HTMLResponseBubble chat={chat} chatIndex={hIndex} /> */}

              {
                chat.botResponse !== null && chat.botResponse !== "" && chat.responseType === "TEXT_OPTION" && chat.optionResponse !== undefined && chat.optionResponse !== null
                &&
                <TextOptionBubble chat={chat} chatIndex={hIndex} />

              }


              {
                chat.botResponse !== null && chat.botResponse !== "" && (chat.responseType === "TEXT" || chat.responseType === "HTML")
                &&
                <Only_Text_Response chat={chat} chatIndex={hIndex} />
              }

              {
                chat.responseType === "HTML_LINKS"
                &&
                <Only_Text_Response chat={chat} chatIndex={hIndex} />
              }

              {
                chat.responseType !== null && chat.responseType !== "" && (chat.responseType === "HTML_PDF")
                &&
                <PDF_container_response chat={chat} chatIndex={hIndex} />
              }

              {
                chat.responseType === "HTML_VIDEO" && chat.cardType === "CardType.ACTIVITY"
                &&
                <Only_Text_button chat={chat} chatIndex={hIndex} />
              }

              {
                chat.botResponse !== null && chat.botResponse !== "" && chat.responseType === "HTML_VIDEO" && chat.cardType === "CardType.FULLCARD"
                &&
                <Video_Text_response chat={chat} chatIndex={hIndex} />
              }


            </div>
          );
        })}

        {/* Loader + Important Questions block */}
        {showDoubtChatLoader.value === true ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center mt-6">
              <img
                src={require("../assets/icons/icon_chat_avatar.png")}
                className="h-[32px] w-[32px] object-contain mr-2"
              />
              <p className=" text-[#37D3E7]"><b>Instant Guru</b></p>
            </div>

            <div className="flex gap-2 items-center">
              <PulseLoader
                color="#26c6da"
                loading={true}
                size={7}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
              <p style={{ lineHeight: 1 }} className="text-sm font-semibold">
                {t("read_till_answer_coming")}
              </p>
            </div>

            {/* ⬇️ Important 1 marks questions block (sirf jab loader active ho) */}
            <div className="w-[100.5%] mt-[38vh] overflow-hidden flex flex-col justify-end">
              <p className="font-bold">{t("one_mark_question")}</p>

              <div className="border-[#DFE6EC] gap-2 flex justify-center py-2 px-2 mt-2 border w-full rounded-xl">
                {/* Static Image */}
                <div className="w-[25px] h-[25px] flex-shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    src={quotes1}
                    alt="quote"
                  />
                </div>

                {/* Dynamic Text Carousel */}
                <div className="w-[95%] relative py-1 overflow-x-hidden flex flex-col justify-between">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={index}
                      className="font-bold text-sm whitespace-pre-wrap break-words"
                      initial={{ x: "100%", opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: "-100%", opacity: 0 }}
                      transition={{ duration: 1 }}
                    >
                      {messages[index]}
                    </motion.p>
                  </AnimatePresence>

                  {/* Fixed 5 Dots Pagination */}
                  <div className="flex mr-8 items-center justify-center mt-2 gap-1">
                    {[...Array(5)].map((_, i) => {
                      const activeIndex = index % 5; // active dot calculation
                      return (
                        <div
                          key={i}
                          className={`h-1 rounded-full transition-all duration-300 ${activeIndex === i
                            ? "bg-[#26c6da] w-4"
                            : "bg-gray-300 w-1"
                            }`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>


          </div>
        ) : null}


        {
          showChatLoadShimmer.value === true && <ChatLoadShimmer />
        }

      </div>

      {
        (suggestedDoubtAsked.value === false && suggestionAdded.value === false && isFirstDoubt.value == true && bottomSuggestedQuestion.value.length > 0)
        &&
 <div className="relative w-full flex  items-end h-[60px] overflow-hidden">
  <div className="flex whitespace-nowrap  animate-scroll">
    {[...bottomSuggestedQuestion.value, ...bottomSuggestedQuestion.value].map(
      (item, index) => (
        <div
          onClick={() => {
            if (subscriptionExpired) {
              showDoubtSubscriptionDialog();
              return;
            }

            let question = suggestedQuestions.find(
              (question) => question.question === item.title
            );
            chatHistory.value = [
              ...chatHistory.value,
              {
                botResponse: question.answer,
                responseType: "HTML",
                showBotAvatar: true,
                userQuery: item.title,
              },
            ];
            isFirstDoubt.value = false;
            chatType.value = "subject_based";
            suggestedDoubtAsked.value = true;
            scrollToBottom();
            saveDoubtChat(item.title, question.answer);
          }}
          key={index}
          className="bg-transparent border border-[#DFE6EC] p-1 rounded-lg mx-2 inline-flex items-center gap-2 flex-shrink-0 cursor-pointer hover:bg-primary/10 transition"
        >
          <div className="w-[15px] h-[15px] flex-shrink-0">
            <img
              className="w-full h-full object-cover"
              src={AtomImg}
              alt=""
            />
          </div>
          <p className="text-sm text-[#000000]/70">{item.title}</p>
        </div>
      )
    )}
  </div>

          <style>{`
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-scroll {
      display: inline-flex;
      animation: scroll 30s linear infinite;
      will-change: transform;
    }
  `}</style>
        </div>

      }

      {/* the new crousal comtainer  */}

      {/* the new crousal comtainer  */}


      <div className="h-[64px] w-full flex items-center px-4">
        <div className="border shadow border-[#e8e9eb] p-0.5 rounded-lg bg-white flex items-center w-full overflow-hidden">
          <Tooltip
            content={t("type_your_question")}
            anchorSelect="#text-input-field"
            isOpen={showTooltipNumber === 1}
            style={{ backgroundColor: "#211F27", borderRadius: 10 }}
          />
            <label htmlFor="imageInputt" id="image-selection-icon" className="cursor-pointer shadow bg-[#26C6DA] rounded-md ml-1 flex justify-center items-center p-2 w-min-[6vh] h-min-[5vh] mr-1" onClick={handleImageIconClick}>
            {/* <img
              src={require("../assets/icons/icon_camera_black.png")}
              className="h-5 object-contain"
              alt="camera"
            /> */}
            <p className="text-white">
             <AiOutlineCamera size={20}/>
            </p>
          </label>
          <input
            type="text"
            id="text-input-field"
            className="outline-none py-3 px-1 w-full text-[14px]"
            placeholder={t("Type ya photo bhej kar pucho...")}
            value={doubtText.value}
            onChange={(e) => {
              if (subscriptionExpired) {
                showDoubtSubscriptionDialog();
                return;
              }

              doubtText.value = e.target.value;
              suggestedDoubtAsked.value = e.target.value.length > 0;
            }}
          />
          <button onClick={handleMicIconClick} className="mr-3">
            <img
              src={require("../assets/icons/icon_mic_black.png")}
              className={`h-9 object-contain ${listening ? "animate-pulse" : ""
                }`}
              alt="mic"
            />
          </button>
          <Tooltip
            content={t("ask_question_using_image")}
            anchorSelect="#image-selection-icon"
            place="top-end"
            isOpen={showTooltipNumber === 2}
            style={{ backgroundColor: "#211F27", borderRadius: 10 }}
          />
           <div className="w-[2px] mr-2 h-[4.5vh] bg-[#DFE6EC]">
                  
           </div>
          <img
            src={require("../assets/icons/icon_send_msg_teal.png")}
            className="h-5 mr-3"
            alt="send"
            onClick={newQuestion}
          />
        </div>
      </div>
    </div>
  );
};

export default InstantGuruUIDev;
