import React from 'react'
import { MdOutlineWhatsapp } from "react-icons/md";
const Whatsapp = () => {
  return (
    <div className='w-[90%] flex-col justify-center gap-5 items-center shadow-md rounded-xl border-2 border-gray-100 p-4 bg-white'>
       <p className='text-[14px]'>Apke sawalo ke behtar jawabo ke liye humre
teachers se whatsapp pe connect karein.</p> 
<button className='flex mt-4 justify-center items-center gap-2 px-7 py-2 text-white rounded-full bg-green-500'><p className='text-[14px]'>Open Whatsapp</p> <MdOutlineWhatsapp /> </button>
    </div>
  )
}

export default Whatsapp
