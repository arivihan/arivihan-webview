import React from 'react'
import { RiShareBoxFill } from 'react-icons/ri'
import Global_like_dislike_response from '../Global_like_dislike_response'
import { openAppActivity } from '../../../utils/instantGuruUtilsDev'

const Only_Text_button = ({ chat }) => {
  return (
    <div className='w-full flex flex-col items-start'>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-[32px] h-[32px] bg-gray-300 rounded-full overflow-hidden">
          <img
            className="h-full w-full object-cover"
            src={require("../../../assets/icons/icon_chat_avatar.png")}
          />
        </div>
        <p className="font-bold text-sm text-[#37D3E7]">Instant Guru</p>
      </div>
      
      <div className='text-[14px]' dangerouslySetInnerHTML={{ __html: chat.botResponse }}></div>
      <div style={{ boxShadow: "0 0 5px rgba(38,198,218,0.8)"  }} className='flex items-center font-semibold my-2 justify-center gap-2 bg-[#37D3E7] px-3 py-2 rounded-full' onClick={() => openAppActivity(chat.screenClassName, chat.navigationParams)}>
        <p className='text-white text-[16px]'>Lecture Dekhein</p>
        <span className='text-white font-bold'><RiShareBoxFill /></span>
      </div>
      <hr className='pt-0' />
      <Global_like_dislike_response chat={chat} />
    </div>
  )
}

export default Only_Text_button
