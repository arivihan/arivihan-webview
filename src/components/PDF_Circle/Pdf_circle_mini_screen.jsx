import React, { useEffect, useRef, useState } from 'react';
import { IoIosArrowRoundDown } from "react-icons/io";
import { IoIosArrowRoundUp } from "react-icons/io";
import Global_like_dislike_response from './Global_like_dislike_response';
import renderMathInElement from 'katex/contrib/auto-render';
import SmilesRenderer from '../smileRenderer';
import ReactDOM from "react-dom/client";
const Pdf_circle_mini_screen = () => {
  const contentRef = useRef(null);
  const containerRef = useRef(null);
  const [mathLoaded, setMathLoaded] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(true);

  const response = `
    <p><strong style="color: #26C6DA; font-size: 1.2em;">त्रिभुज का क्षेत्रफल ज्ञात करना</strong></p>
    <p><strong style="color: #26C6DA;">बेटा, जहाँ आपने सर्कल किया है, वो त्रिभुज का क्षेत्रफल निकालने का तरीका है।</strong></p>
    <p>जब हमें त्रिभुज के तीन बिंदुओं के निर्देशांक दिए होते हैं, तो हम सारणिक (determinant) विधि से उसका क्षेत्रफल निकाल सकते हैं। इसके लिए एक खास सूत्र है:</p>
    <div style="background-color: #E0F2F1; border-left: 4px solid #26C6DA; padding: 12px; margin: 10px 0; border-radius: 5px;">
      <p><strong style="color: #26C6DA;">महत्वपूर्ण सूत्र/अभिक्रिया:</strong></p>
      <p style="text-align: center; font-size: 1.1em; margin: 8px 0;">
        $$\\Delta = \\frac{1}{2} \\left| \\begin{array}{ccc} x_1 & y_1 & 1 \\\\ x_2 & y_2 & 1 \\\\ x_3 & y_3 & 1 \\end{array} \\right|$$
      </p>
      <p><strong style="color: #26C6DA;">इसका मतलब:</strong> यहाँ $\\Delta$ त्रिभुज के क्षेत्रफल को दर्शाता है, और $(x_1, y_1), (x_2, y_2), (x_3, y_3)$ त्रिभुज के तीन शीर्ष बिंदु हैं।</p>
      <p><strong style="color: #26C6DA;">रासायनिक उदाहरण:</strong> 
      \\[\\ce{H2SO4 + 2NaOH -> Na2SO4 + 2H2O}\\]
      और जटिल यौगिक \\[\\ce{[Cu(NH3)4]SO4}\\]</p>
      <p><strong style="color: #26C6DA;">और भी रसायन:</strong> 
      \\[\\ce{CaCO3 ->[\\Delta] CaO + CO2}\\] 
      तथा \\[\\ce{NH4+ + OH- -> NH3 ^ + H2O}\\]</p>
    </div>
    <p><strong style="color: #26C6DA;">गणना के steps:</strong></p>
    <div style="background-color: #E0F2F1; border-left: 4px solid #26C6DA; padding: 12px; margin: 10px 0; border-radius: 5px;">
      <p><strong style="color: #26C6DA;">Step 1:</strong> दिए गए बिंदुओं $(-2, -3), (3, 2), (-1, -8)$ को सारणिक में रखना।</p>
      <p><strong style="color: #26C6DA;">Step 2:</strong> सारणिक को हल करना। यहाँ, हमने पहले कॉलम के सापेक्ष विस्तार किया है।</p>
      <p><strong style="color: #26C6DA;">Step 3:</strong> गणना करने पर $\\frac{1}{2}[-2(2+8) + 3(3+1) + 1(-24+2)]$ मिलता है, जो $\\frac{1}{2}[-20 + 12 - 22]$ के बराबर है।</p>
      <p><strong style="color: #26C6DA;">Step 4:</strong> इसे हल करने पर $\\frac{-30}{2} = -15$ आता है।</p>
      <p><strong style="color: #26C6DA;">Step 5:</strong> क्योंकि क्षेत्रफल हमेशा धनात्मक (positive) होता है, हम $-15$ का निरपेक्ष मान (absolute value) लेते हैं, जो $15$ है।</p>
    </div>
    <div style="background-color: #FFF3E0; border-left: 4px solid #FF9800; padding: 12px; margin: 10px 0; border-radius: 5px;">
      <p><strong style="color: #FF9800;">अतिरिक्त जटिल उदाहरण:</strong></p>
      <p><strong>गणित:</strong> समाकलन $\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$</p>
      <p><strong>श्रृंखला:</strong> $\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$</p>
      <p><strong>रासायनिक संतुलन:</strong> 
      \\[\\ce{Fe^{3+} + SCN^- <=> [FeSCN]^{2+}}\\]
      जहाँ संतुलन स्थिरांक: $K_c = \\frac{[\\ce{[FeSCN]^{2+}}]}{[\\ce{Fe^{3+}}][\\ce{SCN^-}]}$</p>
      
      <p><strong>जटिल यौगिक:</strong> \\[\\ce{K4[Fe(CN)6] * 3H2O}\\] (पोटेशियम फेरोसायनाइड हाइड्रेट)</p>
      
      <p><strong>कार्बनिक यौगिक:</strong> 
      \\[\\ce{CH3-CH2-OH}\\] (एथेनॉल) और \\[\\ce{C6H12O6}\\] (ग्लूकोस)</p>
      
      <p><strong>अम्ल-क्षार:</strong> \\[\\ce{HCl + NaOH -> NaCl + H2O}\\]</p>
      
      <p><strong>ऑक्सीकरण-अपचयन:</strong> 
      \\[\\ce{2KMnO4 + 16HCl -> 2MnCl2 + 5Cl2 + 8H2O + 2KCl}\\]</p>
      
      <p><strong>गैस अभिक्रिया:</strong> \\[\\ce{N2 + 3H2 <=>[\text{Fe catalyst}][\text{400°C, 200 atm}] 2NH3}\\]</p>
      
      <p><strong>इलेक्ट्रॉलिसिस:</strong> \\[\\ce{2H2O ->[\\text{electrolysis}] 2H2 ^ + O2 ^}\\]</p>
      
      <p><strong>भौतिकी:</strong> $E = mc^2$ और तरंग समीकरण $\\psi = Ae^{i(kx - \\omega t)}$</p>
      
      <p><strong>मैट्रिक्स:</strong> $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ax + by \\\\ cx + dy \\end{pmatrix}$</p>
      
      <p><strong>स्माइली और यूनिकोड:</strong> 😊 ✨ 🧬 ⚡ 🔬 📐 🧪 ⚗ 🔥 💎</p>
      <p><strong>गणित चिह्न:</strong> ∀ ∃ ∈ ∉ ⊆ ⊇ ∪ ∩ ∅ ∞ ≤ ≥ ± × ÷</p>
      
      <p><strong>इलेक्ट्रॉन कॉन्फिगरेशन:</strong> \\[\\ce{Fe: [Ar] 4s^2 3d^6}\\]</p>
      
      <p><strong>रेडॉक्स जोड़े:</strong> \\[\\ce{Zn^{2+} + 2e- -> Zn}\\] (E° = -0.76 V)</p>
      
      <p><strong>अतिरिक्त उदाहरण:</strong></p>
      <p>जटिल समीकरण: $\\frac{d^2y}{dx^2} + \\omega^2 y = 0$ जिसका हल $y = A\\cos(\\omega t) + B\\sin(\\omega t)$ है।</p>
      <p>आणविक कक्षक: \\[\\ce{C2H6}\\] में sp³ संकरण और \\[\\ce{C2H4}\\] में sp² संकरण।</p>
      <p>प्रकाश रसायन: \\[\\ce{CH4 + Cl2 ->[h\\nu] CH3Cl + HCl}\\]</p>
      <p>बफर सिस्टम: \\[\\ce{CH3COOH + CH3COO- + H2O}\\]</p>
    </div>
    <p><strong style="color: #26C6DA;">याद रखने का तरीका:</strong> सारणिक विधि को <strong>'साइन-कॉन्वेन्शन'</strong> के साथ याद रखें, जहाँ आप पहले बिंदु के निर्देशांक से शुरू करते हैं और घड़ी की विपरीत दिशा में चलते हैं, और अंत में पहले बिंदु पर वापस आते हैं। 🎯</p>
    <div style="background-color: #F3E5F5; border-left: 4px solid #9C27B0; padding: 12px; margin: 10px 0; border-radius: 5px;">
      <p><strong style="color: #9C27B0;">निष्कर्ष:</strong></p>
      <p>यह विधि बहुत प्रभावी है और सभी प्रकार के त्रिभुजों के लिए काम करती है। अभ्यास करते रहें! 🚀</p>
    </div>
  `;

  // Scroll handler for showing/hiding scroll buttons
const handleScroll = () => {
  if (!contentRef.current) return;

  const { scrollTop, scrollHeight, clientHeight } = contentRef.current;

  // Agar end tak scroll kar liya (tolerance 5px rakha for safety)
  const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

  setShowScrollToTop(isAtBottom);      // sirf neeche pohche tab "Go to Top"
  setShowScrollToBottom(!isAtBottom);  // warna hamesha "Go to Bottom"
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
    <div className="absolute w-screen h-screen bg-zinc-900/60 flex justify-center items-center z-50">
      <div className="w-[100vw] h-[100vh] bg-white overflow-hidden flex flex-col relative">
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
          <div dangerouslySetInnerHTML={{ __html: response }} ref={containerRef} />

          {/* Hamesha neeche render hoga */}
          <Global_like_dislike_response />
        </div>


        {/* Scroll to Top Button */}
         {showScrollToTop && (
          <div className="absolute bottom-10 right-24 group">
            <button
              onClick={scrollToTop}
              className="bg-[#000000CC] hover:bg-zinc-600 text-white rounded-full p-1 py-1.5 px-3 shadow-lg transition-all duration-300 transform hover:scale-110"
            >
              <p className='text-sm flex items-center'>Upar jayein <p className='text-xl'><IoIosArrowRoundUp /></p>
 </p>
            </button>
            {/* Tooltip */}
           
          </div>
        )}


        {/* Scroll to Bottom Button */}
        {showScrollToBottom && (
          <div className="absolute bottom-10 right-24 group ">
            <button
              onClick={scrollToBottom}
              className="bg-[#000000CC]  text-white rounded-full p-1 py-1.5 px-3 shadow-lg transition-all duration-300 transform hover:scale-110"
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