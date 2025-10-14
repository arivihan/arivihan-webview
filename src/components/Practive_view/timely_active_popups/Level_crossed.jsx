import React, { useState } from 'react';
import confettie from "../temp_icons/confettie_avatar.png";
import { X } from 'lucide-react'; // using lucide-react for clean icon

const Level_crossed = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className='w-screen bg-black/20 absolute top-0 left-0 z-[999] h-screen '>
      <div className='w-[70%] p-2 absolute top-[50%] left-[50%] z-[999] transform -translate-x-1/2 -translate-y-1/2 h-[27%] rounded-xl bg-white flex flex-col justify-center items-center'>
        {/* Close Icon */}
        <X
          size={22}
          className="absolute top-3 right-3 text-black/60 cursor-pointer hover:text-black"
          onClick={() => setVisible(false)}
        />

        <div className='rounded-full overflow-hidden w-[80px] h-[80px] bg-[#D0FDFF]'>
          <img src={confettie} alt="" />
        </div>

        <p className='text-xl font-bold text-black/80'>Level 1 crossed</p>
        <p className='text-[#696969] mt-1 leading-4 text-center'>
          Aap aage ke tough quotations solve karne ke liye ready hain!
        </p>
      </div>
    </div>
  );
};

export default Level_crossed;
