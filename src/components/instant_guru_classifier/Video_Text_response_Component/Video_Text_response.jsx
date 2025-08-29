import React, { useRef, useState } from "react";
import { FaPlayCircle } from "react-icons/fa";
import Video_componenet from "./Video_componenet";
import Video_description from "./Video_description";
import { openAppActivity } from "../../../utils/instantGuruUtilsDev";
import { RiShareBoxFill } from "react-icons/ri";

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
    <div className="select-none mb-2 mx-auto bg-white overflow-hidden  rounded-lg">
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
      <div className="mt-4 w-[45vw]">
        <div className="flex items-center justify-center gap-2 bg-[#26C6DA] text-white px-2 py-2 rounded-lg shadow transition" onClick={handleOpenVideo}>
          {
            chat.thumbnailUrl
              ?
              <FaPlayCircle className="text-white" />
              :
              <RiShareBoxFill />
          }
          {chat.actionButtonText}
        </div>
      </div>
    </div>
  );
};

export default Video_Text_response;
