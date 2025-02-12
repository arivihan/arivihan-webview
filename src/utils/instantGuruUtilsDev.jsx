import {
  bottomSuggestedQuestion,
  callClassifier,
  chatHistory,
  chatSessionId,
  chatType,
  giveResponseOption,
  isFirstDoubt,
  lastUserQuestion,
  showChatLoadShimmer,
  showDoubtChatLoader,
  showOptionSelection,
  showWhatsappBottomSheet,
  suggestionAdded,
} from "../state/instantGuruState";
import suggestedQuestions from "../assets/suggested_question.json";
import { useTranslation } from "react-i18next";


export const getChatHistory = () => {
  showChatLoadShimmer.value = true;
  const urlParams = new URLSearchParams(window.location.search);
  let onGoingChatSessionId = urlParams.get("chatSessionId");
  if (
    onGoingChatSessionId !== undefined &&
    onGoingChatSessionId !== null &&
    onGoingChatSessionId !== "null" &&
    onGoingChatSessionId !== ""
  ) {
    chatSessionId.value = onGoingChatSessionId;
  }

  const userId = urlParams.get("userId");
  const langauge = urlParams.get("language");
  const token = urlParams.get("token");
  const env = urlParams.get("env");

  if (chatSessionId.value === undefined || chatSessionId.value === null || chatSessionId.value === "null" || chatSessionId.value === "") {
    postNewChat("");
    showChatLoadShimmer.value = false;
    return;
  }

  fetch(
    `https://platform-${env}.arivihan.com:443/arivihan-platform/webview/doubt/resume?chatSessionId=${chatSessionId.value}`,
    {
      method: "GET",
      headers: {
        token: token,
        accept: "*/*",
        "Accept-Language": langauge === "hi" ? "HINDI" : "ENGLISH",
        userId: userId,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (chatSessionId.value === undefined || chatSessionId.value === null || chatSessionId.value === "null" || chatSessionId.value === "") {
        postNewChat("");
      } else {
        isFirstDoubt.value = false;
        chatHistory.value = data;

        callClassifier.value = false;
        chatType.value = 'subject_based';

        if (data[data.length - 3] && data[data.length - 3].markSeen) {
          updateDoubtStatus("SOLVED_SEEN");
        }


        if (data.length > 0 && data[0].responseType === "TEXT_OPTION") {
          lastUserQuestion.value = data[0].userQuery
        }
        showChatLoadShimmer.value = false
      }
    })
    .catch((error) => {
      chatHistory.value = [];
      console.error("Error:", error);
    });
};

export const postNewChat = (
  userQuery,
  requestType = "HTML",
  doubtImageUrl = "",
  showOptions = false
) => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");
  const board = urlParams.get("board");
  const langauge = urlParams.get("language");
  const subject = urlParams.get("subject");
  const answer = urlParams.get("answer");
  const question = urlParams.get("question");
  const mockQuestion = urlParams.get("mockQuestion");
  const token = urlParams.get("token");
  const env = urlParams.get("env");


  if (showChatLoadShimmer.value !== true) {
    showDoubtChatLoader.value = true;
  }

  fetch(
    `https://platform-${env}.arivihan.com:443/arivihan-platform/webview/doubt/chat`,
    {
      method: "POST",
      headers: {
        accept: "*/*",
        userId: userId,
        board: board === "true" ? true : false,
        token: token,
        "Content-Type": "application/json",
        "Accept-Language": langauge === "hi" ? "HINDI" : "ENGLISH",
      },
      body: JSON.stringify({
        answer: answer,
        chatSessionId: chatSessionId.value,
        doubtImageUrl: doubtImageUrl,
        firstDoubt: isFirstDoubt.value,
        giveOption: isFirstDoubt.value && requestType !== "IMAGE_HTML",
        mockTestDoubt: mockQuestion === "true" ? true : false,
        question: question,
        requestType: requestType,
        selectedSubjectName: subject,
        userQuery: userQuery,
      }),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      isFirstDoubt.value = false;

      if (chatSessionId.value === null || chatSessionId.value === "") {
        chatSessionId.value = data.data[data.data.length - 1].chatSesssionId;
        isFirstDoubt.value = true;
        data.data.forEach((chat) => {
          setTimeout(() => {
            chatHistory.value = [...chatHistory.value, chat];
          }, 200)
        })
      } else {
        chatHistory.value = [...chatHistory.value, ...data.data];
      }

      if ((data.data[data.data.length - 1] && data.data[data.data.length - 1].markSeen && requestType === "HTML") || (subject === "Mathematics" && !data.data[data.data.length - 1].waitingForResponse)) {
        updateDoubtStatus("SOLVED_SEEN");
      }

      if (data.data[data.data.length - 1].showBotAvatar === false) {
        data.data[data.data.length - 1]['showBotAvatar'] = true;
      }


      if (subject === null || subject === "null") {
        subject = "Physics";
      }

      // if (data.data[0].responseType === "TEXT_OPTION" && subject.toLowerCase() !== 'mathematics' && !showOptions) {
      //   chatOptionClicked(data.data[0].responseId, data.data[0].optionResponse[0].title)
      // }else{
      // }

      showChatLoadShimmer.value = false;
      showDoubtChatLoader.value = false;
    })
    .catch((error) => {
      showDoubtChatLoader.value = false;
      console.error("Error:", error);
    });
};

