import React from "react";
import { useTranslation } from "react-i18next";
import { chatHistory, chatType, isFirstDoubt, showChatLoadShimmer, showDoubtChatLoader, suggestedDoubtAsked, waitingForResponse } from "../../state/instantGuruState";
import { chatOptionClicked, chatRequestVideo, chatResponseFeedback, openNewChat, saveDoubtChat, scrollToBottom } from "../../utils/instantGuruUtilsDev";
import { MathJax } from "better-react-mathjax";
import { AnimatePresence, motion } from "framer-motion";
import suggestedQuestions from "../../assets/suggested_question.json";


export const TextOptionBubble = ({ chat, chatIndex }) => {
    const { i18n, t } = useTranslation();
    return chat.botResponse !== null && chat.botResponse !== "" && chat.responseType === "TEXT_OPTION" ? (

        <AnimatePresence>
            <motion.div initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                key="box" className="flex items-end">
                {chat.showAvatar || chat.showBotAvatar ? (
                    <img
                        src={require("../../assets/icons/icon_chat_avatar.png")}
                        className="h-[40px] w-[40px] object-contain mr-2"
                    />
                ) : <div className="h-11 w-11 mr-2"></div>}
                <div class="flex flex-col px-3 py-2 bg-[#f6f6f6] mr-auto text-sm rounded-lg w-full">
                    <p className="mb-1" dangerouslySetInnerHTML={{ __html: chat.botResponse.replaceAll("(bold)<b>", "</b>") ?? t("chooseTypeOfSolution") }}></p>
                    <div className="flex flex-col mr-auto">
                        {chat.optionResponse.map((option, index) => {
                            return (
                                <div key={index}
                                    class="px-3 py-2 bg-white text-sm rounded-[8px] my-1"
                                    onClick={chatIndex !== chatHistory.value.length - 1 ? null : () => {
                                        if (waitingForResponse.value === false && showDoubtChatLoader.value === false && showChatLoadShimmer.value === false) {
                                            if (option.title.includes("Video") || option.title.includes("वीडियो")) {
                                                chatRequestVideo(chat.responseId);
                                            } else if (option.title.includes("New") || option.title.includes("नया")) {
                                                openNewChat();
                                            } else if (option.suggested_question === true) {
                                                let question = suggestedQuestions.filter((question) => question.question === option.title)[0];
                                                chatHistory.value = [...chatHistory.value, {
                                                    "botResponse": question.answer,
                                                    "responseType": "HTML",
                                                    "showBotAvatar": true,
                                                }]
                                                isFirstDoubt.value = false;
                                                suggestedDoubtAsked.value = true;
                                                chatType.value = "subject_based";
                                                scrollToBottom();
                                                saveDoubtChat(option.title, question.answer);
                                            } else {
                                                chatOptionClicked(chat.responseId, option.title);
                                            }
                                        }
                                    }}
                                >
                                    <p
                                        className="text-sm"
                                        dangerouslySetInnerHTML={{
                                            __html: option.title && option.title.replaceAll(
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
            </motion.div>
        </AnimatePresence>
    ) : null;
}



export const HTMLResponseBubble = ({ chat, chatIndex }) => {

    const { i18n, t } = useTranslation();

    return chat.botResponse !== null && chat.botResponse !== "" && (chat.responseType === "TEXT" || chat.responseType === "HTML") ?
        (
            <AnimatePresence>
                <motion.div initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: chatIndex > 2 ? 0 : chatIndex * 0.2 }}
                    exit={{ opacity: 0, scale: 0 }}
                    key="box" className="flex items-end w-full overflow-x-hidden">
                    {chat.showAvatar || chat.showBotAvatar ? (
                        <img
                            src={require("../../assets/icons/icon_chat_avatar.png")}
                            className={
                                chat.needFeedback
                                    ? "h-[40px] w-[40px] object-contain mr-2 mb-6"
                                    : "h-[40px] w-[40px] object-contain mr-2 mb-0"
                            }
                        />
                    ) : <div className="h-11 w-11 mr-2"></div>}
                    <div className="flex flex-col w-[calc(100vw-80px)] overflow-x-hidden">
                        <div class="px-3 py-2 bg-[#f6f6f6] text-sm rounded-xl flex-1 receiveBubble">
                            <MathJax className="overflow-x-auto" dangerouslySetInnerHTML={{ __html: chat.botResponse.replaceAll("(bold)<b>", "</b>").replaceAll("\n", "</br>") }}>
                            </MathJax>
                        </div>
                        {chat.needFeedback && chatIndex == chatHistory.value.length - 1 ? (
                            <div className="flex items-center ml-auto mt-1">
                                <p className="text-[9px] text-gray-500 mr-2">
                                    {t("was_this_helpful")}
                                </p>
                                <img
                                    src={require("../../assets/icons/icon_thumbs_up.png")}
                                    className="h-4 mr-2"
                                    onClick={chatIndex !== chatHistory.value.length - 1 ? null : () => {
                                        chatResponseFeedback(chat.responseId, true);
                                    }}
                                />
                                <img
                                    src={require("../../assets/icons/icon_thumbs_down.png")}
                                    className="h-4"
                                    onClick={chatIndex !== chatHistory.value.length - 1 ? null : () => {
                                        chatResponseFeedback(chat.responseId, false);
                                    }}
                                />
                            </div>
                        ) : null}
                    </div>
                </motion.div>
            </AnimatePresence>

        )
        : null;
}