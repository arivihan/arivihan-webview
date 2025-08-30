// App.jsx
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import "katex/dist/katex.min.css";

// -------------------- Canvas-based SMILES Renderer --------------------
const SmilesRenderer = ({ smiles, width = 200, height = 200 }) => {
  const canvasRef = useRef(null);
  const idRef = useRef(`smiles-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    const loadDrawer = () =>
      new Promise((resolve, reject) => {
        if (window.SmiDrawer) return resolve();
        const script = document.createElement("script");
        script.src =
          "https://unpkg.com/smiles-drawer@2.0.1/dist/smiles-drawer.min.js";
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });

    loadDrawer().then(() => {
      if (!window.SmiDrawer) return;
      const drawer = new window.SmiDrawer({ width, height });
      try {
        drawer.draw(smiles, `#${idRef.current}`, "light", false);
      } catch {
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          ctx.clearRect(0, 0, width, height);
          ctx.font = "16px Arial";
          ctx.fillStyle = "red";
          ctx.fillText("Invalid SMILES", 10, 50);
        }
      }
    });
  }, [smiles, width, height]);

  return (
    <canvas
      id={idRef.current}
      ref={canvasRef}
      width={width}
      height={height}
      style={{ margin: "0 auto", display: "block" }}
    />
  );
};

// -------------------- Dummy Data --------------------
// const dummySmiles = [
//   "CCO", "C1CCCCC1", "CC(=O)O", "c1ccccc1", "CCN", "CCCl", "CCBr", "C=O", "C#N",
//   "CCOCC", "CC(C)O", "CC(C)C", "CCC", "CCCC", "CC(C)C(=O)O", "CC(C)CO", "CCOCCO",
//   "CC(C)N", "CC(C)(C)O", "CCOC", "CCS", "CC(C)S", "C=CC", "CC(C)=O", "CC(C)Cl",
//   "CC(C)Br", "CC(C)I", "CCC(C)O", "CC(C)F", "CC(C)(C)F", "CC(C)CCl", "CC(C)CBr",
//   "CC(C)CI", "CC(C)CN", "CC(C)COC", "CC(C)COCC", "CC(C)(C)CO", "CC(C)(C)COC",
//   "CC(C)C(C)O", "CC(C)C(C)CO", "CC(C)CCO", "CC(C)CC", "CC(C)CCC", "CC(C)CCCC",
//   "CC(C)CC(C)O", "CC(C)C(=O)O", "CC(C)(C)C(=O)O", "CC(C)(C)CCO", "CC(C)(C)COC",
//   "CC(C)C(N)O", "CC(C)C(O)C", "CC(C)(O)C", "CC(C)C(C)N", "CC(C)C(C)Cl", "CC(C)C(C)Br",
//   "CC(C)C(C)F", "CC(C)C(C)I", "CC(C)C(C)OC", "CC(C)C(C)OCC", "CC(C)(C)C(C)O",
//   "CC(C)(C)C(C)OC", "CC(C)C(C)C(C)O", "CC(C)C(C)C(C)OC", "CC(C)C(C)C(C)CO",
//   "CC(C)C(C)C(C)COC", "CC(C)C(C)C(C)C", "CC(C)C(C)C(C)CC", "CC(C)C(C)C(C)CCC",
//   "CC(C)C(C)C(C)CCCC", "CC(C)C(C)C(C)CCO", "CC(C)C(C)C(C)COC", "CC(C)C(C)C(C)C(C)O",
//   "CC(C)C(C)C(C)C(C)OC", "CC(C)C(C)C(C)C(C)CO", "CC(C)C(C)C(C)C(C)C", "CC(C)C(C)C(C)C(C)CC",
//   "CC(C)C(C)C(C)C(C)CCC", "CC(C)C(C)C(C)C(C)CCCC", "CC(C)C(C)C(C)C(C)CCO", "CC(C)C(C)C(C)C(C)COC",
//   "CC(C)C(C)C(C)C(C)C(C)O", "CC(C)C(C)C(C)C(C)C(C)OC", "CC(C)C(C)C(C)C(C)C(C)CO",
//   "CC(C)C(C)C(C)C(C)C(C)C", "CC(C)C(C)C(C)C(C)C(C)CC", "CC(C)C(C)C(C)C(C)C(C)CCC",
//   "CC(C)C(C)C(C)C(C)C(C)CCCC", "CC(C)C(C)C(C)C(C)C(C)CCO", "CC(C)C(C)C(C)C(C)C(C)COC",
//   "CC(C)C(C)C(C)C(C)C(C)C(C)O", "CC(C)C(C)C(C)C(C)C(C)C(C)OC", "CC(C)C(C)C(C)C(C)C(C)C(C)CO",
//   "CC(C)C(C)C(C)C(C)C(C)C(C)C", "CC(C)C(C)C(C)C(C)C(C)C(C)CC", "CC(C)C(C)C(C)C(C)C(C)C(C)CCC",
//   "CC(C)C(C)C(C)C(C)C(C)C(C)CCCC", "CC(C)C(C)C(C)C(C)C(C)C(C)CCO", "CC(C)C(C)C(C)C(C)C(C)C(C)COC",
//   "CC(C)C(C)C(C)C(C)C(C)C(C)C(C)O", "CC(C)C(C)C(C)C(C)C(C)C(C)C(C)OC", "CC(C)C(C)C(C)C(C)C(C)C(C)C(C)CO"
// ];

