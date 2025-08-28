import React, { useState } from "react";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { IoShareSocialOutline } from "react-icons/io5";
import { motion } from "framer-motion";

const Global_like_dislike_response = () => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    if (!liked && disliked) setDisliked(false); // agar dislike pehle se active h to remove
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (!disliked && liked) setLiked(false); // agar like pehle se active h to remove
  };

  return (
    <div className="w-[90vw] text-[#8C8D92]">
      <hr className="w-full mt-2 mb-2" />

      <div className="flex items-center gap-3">
        <span className="text-xs">Was this helpful?</span>

        {/* LIKE */}
        <motion.div
          whileTap={{ scale: 1.3 }}
          animate={{ scale: liked ? 1.2 : 1, color: liked ? "#22c55e" : "#8C8D92" }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={handleLike}
          className="cursor-pointer"
        >
          <AiOutlineLike size={16} />
        </motion.div>

        {/* DISLIKE */}
        <motion.div
          whileTap={{ scale: 1.3 }}
          animate={{ scale: disliked ? 1.2 : 1, color: disliked ? "#ef4444" : "#8C8D92" }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={handleDislike}
          className="cursor-pointer"
        >
          <AiOutlineDislike size={16} />
        </motion.div>

        {/* SHARE */}
        <motion.div
          whileTap={{ rotate: 360, scale: 1.2 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="cursor-pointer"
        >
          <IoShareSocialOutline size={16} />
        </motion.div>
      </div>
    </div>
  );
};

export default Global_like_dislike_response;
