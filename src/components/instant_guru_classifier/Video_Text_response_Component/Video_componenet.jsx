import React, { useRef, useState } from "react";
import { openAppActivity } from "../../../utils/instantGuruUtilsDev";

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
    <div className="relative shadow-md rounded-[10px] border overflow-hidden">
      {/* Video */}

      <div>
        <img src={chat.thumbnailUrl} className="h-full w-full rounded-[10px] object-cover" />
      </div>


      {/* Overlay Play Button (only if not playing) */}
      {!isPlaying && (
        <div
          onClick={handlePlay}
          className="absolute left-[50%] translate-x-[-50%] inset-0 h-[65%] w-[100%] top-[35%] rounded-[10px] translate-y-[-50%] bg-black/10 p-2 flex flex-col items-center justify-center cursor-pointer"
        >
          {loading ? (
            <p className="text-white font-bold">Please wait, video is loading...</p>
          ) : (
            <img className="p-2 rounded w-16 h-16" src="/play_icon.png" alt="play button" />
          )}
        </div>
      )}

      <div className="p-2 leading-3">
        <b>
          <h1>{chat.title}</h1>
        </b>
        <p className="mt-2 text-gray-600 text-xs">
          {chat?.videoEndTime || "00:00"} min • Watch Lecture
        </p>
      </div>
    </div>
  )
}

export default Video_componenet