const dummySmiles = [
  "CCO",             // Ethanol
  "C1CCCCC1",        // Cyclohexane
  "CC(=O)O",         // Acetic acid
  "c1ccccc1",        // Benzene
  "c1ccncc1",        // Pyridine
  "c1ccccc1O",       // Phenol
  "c1ccccc1C(=O)O",  // Benzoic acid
  "c1ccccc1C",       // Toluene
  "c1ccccc1N",       // Aniline
  "CNC",             // Methylamine
  "CCN",             // Ethylamine
  "CCCN",            // Propylamine
  "C=O",             // Formaldehyde
  "CC(=O)C",         // Acetone
  "CCOC",            // Ethyl methyl ether
  "CCOCC",           // Diethyl ether
  "COC",             // Methoxy methane
  "CC(=O)OC",        // Methyl acetate
  "CC(=O)OCC",       // Ethyl acetate
  "CCS",             // Ethanethiol
  "CC(C)O",          // Isopropanol
  "CC(C)(C)O",       // Tert-butanol
  "C1=CC=CC=C1O",    // Phenol
  "C1=CC=CC=C1C(=O)O", // Benzoic acid
  "c1ccccc1C(=O)C",  // Acetophenone
  "C1CC1",           // Cyclopropane
  "C1CCC1",          // Cyclobutane
  "C1CCCC1",         // Cyclopentane
  "C1CCOCC1",        // Tetrahydropyran
  "C1=CC=CN=C1",     // Pyridine
  "C1=CC=CO1",       // Furan
  "C1=CC=CS1",       // Thiophene
  "CC(C)C(=O)O",     // Isobutyric acid
  "CC(C)C(=O)N",     // Isobutyramide
  "CC(C)C(=O)Cl",    // Isobutyryl chloride
  "CC(C)CC",          // Isopentane
  "CCC(C)C",         // Pentane isomer
  "CC(C)C(C)O",      // 2-Butanol
  "CC(C)C(C)C",      // 2-Methylbutane
  "CC(C)C(C)N",      // 2-Aminobutane
  "CC(C)(C)C(=O)O",  // Pivalic acid
  "CC(C)(C)CO",      // Tert-butyl alcohol
  "CC(C)(C)CN",      // Tert-butylamine
  "CC(C)(C)CBr",     // Tert-butyl bromide
  "CC(C)(C)CI",      // Tert-butyl iodide
  "CC(C)C(C)Cl",     // Sec-butyl chloride
  "CC(C)C(C)Br",     // Sec-butyl bromide
  "CC(C)C(C)I",      // Sec-butyl iodide
  "CC(C)C(C)F",      // Sec-butyl fluoride
  "CC(C)(C)C(C)O",   // Tert-pentyl alcohol
  "CC(C)(C)C(C)N",   // Tert-pentylamine
  "CC(C)(C)C(C)Cl",  // Tert-pentyl chloride
  "CC(C)(C)C(C)Br",  // Tert-pentyl bromide
  "CC(C)(C)C(C)I",   // Tert-pentyl iodide
  "CC(C)(C)C(C)F",   // Tert-pentyl fluoride
  "C1=CC=C2C=CC=CC2=C1", // Naphthalene
  "C1=CC=C2C=CC=CN2C1",  // Quinoline
  "C1=CC=C2C=CC=CO2C1",  // Isochromene
  "CC1=CC=CC=C1",         // Methylbenzene (toluene)
  "CC(C)=O",               // Acetone
  "CC(C)(C)=O",            // Pivaldehyde
  "C1=CC=C(C=C1)O",        // Phenol
  "C1=CC=C(C=C1)N",        // Aniline
  "C1=CC=C(C=C1)C(=O)O",   // Benzoic acid
  "CC(=O)NC",               // Acetamide
  "CC(C)C(=O)NC",           // Isobutyramide
  "CC(C)(C)C(=O)NC",        // Pivalamide
  "CCN(CC)CC",               // Diethylamine
  "CCOCCO",                  // Diethylene glycol
  "CC(C)OCC",                // Isopropyl ethyl ether
  "CC(C)(C)OCC",             // Tert-butyl ethyl ether
  "CC(C)C(C)C(=O)O",         // 2-Methylbutanoic acid
  "CC(C)C(C)C(=O)N",         // 2-Methylbutyramide
  "CC(C)(C)C(C)(C)O",        // Tert-pentyl alcohol
  "CC(C)(C)C(C)(C)N",        // Tert-pentylamine
  "CC(C)(C)C(C)(C)Cl",       // Tert-pentyl chloride
  "CC(C)(C)C(C)(C)Br",       // Tert-pentyl bromide
  "CC(C)(C)C(C)(C)I",        // Tert-pentyl iodide
  "CC(C)(C)C(C)(C)F",        // Tert-pentyl fluoride
  "C1CC2CCC1C2",             // Bicyclo[2.2.0]hexane
  "C1CC2CCCCC2C1",           // Bicyclo[2.2.1]heptane
  "NCCO",                     // Ethanolamine
  "CC(C)CO",                  // Isobutanol
  "CC(C)C(C)CO",              // 2-Methyl-1-propanol
  "C1=CC=C(C=C1)C(C)O",       // Benzyl alcohol
  "C1=CC=C(C=C1)CCO",         // Phenethyl alcohol
  "C1=CC=C(C=C1)CC(=O)O",     // Phenylacetic acid
  "C1=CC=C(C=C1)C(=O)O",      // Benzoic acid
  "CC(C)C(=O)O",               // Isobutyric acid
  "CC(C)CC(=O)O",              // Valeric acid
  "CC(C)C(C)C(=O)O",           // 2-Methylbutanoic acid
  "CC(C)(C)CC(=O)O",           // Pivalic acid
  "CC(C)(C)C(C)C(=O)O",        // Tert-pentanoic acid
  "CC(C)N",                     // Isopropylamine
  "CC(C)CCN",                   // Butylamine
  "CC(C)C(C)CN",                 // 2-Methylpropylamine
  "CC(C)(C)CN",                   // Tert-butylamine
  "NCC(=O)O",                     // Glycine
  "N[C@@H](C)C(=O)O",            // L-Alanine
  "N[C@@H](CCO)C(=O)O",          // Serine
  "N[C@@H](CC1=CC=CC=C1)C(=O)O", // Phenylalanine
  "N[C@@H](CC(=O)O)C(=O)O",      // Aspartic acid
  "NC(C(=O)O)C(=O)O",            // Glycolic acid
];


// -------------------- Main App --------------------
const App = () => {
  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>Chemical Structures</h2>
      {dummySmiles.map((smiles, idx) => (
        <div key={idx} style={{ marginBottom: "2rem" }}>
          <p style={{ textAlign: "center" }}>{smiles}</p>
          <SmilesRenderer smiles={smiles} />
        </div>
      ))}
    </div>
  );
};

export default App;
