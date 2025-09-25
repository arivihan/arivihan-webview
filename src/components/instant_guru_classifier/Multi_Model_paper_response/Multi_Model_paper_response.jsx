import React, { useRef, useState } from "react";
import { FaPlayCircle } from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import Global_like_dislike_response from "../Global_like_dislike_response";
import { RiShareBoxLine } from "react-icons/ri";
const Multi_Model_paper_response = () => {
  
  return (
    <div className="w-[95vw] bg-white select-none max-w-md mb-2 mx-auto  overflow-hidden p-4 rounded-lg">
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
      {/* card Info */}
     <div className="flex-col items-center justify-center">
         <div className="rounded-md mb-2 border-2 flex-col items-center justify-items-end border-gray-100">
        <div class="w-full flex items-center justify-between  ">
  <div class="bg-white rounded-lg  p-2">
  <p class="font-bold text-[14px] ">Physics - Model Paper 1</p>
   <div className="flex text-[13px] items-center ">
    <p>180 mins</p>
    <div className="flex items-center">
        <p className="font-bold text-2xl">
            <LuDot />
        </p>
        <p >720 Marks</p>
    </div>
    <div className="flex items-center">
        <p className="font-bold text-2xl">
            <LuDot />
        </p>
        200 Qns
    </div>
   </div>
</div> 
<div className="w-[15%] flex mr-4 justify-center items-center h-[15%]">
    <img className="w-full h-full object-cover" src="/atom.png" alt="" />
</div>

</div>
<div className="bg-[#26C6DA]/10 w-full flex items-center px-3 py-1 justify-end" >
    
    <p class="underline text-[#37D3E7] text-[13px] underline-offset-4 font-bold">
  Start Now
</p>

</div>
      </div> 
         <div className="rounded-md mb-2 border-2 flex-col items-center justify-items-end border-gray-100">
        <div class="w-full flex items-center justify-between  ">
  <div class="bg-white rounded-lg  p-2">
  <p class="font-bold text-[14px] ">Physics - Model Paper 1</p>
   <div className="flex text-[13px] items-center ">
    <p>180 mins</p>
    <div className="flex items-center">
        <p className="font-bold text-2xl">
            <LuDot />
        </p>
        <p >720 Marks</p>
    </div>
    <div className="flex items-center">
        <p className="font-bold text-2xl">
            <LuDot />
        </p>
        200 Qns
    </div>
   </div>
</div> 
<div className="w-[15%] flex mr-4 justify-center items-center h-[15%]">
    <img className="w-full h-full object-cover" src="/atom.png" alt="" />
</div>

</div>
<div className="bg-[#26C6DA]/10 w-full flex items-center px-3 py-1 justify-end" >
    
    <p class="underline text-[#37D3E7] text-[13px] underline-offset-4 font-bold">
  Start Now
</p>

</div>
      </div> 
         <div className="rounded-md mb-2 border-2 flex-col items-center justify-items-end border-gray-100">
        <div class="w-full flex items-center justify-between  ">
  <div class="bg-white rounded-lg  p-2">
  <p class="font-bold text-[14px] ">Physics - Model Paper 1</p>
   <div className="flex text-[13px] items-center ">
    <p>180 mins</p>
    <div className="flex items-center">
        <p className="font-bold text-2xl">
            <LuDot />
        </p>
        <p >720 Marks</p>
    </div>
    <div className="flex items-center">
        <p className="font-bold text-2xl">
            <LuDot />
        </p>
        200 Qns
    </div>
   </div>
</div> 
<div className="w-[15%] flex mr-4 justify-center items-center h-[15%]">
    <img className="w-full h-full object-cover" src="/atom.png" alt="" />
</div>

</div>
<div className="bg-[#26C6DA]/10 w-full flex items-center px-3 py-1 justify-end" >
    
    <p class="underline text-[#37D3E7] text-[13px] underline-offset-4 font-bold">
  Start Now
</p>

</div>
      </div> 
     </div>
      <div >
       <p className="flex text-sm mt-4">
        <p className="text-2xl"><LuDot /></p>
        <p>
            <b>Engineering (B.Tech , B.E)</b> - Computer Science, Mechanical, Civil, IT, etc
        </p>
         
       </p>
       <p className="flex mt-4">
        <p className="text-2xl"><LuDot /></p>
        <p className="text-sm">
            <b>Engineering (B.Tech , B.E)</b> - Computer Science, Mechanical, Civil, IT, etc
        </p>
         
       </p>
       <p className="flex text-sm mt-4">
        <p className="text-2xl"><LuDot /></p>
        <p>
            <b>Engineering (B.Tech , B.E)</b> - Computer Science, Mechanical, Civil, IT, etc
        </p>
         
       </p>
      </div>
       <button className=" bg-[#26C6DA] text-[15px] px-5 text-white flex justify-center items-center gap-2 py-3 mt-4 rounded-full">
       <b><p> Start Test</p></b> <p><b><RiShareBoxLine /></b></p>  
       </button>


       <Global_like_dislike_response/>
    </div>
  );
};

export default Multi_Model_paper_response;