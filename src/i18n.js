import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
    lng: "en",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
    resources: {
        en: {
            translation: {
                newChat: "New Chat",
                chooseTypeOfSolution: "Apko apke doubt ka solution kaisa chahiye?",
                was_this_helpful: "Was this helpful?",
                ask_anything: "Ask Anything...",
                open_whatsapp: "Open Whatsapp",
                open_whatsapp_msg:"Aapke sawalo ke behtar jawabo ke liye humare teachers se whatsapp pe connect karein."
            },
        },
        hi: {
            translation: {
                newChat: "नई चैट",
                chooseTypeOfSolution: "आपको आपके डाउट का समाधान कैसा चाहिए?",
                was_this_helpful: "पसंद आया?",
                ask_anything: "कुछ भी पूछें",
                open_whatsapp: "व्हाट्सएप खोलें",
                open_whatsapp_msg:"आपके सवालों के बेहतर जवाबों के लिए हमारे टीचर्स से व्हाट्सएप पर जुड़ें।"
            },
        },
    },
});

export default i18n;