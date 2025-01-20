import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
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
  showOptionSelection,
  showWhatsappBottomSheet,
  waitingForResponse,
} from "../state/instantGuruState";
import {
  chatClassifier,
  chatImageRequest,
  chatOptionClicked,
  chatRequestVideo,
  chatResponseFeedback,
  getChatHistory,
  openDrawer,
  openFilePicker,
  openMicInput,
  openNewChat,
  openVideo,
  postNewChat,
  showToast,
} from "../utils/instantGuruUtils";
import { useSignals } from "@preact/signals-react/runtime";
import { PulseLoader } from "react-spinners";
import { MathJax } from "better-react-mathjax";
import ImageCropModal from "../components/imageCropModal";
import { ChatLoadShimmer } from "../components/chatLoadShimmer";
import MicListeningUI from "../components/micListeningUi";
import { ImageViewModal } from "../components/imageViewModal";
import OpenWhatsAppSheet from "../components/openWhatsappSheet";
import { useTranslation } from "react-i18next";

const InstantGuruUIDev = () => {
  useSignals();
  const [listening, setListening] = useState(false);
  const location = useLocation();
  const recognition = new window.webkitSpeechRecognition();
  const { i18n, t } = useTranslation();
  const [subject, setSubject] = useState("Physics");

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

  window.processMicInput = (input) => {
    doubtText.value = input;
  }

  window.reloadHistoryForNewResponse = () => {
    setTimeout(() => {
      getChatHistory();
    }, 2500)
  }



  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let language = urlParams.get("language");
    i18n.changeLanguage(language)
    setSubject(urlParams.get("subject") === "null" || urlParams.get("language") == null ? "Physics" : urlParams.get("subject"))
    getChatHistory();
  }, []);



  useEffect(() => {
    if (showMicListentingUI.value === false) {
      recognition.stop();
    }
  }, [showMicListentingUI.value])

  const newQuestion = () => {
    const chatContainer = document.getElementById("chat-container");
    if (waitingForResponse.value === true || showDoubtChatLoader.value === true || showChatLoadShimmer.value === true) {
      showToast("Waiting for response");
      return;
    }
    if (doubtText.value.split(" ").length > 2 || isStepWiseSolution.value === true) {
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
      showToast("Write your doubt in detail...")
    }
  };

  const handleNewChat = () => {
    openNewChat();
  }


  useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    chatContainer.scrollTop = chatContainer.scrollHeight + 400;
  }, [chatHistory.value, showDoubtChatLoader.value]);


  return (
    <div className="font-sans h-screen overflow-hidden">
      <div className="flex items-center px-4 py-2 h-[64px]">
        <img src={require("../assets/icons/icon_menu_home.png")} className="w-7" onClick={() => { openDrawer() }} />
        <h1 className="ml-4 text-lg font-bold">Instant Guru</h1>
        <button className="ml-auto bg-[#f6f6f6] text-sm px-4 py-1 rounded-[8px] border border-[#e8e9eb]" onClick={handleNewChat}>
          {t("newChat")}
        </button>
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
        className="p-4 overflow-y-auto h-[calc(100%-64px-94px)] flex flex-col scroll-smooth gap-4"
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

          if (chat.responseType === "TEXT_OPTION") {
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
              {chat.botResponse !== null && chat.botResponse !== "" && chat.responseType === "TEXT_OPTION" && (subject.toLowerCase() === "mathematics" || showOptionSelection.value === true) ? (
                <div className="flex items-end">
                  {chat.showAvatar || chat.showBotAvatar ? (
                    <img
                      src={require("../assets/icons/icon_chat_avatar.png")}
                      className="h-[40px] w-[40px] object-contain mr-2"
                    />
                  ) : <div className="h-11 w-11 mr-2"></div>}
                  <div className="flex flex-col px-3 py-2 bg-[#f6f6f6] mr-auto text-sm rounded-lg w-full">
                    <p className="mb-1">{t("chooseTypeOfSolution")}</p>
                    <div className="flex flex-col mr-auto">
                      {chat.optionResponse.map((option, index) => {
                        return (
                          <div key={index}
                            className="px-3 py-2 bg-white text-sm rounded-[8px] my-1"
                            onClick={hIndex !== chatHistory.value.length - 1 ? null : () => {
                              if (waitingForResponse.value === false && showDoubtChatLoader.value === false && showChatLoadShimmer.value === false) {
                                if (option.title.includes("Video") || option.title.includes("वीडियो")) {
                                  chatRequestVideo(chat.responseId);
                                } else {
                                  chatOptionClicked(chat.responseId, option.title);
                                }
                              }
                            }}
                          >
                            <p
                              className="text-sm"
                              dangerouslySetInnerHTML={{
                                __html: option.title.replaceAll(
                                  "(bold)<b>",
                                  "</b>"
                                ),
                              }}
                            ></p>
                          </div>
                        );
                      }
                      )}
                    </div>
                  </div>
                </div>
              ) : null
              }

              {chat.botResponse !== null && chat.botResponse !== "" && (chat.responseType === "TEXT" || chat.responseType === "HTML") ?
                (
                  <div className="flex items-end w-full overflow-x-hidden">
                    {chat.showAvatar || chat.showBotAvatar ? (
                      <img
                        src={require("../assets/icons/icon_chat_avatar.png")}
                        className={
                          chat.needFeedback
                            ? "h-[40px] w-[40px] object-contain mr-2 mb-6"
                            : "h-[40px] w-[40px] object-contain mr-2 mb-0"
                        }
                      />
                    ) : <div className="h-11 w-11 mr-2"></div>}
                    <div className="flex flex-col w-[calc(100vw-80px)] overflow-x-hidden">
                      <div className="px-3 py-2 bg-[#f6f6f6] text-sm rounded-xl flex-1 receiveBubble">
                        <MathJax className="overflow-x-auto" dangerouslySetInnerHTML={{ __html: chat.botResponse.replaceAll("(bold)<b>", "</b>").replaceAll("\n", "</br>") }}>
                        </MathJax>
                      </div>
                      {chat.needFeedback && hIndex == chatHistory.value.length - 1 ? (
                        <div className="flex items-center ml-auto mt-1">
                          <p className="text-[9px] text-gray-500 mr-2">
                            {t("was_this_helpful")}
                          </p>
                          <img
                            src={require("../assets/icons/icon_thumbs_up.png")}
                            className="h-4 mr-2"
                            onClick={hIndex !== chatHistory.value.length - 1 ? null : () => {
                              chatResponseFeedback(chat.responseId, true);
                            }}
                          />
                          <img
                            src={require("../assets/icons/icon_thumbs_down.png")}
                            className="h-4"
                            onClick={hIndex !== chatHistory.value.length - 1 ? null : () => {
                              chatResponseFeedback(chat.responseId, false);
                            }}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                )
                : null}
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

      <div className="h-[94px] w-full flex items-center justify-center px-4">
        <div className="border border-[#e8e9eb] rounded-lg bg-white flex items-center w-full overflow-hidden">
          <input
            type="text"
            className="outline-none p-3 w-full text-sm"
            placeholder={t("ask_anything")}
            value={doubtText.value}
            onChange={(e) => {
              doubtText.value = e.target.value;
            }}
          />
          <button onClick={openMicInput} className="mr-3">
            <img
              src={require("../assets/icons/icon_mic_black.png")}
              className={`h-9 object-contain ${listening ? "animate-pulse" : ""
                }`}
              alt="mic"
            />
          </button>
          <label htmlFor="imageInputt" className="cursor-pointer mr-3" onClick={handleImageIconClick}>
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
