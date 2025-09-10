import React from 'react'
import Global_like_dislike_response from '../Global_like_dislike_response'

const Subscription_response = () => {
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
      <div className='w-full h-[16vh] overflow-hidden rounded-md bg-orange-300'>
        <img className='w-full h-full object-cover' src="/thumbnail2.png" alt="" />
      </div>
       <div>
        <h1 className='font-bold mt-2 text-xl'>For Subscription</h1>
        <p style={{lineHeight:"20px"}} className='text-[14px]'>To buy a subscription, just click on the button given below.</p>
       </div>
       <button className=" bg-[#26C6DA] text-[15px] px-5 w-full text-white flex justify-center items-center gap-2 py-3 mt-2 rounded">
       <b><p> Buy Now</p></b>  
       </button>


       <Global_like_dislike_response/>
    </div>
  )
}

export default Subscription_response