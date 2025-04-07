import React, { useState } from 'react';
import { getAuth, COnfirm, signInWithPhoneNumber, RecaptchaVerifier, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { ThreeDots } from 'react-loader-spinner';
import { alertDialogContent, showAuthModal } from '../state/chatState';
import { effect } from '@preact/signals-react';
import { customFetchRequest } from '../utils/customRequest';
import Cookies from 'js-cookie';


export default function AlertDialog() {

    const handleCloseAuthModal = () => {
        alertDialogContent.value = "";
    }

    return (


        <div className={`${alertDialogContent.value == "" ? "hidden" : "fixed"}  inset-x-0 inset-y-0 right-0 bottom-0 z-10 bg-black/80`}>


            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg w-2/6">
                <div className="absolute top-0 right-[-44px] bg-white rounded-full p-2 cursor-pointer" onClick={handleCloseAuthModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </div>

                <div className="flex flex-col">
                    <div className="flex items-center rounded-lg">
                        <h2 className='font-bold text-2xl'>Alert</h2>
                    </div>
                    <hr className='my-4' />

                    <p>{alertDialogContent.value}</p>

                    <hr  className='my-4'/>

                    <button onClick={handleCloseAuthModal} className='px-6 py-2 bg-[#26c6da] text-white rounded-lg ml-auto font-medium flex justify-center'>
                        Close
                    </button>
                  
                </div>
            </div>
        </div>
    )
}