import React from "react";
import { FaPlayCircle } from "react-icons/fa";
import { TbArrowBearRight } from "react-icons/tb";

const Video_Text_response = () => {
  const response_data = {
    title: "Physics Lecture – Important Concepts",
    duration: "10 min",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // apna actual video url
    subject: "Physics",
    descriptionPoints: [
      "Introduction to Newton's Laws",
      "Force and Motion explained",
      "Work and Energy basics",
      "Momentum and Collisions",
      "Gravitation overview",
    ],
  };

  return (
    <div className="w-[95vw] max-w-md mb-2 mx-auto bg-white overflow-hidden p-4 rounded-lg">
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
      <div className="relative h-[25vh] p-2 shadow-md rounded overflow-hidden">
        {/* Thumbnail or muted video */}
        <video
          src={response_data?.videoUrl}
          className="w-full h-[70%] rounded  object-cover"
          muted
          playsInline
        ></video>

        {/* Overlay Play Button */}
        <div className="absolute inset-0  flex flex-col items-center justify-center">
          <img className="p-2 rounded" src="/play_icon.png" alt="" />
          
        </div>

         <div className="mt-2">
            <b><h1>Career Options? After 12th I NEET </h1></b>
            <p className="mt-2 text-gray-600 text-xs">
            {response_data?.duration} • Watch Lecture
          </p>
        </div>
      </div>
      

      {/* Description */}
      <div className="mt-3">
        <p className="text-sm text-gray-600 mb-2">
          Here are key highlights of{" "}
          <span className="font-bold">{response_data?.subject}</span> lecture:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
          {response_data?.descriptionPoints?.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>
      </div>

      {/* Open Button */}
      <div className="mt-4 w-[45vw]">
        <a
          href={response_data?.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#26C6DA] text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
        >
          <FaPlayCircle className="text-white" />
          Watch Lecture
        </a>
      </div>
    </div>
  );
};

export default Video_Text_response;
