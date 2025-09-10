import React from "react";
import { LuDot } from "react-icons/lu";
import { RiShareBoxLine } from "react-icons/ri";
import Global_like_dislike_response from "../Global_like_dislike_response";
import Model_paper from "./Model_paper";

const Model_paper_response = () => {
  // ✅ response object
  const response = {
    fields: [
      {
        title: "Engineering (B.Tech , B.E)",
        desc: "Computer Science, Mechanical, Civil, IT, etc",
      },
      {
        title: "Medical (MBBS, BDS)",
        desc: "General Medicine, Dentistry, Surgery, etc",
      },
      {
        title: "Commerce",
        desc: "B.Com, Economics, Accounting, Finance",
      },
    ],
  };

  return (
    <div className="w-[95vw] bg-white select-none max-w-md mb-2 mx-auto overflow-hidden p-4 rounded-lg">
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

      {/* Card Info */}
      <div className="rounded-md border-2 flex-col items-center justify-items-end border-gray-100">
        <div className="w-full flex items-center justify-between">
          <Model_paper />
          <div className="w-[15%] flex mr-4 justify-center items-center h-[15%]">
            <img className="w-full h-full object-cover" src="/atom.png" alt="" />
          </div>
        </div>
        <div className="bg-[#26C6DA]/10 w-full flex items-center px-3 py-1 justify-end">
          <p className="underline text-[#37D3E7] text-[13px] underline-offset-4 font-bold">
            Start Now
          </p>
        </div>
      </div>

      {/* ✅ Dynamic Response Render */}
      <div>
        {response.fields.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2 mt-4">
            <LuDot className="text-2xl" />
            <p className="text-sm">
              <b>{item.title}</b> - {item.desc}
            </p>
          </div>
        ))}
      </div>

      <button style={{ boxShadow: "0px 0px 6px rgba(38, 198, 218, 0.5)" }
} className="bg-[#26C6DA] text-[15px] px-5 text-white flex justify-center items-center gap-2 py-2.5 mt-4 rounded-full">
        <b>
          <p> Start Test</p>
        </b>{" "}
        <p>
          <b>
            <RiShareBoxLine />
          </b>
        </p>
      </button>

      <Global_like_dislike_response />
    </div>
  );
};

export default Model_paper_response;