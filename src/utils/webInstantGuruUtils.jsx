import {
  bottomSuggestedQuestion,
  callClassifier,
  chatHistory,
  chatSessionId,
  chatType,
  isFirstDoubt,
  lastUserQuestion,
  showChatLoadShimmer,
  showDoubtChatLoader,
  showOptionSelection,
  showWhatsappBottomSheet,
  suggestedDoubtAsked,
  suggestionAdded,
} from "../state/instantGuruState";
import suggestedQuestions from "../assets/suggested_question.json";
import { chatHistoryLoading, chatLimits, chatSessions, showAuthModal, subscriptionActive } from "../state/chatState";
import Cookies from 'js-cookie';

const env = "prod";

let lastAbortController = null;

const customWebRequest = (baseUrl, method = "GET", requestBody = null, fullUrl = false) => {
  const cookieUser = Cookies.get("user");
  if (cookieUser === undefined || cookieUser === null) {
    // return;
    // throw new Error("Please login to check");
    return null;
  }

  if (lastAbortController && baseUrl.includes("resume?chatSessionId")) {
    lastAbortController.abort();
  }

  lastAbortController = new AbortController();
  const signal = lastAbortController.signal;

  let userDetails = JSON.parse(Cookies.get("user"));
  const userId = userDetails.userId;
  const langauge = "en";
  const board = "false";

  return fetch(fullUrl ? baseUrl : `https://platform-${env}.arivihan.com:443/arivihan-platform/secure/webview/doubt/${baseUrl}`, {
    method: method,
    body: requestBody,
    signal: signal,
    headers: {
      "token": Cookies.get('token'),
      "accept": "*/*",
      "Accept-Language": langauge === "hi" ? "HINDI" : "ENGLISH",
      "userId": userId,
      "board": board === "true" ? true : false,
      "Content-Type": "application/json",
    }
  })
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else if (res.status === 401) {
        showAuthModal.value = true;
        return;
      } else {
        console.log('Oops! something went wrong.')
        return;
      }

    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    })
}

export const checkUserSubscrition = () => {
  showChatLoadShimmer.value = true;
  return customWebRequest(`https://platform-${env}.arivihan.com:443/arivihan-platform/secure/bot/doubt/check/subscription`, 'GET', null, true).then((data) => {
    if (data) {
      subscriptionActive.value = data.subscriptionStatus;
      chatLimits.value = data;
      showChatLoadShimmer.value = false;

    }
  })
}

export const getUserChatSessions = () => {
  chatHistoryLoading.value = true;
  return customWebRequest('list/v2')
    .then((data) => {
      chatSessions.value = data;
      chatHistoryLoading.value = false;
    })
    .catch((error) => {
      chatHistoryLoading.value = false;
      alert(error);
    })
}