export const chatOptionClicked = (chatMessageId, option) => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");
  const board = urlParams.get("board");
  const langauge = urlParams.get("language");
  const subject = urlParams.get("subject");
  const token = urlParams.get("token");
  const env = urlParams.get("env");

  showDoubtChatLoader.value = true;

  fetch(
    `https://platform-${env}.arivihan.com:443/arivihan-platform/webview/doubt/option/click/v4?chatMessageId=${chatMessageId}&chatSessionId=${chatSessionId.value}&selectedOption=${option}&selectedSubjectName=${subject}&requestPromptDetail=false&requestType=HTML&userDoubtText=${encodeURI(lastUserQuestion.value)}`,
    {
      method: "GET",
      headers: {
        Accept: "*/*",
        userId: userId,
        board: board,
        token: token,
        "Accept-Language": langauge === "hi" ? "HINDI" : "ENGLISH",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      isFirstDoubt.value = false;
      chatHistory.value = [...chatHistory.value, ...data.data];
      showDoubtChatLoader.value = false;
    })
    .catch((error) => {
      showDoubtChatLoader.value = false;
      console.error("Error:", error);
    });
};

export const chatResponseFeedback = (chatMessageId, thumbsUp) => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");
  const board = urlParams.get("board");
  const langauge = urlParams.get("language");
  const subject = urlParams.get("subject");
  const token = urlParams.get("token");
  const env = urlParams.get("env");

  showDoubtChatLoader.value = true;

  fetch(
    `https://platform-${env}.arivihan.com:443/arivihan-platform/webview/doubt/feedback/v2?responseId=${chatMessageId}&chatSessionId=${chatSessionId}&thumbsUp=${thumbsUp}&videoFeedback=false&selectedSubjectName=${subject}`,
    {
      method: "GET",
      headers: {
        Accept: "*/*",
        userId: userId,
        token: token,
        "Accept-Language": langauge === "hi" ? "HINDI" : "ENGLISH",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      chatHistory.value = [...chatHistory.value, ...data.data];
      showDoubtChatLoader.value = false;
    })
    .catch((error) => {
      showDoubtChatLoader.value = false;
      console.error("Error:", error);
    });
};

export const chatRequestVideo = (responseId) => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");
  const board = urlParams.get("board");
  const langauge = urlParams.get("language");
  const subject = urlParams.get("subject");
  const token = urlParams.get("token");
  const env = urlParams.get("env");

  showDoubtChatLoader.value = true;

  fetch(
    `https://platform-${env}.arivihan.com:443/arivihan-platform/webview/doubt/request-video?chatMessageId=${responseId}&chatSessionId=${chatSessionId.value}&subject=${subject}&createNewSessionRecord=false&doubt=${lastUserQuestion.value}`,
    {
      method: "GET",
      headers: {
        Accept: "*/*",
        token: token,
        userId: userId,
        "Accept-Language": langauge === "hi" ? "HINDI" : "ENGLISH",
        board: board,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      chatHistory.value = [...chatHistory.value, ...data];
      showDoubtChatLoader.value = false;
    })
    .catch((error) => {
      showDoubtChatLoader.value = false;
      console.error("Error:", error);
    });
};

