import {
  chatHistory,
  chatSessionId,
  lastUserQuestion,
  showDoubtChatLoader,
} from "../state/instantGuruState";

export const getChatHistory = () => {
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
  //   chatSessionId = "3e724503-39b9-410b-b183-60763cd17380";

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
      if (chatSessionId.value === null || chatSessionId.value === "null") {
        postNewChat("");
      } else {
        chatHistory.value = data;
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
  doubtImageUrl = ""
) => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");
  const board = urlParams.get("board");
  const langauge = urlParams.get("language");
  const subject = urlParams.get("subject");

  showDoubtChatLoader.value = true;

  fetch(
    "https://platform-dev.arivihan.com:443/arivihan-platform/webview/doubt/chat",
    {
      method: "POST",
      headers: {
        accept: "*/*",
        userId: userId,
        board: board === "true" ? true : false,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answer: "string",
        chatSessionId: chatSessionId.value,
        doubtImageUrl: doubtImageUrl,
        firstDoubt: chatHistory.value.length === 3 ? true : false,
        giveOption: chatHistory.value.length === 3 ? true : false,
        mockTestDoubt: false,
        question: "string",
        requestType: requestType,
        selectedSubjectName: subject,
        userQuery: userQuery,
      }),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (chatSessionId.value === null) {
        chatSessionId.value = data.data[data.data.length - 1].chatSesssionId;
      }
      chatHistory.value = [...chatHistory.value, ...data.data];
      console.log(data);
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
      chatHistory.value = [...chatHistory.value, ...data.data];
      console.log(data);
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

export const chatImageRequest = (imageFile) => {
  let formData = new FormData();
  formData.append("file", imageFile);
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
