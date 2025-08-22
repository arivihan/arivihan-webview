import React, { useRef, useState } from "react";

const Video_componenet = ({response_data}) => {
    const videoRef = useRef(null);
      const [isPlaying, setIsPlaying] = useState(false);
      const [loading, setLoading] = useState(false);
    
      const handlePlay = () => {
        if (videoRef.current) {
          setLoading(true); // Show loading msg
          videoRef.current
            .play()
            .then(() => {
              setIsPlaying(true);
              setLoading(false);
            })
            .catch(() => {
              setLoading(false);
              alert("Please wait, video is loading...");
            });
        }
      };
  return (
     <div className="relative h-[23vh] p-2 shadow-md rounded overflow-hidden">
        {/* Video */}
        <video
          ref={videoRef}
          src={response_data?.videoLink}
          className="w-full h-[70%] rounded object-cover"
          playsInline
          poster={response_data?.thumbnailUrl}
          onWaiting={() => setLoading(true)}
          onPlaying={() => setLoading(false)}
          controls={isPlaying} // controls only when video is playing
        ></video>

        {/* Overlay Play Button (only if not playing) */}
        {!isPlaying && (
          <div
            onClick={handlePlay}
            className="absolute left-[50%] translate-x-[-50%] inset-0 h-[65%] w-[95%] top-[35%] rounded translate-y-[-50%] bg-black/50 p-2 flex flex-col items-center justify-center cursor-pointer"
          >
            {loading ? (
              <p className="text-white font-bold">Please wait, video is loading...</p>
            ) : (
              <img className="p-2 rounded w-14 h-14" src="/play_icon.png" alt="play button" />
            )}
          </div>
        )}

        <div className="mt-2 leading-3">
          <b>
            <h1>Career Options? After 12th I NEET</h1>
          </b>
          <p className="mt-2 text-gray-600 text-xs">
            {response_data?.duration || "00:00"} • Watch Lecture
          </p>
        </div>
      </div>
  )
}

export default Video_componenet
