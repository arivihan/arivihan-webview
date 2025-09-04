import React from 'react';
import { MdClose } from 'react-icons/md';
import { showWhatsappBottomSheet } from '../state/instantGuruState';
import { openWhatsapp } from '../utils/instantGuruUtilsProd';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from "react-icons/fa";
const OpenWhatsAppSheet = () => {

    const { t } = useTranslation();

    return (
        <div className="fixed left-0 right-0 bottom-0 h-[26vh]  w-screen flex justify-center items-center shadow-2xl">
            <div className='w-[95%] flex justify-center items-center h-[25vh]'>
                            <div className=" h-[22vh] shadow-lg rounded-xl w-[100%] border border-gray-100 bg-white ">
                {/* <MdClose className='text-[#b0b0b0] text-3xl mb-6 ml-auto mr-4' onClick={() => { showWhatsappBottomSheet.value = false; }} /> */}
                <div className="flex flex-col items-center p-4  py-10">
                    <p className="text-black text-sm text-center mb-4 font-medium">{t("open_whatsapp_msg")}</p>
                    <div className="flex items-center gap-4 justify-center w-[70%] py-2 rounded-full bg-green-500 relative" onClick={() => { openWhatsapp() }}>
                        <p className='text-white text-lg'>{t("open_whatsapp")}</p>
                        <p className='text-white text-2xl' ><FaWhatsapp /></p>
                    </div>
                </div>

            </div>
            </div>


        </div>
    );
};

export default OpenWhatsAppSheet;
