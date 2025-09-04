import React, { useRef, useState } from "react";
import { FaPlayCircle } from "react-icons/fa";
import Video_componenet from "./Video_componenet";
import Video_description from "./Video_description";
import { openAppActivity } from "../../../utils/instantGuruUtilsDev";
import { RiShareBoxFill } from "react-icons/ri";
import Global_like_dislike_response from "../Global_like_dislike_response";

const Video_Text_response = ({ chat }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenVideo = () => {

    openAppActivity(
      chat.screenClassName, chat.navigationParams
    )

  };

  return (
    <div className="select-none mb-2 mx-auto overflow-hidden  rounded-lg">
      {/* Top Info */}
      <div className="flex items-center  gap-2 mb-2">
        <div className="w-[32px] h-[32px] bg-gray-300 rounded-full overflow-hidden">
          <img
            className="h-full w-full object-cover"
            src={require("../../../assets/icons/icon_chat_avatar.png")}
          />
        </div>
        <p className="font-bold text-sm text-[#37D3E7]">Instant Guru</p>
      </div>

      {/* Video Preview */}
      {
        chat.thumbnailUrl &&
        <Video_componenet chat={chat} />
      }

      {/* Description */}
      <Video_description chat={chat} />

      {/* Open Button */}
      <div className="mt-4 w-[45vw]">
        <div style={{ boxShadow: "0 0 5px rgba(38,198,218,0.8)"  }} className="flex items-center justify-center gap-2 bg-[#26C6DA] shadow-xl text-white  py-2 rounded-full  transition" onClick={handleOpenVideo}>
          {
            chat.thumbnailUrl
              ?
              <FaPlayCircle className="text-white text-2xl" />
              :
              <RiShareBoxFill />
          }
          <p className="text-[16px] mr-5 font-semibold">{chat.actionButtonText}</p>
        </div>
      </div>
      <Global_like_dislike_response/>
    </div>
  );
};

export default Video_Text_response;
