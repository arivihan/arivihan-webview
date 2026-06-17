import React from "react";


const Ask_More = () => {
    
  return (
    <>
      <style>{`
        @keyframes ping-smooth {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          70% {
            transform: scale(1.3);
            opacity: 0.15;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .animate-ping-smooth {
          animation: ping-smooth 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>

      <div  className="relative bg-blue-600 z-[99]">
        {/* Smooth circular pulse light */}
        <span className="absolute bottom-4 z-[9999] right-5 w-[52px] h-[52px] rounded-full bg-cyan-400/50 animate-ping-smooth"></span>

        {/* Main circular button */}
        <div className="w-[52px] h-[52px] flex justify-center items-center text-center leading-4 
          bg-cyan-400 rounded-full absolute bottom-4 right-5 
          shadow-[0_0_0px_2px_rgba(34,211,238,0.6)]">
          <p className="text-white leading-3 font-semibold text-[11px] px-2">Ask More?</p>
        </div>
      </div>
    </>
  );
};

export default Ask_More;
