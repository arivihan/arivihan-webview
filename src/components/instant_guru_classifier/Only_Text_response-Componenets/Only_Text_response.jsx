import renderMathInElement from 'katex/contrib/auto-render';
import React, { useEffect, useRef } from 'react'
import { RiShareBoxFill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import SmilesRenderer from '../../smileRenderer';
import ReactDOM from "react-dom/client";
import Global_like_dislike_response from '../Global_like_dislike_response';
import { chatHistory } from '../../../state/instantGuruState';

const chat=`
   {
  "message": "Success",
  "result": [
    {
      "userQuery": "अभिक्रिया की दर ",
      "cardType": "CardType.FULLCARD",
      "sectionType": "SectionType.LECTURE_DOUBT_VIDEO",
      "displaySubtitle": "watch the doubt video",
      "actionButtonText": null,
      "redirectLink": null,
      "deepLink": null,
      "bigtext": null,
      "pdfLink": null,
      "subscriptionType": null,
      "videoLink": null,
      "position": null,
      "screenClassName": "arivihan.technologies.doubtbuzzter2.activity.MicrolectureListActivity",
      "thumbnailUrl": "https://d2ztt6so6c3jo0.cloudfront.net/do_not_delete/dde65d5c-5804-4b3f-82cb-badf58f2dd7b/MAIN_EXAM_2025_CHEMISTRY_HINDI_CH3.jpg",
      "displayTitle": "अभिक्रिया की दर ",
      "clickableElements": {
        "thumbnail": true,
        "title": true,
        "subtitle": false,
        "link": false
      },
      "navigationParams": {
        "chapterId": "CHEMPBHINCHK",
        "chapterName": "Chemical Kinetics",
        "microLectureId": "CHEMPBHINCHKML1",
        "microLectureName": "अभिक्रिया की दर ",
        "startTime": 1621000,
        "endTime": "2322000",
        "IntroImage": "https://d2ztt6so6c3jo0.cloudfront.net/do_not_delete/dde65d5c-5804-4b3f-82cb-badf58f2dd7b/MAIN_EXAM_2025_CHEMISTRY_HINDI_CH3.jpg",
        "hideTapTarget": true,
        "openVideo": true
      }
    }
  ]
}
`

const Only_Text_response = ({ chat, chatIndex }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (containerRef.current) {
      renderMathInElement(containerRef.current, {
        delimiters: [
          { left: "\\[", right: "\\]", display: true },
          { left: "\\(", right: "\\)", display: false },
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false }
        ]
      });

      const el = containerRef.current;
      if (!el) return;

      setTimeout(() => {
        const nodes = Array.from(el.querySelectorAll("smiles"));
        nodes.forEach((node, i) => {
          const smiles = (node.textContent || node.getAttribute("value") || "").trim();
          const mount = document.createElement("span");
          node.replaceWith(mount);
          console.log(smiles);
          ReactDOM.createRoot(mount).render(<SmilesRenderer key={Math.random()} smiles={smiles} />);
        });

      }, 200)

    }
  }, [chat.botResponse]);



  return (
    <div className='w-full flex flex-col items-start gap-2 py-0'>
      {
        (chat.showBotAvatar || chatHistory.value.length > 2)
        &&
        <div className='flex items-center gap-2'>
          <div className='w-[32px] h-[32px] bg-gray-300 rounded-full overflow-hidden'>
            <img className='h-full w-full object-cover' src={require("../../../assets/icons/icon_chat_avatar.png")} alt="" />
          </div>
          <p className='font-bold text-sm text-[#37D3E7]'>Instant Guru</p>
        </div>
      }
      {
        chat.botResponse &&
        <div className='whitespace-normal text-[15px]' ref={containerRef} dangerouslySetInnerHTML={{ __html: chat.botResponse.replaceAll("(bold)<b>", "</b>").replaceAll(/(\n){2,}/g, '</br>') }}>
        </div>
      }

      {
        chat.redirectLink && chat.redirectLink.length > 0
        &&
        chat.redirectLink.map(link => {
          return (
            <div className="rounded-lg border border-gray-200 p-2">
              <p className='text-xs'>{link.title}</p>
            </div>
          )
        })
      }


      {
        chat.needFeedback && chatIndex == chatHistory.value.length - 1
        &&
        <Global_like_dislike_response chat={chat} />
      }

      {/* <div className='mt-3 border shadow-lg rounded-md p-3'>

        </div> */}
    </div>

  )
}