const base64ToFile = (base64String, fileName) => {
  const byteString = atob(base64String.split(',')[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([uint8Array], { type: 'image/jpeg' });
  return new File([blob], fileName, { type: 'image/jpeg' });
};

export const chatImageRequest = (imageFile) => {
  let formData = new FormData();
  formData.append("file", base64ToFile(imageFile, Math.random() + ".jpg"));
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");
  const board = urlParams.get("board");
  const langauge = urlParams.get("language");
  const subject = urlParams.get("subject");
  const token = urlParams.get("token");
  const env = urlParams.get("env");

  showOptionSelection.value = true;

  showDoubtChatLoader.value = true;
  fetch(
    `https://platform-${env}.arivihan.com:443/arivihan-platform/webview/doubt/upload/image`,
    {
      method: "POST",
      headers: {
        Accept: "*/*",
        userId: userId,
        token: token,
        // "Content-Type": "multipart/form-data",
        // "Content-Type": "application/json",
      },
      body: formData,
    }
  )
    .then((response) => response.json())
    .then((data) => {
      showDoubtChatLoader.value = false;
      postNewChat(data.message, "IMAGE_HTML", data.message, true);
    })
    .catch((error) => console.error("Error:", error));
};

export function chatClassifier(message) {

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const env = urlParams.get("env");


  showDoubtChatLoader.value = true;
  const url = `https://platform-${env}.arivihan.com:443/arivihan-platform/webview/doubt/chat-classifier?doubt=` + encodeURI(message);

  const headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
  };

  fetch(url, {
    method: 'GET',
    headers: headers,
    token: token,
  })
    .then(response => response.json())
    .then(data => {
      chatType.value = data.result;
      showDoubtChatLoader.value = false;
      if (data.result === "conversation_based") {
        postNewChatConversation(message);
      } else if (data.result !== "subject_based") {
        showWhatsappBottomSheet.value = true;
      } else if (data.result === "subject_based") {
        isFirstDoubt.value = true;
        postNewChat(message);
      }
    })
    .catch(error => console.error('Error:', error));
}

export function postNewChatConversation(userDoubt) {
  showDoubtChatLoader.value = true;
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");
  const token = urlParams.get("token");
  const env = urlParams.get("env");

  const url = `https://platform-${env}.arivihan.com:443/arivihan-platform/webview/doubt/chat-conversation?chatSessionId=${chatSessionId.value}&doubt=${userDoubt}`;

  const headers = {
    'accept': '*/*',
    'userId': userId,
    token: token
  };

  fetch(url, {
    method: 'GET',
    headers: headers
  })
    .then(response => response.json())
    .then(data => {
      chatHistory.value = [...chatHistory.value, ...data];
      showDoubtChatLoader.value = false;
    })
    .catch(error => console.error('Error:', error));
}


export function saveDoubtChat(userDoubt, botResponse) {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");
  const token = urlParams.get("token");
  const env = urlParams.get("env");
  let uLanguage = urlParams.get("language");
  let uSubject = urlParams.get("subject");

  const url = `https://platform-${env}.arivihan.com:443/arivihan-platform/webview/doubt/save-doubt-chat`;

  const headers = {
    'accept': '*/*',
    'userId': userId,
    token: token,
    'Content-Type': 'application/json',
  };

  const requestBody = {
    "chatSessionId": chatSessionId.value,
    "userQuery": userDoubt,
    "botResponse": botResponse,
    "language": uLanguage,
    "subjectName": uSubject
  }

  fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(requestBody)
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => console.error('Error:', error));
}

