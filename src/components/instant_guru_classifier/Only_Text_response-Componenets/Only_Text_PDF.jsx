import React, { useState, useEffect } from "react";
import { FaFilePdf } from "react-icons/fa";
import { TbArrowBearRight } from "react-icons/tb";
import { GrDownload } from "react-icons/gr";
import { Document, pdfjs } from "react-pdf";
import { openPdf } from "../../../utils/instantGuruUtilsDev";



const Only_Text_PDF = ({ chat }) => {

  const [numPages, setNumPages] = useState(null);
  const [fileSize, setFileSize] = useState(null);

  // Jab PDF load ho jaye tab pages mil jayenge
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  return (
    <div className="relative h-[40px] w-full flex-1 h-auto bg-red-100 border rounded overflow-hidden" onClick={() => { openPdf(chat.pdfLink) }}>
      {/* <iframe
        src={`${pdfUrl}#page=1&view=FitH`}
        title="PDF Preview"
        className="w-full h-[200px] pointer-events-none"
      ></iframe> */}

      {/* Overlay Info */}
      <div className="max-w-full bg-white text-xs p-2 flex justify-between items-center">
        <div className="flex items-center gap-2" >
          <FaFilePdf style={{ scrollbar: "none" }} className="text-red-400 text-2xl" />
          <div>
            <p className="font-bold text-black text-sm">
              {chat.pdfTitle}
            </p>
            <p className="text-[11px] text-[#585757]">
              📄 {numPages || "..."} pages • 📦 {fileSize || "..."}
            </p>
          </div>
        </div>
        <a
          href={chat.pdfUrl}
          download
          className="text-[#37D3E7] hover:text-red-400"
        >
          <GrDownload size={18} />
        </a>
      </div>
    </div>

  )
}

export default Only_Text_PDF