export default Only_Text_response


// import renderMathInElement from "katex/contrib/auto-render";
// import React, { useEffect, useRef } from "react";
// import { RiShareBoxFill } from "react-icons/ri";
// import { Link } from "react-router-dom";
// import SmilesRenderer from "../../smileRenderer";
// import ReactDOM from "react-dom/client";
// import Global_like_dislike_response from "../Global_like_dislike_response";
// import { chatHistory } from "../../../state/instantGuruState";

// const sampleText = `
//   <p><strong style="color: #26C6DA; font-size: 1.2em;">त्रिभुज का क्षेत्रफल ज्ञात करना</strong></p>
//   <p><strong style="color: #26C6DA;">बेटा, जहाँ आपने सर्कल किया है, वो त्रिभुज का क्षेत्रफल निकालने का तरीका है।</strong></p>
//   <p>जब हमें त्रिभुज के तीन बिंदुओं के निर्देशांक दिए होते हैं, तो हम सारणिक (determinant) विधि से उसका क्षेत्रफल निकाल सकते हैं। इसके लिए एक खास सूत्र है:</p>
//   <div style="background-color: #E0F2F1; border-left: 4px solid #26C6DA; padding: 12px; margin: 10px 0; border-radius: 5px;">
//     <p><strong style="color: #26C6DA;">महत्वपूर्ण सूत्र/अभिक्रिया:</strong></p>
//     <p style="text-align: center; font-size: 1.1em; margin: 8px 0;">\\[ \\Delta = \\frac{1}{2} \\left| \\begin{array}{ccc} x_1 & y_1 & 1 \\\\ x_2 & y_2 & 1 \\\\ x_3 & y_3 & 1 \\end{array} \\right| \\]</p>
//     <p><strong style="color: #26C6DA;">इसका मतलब:</strong> यहाँ \\( \\Delta \\) त्रिभुज के क्षेत्रफल को दर्शाता है, और \\( (x_1, y_1), (x_2, y_2), (x_3, y_3) \\) त्रिभुज के तीन शीर्ष बिंदु हैं।</p>
//   </div>
//   <p><strong style="color: #26C6DA;">गणना के steps:</strong></p>
//   <div style="background-color: #E0F2F1; border-left: 4px solid #26C6DA; padding: 12px; margin: 10px 0; border-radius: 5px;">
//     <p><strong style="color: #26C6DA;">Step 1:</strong> दिए गए बिंदुओं \\((-2, -3), (3, 2), (-1, -8)\\) को सारणिक में रखना।</p>
//     <p><strong style="color: #26C6DA;">Step 2:</strong> सारणिक को हल करना। यहाँ, हमने पहले कॉलम के सापेक्ष विस्तार किया है।</p>
//     <p><strong style="color: #26C6DA;">Step 3:</strong> गणना करने पर \\(\\frac{1}{2}[-2(2+8) + 3(3+1) + 1(-24+2)]\\) मिलता है, जो \\(\\frac{1}{2}[-20 + 12 - 22]\\) के बराबर है।</p>
//     <p><strong style="color: #26C6DA;">Step 4:</strong> इसे हल करने पर \\(\\frac{-30}{2} = -15\\) आता है।</p>
//     <p><strong style="color: #26C6DA;">Step 5:</strong> क्योंकि क्षेत्रफल हमेशा धनात्मक (positive) होता है, हम \\(-15\\) का निरपेक्ष मान (absolute value) लेते हैं, जो \\(15\\) है।</p>
//   </div>
//   <p><strong style="color: #26C6DA;">याद रखने का तरीका:</strong> सारणिक विधि को <b>'साइन-कॉन्वेन्शन'</b> के साथ याद रखें, जहाँ आप पहले बिंदु के निर्देशांक से शुरू करते हैं और घड़ी की विपरीत दिशा में चलते हैं, और अंत में पहले बिंदु पर वापस आते हैं।</p>
// `;

