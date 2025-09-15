import React, { useLayoutEffect, useRef, useState, useEffect, useCallback, useMemo } from "react";
import gsap from "gsap";
import confetti from "canvas-confetti";
// import { Canvas } from "@react-three/fiber";
import { IoIosArrowBack } from "react-icons/io";
import { GoCheckCircleFill } from "react-icons/go";
import { MdLock } from "react-icons/md";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { BsFillSkipForwardFill } from "react-icons/bs";
import { motion } from "framer-motion";
import { openAppActivity } from '../../utils/instantGuruUtilsDev'
gsap.registerPlugin(ScrollToPlugin);
import { Canvas, useFrame } from 'https://esm.sh/@react-three/fiber'
import htm from 'https://esm.sh/htm'


// Node type to icon mapping
const NODE_TYPE_ICONS = {
  QUICK_REVISION_LECTURE: "/img1.png",
  CHAPTER_WISE_TEST: "/img2.png",
  TEST_ANALYSIS: "/img3.png",
  WEAK_TOPIC_PRACTICE: "/img4.png",
  PERSONAL_VIDEO_MESSAGE: "/img1.png",
};

// Sample API Response Data
const apiResponse = {
  activeNodes: 6,
  completedNodes: 3,
  completionPercentage: 30,
  currentNodeId: "node-3",
  sections: [
    {
      nodes: [
        {
          ctaAction: "OPEN_LECTURE",
          estimatedDurationMinutes: 45,
          isOptional: false,
          lockedReason: null,
          locked: true,
          nodeId: "node-1",
          nodeStatus: "not",
          nodeType: "QUICK_REVISION_LECTURE",
          subtitle: "Lectures",
          title: "Quick Revision",
          userNodeCompletedDate: "2025-09-01T10:45:39.059Z",
          userNodeId: "user-node-1",
          userNodeStartDate: "2025-09-01T09:45:39.059Z",
          userSequencePosition: 1,
          screenClassName:"arivihan.technologies.doubtbuzzter2.activity.ToppersNotesActivity",
          navigationParams:{
            ncertSolutions : true
          }

        },
        {
          ctaAction: "START_TEST",
          estimatedDurationMinutes: 60,
          isOptional: false,
          lockedReason: null,
          locked: false,
          nodeId: "node-2",
          nodeStatus: "COMPLETED",
          nodeType: "CHAPTER_WISE_TEST",
          subtitle: "Test",
          title: "Chapterwise",
          userNodeCompletedDate: "2025-09-02T10:45:39.059Z",
          userNodeId: "user-node-2",
          userNodeStartDate: "2025-09-02T09:45:39.059Z",
          userSequencePosition: 2,
          // skipped: true,
        },
      ],
    },
    {
      nodes: [
        {
          ctaAction: "OPEN_ANALYSIS",
          estimatedDurationMinutes: 30,
          isOptional: true,
          lockedReason: null,
          locked: false,
          nodeId: "node-3",
          nodeStatus: "COMPLETED",
          nodeType: "TEST_ANALYSIS",
          subtitle: "Reports",
          title: "Test Analysis",
          userNodeCompletedDate: "2025-09-03T10:45:39.059Z",
          userNodeId: "user-node-3",
          userNodeStartDate: "2025-09-03T09:45:39.059Z",
          userSequencePosition: 3,
        },
      ],
    },
    {
      nodes: [
        {
          ctaAction: "START_TEST",
          estimatedDurationMinutes: 180,
          isOptional: false,
          lockedReason: null,
          locked: false,
          nodeId: "node-5",
          nodeStatus: "COMPLETED",
          nodeType: "CHAPTER_WISE_TEST",
          subtitle: "Full Syllabus",
          title: "Mock Exam",
          userNodeCompletedDate: null,
          userNodeId: "user-node-5",
          userNodeStartDate: "2025-09-05T09:45:39.059Z",
          userSequencePosition: 5,
        },
        {
          ctaAction: "START_TEST",
          estimatedDurationMinutes: 180,
          isOptional: true,
          lockedReason: null,
          locked: false,
          nodeId: "node-6",
          nodeStatus: "COMPLETED",
          nodeType: "CHAPTER_WISE_TEST",
          subtitle: "Final Goal",
          title: "AIIMS",
          userNodeCompletedDate: null,
          userNodeId: "user-node-6",
          userNodeStartDate: null,
          userSequencePosition: 6,
        },
      ],
    },
    {
      nodes: [
        {
          ctaAction: "SUBSCRIBE",
          estimatedDurationMinutes: 60,
          isOptional: false,
          lockedReason: "Complete previous levels",
          locked: false,
          nodeId: "node-7",
          nodeStatus: "COMPLETED",
          nodeType: "QUICK_REVISION_LECTURE",
          subtitle: "Advanced Topics",
          title: "Extra Level 1",
          userNodeCompletedDate: null,
          userNodeId: "user-node-7",
          userNodeStartDate: null,
          userSequencePosition: 7,
        },
        {
          ctaAction: "SUBSCRIBE",
          estimatedDurationMinutes: 60,
          isOptional: false,
          lockedReason: "Complete previous levels",
          locked: true,
          nodeId: "node-7",
          nodeStatus: "COMPLETED",
          nodeType: "QUICK_REVISION_LECTURE",
          subtitle: "Advanced Topics",
          title: "Extra Level 1",
          userNodeCompletedDate: null,
          userNodeId: "user-node-7",
          userNodeStartDate: null,
          userSequencePosition: 8,
          skipped: true,
        },
      ],
    },
  ],
  selectedLanguage: "en",
  subjectId: "physics",
  totalNodes: 7,
};

