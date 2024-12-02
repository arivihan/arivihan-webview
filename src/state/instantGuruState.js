import { signal } from "@preact/signals-react";


export const chatSessionId = signal(null);
export const doubtText = signal("");
export const showDoubtChatLoader = signal(false);
export const chatHistory = signal([]);
export const lastUserQuestion = signal("");
export const videoResponseRequested = signal(false);
export const waitingForResponse = signal(false);

