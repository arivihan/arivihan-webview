import React, { useRef, useState } from "react";
import { openAppActivity } from "../../../utils/instantGuruUtilsDev";
import { GoDotFill } from "react-icons/go";
import playbutton from "../../../assets/icons/play2.png"
const Video_componenet = ({ chat }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePlay = () => {

    openAppActivity(
      chat.screenClassName, chat.navigationParams
    )
    // if (videoRef.current) {
    //   setLoading(true); // Show loading msg
    //   videoRef.current
    //     .play()
    //     .then(() => {
    //       setIsPlaying(true);
    //       setLoading(false);
    //     })
    //     .catch(() => {
    //       setLoading(false);
    //       alert("Please wait, video is loading...");
    //     });
    // }
  };


  return (
    <div className="relative  w-[100%] bg-white shadow-md rounded-[10px] border overflow-hidden">
      {/* Video */}

      <div className="w-[95%] h-[140px] relative mt-2 ml-2 overflow-hidden rounded-[10px]">
        <div className="w-full h-full absolute top-0 left-0  bg-black/30"></div>
        <img src={chat.thumbnailUrl} className="h-full w-full rounded-[10px] object-cover" />
      </div>


      {/* Overlay Play Button (only if not playing) */}
      {!isPlaying && (
        <div
          onClick={handlePlay}
          className="absolute left-[50%] translate-x-[-50%] inset-0 h-[73%] w-[95%] top-[28%] rounded-[10px] translate-y-[-33%] p-2 flex flex-col items-center justify-center cursor-pointer"
        >
          {loading ? (
            <p className="text-white font-bold">Please wait, video is loading...</p>
          ) : (
            <img className="p-2 rounded z-[999999] w-[70px]" src={playbutton} alt="play button" />
          )}
        </div>
      )}

      <div className="p-2 leading-3">
        <b>
          <h1 className="text-[18px]">{chat.title}</h1>
        </b>
        <p className="mt-2 flex items-center gap-1 text-gray-400 text-xs text-capitalize">
          {chat.videoEndTime ? chat.videoEndTime + " min" : ""} <GoDotFill size={12} /> {chat.subtitle}
        </p>
      </div>
    </div>
  )
}

export default Video_componenet