// const Only_Text_response = ({ chat, chatIndex }) => {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     if (containerRef.current) {
//       renderMathInElement(containerRef.current, {
//         delimiters: [
//           { left: "\\[", right: "\\]", display: true },
//           { left: "\\(", right: "\\)", display: false },
//           { left: "$$", right: "$$", display: true },
//           { left: "$", right: "$", display: false },
//         ],
//       });

//       const el = containerRef.current;
//       if (!el) return;

//       setTimeout(() => {
//         const nodes = Array.from(el.querySelectorAll("smiles"));
//         nodes.forEach((node) => {
//           const smiles =
//             (node.textContent || node.getAttribute("value") || "").trim();
//           const mount = document.createElement("span");
//           node.replaceWith(mount);
//           ReactDOM.createRoot(mount).render(
//             <SmilesRenderer key={Math.random()} smiles={smiles} />
//           );
//         });
//       }, 200);
//     }
//   }, [chat.botResponse]);

//   return (
//     <div className="w-full flex flex-col items-start gap-2 py-0">
//       {(chat.showBotAvatar || chatHistory.value.length > 2) && (
//         <div className="flex items-center gap-2">
//           <div className="w-[32px] h-[32px] bg-gray-300 rounded-full overflow-hidden">
//             <img
//               className="h-full w-full object-cover"
//               src={require("../../../assets/icons/icon_chat_avatar.png")}
//               alt="bot"
//             />
//           </div>
//           <p className="font-bold text-sm text-[#37D3E7]">Instant Guru</p>
//         </div>
//       )}

//       {chat.botResponse && (
//         <div
//           className="whitespace-normal text-[15px]"
//           ref={containerRef}
//           dangerouslySetInnerHTML={{ __html: sampleText }}
//         />
//       )}

//       {chat.redirectLink &&
//         chat.redirectLink.length > 0 &&
//         chat.redirectLink.map((link, i) => (
//           <div key={i} className="rounded-lg border border-gray-200 p-2">
//             <p className="text-xs">{link.title}</p>
//           </div>
//         ))}

//       {chat.needFeedback && chatIndex === chatHistory.value.length - 1 && (
//         <Global_like_dislike_response chat={chat} />
//       )}
//     </div>
//   );
// };

// export default Only_Text_response;



// import renderMathInElement from "katex/contrib/auto-render";
// import React, { useEffect, useRef } from "react";
// import SmilesRenderer from "../../smileRenderer";
// import ReactDOM from "react-dom/client";
// import Global_like_dislike_response from "../Global_like_dislike_response";
// import { chatHistory } from "../../../state/instantGuruState";

// const Only_Text_response = ({ chat, chatIndex }) => {
//   const containerRef = useRef(null);
//    const sampletext =`
//     "bigtext": "$$Q. निम्नलिखित अभिक्रियाओं को पूर्ण कीजिये : (i) \\(\\left(\\mathrm{CH}_{3}\\right)_{3} \\mathrm{C}-\\mathrm{OC}_{2} \\mathrm{H}_{5} \\xrightarrow{\\mathrm{HI}}\\) (ii) \\(\\mathrm{CO}+2 \\mathrm{H}_{2} \\xrightarrow[\\substack{200-300 \\text { atm } \\\\ 573-673 \\mathrm{~K}}]{\\mathrm{ZnO}-\\mathrm{Cr}_{2} \\mathrm{O}_{3}}\\) (iii) benzene + \\(\\mathrm{CH}_{3}Cl\\) with \\(\\mathrm{AlCl}_{3}\\) (iv) phenol + \\(\\mathrm{CHCl}_{3}\\) + \\(\\mathrm{NaOH}\\)$$",

// React

// Reply

