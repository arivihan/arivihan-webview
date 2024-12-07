import {
  chatHistory,
  chatSessionId,
  chatType,
  giveResponseOption,
  isFirstDoubt,
  lastUserQuestion,
  showChatLoadShimmer,
  showDoubtChatLoader,
  showWhatsappBottomSheet,
} from "../state/instantGuruState";

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

  fetch(
    `https://platform-dev.arivihan.com:443/arivihan-platform/webview/doubt/resume?chatSessionId=${chatSessionId.value}`,
    {
      method: "GET",
      headers: {
        accept: "*/*",
        "Accept-Language": langauge,
        userId: userId,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      // setChatHistory(data);
      if (chatSessionId.value === undefined || chatSessionId.value === null || chatSessionId.value === "null" || chatSessionId.value === "") {
        postNewChat("");
      } else {
        isFirstDoubt.value = false;
        chatHistory.value = data;
        showChatLoadShimmer.value = false
      }
    })
    .catch((error) => {
      // setChatHistory([]);
      chatHistory.value = [];
      console.error("Error:", error);
    });
};

export const postNewChat = (
  userQuery,
  requestType = "HTML",
  doubtImageUrl = "",
) => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");
  const board = urlParams.get("board");
  const langauge = urlParams.get("language");
  const subject = urlParams.get("subject");
  const answer = urlParams.get("answer");
  const question = urlParams.get("question");

  if (showChatLoadShimmer.value !== true) {
    showDoubtChatLoader.value = true;
  }

  fetch(
    "https://platform-dev.arivihan.com:443/arivihan-platform/webview/doubt/chat",
    {
      method: "POST",
      headers: {
        accept: "*/*",
        userId: userId,
        board: board === "true" ? true : false,
        "Content-Type": "application/json",
        "Accept-Language": langauge,
      },
      body: JSON.stringify({
        answer: answer,
        chatSessionId: chatSessionId.value,
        doubtImageUrl: doubtImageUrl,
        firstDoubt: isFirstDoubt.value,
        giveOption: isFirstDoubt.value && requestType !== "IMAGE_HTML",
        mockTestDoubt: false,
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
      }
      chatHistory.value = [...chatHistory.value, ...data.data];
      showDoubtChatLoader.value = false;
      showChatLoadShimmer.value = false;
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

  showDoubtChatLoader.value = true;

  fetch(
    `https://platform-dev.arivihan.com:443/arivihan-platform/webview/doubt/option/click/v4?chatMessageId=${chatMessageId}&chatSessionId=${chatSessionId.value}&selectedOption=${option}&selectedSubjectName=${subject}&requestPromptDetail=false&requestType=HTML&userDoubtText=${lastUserQuestion.value}`,
    {
      method: "GET",
      headers: {
        Accept: "*/*",
        userId: userId,
        board: board,
        "Accept-Language": langauge,
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

  showDoubtChatLoader.value = true;

  fetch(
    `https://platform-dev.arivihan.com:443/arivihan-platform/webview/doubt/feedback/v2?responseId=${chatMessageId}&chatSessionId=${chatSessionId}&thumbsUp=${thumbsUp}&videoFeedback=false&selectedSubjectName=${subject}`,
    {
      method: "GET",
      headers: {
        Accept: "*/*",
        userId: userId,
        "Accept-Language": langauge,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      chatHistory.value = [...chatHistory.value, ...data.data];
      showDoubtChatLoader.value = false;
      console.log(data);
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

  showDoubtChatLoader.value = true;

  fetch(
    `https://platform-dev.arivihan.com:443/arivihan-platform/webview/doubt/request-video?chatMessageId=${responseId}&chatSessionId=${chatSessionId.value}&subject=${subject}&createNewSessionRecord=false&doubt=${lastUserQuestion.value}`,
    {
      method: "GET",
      headers: {
        Accept: "*/*",
        userId: userId,
        "Accept-Language": langauge,
        board: board,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      chatHistory.value = [...chatHistory.value, ...data];
      showDoubtChatLoader.value = false;
      console.log(data);
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

  showDoubtChatLoader.value = true;
  fetch(
    "https://platform-dev.arivihan.com:443/arivihan-platform/webview/doubt/upload/image",
    {
      method: "POST",
      headers: {
        Accept: "*/*",
        userId: userId,
        // "Content-Type": "multipart/form-data",
        // "Content-Type": "application/json",
      },
      body: formData,
    }
  )
    .then((response) => response.json())
    .then((data) => {
      showDoubtChatLoader.value = false;
      postNewChat(data.message, "IMAGE_HTML", data.message);
      console.log(data);

    })
    .catch((error) => console.error("Error:", error));
};

export function chatClassifier(message) {

  showDoubtChatLoader.value = true;
  const url = 'https://platform-dev.arivihan.com:443/arivihan-platform/webview/doubt/chat-classifier?doubt=' + message;

  const headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
  };

  fetch(url, {
    method: 'GET',
    headers: headers,
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
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

  const url = `https://platform-dev.arivihan.com:443/arivihan-platform/webview/doubt/chat-conversation?chatSessionId=${chatSessionId.value}&doubt=${userDoubt}`;

  const headers = {
    'accept': '*/*',
    'userId': userId
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