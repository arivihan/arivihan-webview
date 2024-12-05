import React from 'react';
import { MdClose } from 'react-icons/md';
import { showWhatsappBottomSheet } from '../state/instantGuruState';
import { openWhatsapp } from '../utils/instantGuruUtils';

const OpenWhatsAppSheet = () => {
    return (
        <div className="fixed left-0 right-0 bottom-0 bg-[#333333]/80 w-screen flex flex-col justify-center items-center h-auto shadow">
            <div className="h-full w-full">
                {/* <MdClose className='text-[#b0b0b0] text-3xl mb-6 ml-auto mr-4' onClick={() => { showWhatsappBottomSheet.value = false; }} /> */}
                <div className="flex flex-col items-center p-4 bg-white py-10">
                    <p className="text-black mb-4 text text-center mb-4 font-medium">Aapke sawalo ke behtar jawabo ke liye humare teachers se whatsapp pe connect karein.</p>
                    <div className="flex items-center justify-center w-full py-2 rounded-full bg-green-500 relative" onClick={() => { openWhatsapp() }}>
                        <p className='text-white text-lg'>Open Whatsapp</p>
                        <img src={require("../assets/icons/whatsapp.png")} className='h-6 ml-3' />
                    </div>
                </div>

            </div>

        </div>
    );
};

export default OpenWhatsAppSheet;