// Transform API data to levels format
const transformApiToLevels = (apiData) => {
  const levels = [];
  if (!apiData || !Array.isArray(apiData.sections)) return levels;

  apiData.sections.forEach((section) => {
    section.nodes.forEach((node) => {
      levels.push({
        id: node.nodeId,
        title: node.title,
        subtitle: node.subtitle,
        icon: NODE_TYPE_ICONS[node.nodeType] || "/img1.png",
        completed: node.nodeStatus === "COMPLETED",
        active: node.nodeStatus === "ACTIVE" && node.nodeId === apiData.currentNodeId,
        locked: !!node.locked,
        lockedReason: node.lockedReason,
        estimatedMinutes: node.estimatedDurationMinutes,
        isOptional: node.isOptional,
        ctaAction: node.ctaAction,
        position: node.userSequencePosition,
        skipped: !!node.skipped,
      });
    });
  });

  // pad to at least 20 for demo
  while (levels.length < 50) {
    levels.push({
      id: `extra-${levels.length + 1}`,
      title: `Extra Level ${levels.length - 6}`,
      subtitle: "Bonus",
      icon: "/img3.png",
      completed: true,
      active: false,
      locked: false,
      lockedReason: "Complete previous levels",
      position: levels.length + 1,
    });
  }

  return levels;
};


// Paths
const PATHS = [
  "M199.347 1C193.032 11.8776 82.1564 72.5807 82.1564 137.274C82.1564 201.966 504.475 103.814 475.582 247.194C447.118 388.449 50.3132 242.596 33.8943 336.487C17.4753 430.377 73.0466 434.975 146.57 434.975C220.092 434.975 408.374 433.24 420.373 483.047C420.373 534 406.354 521.634 297.23 534",
  "M289.5 535C283 537 -2 563.001 29.5 703.5C61 843.999 475.351 614.356 446.613 823.128C418.302 1028.81 23.2098 844.324 6.8788 981.035C-9.45224 1117.75 45.8215 1124.44 118.951 1124.44C192.08 1124.44 379.354 1121.92 391.288 1194.44C402.652 1337.75 307.369 1248.13 198.83 1266.13",
  "M194 1269C173 1272.5 84.5 1326.27 80.2833 1463.67C76.0666 1601.06 502.602 1419.03 473.709 1627.44C445.245 1832.76 48.4402 1620.76 32.0212 1757.23C15.6023 1893.71 71.1736 1900.39 144.696 1900.39C218.219 1900.39 406.501 1897.87 418.5 1970.26C418.5 2044.33 404.48 2026.35 295.357 2044.33",
  "M288.5 2045.5C251 2048.67 44 1967.36 44 2151.9C44 2336.44 475.763 2126.86 447 2335.27C418.664 2540.59 23.2266 2356.43 6.88132 2492.9C-9.464 2629.38 45.8581 2636.06 119.051 2636.06C192.244 2636.06 379.682 2633.54 391.627 2705.94C396.028 2723.14 377.67 2762.02 269.036 2780",
  "M263 2781.5C228 2787.5 65 2792 53.1564 2916.27C41.3127 3040.55 475.475 2882.81 446.582 3026.19C418.118 3167.45 21.3132 3021.6 4.8943 3115.49C-11.5247 3209.38 44.0466 3213.97 117.57 3213.97C191.092 3213.97 379.374 3212.24 391.373 3262.05C391.373 3313 377.354 3300.63 268.23 3313",
];

