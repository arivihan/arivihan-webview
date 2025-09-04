import {
  bottomSuggestedQuestion,
  callClassifier,
  chatHistory,
  chatSessionId,
  chatType,
  giveResponseOption,
  isFirstDoubt,
  isFirstRequestLoaded,
  lastUserQuestion,
  showChatLoadShimmer,
  showDoubtChatLoader,
  showOptionSelection,
  showSuggestions,
  showWhatsappBottomSheet,
  suggestedDoubtAsked,
  suggestionAdded,
} from "../state/instantGuruState";
import suggestedQuestions from "../assets/suggested_question.json";
import { analytics } from "../firebase";
import { logEvent } from "firebase/analytics"
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";


const REGION = "ap-south-1"; // Your region
const BUCKET = "my-react-upload-bucket"; // Your bucket
const IDENTITY_POOL_ID = "ap-south-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";

const s3 = new S3Client({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: REGION },
    identityPoolId: IDENTITY_POOL_ID,
  }),
});



const customAppRequest = (baseUrl, method = "GET", requestBody = null) => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");
  const langauge = urlParams.get("language");
  const token = urlParams.get("token");
  const env = urlParams.get("env");
  const board = urlParams.get("board");

  return fetch(`https://platform-${env}.arivihan.com:443/arivihan-platform/secure/webview/doubt/${baseUrl}`, {
    method: method,
    body: requestBody,
    headers: {
      "token": token,
      "accept": "*/*",
      "Accept-Language": langauge === "hi" ? "HINDI" : "ENGLISH",
      "userId": userId,
      "board": board === "true" ? true : false,
      "Content-Type": "application/json",
    },
  })
    .then(res => res.json())
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    })
}


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

  if (chatSessionId.value === undefined || chatSessionId.value === null || chatSessionId.value === "null" || chatSessionId.value === "") {
    postNewChat("");
    showChatLoadShimmer.value = false;
    return;
  }

  customAppRequest(`resume?chatSessionId=${chatSessionId.value}`)
    .then(data => {
      if (chatSessionId.value === undefined || chatSessionId.value === null || chatSessionId.value === "null" || chatSessionId.value === "") {
        postNewChat("");
      } else {
        suggestedDoubtAsked.value = true;
        suggestionAdded.value = true;
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
    .catch(error => {
      chatHistory.value = [];
      console.error("Error:", error);
    })
};

export const postNewChat = (
  userQuery,
  requestType = "HTML",
  doubtImageUrl = "",
  showOptions = false,
  imageQuery = "",
) => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");
  const board = urlParams.get("board");
  const langauge = urlParams.get("language");
  let subject = urlParams.get("subject");
  const answer = urlParams.get("answer");
  const question = urlParams.get("question");
  const mockQuestion = urlParams.get("mockQuestion");
  const token = urlParams.get("token");
  const env = urlParams.get("env");


  if (showChatLoadShimmer.value !== true) {
    showDoubtChatLoader.value = true;
  }

  let requestBody = JSON.stringify({
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
    imageQuery: imageQuery,
  });
  customAppRequest('chat', 'POST', requestBody)
    .then(data => {
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
              chatHistory.value = [...chatHistory.value, chat];
            }, 200)
          })
        } else {
          chatHistory.value = [...chatHistory.value, ...data.data];
        }
      }

      showChatLoadShimmer.value = false;
      isFirstRequestLoaded.value = true;

    })
    .catch(error => {
      showDoubtChatLoader.value = false;
      console.error("Error:", error);
    })
};

export const chatOptionClicked = (chatMessageId, option) => {
  const urlParams = new URLSearchParams(window.location.search);
  const subject = urlParams.get("subject");

  showDoubtChatLoader.value = true;

  customAppRequest(`option/click/v4?chatMessageId=${chatMessageId}&chatSessionId=${chatSessionId.value}&selectedOption=${option}&selectedSubjectName=${subject}&requestPromptDetail=false&requestType=HTML&userDoubtText=${encodeURI(lastUserQuestion.value)}`)
    .then(data => {
      isFirstDoubt.value = false;
      chatHistory.value = [...chatHistory.value, ...data.data];
      showDoubtChatLoader.value = false;
    })
    .catch(error => {
      showDoubtChatLoader.value = false;
      console.error("Error:", error);
    })
};

