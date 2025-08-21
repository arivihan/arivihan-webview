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
        <p className='text-[14px]'>Aap Physics ke sabhi lectures hamare app ke <span className='font-bold'>{Specific_lecture_name}</span> section me dekh sakte hain. Chaleye, main aapko us page par le chalta hoon.</p>
      </div>
      <div className='mt-3 border shadow-lg rounded-md p-3'>
            <div>
                <Link to={response_data?.redirectLink }>
                <p className='text-[14px]'> <span className='font-bold'>{Specific_lecture_name}</span> ke saare lectures dekhne ke liye niche diye gaye button par click karein</p>
                <hr className='mt-1' />
                <div className='flex items-center mt-1 justify-center gap-2'>
                    <p className=' text-[#37D3E7]'><b>{response_data?.actionButtonText ||"Lecture Dekhein"} </b></p>
                    <span className='text-[#37D3E7] font-bold'>< RiShareBoxFill /></span>
                </div>
                </Link>
            </div>
      </div>
    </div>
    </div>

  )
}

export default Only_Text_response
