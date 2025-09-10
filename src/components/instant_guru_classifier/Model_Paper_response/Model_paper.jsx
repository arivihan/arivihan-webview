import React from 'react'
import { LuDot } from "react-icons/lu";
const Model_paper = () => {
  return (
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
  )
}

export default Model_paper