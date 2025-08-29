import React, { useState, useEffect } from "react";
import { FaFilePdf } from "react-icons/fa";
import { TbArrowBearRight } from "react-icons/tb";
import { GrDownload } from "react-icons/gr";
import { Document, pdfjs } from "react-pdf";
import { openPdf } from "../../../utils/instantGuruUtilsDev";



const Only_Text_PDF = ({ file }) => {

  const [numPages, setNumPages] = useState(null);
  const [fileSize, setFileSize] = useState(null);

  // Jab PDF load ho jaye tab pages mil jayenge
  return (
    <div className="relative h-min-[62px] w-full flex-1 h-auto shadow-sm border border-gray-100 rounded-lg overflow-hidden" onClick={() => { openPdf(file.pdfLink) }}>
      {/* <iframe
        src={`${pdfUrl}#page=1&view=FitH`}
        title="PDF Preview"
        className="w-full h-[200px] pointer-events-none"
      ></iframe> */}

      {/* Overlay Info */}
      <div className="max-w-full bg-white text-xs p-2 flex justify-between items-center">
        <div className="flex items-center gap-2" >
          <img src={require("../../../assets/icons/icon_pdf.png")} className="h-8 w-min-8 object-contain" />
          <div>
            <p className="font-bold text-black text-sm">
              {file.pdfTitle}
            </p>
            <p className="text-[11px] text-[#585757]">
              📄 {numPages || "..."} pages •  {fileSize || "..."}
            </p>
          </div>
        </div>
        <a
          href={file.pdfLink}
          download
          className="text-gray-400 hover:text-red-400"
        >
          <GrDownload size={18} />
        </a>
      </div>
    </div>

  )
}

export default Only_Text_PDF