export function updateDoubtStatus(status) {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");
  const token = urlParams.get("token");
  const env = urlParams.get("env");

  fetch(`https://platform-${env}.arivihan.com:443/arivihan-platform/webview/doubt/update/doubt/status?chatSessionId=${chatSessionId.value}&status=${status}`, {
    method: "GET",
    headers: {
      "accept": "*/*",
      "userId": userId,
      token: token
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

export function loadSuggestedQuestions(addInChatHistory = false) {

  const urlParams = new URLSearchParams(window.location.search);
  let uLanguage = urlParams.get("language");
  let uCourseId = urlParams.get("courseId");
  let uSubject = urlParams.get("subject");
  let uClassId = urlParams.get("classId");

  let courseNameMapping = {
    "1": "jee",
    "2": "board",
    "3": "jee"
  }

  let classNameMapping = {
    "1": "11th",
    "2": "12th",
    "3": "dropper",
    "4": "foundation"
  };

  if (uLanguage && uCourseId && uSubject && uClassId) {
    if (suggestedQuestions && suggestedQuestions.length > 0) {
      let options = suggestedQuestions
        .filter((question) => question.subject === uSubject.toLowerCase() && question.language === uLanguage.toLowerCase() && question.course === courseNameMapping[uCourseId] && question.class === classNameMapping[uClassId])
        .map((question) => {
          return {
            "title": question['question'],
            "suggested_question": true,
          }
        })

      if (options.length > 0 && suggestionAdded.value === false) {
        bottomSuggestedQuestion.value = options;
        console.log(options);
        
        if (addInChatHistory) {
          suggestionAdded.value = true;
          return options;
        }
      }
    }
  }
}

export function scrollToBottom() {
  setTimeout(()=>{
    const chatContainer = document.getElementById("chat-container");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  },200)
}

export function showToast(message) {
  if (typeof AndroidInterface !== 'undefined') {
    window.AndroidInterface.showToast(message)
  } else {
    alert(message);
  }
}

export function openDrawer() {
  if (typeof AndroidInterface !== 'undefined') {
    window.AndroidInterface.openDrawer();
  } else {
    alert("AndroidInterface is not defined for drawer");
  }
}

export function openVideo(videoUrl, startPosition, endPosition, chatSesisonId, responseId) {
  if (typeof AndroidInterface !== 'undefined') {
    updateDoubtStatus("SOLVED_SEEN")
    window.AndroidInterface.openVideo(videoUrl, startPosition, endPosition, chatSesisonId, responseId);
  } else {
    alert("AndroidInterface is not defined for drawer");
  }
}

export function openWhatsapp() {
  if (typeof AndroidInterface !== 'undefined') {
    window.AndroidInterface.openWhatsapp();
  } else {
    alert("AndroidInterface is not defined for drawer");
  }
}

export function openNewChat() {
  if (typeof AndroidInterface !== 'undefined') {
    window.AndroidInterface.openNewChat();
  } else {
    alert("AndroidInterface is not defined for NewChat");
  }
}

export function openFilePicker() {
  if (typeof AndroidInterface !== 'undefined') {
    window.AndroidInterface.openImagePicker();
  } else {
    alert("AndroidInterface is not defined for File Picker");
  }
}

export function openMicInput() {
  if (typeof AndroidInterface !== 'undefined') {
    window.AndroidInterface.openMicInput();
  } else {
    alert("AndroidInterface is not defined for Mic Input");
  }
}

export function setChatSessionIdInActivity() {
  if (typeof AndroidInterface !== 'undefined') {
    try {
      window.AndroidInterface.setChatSessionId(chatSessionId.value);
    } catch (error) {

    }
  } else {
    // alert("AndroidInterface is not defined chat session id");
  }
}


export function changeSelectedCourse() {
  console.log("testafasd")
  if (typeof AndroidInterface !== 'undefined') {
    try {
      window.AndroidInterface.changeCourse();
    } catch (error) {

    }
  } else {
    alert("AndroidInterface is not defined for change selected course");
  }
}

export function watchLectureNowTextClickAction() {
  if (typeof AndroidInterface !== 'undefined') {
    try {
      window.AndroidInterface.watchLectureNow();
    } catch (error) {

    }
  } else {
    alert("AndroidInterface is not defined for watchLectureNowTextClickAction");
  }
}