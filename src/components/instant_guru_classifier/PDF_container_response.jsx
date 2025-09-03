import React, { useState, useEffect } from "react";
import { FaFilePdf } from "react-icons/fa";
import { TbArrowBearRight } from "react-icons/tb";
import { GrDownload } from "react-icons/gr";
import { Document, pdfjs } from "react-pdf";
import Only_Text_PDF from "./Only_Text_response-Componenets/Only_Text_PDF";
import Only_Text_Discription from "./Only_Text_response-Componenets/Only_Text_Discription";
import Global_like_dislike_response from "./Global_like_dislike_response";

// ✅ Worker setup (use public folder, no CDN, no ?url)
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

const PDF_container_response = ({ chat }) => {


  // File size nikalna
  // useEffect(() => {
  //   // console.log(chat);

  //   if (response_data?.pdfUrl) {
  //     fetch(response_data.pdfUrl, { method: "HEAD" })
  //       .then((res) => {
  //         const bytes = res.headers.get("Content-Length");
  //         if (bytes) {
  //           const kb = (bytes / 1024).toFixed(1);
  //           setFileSize(
  //             kb > 1024 ? (kb / 1024).toFixed(1) + " MB" : kb + " KB"
  //           );
  //         }
  //       })
  //       .catch(() => setFileSize("Unknown"));
  //   }
  // }, [chat.pdfLink]);

  return (
    <div className="mb-2 bg-white rounded-lg ">
      {/* Top Info */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-[32px] h-[32px] bg-gray-300 rounded-full overflow-hidden">
          <img
            className="h-full w-full object-cover"
            src={require("../../assets/icons/icon_chat_avatar.png")}
            alt="profile"
          />
        </div>
        <p className="font-bold text-sm text-[#37D3E7]">Instant Guru</p>
      </div>

      {/* PDF Preview */}

      <div className="flex flex-col gap-3">
        {
          chat.pdfFiles.map(pdfFile => {
            return (
              <Only_Text_PDF file={pdfFile} />
            )
          })
        }
      </div>

      {/* Description */}
      <Only_Text_Discription chat={chat} />

      {/* Open Button */}
      {/* <div className="mt-4 w-[45vw]">
        <a
          href={response_data?.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#26C6DA] text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
        >
          <FaFilePdf className="text-red-500" />
          Open PDF
          <TbArrowBearRight />
        </a>
      </div> */}

      {/* Hidden Document (sirf pages count nikalne ke liye) */}
      {/* <div className="">
        <Document
          file={chat?.pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
        ></Document>
      </div> */}
      <Global_like_dislike_response chat={chat} />
    </div>
  );
};

export default PDF_container_response;
