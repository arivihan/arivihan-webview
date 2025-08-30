import React, { useRef, useState } from "react";
import { FaPlayCircle } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import Global_like_dislike_response from "../Global_like_dislike_response";

const Multi_Video_response = () => {
  
  return (
    <div className="w-[95vw] select-none max-w-md mb-2 mx-auto bg-white overflow-hidden p-4 rounded-lg">
      {/* Top Info */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-[32px] h-[32px] bg-gray-300 rounded-full overflow-hidden">
          <img
            className="h-full w-full object-cover"
            src="https://cdn-icons-png.flaticon.com/128/3829/3829933.png"
            alt=""
          />
        </div>
        <p className="font-bold text-sm text-[#37D3E7]">Instant Guru</p>
      </div>
         <p className="font-semibold">After 12th ke baad career choose karna thoda confusing ho sakta hai kyunki options bohot zyada hain. Ye depend karta hai ki aapne 12th kis stream (Science, Commerce, Arts) se ki hai aur aapki interest, skills aur long-term goals kya hain. Main aapko stream-wise aur general options dono bata deta hoon 👇</p>
         <hr className="mt-4" />
         <div>
            <p className="font-semibold mt-3 text-[18px]"><b>Recommended videos :</b></p>
         </div>
         <div>
            <div className="w-[95vw] mt-4  items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-[30vw] h-[8vh] bg-pink-800 overflow-hidden rounded-md border-2 border-[#37D3E7]">
                            <img className="w-full h-full object-cover " src="/thumbnail.png" alt="" />
                     </div>
                <div>
                    <p className="text-[18px]">
                        <b>1. Science (PCM / PCB)</b>
                    </p>
                    <div className="flex items-center gap-2">
                    <p className="text-[#37D3E7]"> <FaYoutube /> </p>  <p className="text-[#37D3E7] font-semibold">Watch</p>
                    </div>
                    
                </div>
                </div>
                <hr className="mt-4" />  
            </div>
            <div className="w-[95vw] mt-4  items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-[30vw] h-[8vh] rounded-md border-2 border-[#37D3E7]">

                </div>
                <div>
                    <p className="text-[18px]">
                        <b>1. Science (PCM / PCB)</b>
                    </p>
                    <div className="flex items-center gap-2">
                    <p className="text-[#37D3E7]"> <FaYoutube /> </p>  <p className="text-[#37D3E7] font-semibold">Watch</p>
                    </div>
                    
                </div>
                </div>
                <hr className="mt-4" />  
            </div>
            <div className="w-[95vw] mt-4  items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-[30vw] h-[8vh] rounded-md border-2 border-[#37D3E7]">

                </div>
                <div>
                    <p className="text-[18px]">
                        <b>1. Science (PCM / PCB)</b>
                    </p>
                    <div className="flex items-center gap-2">
                    <p className="text-[#37D3E7]"> <FaYoutube /> </p>  <p className="text-[#37D3E7] font-semibold">Watch</p>
                    </div>
                    
                </div>
                </div>
                <hr className="mt-4" />  
            </div>
         </div>
      
       <Global_like_dislike_response/>
    </div>
  );
};

export default Multi_Video_response;
