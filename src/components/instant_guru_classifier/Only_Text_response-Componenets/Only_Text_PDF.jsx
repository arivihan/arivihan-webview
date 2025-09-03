import React, { useState, useEffect } from "react";
import { FaFilePdf } from "react-icons/fa";
import { TbArrowBearRight } from "react-icons/tb";
import { GrDownload } from "react-icons/gr";
import { Document, pdfjs } from "react-pdf";
const Only_Text_PDF = ({response_data }) => {
      const [numPages, setNumPages] = useState(null);
      const [fileSize, setFileSize] = useState(null);
    
      // Jab PDF load ho jaye tab pages mil jayenge
      function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
      }
  return (
   <div className="relative h-[25vh] shadow-md rounded overflow-hidden">
           <iframe
             src={`${response_data?.pdfUrl}#page=1&view=FitH`}
             title="PDF Preview"
             className="w-full h-[200px] pointer-events-none"
           ></iframe>
   
           {/* Overlay Info */}
           <div className="absolute bottom-0 left-0 right-0 bg-white text-xs p-2 flex justify-between items-center">
             <div className="flex items-center gap-2">
               <FaFilePdf style={{scrollbar: "none"}} className="text-red-400  text-lg" />
               <div>
                 <p className="font-bold text-black text-sm">
                   {response_data?.title}
                 </p>
                 <p className="text-[11px] text-[#585757]">
                   📄 {numPages || "..."} pages • 📦 {fileSize || "..."}
                 </p>
               </div>
             </div>
             <a
               href={response_data?.pdfUrl}
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