const CHECKPOINTS = [
  { seg: 0, t: 0.0 },
  { seg: 0, t: 0.33 },
  { seg: 0, t: 0.65 },
  { seg: 0, t: 0.88 },
  { seg: 1, t: 0.12 },
  { seg: 1, t: 0.40 },
  { seg: 1, t: 0.65 },
  { seg: 1, t: 0.88 },
  { seg: 2, t: 0.12 },
  { seg: 2, t: 0.36 },
  { seg: 2, t: 0.63 },
  { seg: 2, t: 0.92 },
  { seg: 3, t: 0.30 },
  { seg: 3, t: 0.36 },
  { seg: 3, t: 0.85 },
  { seg: 4, t: 0.95 },
];

const FIXED_POSITIONS = [
  { x: "2vw", y: 3 },
  { x: "auto", right: "2vw", y: 170 },
  { x: "2vw", y: 320 },
  { x: "auto", right: "2vw", y: 450 },
  { x: "2vw", y: 600 },
  { x: "auto", right: "2vw", y: 780 },
  { x: "1vw", y: 1000 },
  { x: "auto", right: "2vw", y: 1200 },
  { x: "2vw", y: 1440 },
  { x: "auto", right: "2vw", y: 1650 },
  { x: "2vw", y: 1800 },
  { x: "auto", right: "2vw", y: 2020 },
  { x: "8vw", y: 2140 },
  { x: "auto", right: "2vw", y: 2340 },
  { x: "2vw", y: 2550 },
  { x: "auto", right: "4vw", y: 2770 },
];

function LevelPage({ pageLevels, apiData, onScrollBottomChange ,pageIndex,totalPages }) {
  const pathRefs = useRef([]);
  const progressRefs = useRef([]);
  const pointerRef = useRef(null);
  const rootRef = useRef(null);
  const [toast, setToast] = useState(null);
  const [animateKey, setAnimateKey] = useState(0);
  const [checkpointPoints, setCheckpointPoints] = useState([]);
   const [popupOpen, setPopupOpen] = useState(false);
  const visibleCheckpoints = useMemo(
  () => CHECKPOINTS.slice(0, pageLevels.length),
  [pageLevels.length]
);
 const maxVisibleSeg = useMemo(
  () => visibleCheckpoints[visibleCheckpoints.length - 1]?.seg ?? 0,
  [visibleCheckpoints]
);
 
  // const lastPos = FIXED_POSITIONS[pageLevels.length -1] || { y: 0 };
 const contentHeight = useMemo(() => {
  const lastPos = FIXED_POSITIONS[pageLevels.length - 1] || { y: 0 };
  return lastPos.y;
}, [pageLevels.length]);
   
  const isLastPage = pageIndex === totalPages - 1;
const allCompleted = pageLevels.length > 0 && pageLevels.every(lvl => lvl.completed);


  useEffect(() => {
    setAnimateKey((prev) => prev + 1);
  }, [pageLevels]);

  // ensure refs arrays exist
  useEffect(() => {
    if (!pathRefs.current || pathRefs.current.length < PATHS.length) {
      pathRefs.current = Array(PATHS.length).fill(null);
    }
    if (!progressRefs.current || progressRefs.current.length < PATHS.length) {
      progressRefs.current = Array(PATHS.length).fill(null);
    }
  }, []);

  // Scroll detection: notify parent whether current page is scrolled to bottom
  useEffect(() => {
    if (!rootRef.current || typeof onScrollBottomChange !== "function") return;

    const el = rootRef.current;
    let ticking = false;

    const checkBottom = () => {
      const scrollTop = el.scrollTop;
      const clientHeight = el.clientHeight;
      const scrollHeight = el.scrollHeight;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 6; // 6px tolerance
      onScrollBottomChange(Boolean(atBottom));
    };

    const handler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkBottom();
          ticking = false;
        });
        ticking = true;
      }
    };

    // initial check
    checkBottom();

    el.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);

    return () => {
      el.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, [onScrollBottomChange]);
  

