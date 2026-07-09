import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function ChatLimtExhausted() {
    const { t } = useTranslation();

    useEffect(()=>{
        document.getElementById("message_container").scrollBy({ top: 6000, behavior: "smooth" });
    },[])

    return (
        <div className={`mb-3 bg-[#E8FBFC] mt-6 flex flex-col p-2 rounded w-full`}>
            <img src={require("../assets/chat.png")} className='h-28 object-contain' alt="" />
            <div className={`ml-12 text-gray-800 text-center`}>
                {t("chat_limit_exhausted_message")}
            </div>
            <a href="https://play.google.com/store/apps/details?id=arivihan.technologies.doubtbuzzter2&hl=en_NZ" target='_blank' className="bg-[#26c6da] rounded p-2 mt-2 mb-3 text-white text-sm text-center self-center  block">{t("chat_limit_visit_application")}</a>
        </div>

    )
}