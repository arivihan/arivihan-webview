import React from "react";
import { FaYoutube } from "react-icons/fa";
import Global_like_dislike_response from "../Global_like_dislike_response";
import { useTranslation } from "react-i18next";


const Multi_Video_response = () => {
  const { t } = useTranslation();
  // Data object


  const videoData = [
    {
      id: 1,
      title: "1. Science (PCM / PCB)",
      thumbnail: "",
      youtubeLink: "#",
    },
    {
      id: 2,
      title: "2. Commerce",
      thumbnail: "",
      youtubeLink: "#",
    },
    {
      id: 3,
      title: "3. Arts / Humanities",
      thumbnail: "",
      youtubeLink: "#",
    },
  ];

  return (
    <div className="w-[95vw] select-none max-w-md mb-2 mx-auto bg-white overflow-hidden p-4 rounded-lg">
      {/* Top Info */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-[32px] h-[32px] bg-gray-300 rounded-full overflow-hidden">
          <img
            className="h-full w-full object-cover"
            src="https://cdn-icons-png.flaticon.com/128/3829/3829933.png"
            alt="profile"
          />
        </div>
        <p className="font-bold text-sm text-[#37D3E7]">{t("instant_guru_bot_name")}</p>
      </div>

      <p className="font-normal">
        {t("multi_video_response_career_intro")}
      </p>

      <hr className="mt-4" />

      <div>
        <p className="font-semibold mt-3 text-[18px]">
          <b>{t("multi_video_response_recommended")}</b>
        </p>
      </div>

      {/* Video List */}
      <div className="mt-4">
        {videoData.map((video, index) => (
          <div key={video.id} className="w-[95vw] mb-4 items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-[120px] overflow-hidden h-[68px] rounded-md border-2 border-[#37D3E7]">
                {video.thumbnail ? (
                  <img
                    className="w-full h-full object-cover"
                    src={video.thumbnail}
                    alt={video.title}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
              <div>
                <p className="text-[17px] font-semibold">{video.title}</p>
                <div className="flex items-center gap-2">
                  <p className="text-[#37D3E7]">
                    <FaYoutube />
                  </p>
                  <p className="text-[#37D3E7] text-[14px] font-semibold">
                    {t("multi_video_response_watch")}
                  </p>
                </div>
              </div>
            </div>
            {/* HR except last item */}
            {index !== videoData.length - 1 && <hr className="mt-4" />}
          </div>
        ))}
      </div>

      <Global_like_dislike_response />
    </div>
  );
};

export default Multi_Video_response;