const lastCompletedIndex = useMemo(
  () => pageLevels.map((l) => l.completed).lastIndexOf(true),
  [pageLevels]
);
useLayoutEffect(() => {
  if (!pathRefs.current.length || !pointerRef.current || lastCompletedIndex < 0) return;

  const targetCP = CHECKPOINTS[Math.min(lastCompletedIndex, CHECKPOINTS.length - 1)];
  const path = pathRefs.current[targetCP.seg];
  if (!path) return;

  try {
    const segLen = path.getTotalLength();
    const lenAtT = Math.max(0, Math.min(1, targetCP.t));
    const point = path.getPointAtLength(lenAtT);

    const svg = path.ownerSVGElement;
    if (!svg) return;

    const pt = svg.createSVGPoint();
    pt.x = point.x;
    pt.y = point.y;
    const transformedPoint = pt.matrixTransform(path.getCTM());

    const pw = pointerRef.current.offsetWidth || 50;
    const ph = pointerRef.current.offsetHeight || 50;

    const targetX = transformedPoint.x - pw / 2;
    const targetY = transformedPoint.y - ph / 2;

    gsap.set(pointerRef.current, { x: targetX, y: targetY });

    const viewportCenter = window.innerHeight / 2;
  rootRef.current.scrollTo({
  top: Math.max(0, targetY - viewportCenter),
  behavior: "smooth",
});

  } catch (err) {
    console.log(err);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [pageLevels, animateKey]);

 const autoScrollEnabled = useRef(true);

      useEffect(() => {
  const handleUserScroll = () => {
    autoScrollEnabled.current = false;
    gsap.killTweensOf(rootRef.current); // agar koi animation chal rahi hai to turant stop
  };

  const el = rootRef.current;
  if (el) {
    el.addEventListener("wheel", handleUserScroll, { passive: true });
    el.addEventListener("touchmove", handleUserScroll, { passive: true }); // mobile ke liye
  }

  return () => {
    if (el) {
      el.removeEventListener("wheel", handleUserScroll);
      el.removeEventListener("touchmove", handleUserScroll);
    }
  };
}, []);

  
  const initialPageIndex = Math.floor(lastCompletedIndex / 16); // 16 levels per page

      const animatedLevels = new Set();

    const animateSegment = useCallback( (segIndex, toOffset, onComplete) => {
      const path = pathRefs.current[segIndex];
      const prog = progressRefs.current[segIndex];
      if (!path || !prog) return onComplete && onComplete();

      let segLen;
      try {
        segLen = path.getTotalLength();
      } catch (err) {
        onComplete && onComplete();
        return;
      }

      if (pointerRef.current) {
        try {
          const startPoint = path.getPointAtLength(0);
          const svg = path.ownerSVGElement;
          if (svg) {
            const pt = svg.createSVGPoint();
            pt.x = startPoint.x;
            pt.y = startPoint.y;
            const transformedPoint = pt.matrixTransform(path.getCTM());
            const pw = pointerRef.current.offsetWidth || 50;
            const ph = pointerRef.current.offsetHeight || 50;
            gsap.set(pointerRef.current, {
              x: transformedPoint.x - pw / 2,
              y: transformedPoint.y - ph / 2,
            });
          }
        } catch (err) {
          // ignore
        }
      }
       




      gsap.to(prog, {
        strokeDashoffset: toOffset,
        duration: 8,
        ease: "none",
        onUpdate: () => {
          try {
            const offset = parseFloat(gsap.getProperty(prog, "strokeDashoffset"));
            const point = path.getPointAtLength(Math.max(0, Math.min(segLen, segLen - offset)));
            if (pointerRef.current) {
              const svg = path.ownerSVGElement;
              if (svg) {
                const pt = svg.createSVGPoint();
                pt.x = point.x;
                pt.y = point.y;
                const transformedPoint = pt.matrixTransform(path.getCTM());
                const pw = pointerRef.current.offsetWidth || 50;
                const ph = pointerRef.current.offsetHeight || 50;

                gsap.set(pointerRef.current, {
                  x: transformedPoint.x - pw / 2,
                  y: transformedPoint.y - ph / 2,
                });

CHECKPOINTS.forEach((cp) => {
  if (!autoScrollEnabled.current) return; // agar user scroll kar raha hai to skip

  const cpPath = pathRefs.current[cp.seg];
  if (!cpPath) return;

  try {
    const cpSegLen = cpPath.getTotalLength();
    const cpLen = cpSegLen * cp.t;

    if (Math.abs(segLen - offset - cpLen) < 3) {
      if (rootRef.current) {
        gsap.to(rootRef.current, {
          scrollTo: {
            y: transformedPoint.y - rootRef.current.clientHeight / 2,
          },
          duration: 1.2,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    }
  } catch (err) {
    // ignore
  }
});

              }
            }
          } catch (err) {
            // ignore
          }
        },
        onComplete,
      });
    }, [pageLevels, lastCompletedIndex]);
   
  useLayoutEffect(() => {
    if (!pathRefs.current.length || !progressRefs.current.length) return;

    const lastCompletedIdx = pageLevels.map((l) => l.completed).lastIndexOf(true);
    if (lastCompletedIdx < 0) return;

    const targetCP = CHECKPOINTS[Math.min(lastCompletedIdx, CHECKPOINTS.length-1 )];
    if (!targetCP) return;

    const targetSeg = targetCP.seg;
    const elementsPerPage = pageLevels.length;
let targetT;

const allCompleted = pageLevels.every((lvl) => lvl.completed);

if (elementsPerPage === 16 && allCompleted) {
  targetT = Math.max(0, Math.min(1, targetCP.t - 0.7));
}
else if (elementsPerPage === 16 && !allCompleted) {
  targetT = Math.max(0, Math.min(1, targetCP.t-0.7));
}
else {
  targetT = Math.max(0, Math.min(1, targetCP.t+0.7));
}


 

    progressRefs.current.forEach((prog) => {
      if (!prog) return;
      try {
        const segLen = prog.getTotalLength();
        gsap.set(prog, { strokeDasharray: segLen, strokeDashoffset: segLen });
      } catch (err) {
        // ignore
      }
    });

 

    const run = (segIdx = 0) => {
      if (segIdx > targetSeg) return;

      const prog = progressRefs.current[segIdx];
      if (!prog) {
        run(segIdx + 1);
        return;
      }

      let segLen;
      try {
        segLen = prog.getTotalLength();
      } catch (err) {
        run(segIdx + 1);
        return;
      }

      if (segIdx < targetSeg) {
        animateSegment(segIdx, 0, () => {
          pageLevels.forEach((lvl, i) => {
            if (i <= lastCompletedIdx && CHECKPOINTS[i] && CHECKPOINTS[i].seg === segIdx && !animatedLevels.has(lvl.id)) {
              animatedLevels.add(lvl.id);
              setTimeout(() => setToast(null), 1200);
              confetti({ particleCount: 40, spread: 60, origin: { y: 0.9 } });
            }
          });
          run(segIdx + 1);
        });
      } else {
        const targetLen = targetT * segLen;
        const toOffset = segLen - targetLen;
        animateSegment(segIdx, toOffset, () => {
          pageLevels.forEach((lvl, i) => {
            if (i <= lastCompletedIdx && !animatedLevels.has(lvl.id)) {
              animatedLevels.add(lvl.id);
              setToast(`${lvl.title} Completed!`);
              setTimeout(() => setToast(null), 1200);
              confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
            }
          });
        });
      }
    };

    run(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageLevels, animateKey]);
  

 const renderedLevels = useMemo(() => {
  return pageLevels.map((level, i) => {
    const pos = FIXED_POSITIONS[i] || { x: "2vw", y: i * 180 };
    const isActive = level.active || i === lastCompletedIndex;
      
    return (
<div
   
  key={level.id + "-" + i}
 onClick={() => {
  console.log('clicked')
    if (level.locked) {
      setPopupOpen(true); // bas state update karo
    }
    else {
      openAppActivity(level.screenClassName, level.navigationParams)
    }
  }}
  style={{
    position: "absolute",
    top: pos.y,
    left: pos.x !== "auto" ? pos.x : undefined,
    right: pos.right,
    minWidth: "45vw",
    zIndex: 99999,
    height: 50,
    borderRadius: "12px",
    background: level.locked ? "#f5f5f5" : "white",
    display: "flex",
    alignItems: "center",
    padding: "6px",
    gap: "8px",
    boxShadow: level.locked
      ? "0px 2px 8px rgba(0,0,0,0.1)"
      : "0px 4px 12px rgba(38,198,218,0.25)",
    border: isActive ? "2px solid #00D4FF" : "none",
    opacity: level.locked ? 0.7 : 1,
    cursor: "pointer", // ✅ always pointer
  }}   
> 

        <div style={{ position: "relative" }}>
          <img
            src={level.icon}
            alt="icon"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              opacity: level.completed ? 1 : level.locked ? 0.3 : 0.6,
              filter: level.locked ? "grayscale(100%)" : "none",
            }}
          />
          {level.completed && (
            <div className="absolute top-[-15px] rounded-full text-green-500 text-2xl bg-white right-[-120px] w-[30px] h-[30px] flex items-center justify-center">
              <GoCheckCircleFill />
            </div>
          )}
          {level.locked && (
            <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-gray-600 text-xl">
              <MdLock />
            </div>
          )}
          {level.skipped && (
            <div className="absolute top-[-15px] rounded-full border border-gray-300 text-gray-500 text-2xl bg-white right-[-120px] w-[30px] h-[30px] flex items-center justify-center">
              <BsFillSkipForwardFill size={15} />
            </div>
          )}
          {level.isOptional && (
            <div className="absolute top-[-15px] rounded p-1 border border-gray-300 text-gray-500 text-2xl bg-white right-[20px] w-[35px] h-[20px] flex items-center justify-center">
              <p className="text-[8px]">Optional</p>
            </div>
          )}
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: "600",
              color: level.locked ? "#999" : "#333",
            }}
          >
            {level.title}
          </span>
          <span
            style={{
              fontSize: "10px",
              color: level.locked ? "#999" : "#666",
            }}
          >
            {level.subtitle}
            {level.estimatedMinutes && ` • ${level.estimatedMinutes} min`}
          </span>
          {level.locked && level.lockedReason && (
            <span
              style={{
                fontSize: "10px",
                color: "#999",
                marginTop: "2px",
              }}
            >
              🔒 {level.lockedReason}
            </span>
          )}
        </div>
      </div>
    );
  });
}, [pageLevels, lastCompletedIndex]); // dependencies


  
  return (
    <div
      ref={rootRef}
      className="main h-[100vh] w-full relative flex flex-col overflow-y-auto"
      style={{
        height: "100vh",
        overflowY: contentHeight > window.innerHeight ? "auto" : "hidden",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* <div className="w-[100vw] h-[320vh] overflow-hidden absolute z-[9]">
        <div className="cloud-container">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`cloud cloud-${i}`}>
              <img
                src="https://imgs.search.brave.com/3wbjtHZ0SmPvsTjlSqg5bcTG14I9naMhcrhGjUA2bWE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjEv/MTU1LzUxMC9zbWFs/bC9zZXQtb2YtcmVh/bGlzdGljLWNvbG9y/LXNoYWRlLWNsb3Vk/LWlsbHVzdHJhdGlv/bi1vbi10cmFuc3Bh/cmVuY3ktYmFja2dy/b3VuZC1wbmcucG5n"
                alt="cloud"
              />
            </div>
          ))}
        </div>
      </div>  */}
 {isLastPage  && (
   <div className="absolute bottom-[20%] z-[9999] left-[30%] w-[50%]  flex items-center justify-center">
      <img src="/AIIMSHD.png" alt="img" />
   </div>
)}


      <Canvas className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} camera={{ position: [0, 1500, 1200], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 3000, 1000]} intensity={1} />
      </Canvas> 

      <div className="flex-1 mt-[4vh] ml-4 w-[90%] relative z-10">
        <svg width="340" height="3023" viewBox="0 0 495 3023" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          {PATHS.map((d, i) => {
  if (i > maxVisibleSeg) return null; // skip extra paths
  return (
    <React.Fragment key={i}>
      <path
        d={d}
        stroke="#bbb"
        strokeWidth="5"
        strokeDasharray="16 16"
        fill="transparent"
        ref={(el) => (pathRefs.current[i] = el)}
      />
      <path
        d={d}
        stroke="url(#grad)"
        strokeWidth="5"
        fill="transparent"
        ref={(el) => (progressRefs.current[i] = el)}
      />
    </React.Fragment>
  );
})}


          {checkpointPoints.map((p, idx) => (
            <circle key={idx} cx={p.x} cy={p.y} r="4" fill="white" stroke="#00D4FF" strokeWidth="1" />
          ))}

          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#26C6DA" />
              <stop offset="100%" stopColor="#00D4FF" />
            </linearGradient>
          </defs>
        </svg>

        <div ref={pointerRef} style={{ position: "absolute", top: 0, left: 0, width: 50, height: 50, pointerEvents: "none", zIndex: 50 }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", border: "3px solid #00D4FF", overflow: "hidden", background: "white" }}>
            <img
              src="https://i.pinimg.com/236x/9a/75/f8/9a75f8641f8143f3a2d58cf53bf8339b.jpg"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              alt="pointer"
            />
          </div>
        </div>

        {renderedLevels}
        {/* {popupOpen && (
  <div className="w-[90%] h-[30vh] bg-pink-700 z-[999999] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
    <button
      className="px-4 py-2 bg-white rounded"
      onClick={() => setPopupOpen(false)}
    >
      Close
    </button>
  </div>
)} */} 
{popupOpen && (
  <div className="fixed h-[100vh] inset-0 bg-black/50 flex items-center justify-center z-[999999]">
    <div className="relative w-[95vw] max-w-md bg-white select-none overflow-hidden p-4 rounded-lg shadow-lg">
      
      {/* ❌ Close Button */}
      <button
        onClick={() => setPopupOpen(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
      >
        ✕
      </button>

      {/* card Info */}
      <div className="w-full h-[16vh] overflow-hidden rounded-md bg-orange-300">
        <img className="w-full h-full object-cover" src="/thumbnail2.png" alt="" />
      </div>

      <div>
        <h1 className="font-bold mt-2 text-xl">For Subscription</h1>
        <p style={{ lineHeight: "20px" }} className="text-[14px]">
          To buy a subscription, just click on the button given below.
        </p>
      </div>

      <button className="bg-[#26C6DA] text-[15px] px-5 w-full text-white flex justify-center items-center gap-2 py-3 mt-2 rounded">
        <b>
          <p>Buy Now</p>
        </b>
      </button>
    </div>
  </div>
)}




        {toast && (
          <div
            style={{
              position: "fixed",
              bottom:"20px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#333",
              color: "white",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              zIndex: 9999,
              animation: "fadeInOut 2s ease",
            }}
          >
            {toast}
          </div>
        )}
      </div>
    </div>
  ); 
  
}

export default function LevelsContainer() {
  const [pageIndex, setPageIndex] = useState(0);
  const [apiData] = useState(apiResponse);
  const levels = useMemo(() => transformApiToLevels(apiData), [apiData]);
  const [pages, setPages] = useState([levels.slice(0, 16)]);
  const [currentPageAtBottom, setCurrentPageAtBottom] = useState(false);

  // === Auto detect completed node and redirect to its page ===
  useEffect(() => {
    const lastCompletedIndex = levels.map((lvl) => lvl.completed).lastIndexOf(true);
    if (lastCompletedIndex < 0) return;

    const requiredPage = Math.floor(lastCompletedIndex / 16);

    // agar required page abhi tak nahi bana hai, toh bana do
    if (requiredPage >= pages.length) {
      const newPages = [...pages];
      for (let i = pages.length; i <= requiredPage; i++) {
        newPages.push(levels.slice(i * 16, i * 16 + 16));
      }
      setPages(newPages);
    }

    // pageIndex update karo
    if (requiredPage !== pageIndex) {
      setPageIndex(requiredPage);
      setCurrentPageAtBottom(false);
    }
  }, [levels, apiData.selectedLanguage]);

  // Reset when language changes
  useEffect(() => {
    setPages([levels.slice(0, 16)]);
    setPageIndex(0);
    setCurrentPageAtBottom(false);
  }, [apiData.selectedLanguage, levels]);

  const hasMore = (pageIndex + 1) * 16 < levels.length;

  const loadMore = () => {
    const start = (pageIndex + 1) * 16;
    const next = levels.slice(start, start + 16);
    if (next.length > 0) {
      setPages((prev) => [...prev, next]);
      setPageIndex((prev) => prev + 1);
      setCurrentPageAtBottom(false);

      window.requestAnimationFrame(() => {
        window.scrollTo({ top: document.documentElement.scrollTop + 1 });
      });
    }
  };

  const completedCount = apiData.completedNodes;
  const totalCount = apiData.totalNodes;
  const percent = apiData.completionPercentage;

  const handlePageBottomChange = useCallback(
    (isAtBottom) => {
      setCurrentPageAtBottom(isAtBottom);
    },
    [setCurrentPageAtBottom]
  );

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex sticky top-0 z-20 bg-white gap-2 items-center p-2 shadow-md">
        <p className="text-2xl">
          <IoIosArrowBack />
        </p>
        <p className="text-lg font-bold">
          {apiData.subjectId
            ? apiData.subjectId.charAt(0).toUpperCase() + apiData.subjectId.slice(1)
            : "Physics"}{" "}
          Personalised Path
        </p>
      </div>

      {/* Progress Bar */}
      <div className="sticky shadow-md top-[45px] z-20 bg-white">
        <div className="mx-auto max-w-[520px] px-4 py-1 flex items-center justify-between">
          <div className="text-black font-semibold">Your Progress</div>
          <div className="text-xs text-gray-600">
            {completedCount}/{totalCount} completed • {apiData.activeNodes} active
          </div>
        </div>
        <div className="mx-auto flex items-center justify-between max-w-[520px] px-4 pb-3">
          <div className="h-2 w-[90%] bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#26C6DA] to-[#00D4FF] transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="text-sm text-black">
            <p className="font-semibold text-[15px]">{percent}%</p>
          </div>
        </div>
      </div>

      {/* Pages */}
      <div className="relative flex-1">
        {pages.map((pageLevels, idx) => (
          <div
            key={idx}
            className="absolute top-0 left-0 w-full h-full transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateY(${(idx - pageIndex) * 100}%)`,
              zIndex: idx === pageIndex ? 10 : 0,
            }}
          >
            <LevelPage
              pageLevels={pageLevels}
              apiData={apiData}
              pageIndex={idx}
              totalPages={apiData.sections.length}
              onScrollBottomChange={idx === pageIndex ? handlePageBottomChange : undefined}
            />
          </div>
        ))}
      </div>

      {/* Load More button */}
      {hasMore && currentPageAtBottom && (
        <div className="flex z-[99] absolute bottom-0 left-[30%] justify-center py-6">
          <button
            onClick={loadMore}
            className="px-6 py-2 rounded-lg bg-[#26C6DA] text-white font-semibold shadow-md hover:bg-[#00ACC1] transition"
          >
            <p className="text-[10px]">Load More..</p>
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="sticky bottom-0 bg-white p-3 border-t text-sm flex justify-between">
        <span>
          Completed: {completedCount}/{totalCount}
        </span>
        <span>{percent}%</span>
      </div>
    </div>
  );
}
