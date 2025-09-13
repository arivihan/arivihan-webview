import React, { useState, useEffect } from "react";
import { FaFilePdf } from "react-icons/fa";
import { TbArrowBearRight } from "react-icons/tb";
import { GrDownload } from "react-icons/gr";
import { Document, pdfjs } from "react-pdf";
import { openPdf } from "../../../utils/instantGuruUtilsDev";
import { MdOutlineFileDownload } from "react-icons/md";


const Only_Text_PDF = ({ file }) => {

  const [numPages, setNumPages] = useState(null);
  const [fileSize, setFileSize] = useState(null);

  // Jab PDF load ho jaye tab pages mil jayenge
  return (
    <div className="relative h-min-[62px]  w-full flex-1 h-auto shadow-sm border border-gray-100 rounded-lg overflow-hidden" onClick={() => { openPdf(file.pdfLink, file.pdfTitle) }}>
      {/* <iframe
        src={`${pdfUrl}#page=1&view=FitH`}
        title="PDF Preview"
        className="w-full h-[200px] pointer-events-none"
      ></iframe> */}

      {/* Overlay Info */}
      <div className="max-w-full border border-gray-950/10 rounded-md  text-xs px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2" >
          <img src={require("../../../assets/icons/pdf_icon.png")} className="h-8 w-min-8 object-contain" />
          <div>
           <p className="font-semibold text-black text-sm">
              {file.pdfTitle.length > 27
                ? file.pdfTitle.slice(0, 27) + "…"
                : file.pdfTitle}
            </p>
            {/* <p className="text-[11px] text-[#585757]">
              📄 {numPages || "..."} pages •  {fileSize || "..."}
            </p> */}
          </div>
        </div>

      </div>
    </div>

  )
}

export default Only_Text_PDF
