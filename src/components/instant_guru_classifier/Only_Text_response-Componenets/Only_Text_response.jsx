import React from 'react'
import { RiShareBoxFill } from "react-icons/ri";
import { Link } from 'react-router-dom';
const Only_Text_response = ({ response_data = {} }) => {
    const Specific_lecture_name = "Physics"
  return (
    <div className='w-full flex justify-center items-center'>
            <div className='flex-col justify-center items-start gap-3 p-4  w-[90vw] h-fit'>
      <div className='flex items-center gap-2'>
        <div className='w-[32px] h-[32px] bg-gray-300 rounded-full overflow-hidden'>
            <img className='h-full w-full object-cover' src="https://cdn-icons-png.flaticon.com/128/3829/3829933.png" alt="" />
           
        </div>
        <p className='font-bold text-sm text-[#37D3E7]'>Instant Guru</p>
      </div>
      <div className='mt-3'>
        <p className='text-[14px]'>Aap {Specific_lecture_name} ke sabhi lectures hamare app ke <span className='font-bold'>{Specific_lecture_name}</span> section me dekh sakte hain. Chaleye, main aapko us page par le chalta hoon.</p>
      </div>
      <div className='mt-3 border shadow-lg rounded-md p-3'>
            
      </div>
    </div>
    </div>

  )
}

export default Only_Text_response
