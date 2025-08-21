import Lottie from 'lottie-react';
import React from 'react';
import { MdClose } from 'react-icons/md';
import micAnimation from "../assets/lottie/voice_search_anim.json";
import { showMicListentingUI } from '../state/instantGuruState';

const MicListeningUI = () => {
    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-[#333333]/80 h-screen w-screen flex flex-col justify-center items-center">

            <div className="flex flex-col absolute bottom-0 left-0 right-0 ">
                <MdClose className='text-[#b0b0b0] text-3xl mb-6 ml-auto mr-4' onClick={() => { showMicListentingUI.value = false; }} />
                <div className="flex flex-col items-center p-4 bg-black rounded-t-[40px] py-16">
                    <p className="text-gray-300 mb-4 text-2xl italic mb-4 font-medium">listening...</p>
                    <div className="flex items-center justify-center w-50 h-28 rounded-full bg-black relative">
                        <div className="absolute flex w-full h-full items-center justify-center">
                            <Lottie animationData={micAnimation} loop={true} className='' />
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default MicListeningUI;