export const chatResponseFeedback = (chatMessageId, thumbsUp) => {
  const urlParams = new URLSearchParams(window.location.search);
  const subject = urlParams.get("subject");

  showDoubtChatLoader.value = true;

  customAppRequest(`feedback/v2?responseId=${chatMessageId}&chatSessionId=${chatSessionId}&thumbsUp=${thumbsUp}&videoFeedback=false&selectedSubjectName=${subject}`)
    .then(data => {
      chatHistory.value = [...chatHistory.value, ...data.data];
      showDoubtChatLoader.value = false;
    })
    .catch(error => {
      showDoubtChatLoader.value = false;
      console.error("Error:", error);
    })
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

  customAppRequest(`request-video?chatMessageId=${responseId}&chatSessionId=${chatSessionId.value}&subject=${subject}&createNewSessionRecord=false&doubt=${lastUserQuestion.value}`)
    .then(data => {
      chatHistory.value = [...chatHistory.value, ...data];
      showDoubtChatLoader.value = false;
    })
    .catch(error => {
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
    `https://platform-${env}.arivihan.com:443/arivihan-platform/secure/webview/doubt/upload/image`,
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
      console.log(data);

      showDoubtChatLoader.value = false;
      postNewChat(data.message, "IMAGE_HTML", data.message, true, userQuery);
    })
    .catch((error) => console.error("Error:", error));
};

export function chatClassifier(message) {
  showDoubtChatLoader.value = true;
  const urlParams = new URLSearchParams(window.location.search);
  const startTime = performance.now();

  customAppRequest(`chat-classifier-new`, "POST", JSON.stringify({
    "class": "Class 12th",
    "course": "Board",
    "language": urlParams.get("language").toLocaleLowerCase() === "en" ? "english" : "hindi",
    "requestType": "HTML",
    "subjectName": urlParams.get("subject"),
    "subscriptionStatus": "subscribed",
    "userName": urlParams.get("username"),
    "userQuery": message,
    "chatSessionId": chatSessionId.value
  }))
    .then(data => {
      console.log(data);

      chatType.value = data[0].sectionType;
      showDoubtChatLoader.value = false;


      try {
        const firebaseEventData = {
          event: "chat_classifier_response",
          result: data.result,
          timestamp: Date.now(),
          timeTakenMs: performance.now() - startTime,
          doubt: message
        };
        if (analytics) {
          logEvent(
            analytics,
            "chat_classifier_response",
            firebaseEventData
          )
        }

      } catch (error) {
        console.error("failed to push event :: " + error)
      }


      if (data[0].sectionType === "SectionType.SUBJECT_RELATED") {
        isFirstDoubt.value = true;
        postNewChat(message);
      } else if (data[0].sectionType === "SectionType.FAQ" || data[0].sectionType === "SectionType.CONVERSATION_BASED") {
        chatHistory.value = [...chatHistory.value, {
          "botResponse": data[0].bigtext,
          "responseType": "HTML",
          "showBotAvatar": true,
          "userQuery": ""
        }]
      } else if (data[0].sectionType === "SectionType.PDF") {

        if (data[0].cardType === "CardType.ACTIVITY") {
          chatHistory.value = [...chatHistory.value, {
            "botResponse": data[0].bigtext,
            "responseType": "HTML_VIDEO",
            "thumbnailUrl": data[0].thumbnailUrl,
            "title": data[0].displayTitle,
            "cardType": data[0].cardType,
            "actionButtonText": data[0].actionButtonText,
            "screenClassName": data[0].screenClassName,
            "navigationParams": data[0].navigationParams,
            "videoEndTime": data[0].Video_End_Time,
            "subtitle": data[0].displaySubtitle,
            "showBotAvatar": true,
            "needFeedback": true,
            "userQuery": ""
          }]
        } else {
          let pdfUrls = []

          data.forEach(res => {
            pdfUrls.push(
              {
                "pdfTitle": res.displayTitle,
                "pdfLink": res.pdfLink,
              }
            )
          });

          chatHistory.value = [...chatHistory.value, {
            "botResponse": data[0].bigtext,
            "responseType": "HTML_PDF",
            "pdfFiles": pdfUrls,
            "showBotAvatar": true,
            "userQuery": "",
            "needFeedback": true,
          }]
        }

      } else if (data[0].sectionType === "SectionType.LECTURE") {
        chatHistory.value = [...chatHistory.value, {
          "botResponse": data[0].bigtext,
          "responseType": "HTML_VIDEO",
          "thumbnailUrl": data[0].thumbnailUrl,
          "title": data[0].displayTitle,
          "cardType": data[0].cardType,
          "actionButtonText": data[0].actionButtonText,
          "screenClassName": data[0].screenClassName,
          "navigationParams": data[0].navigationParams,
          "videoEndTime": data[0].Video_End_Time,
          "subtitle": data[0].displaySubtitle,
          "showBotAvatar": true,
          "userQuery": "",
          "needFeedback": true,
        }]


      } else if (data[0].sectionType === "SectionType.ACTIVITY") {
        chatHistory.value = [...chatHistory.value, {
          "botResponse": data[0].bigtext,
          "responseType": "HTML_VIDEO",
          "thumbnailUrl": data[0].thumbnailUrl,
          "title": data[0].displayTitle,
          "cardType": data[0].cardType,
          "actionButtonText": data[0].actionButtonText,
          "screenClassName": data[0].screenClassName,
          "navigationParams": data[0].navigationParams,
          "videoEndTime": data[0].Video_End_Time,
          "subtitle": data[0].displaySubtitle,
          "showBotAvatar": true,
          "userQuery": "",
          "needFeedback": true,
        }]
      } else if (data[0].sectionType === "SectionType.PYQ") {
        chatHistory.value = [...chatHistory.value, {
          "botResponse": data[0].bigtext,
          "responseType": "HTML_LINKS",
          "showBotAvatar": true,
          "userQuery": "",
          "redirectLink": data[0].redirectLink,
          "needFeedback": true
        }]
      }
      // if (data[0].sectionType === "SectionType.OPEN_WHATSAPP")
      else {
        showWhatsappBottomSheet.value = true;
      }

      // callClassifier.value = false;

      // if (data.result === "conversation_based") {
      //   postNewChatConversation(message);
      // } else if (data.sectionType !== "SectionType.SUBJECT_RELATED") {
      //   showWhatsappBottomSheet.value = true;
      // } else if (data.sectionType === "SectionType.SUBJECT_RELATED") {
      //   isFirstDoubt.value = true;
      //   postNewChat(message);
      // }
    })
    .catch(error => {
      console.error('Error:', error)
    })


}

