import renderMathInElement from 'katex/contrib/auto-render';
import React, { useEffect, useRef } from 'react'
import { RiShareBoxFill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import SmilesRenderer from '../../smileRenderer';
import ReactDOM from "react-dom/client";
import Global_like_dislike_response from '../Global_like_dislike_response';
import { chatHistory } from '../../../state/instantGuruState';



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
    <div className='w-full flex flex-col items-start gap-2 py-2 h-fit'>
      <div className='flex items-center gap-2'>
        <div className='w-[32px] h-[32px] bg-gray-300 rounded-full overflow-hidden'>
          <img className='h-full w-full object-cover' src={require("../../../assets/icons/icon_chat_avatar.png")} alt="" />
        </div>
        <p className='font-bold text-sm text-[#37D3E7]'>Instant Guru</p>
      </div>
      {
        chat.botResponse &&
        <div className='whitespace-normal' ref={containerRef} dangerouslySetInnerHTML={{ __html: chat.botResponse.replaceAll("(bold)<b>", "</b>").replaceAll(/(\n){2,}/g, '</br>') }}>
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
