import { signal } from "@preact/signals-react";


export const chatSessionId = signal("");
export const doubtText = signal("");
export const showMicListentingUI = signal(false);
export const showChatLoadShimmer = signal(true);
export const showDoubtChatLoader = signal(false);
export const chatHistory = signal([]);
export const lastUserQuestion = signal("");
export const videoResponseRequested = signal(false);
export const waitingForResponse = signal(false);
export const isFirstDoubt = signal(false);
export const isFirstRequestLoaded = signal(false);
export const callClassifier = signal(true);
export const imageViewUrl = signal(null);
export const chatType = signal(null);
export const showWhatsappBottomSheet = signal(false);
export const isStepWiseSolution = signal(false);
export const indexOfOptionSelection = signal(-2)
export const showOptionSelection = signal(false);
export const showSuggestions = signal(false);
export const suggestionAdded = signal(false);
export const suggestedDoubtAsked = signal(false);
export const bottomSuggestedQuestion = signal([]);

