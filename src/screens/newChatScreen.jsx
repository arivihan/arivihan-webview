import React, { useEffect, useState } from "react";
// import 'katex/dist/katex.min.css';
// import Latex from "react-latex-next";
import { useLocation } from "react-router-dom";
import {
  chatHistory,
  doubtText,
  lastUserQuestion,
  showDoubtChatLoader,
  waitingForResponse,
} from "../state/instantGuruState";
import {
  chatImageRequest,
  chatOptionClicked,
  chatRequestVideo,
  chatResponseFeedback,
  getChatHistory,
  postNewChat,
} from "../utils/instantGuruUtils";
import { useSignals } from "@preact/signals-react/runtime";
import { PulseLoader } from "react-spinners";
import { MathJax } from "better-react-mathjax";

const InstantGuruUI = () => {
  useSignals();
  const [listening, setListening] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const location = useLocation();

  useEffect(() => {
    getChatHistory();
  }, []);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support voice input!");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      doubtText.value = transcript;
      // setDoubtText(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
    };

    recognition.start();
  };

  const newQuestion = () => {
    const chatContainer = document.getElementById("chat-container");
    if(waitingForResponse.value ===  true){
      alert("waiting for response")
      return;
    }
    if (doubtText.value.split(" ").length > 2) {
      chatContainer.innerHTML += `<div class='px-3 py-2 bg-[#f6f6f6] ml-auto text-sm rounded mt-4'><p>${doubtText}</p></div>`;
      chatContainer.scrollTop = chatContainer.scrollHeight;
      postNewChat(doubtText.value);
      lastUserQuestion.value = doubtText.value;
      doubtText.value = "";
    }
  };

  useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [chatHistory.value, showDoubtChatLoader.value]);

  const handleImageSelection = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const chatContainer = document.getElementById("chat-container");
        chatContainer.innerHTML += `<div class='max-w-[64%] p-2 bg-[#f6f6f6] ml-auto text-lg rounded'>
          <img src="${e.target.result}" alt="Uploaded" class="h-full rounded-lg" />
        </div>`;
        chatContainer.scrollTop = chatContainer.scrollHeight;
      };
      reader.readAsDataURL(file);
      setTimeout(()=>{
        chatImageRequest(file);
      },100)
    }
  };

  return (
    <div className="font-sans h-screen overflow-y-hidden">
      <div className="flex justify-between items-center px-4 py-2 h-[64px]">
        <h1 className="text-lg font-bold">Instant Guru</h1>
        <button className="bg-[#f6f6f6] text-sm px-4 py-1 rounded border border-[#e8e9eb]">
          New Chat
        </button>
      </div>

      <div
        className="p-4 space-y-2 overflow-y-auto h-[calc(100%-64px-94px)] flex flex-col scroll-smooth"
        id="chat-container"
      >
        {chatHistory.value.map((chat, hIndex) => {
          if(chat.waitingForResponse){
            waitingForResponse.value = true;
          }
          return (
            <div className="flex flex-col w-full">
              {chat.userQuery !== undefined &&
              chat.userQuery !== null &&
              chat.userQuery !== "" ? (
                chat.requestType === "IMAGE_HTML" ||
                chat.requestType === "IMAGE" ? (
                  <div class="p-2 bg-[#f6f6f6] ml-auto text-lg rounded max-w-[64%] mt-2">
                    <img
                      src={chat.userQuery}
                      alt="Uploaded"
                      class="rounded-lg object-contain"
                    />
                  </div>
                ) : (
                  <div class="px-3 py-2 bg-[#f6f6f6] ml-auto text-sm rounded max-w-[64%] mt-2">
                    <p className="text-sm">{chat.userQuery}</p>
                  </div>
                )
              ) : null}
              {chat.botResponse !== null && chat.botResponse !== "" ? (
                chat.responseType === "TEXT_OPTION" ? (
                  <div className="flex items-end mt-4">
                    {/* {chat.showBotAvatar && ( */}
                    <img
                      src={require("../assets/icons/icon_chat_avatar.png")}
                      className="h-10 w-10 object-contain mr-2"
                    />
                    {/* )}  */}
                    <div class="px-3 py-2 bg-[#f6f6f6] mr-auto text-sm rounded w-full">
                      <p>Apko apke doubt ka solution kaisa chahiye?</p>
                      {chat.optionResponse.map((option, index) => {
                        return (
                          <div
                            class="px-3 py-2 bg-white ml-auto text-sm rounded my-2"
                            onClick={hIndex !== chatHistory.value.length -1 ? null : () => {
                              if(option.title.includes("Video")){
                                chatRequestVideo(chat.responseId);
                              }else{
                                chatOptionClicked(chat.responseId, option.title);
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
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-end mt-4 w-full overflow-hidden">
                    <img
                      src={require("../assets/icons/icon_chat_avatar.png")}
                      className={
                        chat.needFeedback
                          ? "h-10 w-10 object-contain mr-2 mb-6"
                          : "h-10 w-10 object-contain mr-2 mb-0"
                      }
                    />
                    <div className="flex flex-col w-full">
                      <div class="px-3 py-2 bg-[#f6f6f6] mr-auto text-sm rounded w-full overflow-x-auto">
                        <MathJax dangerouslySetInnerHTML={{__html:chat.botResponse.replaceAll("(bold)<b>", "</b>")}}>
                          {/* {chat.botResponse.replaceAll("(bold)<b>", "</b>")} */}
                        </MathJax>
                      </div>
                      {chat.needFeedback ? (
                        <div className="flex items-center ml-auto mt-1">
                          <p className="text-[9px] text-gray-500 mr-2">
                            Was this helpful?{" "}
                          </p>{" "}
                          <img
                            src={require("../assets/icons/icon_thumbs_up.png")}
                            className="h-4 mr-2"
                            onClick={hIndex !== chatHistory.value.length -1 ? null : () => {
                              chatResponseFeedback(chat.responseId, true);
                            }}
                          />
                          <img
                            src={require("../assets/icons/icon_thumbs_down.png")}
                            className="h-4"
                            onClick={hIndex !== chatHistory.value.length -1 ? null : () => {
                              chatResponseFeedback(chat.responseId, false);
                            }}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                )
              ) : null}
            </div>
          );
        })}

        {showDoubtChatLoader.value === true ? (
          <div className="flex items-center mt-6">
            <img
              src={require("../assets/icons/icon_chat_avatar.png")}
              className="h-10 w-10 object-contain mr-2"
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
      </div>

      <div className="h-[94px] w-full flex items-center justify-center px-4">
        <div className="border border-[#e8e9eb] rounded-lg bg-white flex items-center w-full overflow-hidden">
          <input
            type="text"
            className="outline-none p-3 w-full text-sm"
            placeholder="Ask anything..."
            value={doubtText.value}
            onChange={(e) => {
              doubtText.value = e.target.value;
            }}
          />
          <button onClick={startListening} className="mr-3">
            <img
              src={require("../assets/icons/icon_mic_black.png")}
              className={`h-9 object-contain ${
                listening ? "animate-pulse" : ""
              }`}
              alt="mic"
            />
          </button>
          <label htmlFor="imageInput" className="cursor-pointer mr-3">
            <img
              src={require("../assets/icons/icon_camera_black.png")}
              className="h-7 object-contain"
              alt="camera"
            />
          </label>
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelection}
          />
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

export default InstantGuruUI;