export const getChatHistory = () => {
  showChatLoadShimmer.value = true;

  if (chatSessionId.value === undefined || chatSessionId.value === null || chatSessionId.value === "null" || chatSessionId.value === "") {
    postNewChat("");
    showChatLoadShimmer.value = false;
    return;
  }

  const fetchingChatHistorySessionId = chatSessionId.value;

  customWebRequest(`resume?chatSessionId=${fetchingChatHistorySessionId}`)
    .then((data) => {
      if (chatSessionId.value === undefined || chatSessionId.value === null || chatSessionId.value === "null" || chatSessionId.value === "") {
        postNewChat("");
      } else {
        suggestedDoubtAsked.value = true;
        suggestionAdded.value = true;
        isFirstDoubt.value = false;

        if (chatSessionId.value === fetchingChatHistorySessionId) {
          chatHistory.value = data;
        }

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
    .catch((err) => {
      chatHistory.value = [];
      console.error("Error:", err);
    })
};

export const postNewChat = (
  userQuery,
  requestType = "HTML",
  doubtImageUrl = "",
  showOptions = false,
  imageQuery = "",
) => {
  let subject = "physics";

  if (showChatLoadShimmer.value !== true) {
    showDoubtChatLoader.value = true;
  }

  let data = JSON.stringify({
    answer: "",
    chatSessionId: chatSessionId.value,
    doubtImageUrl: doubtImageUrl,
    firstDoubt: isFirstDoubt.value,
    giveOption: isFirstDoubt.value && requestType !== "IMAGE_HTML",
    mockTestDoubt: false,
    question: "",
    requestType: requestType,
    selectedSubjectName: subject,
    userQuery: userQuery,
    imageQuery: imageQuery,
  })


  customWebRequest('chat', 'POST', data)
    .then((data) => {
      isFirstDoubt.value = false;
      if (chatSessionId.value !== null && chatSessionId.value !== "" && data.data[data.data.length - 1] && !data.data[data.data.length - 1].waitingForResponse) {
        updateDoubtStatus("SOLVED_SEEN");
      }

      if (data.data[data.data.length - 1].showBotAvatar === false) {
        data.data[data.data.length - 1]['showBotAvatar'] = true;
      }

      if (subject === null || subject === "null") {
        subject = "Physics";
      }

      if (data.data[0].responseType === "TEXT_OPTION" && subject.toLowerCase() !== 'mathematics' && !showOptions && (data.data[0].optionResponse[0].title.includes("Text") || data.data[0].optionResponse[0].title.includes("टेक्स्ट"))) {
        chatOptionClicked(data.data[0].responseId, data.data[0].optionResponse[0].title)
      } else {
        showDoubtChatLoader.value = false;

        if (chatSessionId.value === null || chatSessionId.value === "") {
          chatSessionId.value = data.data[data.data.length - 1].chatSesssionId;
          isFirstDoubt.value = true;
          data.data.forEach((chat) => {
            setTimeout(() => {
              if (Array.isArray(chatHistory.value)) {
                chatHistory.value = [...chatHistory.value, chat];
              } else {
                chatHistory.value = [chat];
              }
              // chatHistory.value = [...chatHistory.value, chat];
            }, 200)
          })
        } else {
          if (Array.isArray(chatHistory.value)) {
            chatHistory.value = [...chatHistory.value, ...data.data];
          } else {
            chatHistory.value = data.data;
          }
        }
      }
      showChatLoadShimmer.value = false;
    })
    .catch((err) => {
      showDoubtChatLoader.value = false;
      console.error("Error:", err);
    })
};

export const chatOptionClicked = (chatMessageId, option) => {
  const subject = "physics";

  showDoubtChatLoader.value = true;
  customWebRequest(`option/click/v4?chatMessageId=${chatMessageId}&chatSessionId=${chatSessionId.value}&selectedOption=${option}&selectedSubjectName=${subject}&requestPromptDetail=false&requestType=HTML&userDoubtText=${encodeURI(lastUserQuestion.value)}`)
    .then((data) => {
      isFirstDoubt.value = false;
      chatHistory.value = [...chatHistory.value, ...data.data];
      showDoubtChatLoader.value = false;
    })
    .catch((error) => {
      showDoubtChatLoader.value = false;
      console.error("Error:", error);
    })
};

export const chatResponseFeedback = (chatMessageId, thumbsUp) => {
  const subject = "physics";

  showDoubtChatLoader.value = true;
  customWebRequest(`feedback/v2?responseId=${chatMessageId}&chatSessionId=${chatSessionId}&thumbsUp=${thumbsUp}&videoFeedback=false&selectedSubjectName=${subject}`)
    .then((data) => {
      chatHistory.value = [...chatHistory.value, ...data.data];
      showDoubtChatLoader.value = false;
    })
    .catch((error) => {
      showDoubtChatLoader.value = false;
      console.error("Error:", error);
    })
};

export const chatRequestVideo = (responseId) => {
  const subject = "physics";

  showDoubtChatLoader.value = true;
  customWebRequest(`request-video?chatMessageId=${responseId}&chatSessionId=${chatSessionId.value}&subject=${subject}&createNewSessionRecord=false&doubt=${lastUserQuestion.value}`)
    .then((data) => {
      chatHistory.value = [...chatHistory.value, ...data];
      showDoubtChatLoader.value = false;
    })
    .catch((error) => {
      showDoubtChatLoader.value = false;
      console.error("Error:", error);
    })
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

export const chatImageRequest = (imageFile, userQuery = "") => {
  let formData = new FormData();
  formData.append("file", base64ToFile(imageFile, Math.random() + ".jpg"));

  let userDetails = JSON.parse(Cookies.get("user"));
  const userId = userDetails.userId;
  const token = Cookies.get("token");

  showOptionSelection.value = true;

  showDoubtChatLoader.value = true;
  fetch(
    `https://platform-${env}.arivihan.com:443/arivihan-platform/secure/webview/doubt/upload/image`,
    {
      method: "POST",
      headers: {
        Accept: "*/*",
        userId: userId,
        token: token,
      },
      body: formData,
    }
  )
    .then((response) => response.json())
    .then((data) => {
      showDoubtChatLoader.value = false;
      postNewChat(data.message, "IMAGE_HTML", data.message, true, userQuery);
    })
    .catch((error) => console.error("Error:", error));
};

export function chatClassifier(message) {
  showDoubtChatLoader.value = true;

  customWebRequest(`chat-classifier?doubt=` + encodeURI(message))
    .then((data) => {
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
    .catch((error) => {
      console.error('Error:', error)
    })
}

export function postNewChatConversation(userDoubt) {
  showDoubtChatLoader.value = true;

  customWebRequest(`chat-conversation?chatSessionId=${chatSessionId.value}&doubt=${userDoubt}`)
    .then((data) => {
      chatHistory.value = [...chatHistory.value, ...data];
      showDoubtChatLoader.value = false;
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}


export function saveDoubtChat(userDoubt, botResponse) {
  let uLanguage = "en";
  let uSubject = "physics";

  const requestBody = JSON.stringify({
    "chatSessionId": chatSessionId.value,
    "userQuery": userDoubt,
    "botResponse": botResponse,
    "language": uLanguage === "hi" ? "HINDI" : "ENGLISH",
    "subjectName": uSubject
  })

  customWebRequest('save-doubt-chat', 'POST', requestBody)
    .then((data) => {
      chatHistory.value = [...chatHistory.value, ...data]
      console.log(data);
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

export function updateDoubtStatus(status) {
  customWebRequest(`update/doubt/status?chatSessionId=${chatSessionId.value}&status=${status}`)
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    })
}

export function loadSuggestedQuestions(addInChatHistory = false) {

  let userDetails = JSON.parse(Cookies.get("user"));

  let uLanguage = "en";
  let uCourseId = userDetails.courseId;
  let uSubject = "physics";
  let uClassId = userDetails.classId;

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
          return options;
        }
      }
    }
  }
}

export function scrollToBottom() {
  setTimeout(() => {
    const chatContainer = document.getElementById("chat-container");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, 200)
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