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

const PDF_container_response = () => {
  const response_data = {
    title: "Physics imp questions",
    pdfUrl: "https://www3.nd.edu/~powers/ame.20231/notes.pdf", // 👈 apna link
    subject: "Physics",
   "descriptionHtml": `
<ul>
  <li><b>Introduction to Newton's Laws</b> - These laws basically tell about the motions</li>
  <li><b>Law of Inertia</b> - An object will remain at rest or in uniform motion unless acted upon by an external force</li>
  <li><b>Law of Acceleration</b> - Force equals mass times acceleration (F=ma)</li>
</ul>
`
  };

const [fileSize, setFileSize] = useState(null);
const [numPages, setNumPages] = useState(null);
 function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
      }
  // File size nikalna
  useEffect(() => {
    if (response_data?.pdfUrl) {
      fetch(response_data.pdfUrl, { method: "HEAD" })
        .then((res) => {
          const bytes = res.headers.get("Content-Length");
          if (bytes) {
            const kb = (bytes / 1024).toFixed(1);
            setFileSize(
              kb > 1024 ? (kb / 1024).toFixed(1) + " MB" : kb + " KB"
            );
          }
        })
        .catch(() => setFileSize("Unknown"));
    }
  }, [response_data?.pdfUrl]);

  return (
    <div className="w-[95vw] max-w-md mb-2 mx-auto bg-white overflow-hidden p-4 rounded-lg ">
      {/* Top Info */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-[32px] h-[32px] bg-gray-300 rounded-full overflow-hidden">
          <img
            className="h-full w-full object-cover"
            src="https://cdn-icons-png.flaticon.com/128/3829/3829933.png"
            alt="profile"
          />
        </div>
        <p className="font-bold text-sm text-[#37D3E7]">Instant Guru</p>
      </div>

      {/* PDF Preview */}
      <Only_Text_PDF response_data={response_data} />
      {/* Description */}
     <Only_Text_Discription response_data={response_data}/>

      {/* Open Button */}
      <div className="mt-4 w-[45vw]">
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
      </div>

      {/* Hidden Document (sirf pages count nikalne ke liye) */}
      <div className="hidden">
        <Document
          file={response_data?.pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
        ></Document>
      </div> 
      <Global_like_dislike_response/>
    </div>
  );
};

export default PDF_container_response;
