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
    <div className="flex flex-col mb-2 rounded-lg">
      {/* Top Info */}
      <div className="flex items-center gap-2 mb-2">
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

      <div className='mr-auto flex items-center my-2 justify-center gap-2 bg-[#37D3E7] px-3 py-2 rounded-full' onClick={() => openAppActivity(chat.screenClassName, chat.navigationParams)}>
        <p className='text-white'>{chat.actionButtonText}</p>
        <span className='text-white font-bold'><RiShareBoxFill /></span>
      </div>
      <Global_like_dislike_response/>
    </div>
  );
};

export default Video_Text_response;
