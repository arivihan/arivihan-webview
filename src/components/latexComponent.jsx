import renderMathInElement from 'katex/contrib/auto-render';
import React, { useEffect, useRef } from 'react'
import SmilesRenderer from './smileRenderer';
import ReactDOM from "react-dom/client";


const LatexComponent = ({ latexContent }) => {
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
    }, [latexContent]);



    return (
        <div className='w-full flex flex-col items-start gap-2 py-0'>
            <div className='w-full whitespace-normal text-[15px] overflow-x-hidden' ref={containerRef} dangerouslySetInnerHTML={{ __html: latexContent.replaceAll("(bold)<b>", "</b>").replaceAll(/(\n){2,}/g, '</br>') }}></div>
        </div>

    )
}

export default LatexComponent

