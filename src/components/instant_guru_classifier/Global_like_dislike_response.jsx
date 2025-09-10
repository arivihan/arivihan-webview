import React, { useState } from "react";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { motion } from "framer-motion";
import { chatResponseFeedback } from "../../utils/instantGuruUtilsDev";
import { IoShareSocialOutline } from "react-icons/io5";

const Global_like_dislike_response = ({ chat }) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [cooldown, setCooldown] = useState(false); // cooldown state

  const startCooldown = () => {
    setCooldown(true);
    setTimeout(() => setCooldown(false), 3000); // 3 sec disable
  };

  const handleLike = () => {
    if (cooldown) return; // agar cooldown hai to ignore
    chatResponseFeedback(chat.responseId, true);
    setLiked(!liked);
    if (!liked && disliked) setDisliked(false);
    startCooldown();
  };

  const handleDislike = () => {
    if (cooldown) return;
    chatResponseFeedback(chat.responseId, false);
    setDisliked(!disliked);
    if (!disliked && liked) setLiked(false);
    startCooldown();
  };

  return (
    <div className="w-[90vw] py-1 text-[#8C8D92]">
      <hr className="w-full mt-2 mb-2" />

      <div className="flex items-center gap-3">
        <span className="text-xs">Was this helpful?</span>

        {/* LIKE */}
        <motion.div
          whileTap={!cooldown ? { scale: 1.3 } : {}}
          animate={{
            scale: liked ? 1.4 : 1.2,
            color: liked ? "#22c55e" : "#8C8D92",
            opacity: cooldown ? 0.5 : 1, // thoda fade jab disabled
          }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={handleLike}
          className={`cursor-pointer ${cooldown ? "pointer-events-none" : ""}`}
        >
          <AiOutlineLike size={16} />
        </motion.div>

        {/* DISLIKE */}
        <motion.div
          whileTap={!cooldown ? { scale: 1.3 } : {}}
          animate={{
            scale: disliked ? 1.4 : 1.2,
            color: disliked ? "#ef4444" : "#8C8D92",
            opacity: cooldown ? 0.5 : 1,
          }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={handleDislike}
          className={`cursor-pointer ${cooldown ? "pointer-events-none" : ""}`}
        >
          <AiOutlineDislike size={16} />
        </motion.div>
        <motion.div
          whileTap={{ rotate: 360, scale: 1.2 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="cursor-pointer"
        >
          <IoShareSocialOutline size={22} />
        </motion.div>
      </div>
    </div>
  );
};

export default Global_like_dislike_response;
