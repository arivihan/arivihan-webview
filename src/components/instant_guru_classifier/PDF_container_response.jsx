import React from "react";
import { FaFilePdf } from "react-icons/fa";
import { TbArrowBearRight } from "react-icons/tb";
import { GrDownload } from "react-icons/gr";

const PDF_container_response = () => {
  const response_data = {
    title: "Physics imp questions",
    pageCount: 2,
    size: "780 kB",
    pdfUrl: "https://example.com/physics.pdf", // apna actual PDF URL lagao
    subject: "Physics",
    descriptionPoints: [
      "Sed ut perspiciatis unde omnis iste natus",
      "Neque porro quisquamest, qui dolorem ipsum",
      "Quis autem vel eum iure reprehenderit",
      "At vero eos et accusamus et iusto odio dignissimos",
      "Et harum quidem rerum facilis",
      "Excepteur sint occaecat cupidatat non proident",
    ],
  };

  return (
    <div className="w-[95vw] max-w-md mb-2 mx-auto bg-white overflow-hidden p-4 rounded-lg ">
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

      {/* PDF Preview (Iframe) */}
      <div className="relative h-[25vh] shadow-md rounded overflow-hidden ">
        <div className="bg-orange-400">
          <iframe
          src={`${response_data?.pdfUrl}#page=1&view=FitH`}
          title="PDF Preview"
          className="w-full h-[200px] pointer-events-none"
        ></iframe>
         <div className="absolute bottom-0 left-0 right-0 bg-white text-white text-xs p-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaFilePdf className="text-red-400 text-lg" />
            <div>
              <p className="font-bold text-black text-sm">{response_data?.title}</p>
              <p className="text-[11px] text-[#585757]">
                {response_data?.pageCount} pages • {response_data?.size}
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
        

        {/* Overlay Info */}
       
      </div>

      {/* Description */}
      <div className="mt-3">
        <p className="text-sm text-gray-600 mb-2">
          Here are list of questions related to{" "}
          <span className="font-bold">{response_data?.subject}</span>:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
          {response_data?.descriptionPoints?.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>
      </div>

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
    </div>
  );
};

export default PDF_container_response;
