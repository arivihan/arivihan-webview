import React from 'react'
import Global_like_dislike_response from '../Global_like_dislike_response'

const Question_response = () => {
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
      <div className='flex items-center gap-1'>
        <div className='w-[5vw] h-[5vw]'>
            <img className='w-full h-full object-cover' src="/atom.png" alt="" />
        </div>
        <p>Yah Kuch Question he 4 marks ke hai </p>
      </div>
       <div className='border-2 mt-2 border-gray-100 rounded-md'>
         <div className='flex px-2 py-1 justify-between items-center'>
            <p><b>Question 1</b></p>
            <div className='w-[6vw] h-[6vw]'>
            <img className='w-full h-full object-cover' src="/atom.png" alt="" />
        </div>
         </div>
          <div className='px-2'><p>State the law and derive its vector form.</p></div>
       </div>
       <div className='border-2 mt-2 border-gray-100 rounded-md'>
         <div className='flex px-2 py-1 justify-between items-center'>
            <p><b>Question 1</b></p>
            <div className='w-[6vw] h-[6vw]'>
            <img className='w-full h-full object-cover' src="/atom.png" alt="" />
        </div>
         </div>
          <div className='px-2'><p>State the law and derive its vector form.</p></div>
       </div>
       <div className='border-2 mt-2 border-gray-100 rounded-md'>
         <div className='flex px-2 py-1 justify-between items-center'>
            <p><b>Question 1</b></p>
            <div className='w-[6vw] h-[6vw]'>
            <img className='w-full h-full object-cover' src="/atom.png" alt="" />
        </div>
         </div>
          <div className='px-2'><p>State the law and derive its vector form.</p></div>
       </div>
       <div className='border-2 mt-2 border-gray-100 rounded-md'>
         <div className='flex px-2 py-1 justify-between items-center'>
            <p><b>Question 1</b></p>
            <div className='w-[6vw] h-[6vw]'>
            <img className='w-full h-full object-cover' src="/atom.png" alt="" />
        </div>
         </div>
          <div className='px-2'><p>State the law and derive its vector form.</p></div>
       </div>

       <Global_like_dislike_response/>
    </div>
  )
}

export default Question_response
