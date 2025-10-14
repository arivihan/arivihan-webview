import React, { useState } from 'react';
import sandclock from "../temp_icons/sandclock.png";
import { X } from 'lucide-react'; // using lucide-react for clean icon

const TimeOver = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className='w-screen bg-black/20 absolute top-0 left-0 z-[999] h-screen '>
      <div className='w-[70%] py-6 p-2 absolute top-[50%] left-[50%] z-[999] transform -translate-x-1/2 -translate-y-1/2 h-[37%] rounded-xl bg-white flex flex-col justify-center items-center'>
        {/* Close Icon */}
        <X
          size={22}
          className="absolute top-3 right-3 text-black/60 cursor-pointer hover:text-black"
          onClick={() => setVisible(false)}
        />

        <div className='rounded-full shrink-0 mt-2 flex justify-center items-center overflow-hidden w-[80px] h-[80px] bg-[#FEF2E5]'>
          <img className='w-[50%] h-[70%]' src={sandclock} alt="" />
        </div>

        <p className='text-xl mt-2 font-bold text-black/80'>Time's Up!</p>
        <p className='text-black/80 mt-4 leading-4 text-center'>
          Is question ka time khatam ho gaya. chalo agla question solve karte hain.
        </p>
      </div>
    </div>
  );
};

export default TimeOver;
