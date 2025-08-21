import { signal } from "@preact/signals-react";
import { v4 } from 'uuid';
import Cookies from 'js-cookie';

export const chatIsWaitingForResponse = signal(false);
export const chatLoadingMessageId = signal("");
export const chatReceiveChatMessage = signal(null);
export const subscriptionActive = signal(false);
export const chatLimits = signal(null);
export const chatClear = signal(false);
export const chatSessionId = signal(v4());
export const showAuthModal = signal(false);
export const userChatsCount = signal(0);
export const isGuestUser = signal(true);
export const loggedInUser = signal(null);
export const chatSessions = signal(null);
export const showSidebarMobile = signal(true);
export const showLandingUi = signal(Cookies.get("user") === undefined || Cookies.get("user") === null)
export const chatHistoryLoading = signal(false);
export const alertDialogContent = signal("");