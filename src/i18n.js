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
                newChat: "New Question",
                newChatForImage: "Click new chat to ask doubt using image",
                chooseTypeOfSolution: "Apko apke doubt ka solution kaisa chahiye?",
                was_this_helpful: "Was this helpful?",
                ask_anything: "Ask Anything...",
                open_whatsapp: "Open Whatsapp",
                open_whatsapp_msg: "Aapke sawalo ke behtar jawabo ke liye humare teachers se whatsapp pe connect karein.",
                type_your_question: "Apna sawal type karein!",
                ask_question_using_image: "Ya apne sawal ki photo click karein!",
                click_here_for_old_questions: "Purane sawal aur solutions ke liye yahan click karein!",
                suggested_question: "Suggested Questions",
                waiting_for_response: "Waiting for response",
                write_doubt_in_detail: "Write your doubt in detail...",
                one_mark_question: "Important 1 marks questions",
                read_till_answer_coming: "Answer jald hi aa raha hai, tab tak ye padhein..."
            },
        },
        hi: {
            translation: {
                newChat: "नया प्रश्न",
                newChatForImage: "नई चैट पर क्लिक करके इमेज से सवाल पूछें।",
                chooseTypeOfSolution: "आपको आपके डाउट का समाधान कैसा चाहिए?",
                was_this_helpful: "पसंद आया?",
                ask_anything: "कुछ भी पूछें",
                open_whatsapp: "व्हाट्सएप खोलें",
                open_whatsapp_msg: "आपके सवालों के बेहतर जवाबों के लिए हमारे टीचर्स से व्हाट्सएप पर जुड़ें।",
                type_your_question: "अपना सवाल टाइप करें!",
                ask_question_using_image: "या अपने सवाल की फोटो क्लिक करें!",
                click_here_for_old_questions: "पुराने सवाल और सॉल्यूशंस के लिए यहां क्लिक करें!",
                suggested_question: "प्रश्न सुझाव",
                waiting_for_response: "समाधान की प्रतीक्षा है",
                write_doubt_in_detail: "अपना प्रश्न विस्तार से लिखें...",
                one_mark_question: "महत्वपूर्ण 1 अंक के प्रश्न",
                read_till_answer_coming: "उत्तर जल्द ही आ रहा है, तब तक ये पढ़ें..."
            },
        },
    },
});

export default i18n;