import React, { useRef, useState } from "react";
import { FaPlayCircle } from "react-icons/fa";
import Video_componenet from "./Video_componenet";
import Video_description from "./Video_description";

const Video_Text_response = ({ response_data }) => {
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
    <div className="w-[95vw] select-none max-w-md mb-2 mx-auto bg-white overflow-hidden p-4 rounded-lg">
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

      {/* Video Preview */}
     <Video_componenet  response_data={response_data}/>

      {/* Description */}
         
          <Video_description response_data={response_data}/>
         
      {/* Open Button */}
      <div className="mt-4 w-[45vw]">
        <a
          href={response_data?.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#26C6DA] text-white px-4 py-2 rounded-lg shadow transition"
        >
          <FaPlayCircle className="text-white" />
          Watch Lecture
        </a>
      </div>
       
    </div>
  );
};

export default Video_Text_response;
