import React, { useEffect, useRef, useState } from 'react';
import { IoIosArrowRoundDown } from "react-icons/io";
import { IoIosArrowRoundUp } from "react-icons/io";
import Global_like_dislike_response from './Global_like_dislike_response';
import renderMathInElement from 'katex/contrib/auto-render';
import SmilesRenderer from '../smileRenderer';
import ReactDOM from "react-dom/client";
import "./pdf-circle-and-web-view-common.css";
const Pdf_circle_mini_screen = () => {
  const contentRef = useRef(null);
  const containerRef = useRef(null);
  const [mathLoaded, setMathLoaded] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(true);
  const [isScrollable, setIsScrollable] = useState(false);
  const [response, setResponse] = useState("");


  window.showNotesDoubtResponse  = (res) => {
    console.log(res);
    setResponse(res.response);
  }

  // Scroll handler for showing/hiding scroll buttons
const handleScroll = () => {
  if (!contentRef.current) return;
  const { scrollTop, scrollHeight, clientHeight } = contentRef.current;

  const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

  setShowScrollToTop(isAtBottom);
  setShowScrollToBottom(!isAtBottom);
  setShowScrollToTop(isAtBottom);
  setShowScrollToBottom(!isAtBottom);
};



  // Smooth scroll to top
  const scrollToTop = () => {
    if (!contentRef.current) return;
    contentRef.current.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Smooth scroll to bottom
  const scrollToBottom = () => {
    if (!contentRef.current) return;
    contentRef.current.scrollTo({
      top: contentRef.current.scrollHeight,
      behavior: 'smooth'
    });
  };
useEffect(() => {
  const contentElement = contentRef.current;
  if (contentElement) {
    // Pehle check karo scrollable hai ya nahi
    const checkScrollable = () => {
      setIsScrollable(contentElement.scrollHeight > contentElement.clientHeight);
    };

    checkScrollable(); // Initial check
    window.addEventListener("resize", checkScrollable); // Resize pe bhi check karna zaruri hai

    contentElement.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial scroll check

    return () => {
      contentElement.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkScrollable);
    };
  }
}, []);



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
  }, []);

  useEffect(() => {
  const contentElement = contentRef.current;
  if (contentElement) {
    // Pehle check karo scrollable hai ya nahi
    const checkScrollable = () => {
      setIsScrollable(contentElement.scrollHeight > contentElement.clientHeight);
    };

    checkScrollable(); // Initial check
    window.addEventListener("resize", checkScrollable); // Resize pe bhi check karna zaruri hai

    contentElement.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial scroll check

    return () => {
      contentElement.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkScrollable);
    };
  }
}, []);

  // Add scroll event listener
  useEffect(() => {
    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();

      return () => {
        contentElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <div className="absolute w-screen h-screen bg-zinc-900/60  flex justify-center items-center z-50">
      <div className="w-[100vw] h-[100vh]  bg-white overflow-hidden flex flex-col relative">
        {/* Header */}
        <div className="flex items-center px-4 py-1 h-[50px] flex-shrink-0">
          <div className="w-8 h-8  rounded-full flex items-center justify-center shadow-md">
            <img src={require("../../assets/icons/icon_chat_avatar.png")} alt="" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-[#37D3E7] font-bold">Instant Guru</p>
          </div>
        </div>

        {/* Content */}
        <div
          className="flex-1 px-6 py-4 text-sm text-gray-700 leading-relaxed overflow-y-auto relative"
          style={{
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
            lineHeight: '1.7'
          }}
          ref={contentRef}
        >
          {/* Response content */}
          <div dangerouslySetInnerHTML={{ __html: response.replaceAll("(bold)<b>", "</b>").replaceAll(/(\n){2,}/g, '</br>') }} ref={containerRef} />

          {/* Hamesha neeche render hoga */}
          <Global_like_dislike_response />
          <div className='h-[10vh]'></div>
        </div>


        {/* Scroll to Top Button */}
        {isScrollable && showScrollToTop && (
          <div className="absolute bottom-[15vh] left-[50%] -translate-x-[50%] group">
            <button
              onClick={scrollToTop}
              className="bg-[#000000CC]/80 hover:bg-zinc-600 text-white rounded-full p-1 py-1.5 px-3 shadow-lg transition-all duration-300 transform hover:scale-110"
            >
              <p className='text-sm flex items-center'>Upar jayein <p className='text-xl'><IoIosArrowRoundUp /></p>
              </p>
            </button>
            {/* Tooltip */}

          </div>
        )}


        {/* Scroll to Bottom Button */}
        {isScrollable && showScrollToBottom && (
          <div className="absolute bottom-[15vh] left-[50%] -translate-x-[50%] group ">
            <button
              onClick={scrollToBottom}
              className="bg-[#000000CC]/80  text-white rounded-full p-1 py-1.5 px-3 shadow-lg transition-all duration-300 transform hover:scale-110"
            >
              <p className="text-sm flex items-center">Neeche jayein <p className='text-xl'><IoIosArrowRoundDown /></p> </p>
            </button>
            {/* Tooltip */}

          </div>
        )}


        <div className='w-full p-2 bg-white border-t border-gray-100'></div>
      </div>
    </div>
  );
};

export default Pdf_circle_mini_screen;