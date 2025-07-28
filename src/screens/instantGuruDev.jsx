import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
import { HTMLResponseBubble, TextOptionBubble } from "../components/instant-guru/chatBubble";
import suggestedQuestions from "../assets/suggested_question.json";
import { set } from "firebase/database";


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

  window.processCroppedImage = (base64Image) => {
    if (base64Image) {
      const chatContainer = document.getElementById("chat-container");
      chatContainer.innerHTML += `<div class='max-w-[64%] p-2 bg-[#d2f8f9] ml-auto text-lg rounded-[12px]'>
      <img src="${"data:image/png;base64," + base64Image}" alt="Uploaded" class="h-full" />
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
      <img src="${'data:image/png;base64,' + base64Image}" alt="Uploaded" class="w-full" />
      <p class="mt-1 text-sm">${question}</p>
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
      if ((chatType.value === null || chatType.value !== "subject_based") && callClassifier.value == true) {
        chatClassifier(doubtText.value);
      } else if (chatType.value === "subject_based") {
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
    <div className="font-sans h-screen overflow-hidden" onClick={() => { if (showTooltips && showTooltipNumber < 4) { setShowTooltipNumber(showTooltipNumber + 1) } }}>
      <div className="flex items-center px-4 py-2 h-[64px]">
        <Tooltip
          content={t("click_here_for_old_questions")}
          anchorSelect="#open-drawer-btn"
          place="bottom-start"
          isOpen={showTooltipNumber === 3}
          style={{ backgroundColor: "#211F27", borderRadius: 10 }}
        />
        <img id="open-drawer-btn" src={require("../assets/icons/icon_menu_home.png")} className="w-7" onClick={() => { openDrawer() }} />
        <h1 className="ml-4 text-lg font-bold">Instant Guru</h1>
        <div className="relative flex items-center justify-center ml-auto" onClick={handleNewChat}>
          {/* <Lottie
            loop
            className="shadow rounded-[10px] overflow-hidden"
            animationData={require("../assets/lottie/new_chat_shimmer.json")}
            play
            style={{ width: 100, height: 32 }}
          /> */}
          <div class="w-[120px] h-[32px] rounded-[10px] animate-pulse overflow-hidden bg-white shadow">
            {
              isFirstDoubt.value === false
                ?
                <div class="absolute rounded-[10px] inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-shimmer">
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
        className={`p-4 overflow-y-auto  ${isFirstDoubt.value === false || suggestedDoubtAsked.value === true || bottomSuggestedQuestion.value.length < 1 || suggestionAdded.value === true ? 'h-[calc(100%-64px-94px)]' : 'h-[calc(100%-64px-94px-64px)]'} flex flex-col scroll-smooth gap-4`}
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
                  <div class="p-2 bg-[#d2f8f9] ml-auto text-lg rounded-[12px] max-w-[64%]">
                    <img
                      src={chat.userQuery}
                      alt="Uploaded"
                      class="rounded-lg object-contain"
                      onClick={() => { imageViewUrl.value = chat.userQuery }}
                    />
                  </div>
                ) : (
                  <div class="px-3 py-2 bg-[#d2f8f9] ml-auto text-sm rounded-[12px] max-w-[64%]">
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
                    <div class="px-3 py-2 bg-[#f6f6f6] mr-auto text-sm rounded-lg w-full" onClick={() => { openVideo(chat.optionResponse[0].contentUrl, chat.optionResponse[0].startPosition, chat.optionResponse[0].endPosition, chatSessionId.value, chat.responseId) }}>
                      <img src={require("../assets/mock_test_video_player_image.png")} className="w-full object-cover rounded-lg" />
                    </div>
                  </div>
                  :
                  null
              }

              <TextOptionBubble chat={chat} chatIndex={hIndex} />
              <HTMLResponseBubble chat={chat} chatIndex={hIndex} />

            </div>
          );
        })}

        {showDoubtChatLoader.value === true ? (
          <div className="flex items-center mt-6">
            <img
              src={require("../assets/icons/icon_chat_avatar.png")}
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
          showChatLoadShimmer.value === true && <ChatLoadShimmer />
        }

      </div>

      {
        (suggestedDoubtAsked.value === false && suggestionAdded.value === false && isFirstDoubt.value == true && bottomSuggestedQuestion.value.length > 0)
        &&
        <div className="flex flex-row items-center p-2 overflow-x-auto h-[64px]">
          {
            bottomSuggestedQuestion.value.map((item, index) => {
              return (
                <div onClick={() => {
                  if (subscriptionExpired) {
                    showDoubtSubscriptionDialog();
                    return;
                  }

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
            className="outline-none p-3 w-full text-sm"
            placeholder={t("ask_anything")}
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
          <label htmlFor="imageInputt" id="image-selection-icon" className="cursor-pointer mr-3" onClick={handleImageIconClick}>
            <img
              src={require("../assets/icons/icon_camera_black.png")}
              className="h-7 object-contain"
              alt="camera"
            />
          </label>
          <img
            src={require("../assets/icons/icon_send_msg_teal.png")}
            className="h-6 mr-3"
            alt="send"
            onClick={newQuestion}
          />
        </div>
      </div>
    </div>
  );
};

export default InstantGuruUIDev;
