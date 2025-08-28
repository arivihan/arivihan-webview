import React from 'react'
import { RiShareBoxFill } from "react-icons/ri";
import { Link } from 'react-router-dom';


const Only_Text_response = ({ chat }) => {
  const Specific_lecture_name = "Physics"
  return (
    <div className='w-full flex flex-col justify-center items-start gap-2 py-2 h-fit'>
      <div className='flex items-center gap-2'>
        <div className='w-[32px] h-[32px] bg-gray-300 rounded-full overflow-hidden'>
          <img className='h-full w-full object-cover' src={require("../../../assets/icons/icon_chat_avatar.png")} alt="" />
        </div>
        <p className='font-bold text-sm text-[#37D3E7]'>Instant Guru</p>
      </div>
      <div className='text-sm text whitespace-normal' dangerouslySetInnerHTML={{ __html: chat.botResponse.replaceAll("(bold)<b>", "</b>").replaceAll(/(\n){2,}/g, '</br>') }}>

      </div>
      {/* <div className='mt-3 border shadow-lg rounded-md p-3'>

        </div> */}
    </div>

  )
}

export default Only_Text_response
