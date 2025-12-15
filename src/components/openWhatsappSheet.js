import React from 'react';
import { MdClose } from 'react-icons/md';
import { showWhatsappBottomSheet } from '../state/instantGuruState';
import { openWhatsapp } from '../utils/instantGuruUtilsProd';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from "react-icons/fa";
const OpenWhatsAppSheet = () => {
 
    const { t } = useTranslation();

    return (
        <div className="fixed h-[25vh] left-0  right-0 bottom-0  z-[999999] w-screen flex justify-center items-center shadow-2xl">
            <div  className='w-[92%]  flex justify-center items-center '>
                            <div style={{boxShadow: "0px  0 15px rgba(0,0,0,0.2)"}} className=" shadow-lg rounded-xl mt-7 w-[100%] h-[17vh]   bg-white ">
                {/* <MdClose className='text-[#b0b0b0] text-3xl mb-6 ml-auto mr-4' onClick={() => { showWhatsappBottomSheet.value = false; }} /> */}
                <div className="flex flex-col  items-center justify-center p-2 py-3 ">
                    <p className="text-black text-[15px] text-center mb-2 font-medium">{t("open_whatsapp_msg")}</p>
                    <div className="flex items-center gap-2 justify-center w-[70%] py-2 rounded-full bg-green-500 relative" onClick={() => { openWhatsapp() }}>
                        <p className='text-white text-'>{t("open_whatsapp")}</p>
                        <p className='text-white text-2xl' ><FaWhatsapp /></p>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default OpenWhatsAppSheet;