// 4:53
// "bigtext": "$$Q. निम्नलिखित अभिक्रियाओं को पूर्ण कीजिये : (i) \\(\\left(\\mathrm{CH}_{3}\\right)_{3} \\mathrm{C}-\\mathrm{OC}_{2} \\mathrm{H}_{5} \\xrightarrow{\\mathrm{HI}}\\) (ii) \\(\\mathrm{CO}+2 \\mathrm{H}_{2} \\xrightarrow[\\substack{200-300 \\text { atm } \\\\ 573-673 \\mathrm{~K}}]{\\mathrm{ZnO}-\\mathrm{Cr}_{2} \\mathrm{O}_{3}}\\) (iii) benzene + \\(\\mathrm{CH}_{3}Cl\\) with \\(\\mathrm{AlCl}_{3}\\) (iv) phenol + \\(\\mathrm{CHCl}_{3}\\) + \\(\\mathrm{NaOH}\\)$$",
// 4:53
// "bigtext": "$$Q. निम्नलिखित अभिक्रियाओं को पूर्ण कीजिये : (i) \\(\\left(\\mathrm{CH}_{3}\\right)_{3} \\mathrm{C}-\\mathrm{OC}_{2} \\mathrm{H}_{5} \\xrightarrow{\\mathrm{HI}}\\) (ii) \\(\\mathrm{CO}+2 \\mathrm{H}_{2} \\xrightarrow[\\substack{200-300 \\text { atm } \\\\ 573-673 \\mathrm{~K}}]{\\mathrm{ZnO}-\\mathrm{Cr}_{2} \\mathrm{O}_{3}}\\) (iii) benzene + \\(\\mathrm{CH}_{3}Cl\\) with \\(\\mathrm{AlCl}_{3}\\) (iv) phenol + \\(\\mathrm{CHCl}_{3}\\) + \\(\\mathrm{NaOH}\\)$$",
//    `
//   useEffect(() => {
//     if (containerRef.current) {
//       renderMathInElement(containerRef.current, {
//         delimiters: [
//           { left: "\\[", right: "\\]", display: true },
//           { left: "\\(", right: "\\)", display: false },
//           { left: "$$", right: "$$", display: true },
//           { left: "$", right: "$", display: false },
//         ],
//       });

//       const el = containerRef.current;
//       if (!el) return;

//       setTimeout(() => {
//         const nodes = Array.from(el.querySelectorAll("smiles"));
//         nodes.forEach((node) => {
//           const smiles =
//             (node.textContent || node.getAttribute("value") || "").trim();
//           const mount = document.createElement("span");
//           node.replaceWith(mount);
//           ReactDOM.createRoot(mount).render(
//             <SmilesRenderer key={Math.random()} smiles={smiles} />
//           );
//         });
//       }, 200);
//     }
//   }, [chat.botResponse]);

//   return (
//     <div className="w-full flex flex-col items-start gap-2 py-0">
//       {(chat.showBotAvatar || chatHistory.value.length > 2) && (
//         <div className="flex items-center gap-2">
//           <div className="w-[32px] h-[32px] bg-gray-300 rounded-full overflow-hidden">
//             <img
//               className="h-full w-full object-cover"
//               src={require("../../../assets/icons/icon_chat_avatar.png")}
//               alt="bot"
//             />
//           </div>
//           <p className="font-bold text-sm text-[#37D3E7]">Instant Guru</p>
//         </div>
//       )}

//       {chat.botResponse && (
//         <div
//           className="whitespace-normal text-[15px]"
//           ref={containerRef}
//           dangerouslySetInnerHTML={{ __html: sampletext }}
//         />
//       )}

//       {chat.redirectLink &&
//         chat.redirectLink.length > 0 &&
//         chat.redirectLink.map((link, i) => (
//           <div key={i} className="rounded-lg border border-gray-200 p-2">
//             <p className="text-xs">{link.title}</p>
//           </div>
//         ))}

//       {chat.needFeedback && chatIndex === chatHistory.value.length - 1 && (
//         <Global_like_dislike_response chat={chat} />
//       )}
//     </div>
//   );
// };

// export default Only_Text_response;
