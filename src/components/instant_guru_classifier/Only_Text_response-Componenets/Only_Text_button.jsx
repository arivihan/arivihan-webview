import React from 'react'

const Only_Text_button = () => {
  return (
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
  )
}

export default Only_Text_button