export function postNewChatConversation(userDoubt) {
  showDoubtChatLoader.value = true;

  customAppRequest(`chat-conversation?chatSessionId=${chatSessionId.value}&doubt=${userDoubt}`)
    .then(data => {
      chatHistory.value = [...chatHistory.value, ...data];
      showDoubtChatLoader.value = false;
    })
    .catch(error => {
      console.error('Error:', error)
    })
}


export function saveDoubtChat(userDoubt, botResponse) {
  const urlParams = new URLSearchParams(window.location.search);
  let uLanguage = urlParams.get("language");
  let uSubject = urlParams.get("subject");


  const requestBody = JSON.stringify({
    "chatSessionId": chatSessionId.value,
    "userQuery": userDoubt,
    "botResponse": botResponse,
    "language": uLanguage === "hi" ? "HINDI" : "ENGLISH",
    "subjectName": uSubject
  })

  customAppRequest('save-doubt-chat', 'POST', requestBody)
    .then(data => {
      chatHistory.value = [...chatHistory.value, ...data]
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error)
    })
}

export function updateDoubtStatus(status) {
  customAppRequest(`update/doubt/status?chatSessionId=${chatSessionId.value}&status=${status}`)
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    })
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
    "4": "foundation",
    "5": "12th",
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

export function showDoubtSubscriptionDialog() {
  if (typeof AndroidInterface !== 'undefined') {
    try {
      window.AndroidInterface.showSubscriptionDialog();
    } catch (error) {

    }
  } else {
    alert("AndroidInterface is not defined for showSubscriptionDialog");
  }
}



export function openAppActivity(className, activityParams) {
  console.log("OPEN_PARAMS :: " + JSON.stringify(className));

  console.log("OPEN_PARAMS :: " + JSON.stringify(activityParams));

  if (typeof AndroidInterface !== 'undefined') {
    try {
      window.AndroidInterface.openActivity(className, JSON.stringify(activityParams));
    } catch (error) {
    }
  } else {
    alert("AndroidInterface is not defined for openActivity");
  }
}

export function openPdf(url) {
  if (typeof AndroidInterface !== 'undefined') {
    try {
      window.AndroidInterface.openPdf(url);
    } catch (error) {
    }
  } else {
    alert("AndroidInterface is not defined for openActivity");
  }
}