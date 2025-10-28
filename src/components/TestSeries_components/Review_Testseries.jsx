import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Clock, Menu, AlertTriangle, X } from 'lucide-react';

// KaTeX renderer for latex
const LatexRenderer = ({ text }) => {
  const containerRef = useRef(null);
  const [isKatexLoaded, setIsKatexLoaded] = useState(false);

  useEffect(() => {
    if (window.katex) {
      setIsKatexLoaded(true);
      return;
    }
    if (document.getElementById('katex-js')) {
      const checkKatex = setInterval(() => {
        if (window.katex) {
          setIsKatexLoaded(true);
          clearInterval(checkKatex);
        }
      }, 100);
      return () => clearInterval(checkKatex);
    }
    
    const katexCSS = document.createElement('link');
    katexCSS.rel = 'stylesheet';
    katexCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css';
    document.head.appendChild(katexCSS);

    const katexScript = document.createElement('script');
    katexScript.id = 'katex-js';
    katexScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js';
    katexScript.onload = () => setIsKatexLoaded(true);
    document.head.appendChild(katexScript);
  }, []);

  useEffect(() => {
    if (containerRef.current && isKatexLoaded && window.katex) {
      const container = containerRef.current;
      container.innerHTML = '';
      const parts = text.split(/(\$[^$]+\$)/g);
      parts.forEach(part => {
        if (part.startsWith('$') && part.endsWith('$')) {
          const latex = part.slice(1, -1);
          const span = document.createElement('span');
          try {
            window.katex.render(latex, span, { throwOnError: false, displayMode: false });
          } catch (e) {
            span.textContent = part;
          }
          container.appendChild(span);
        } else if (part) {
          container.appendChild(document.createTextNode(part));
        }
      });
    }
  }, [text, isKatexLoaded]);

  if (!isKatexLoaded) {
    return <span>{text}</span>;
  }

  return <span ref={containerRef} className="inline" />;
};

const ReviewTestViewer = ({ 
  userId = "2c9fab4b9a1a5d1d019a256963f626c2", 
  testId = "PHYNEETENGUNDT1", 
  testSeriesId = "PHYNEETENGUND", 
  token = "temp__b79dfeae-12a5-4a92-bb23-48378e024d88" 
}) => {
  const [testData, setTestData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const navigationRef = useRef(null);
  const touchStartRef = useRef(null);
  const solutionRef = useRef(null);
  const contentRef = useRef(null);

  const questions = testData?.testSeriesTypes?.[0]?.testSeriesQuestionList || [];
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const activeBtn = navigationRef.current?.children[currentQuestion];
    if (activeBtn) {
      const { offsetLeft, offsetWidth } = activeBtn;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [currentQuestion]);

  // Fetch test data
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const url = `https://platform-dev.arivihan.com:443/arivihan-platform/secure/testSeries/question?userId=${userId}&id=${testId}&testSeriesId=${testSeriesId}&reviewMode=true`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            accept: "*/*",
            token: token,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        setTestData(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchTestData();
  }, [userId, testId, testSeriesId, token]);

  // Touch handlers with proper vertical scroll handling
  const handleTouchStart = e => {
    const touch = e.targetTouches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      scrollTop: contentRef.current?.scrollTop || 0
    };
    setIsDragging(false);
  };

  const handleTouchMove = e => {
    if (!touchStartRef.current) return;
    
    const currentTouch = e.targetTouches[0];
    const diffX = touchStartRef.current.x - currentTouch.clientX;
    const diffY = touchStartRef.current.y - currentTouch.clientY;
    
    // Only engage horizontal swipe if horizontal movement is significantly larger than vertical
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      setIsDragging(true);
      let offset = -diffX;
      if (currentQuestion === 0 && offset > 0) offset *= 0.3;
      else if (currentQuestion === questions.length - 1 && offset < 0) offset *= 0.3;
      setDragOffset(offset);
    }
  };

  const handleTouchEnd = e => {
    if (!touchStartRef.current) return;
    
    let touchEnd = e.changedTouches ? e.changedTouches[0].clientX : null;
    if (touchStartRef.current.x != null && touchEnd != null && isDragging) {
      const swipeDistance = touchStartRef.current.x - touchEnd;
      const threshold = 50;
      if (Math.abs(swipeDistance) > threshold) {
        if (swipeDistance > 0 && currentQuestion < questions.length - 1) {
          setCurrentQuestion(q => q + 1);
          scrollNavigationToCenter(currentQuestion + 1);
        } else if (swipeDistance < 0 && currentQuestion > 0) {
          setCurrentQuestion(q => q - 1);
          scrollNavigationToCenter(currentQuestion - 1);
        }
      }
    }
    setDragOffset(0);
    setIsDragging(false);
    touchStartRef.current = null;
  };

  const navigateToQuestion = (index) => {
    if (isDragging || index === currentQuestion) return;
    setCurrentQuestion(index);
    scrollNavigationToCenter(index);
    setShowOverview(false);
  };

  const scrollToSolution = () => {
    if (solutionRef.current) {
      solutionRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const scrollNavigationToCenter = (index) => {
    if (navigationRef.current) {
      const navContainer = navigationRef.current;
      const buttons = navContainer.children;
      if (buttons[index]) {
        const button = buttons[index];
        const containerWidth = navContainer.parentElement.offsetWidth;
        const buttonLeft = button.offsetLeft;
        const buttonWidth = button.offsetWidth;
        const scrollPosition = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
        navContainer.parentElement.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')} : ${String(secs).padStart(2, '0')}`;
  };

  const getDifficultyColor = (level) => {
    switch (level?.toUpperCase()) {
      case 'EASY':
        return 'bg-[#26C6DA]/20 text-[#26C6DA]';
      case 'MEDIUM':
        return 'bg-[#26C6DA]/20 text-[#26C6DA]';
      case 'HARD':
        return 'bg-[#26C6DA]/20 text-[#26C6DA]';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getQuestionStatus = (q) => {
    if (!q.userAnswer) return 'unattempted';
    return q.correct ? 'correct' : 'incorrect';
  };

  const getAnsweredCount = () => {
    return questions.filter(q => q.userAnswer).length;
  };

  const getUnansweredCount = () => {
    return questions.filter(q => !q.userAnswer).length;
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#26C6DA] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading review...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-gray-900 font-semibold mb-2">Error loading test</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!testData || questions.length === 0) {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-900 font-semibold mb-2">No test data available</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isCorrect = question.correct;
  const userAnswer = question.userAnswer;
  const correctAnswer = question.answer;
  const questionStatus = getQuestionStatus(question);

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-white flex flex-col relative overflow-hidden">
      {/* Top bar */}
      <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm z-10">
        <ChevronLeft className="w-6 h-6 text-gray-700" />
        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="w-4 h-4" />
          <span className="text-[16px] font-semibold">
            {formatTime(question.timeTaken || 0)} Min
          </span>
        </div>
      </div>

      {/* Overview header */}
      <div className="px-4 py-3 flex items-center justify-between bg-white z-10">
        <button 
          onClick={() => setShowOverview(!showOverview)}
          className="flex items-center gap-2 text-gray-900"
        >
          <Menu className="w-5 h-5" />
          <span className="font-semibold text-base">Overview</span>
        </button>
        <AlertTriangle className="w-5 h-5 text-gray-700" />
      </div>

      {/* Full Screen Overview Panel */}
      {showOverview && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Overview Header */}
          <div className="px-4 py-4 flex items-center justify-between border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Overview</h2>
            <button 
              onClick={() => setShowOverview(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Instructions Section */}
          <div className="px-4 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-full border-2 border-[#26C6DA] flex items-center justify-center">
                <span className="text-[#26C6DA] text-xs font-bold">i</span>
              </div>
              <span className="text-gray-600 font-medium">Instructions</span>
            </div>
            
            <div className="space-y-2 ml-7">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#26C6DA]"></div>
                <span className="text-gray-700 text-sm">{getAnsweredCount()} Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <span className="text-gray-700 text-sm">{getUnansweredCount()} Unanswered</span>
              </div>
            </div>
          </div>

          {/* Questions Grid */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="grid grid-cols-5 gap-4">
              {questions.map((q, idx) => {
                const status = getQuestionStatus(q);
                const isActive = currentQuestion === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => navigateToQuestion(idx)}
                    className={`aspect-square rounded-lg flex items-center justify-center text-base font-semibold transition-all ${
                      status === 'correct'
                        ? 'bg-[#26C6DA]/70 text-gray-800'
                        : status === 'incorrect'
                        ? 'bg-[#26C6DA]/70 text-gray-800'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Navigation pills */}
      <div className="px-4 py-3 overflow-x-auto scrollbar-hide bg-white relative z-10">
        <div ref={navigationRef} className="flex gap-8 min-w-max relative">
          {questions.map((q, idx) => {
            const status = getQuestionStatus(q);
            const isActive = currentQuestion === idx;
            return (
              <button
                key={idx}
                onClick={() => navigateToQuestion(idx)}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold transition-all flex-shrink-0 relative ${
                  isActive
                    ? status === "correct"
                      ? "bg-[#C8E6C9] text-[#191919]"
                      : status === "incorrect"
                      ? "bg-[#FFCDD2] text-[#191919]"
                      : "bg-transparent text-[#191919]"
                    : status === "correct"
                    ? "bg-[#C8E6C9] text-[#191919]"
                    : status === "incorrect"
                    ? "bg-[#FFCDD2] text-[#191919]"
                    : "bg-transparent text-[#191919]"
                }`}
              >
                {idx + 1}
              </button>
            );
          })}

          {/* Animated underline */}
          <div
            className="absolute bottom-[-10px] h-[2px] bg-[#26C6DA] rounded-full transition-all duration-300 ease-in-out"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
            }}
          />
        </div>
      </div>

      {/* Swipe Questions */}
      <div
        className="flex-1 px-1 overflow-hidden relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'pan-y' }}
      >
        <div
          className={`flex h-full ${isDragging ? '' : 'transition-transform duration-300'}`}
          style={{
            transform: `translateX(calc(-${currentQuestion * (100 / questions.length)}% + ${dragOffset}px))`,
            width: `${questions.length * 100}%`,
          }}
        >
          {questions.map((q, qIndex) => (
            <div
              key={q.questionId}
              ref={qIndex === currentQuestion ? contentRef : null}
              className="flex-shrink-0 overflow-y-auto px-4 pb-4 pt-3"
              style={{ width: `${100 / questions.length}%` }}
            >
              {/* Question Type and Marks */}
              <div className="flex items-center justify-end gap-2 mb-4">
                <span className="px-3 py-1.5 bg-[#26C6DA]/20 text-[#26C6DA] text-xs font-semibold rounded-md">
                  Single-choice
                </span>
                <span className={`px-3 py-1.5 text-xs font-semibold rounded-md ${
                  q.correct ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-gray-100 text-gray-600'
                }`}>
                  +{q.score}
                </span>
                {q.negativeScore > 0 && (
                  <span className={`px-3 py-1.5 text-xs font-semibold rounded-md ${
                    !q.correct && q.userAnswer ? 'bg-[#FFEBEE] text-[#C62828]' : 'bg-gray-100 text-gray-600'
                  }`}>
                    -{q.negativeScore}
                  </span>
                )}
              </div>

              {/* Question Text */}
              <div className="mb-4">
                <p className="text-gray-900 font-semibold text-[15px] leading-relaxed">
                  <LatexRenderer text={q.questionText} />
                </p>
              </div>

              {/* Your Submitted Answer Label */}
              {userAnswer && (
                <div className="text-sm text-gray-500 mb-3 font-normal">
                  Your submitted answer
                </div>
              )}

              {/* Options */}
              <div className="space-y-3 mb-2">
                {q.options && q.options.map((option, idx) => {
                  const isUserAnswer = userAnswer === option;
                  const isCorrectAnswer = correctAnswer === option;
                  
                  let borderColor = 'border-gray-200';
                  let bgColor = 'bg-white';
                  
                  if (isUserAnswer && !isCorrect) {
                    borderColor = 'border-[#A90202]';
                    bgColor = 'bg-[#FFF5F5]';
                  } else if (isUserAnswer && isCorrect) {
                    borderColor = 'border-[#189C4D]';
                    bgColor = 'bg-[#DAF2E4]';
                  } else if (isCorrectAnswer && !isCorrect) {
                    borderColor = 'border-[#189C4D]';
                    bgColor = 'bg-[#DAF2E4]';
                  }
                  
                  return (
                    <div
                      key={idx}
                      className={`w-full text-left px-4 py-3 rounded-xl border ${borderColor} ${bgColor}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-semibold text-gray-700 mt-0.5 text-sm">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-gray-900 flex-1 text-[15px] leading-relaxed">
                          <LatexRenderer text={option} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Solution Section */}
              <div ref={qIndex === currentQuestion ? solutionRef : null} className="relative bg-white pt-5 mt-6">
                <div className="mb-3">
                  <h3 className="text-base font-bold text-gray-900 mb-2">Solution</h3>
                  <span className={`inline-block px-3 py-1 rounded-md text-xs font-semibold capitalize ${getDifficultyColor(q.difficultyLevel)}`}>
                    {q.difficultyLevel || 'Medium'}
                  </span>
                </div>
                
                <button
                  onClick={qIndex === currentQuestion ? scrollToSolution : undefined}
                  className="w-[40vw] sticky transform left-[50%] -translate-x-[50%] top-2 bg-gray-800 text-white py-1 rounded-lg font-medium text-sm flex items-center justify-center gap-2 mb-4 hover:bg-gray-700 transition-colors"
                >
                  View Solution
                  <span className="text-xs">▼</span>
                </button>

                <div className=" rounded-xl p-4 mt-3">
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    <LatexRenderer text={q.explanation || 'No explanation available'} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-4 flex w-screen justify-between items-end bg-white gap-4 shadow-sm z-10">
        <button
          className="w-[40%] bg-white   text-gray-700 py-3.5 rounded-xl font-semibold text-base hover:bg-gray-50 transition-all"
        >
         
        </button>
        <button
          onClick={() => {
            if (currentQuestion < questions.length - 1) {
              setCurrentQuestion(currentQuestion + 1);
              scrollNavigationToCenter(currentQuestion + 1);
            }
          }}
          disabled={currentQuestion === questions.length - 1}
          className="w-[35%] bg-[#26C6DA] text-white py-3.5 rounded-xl font-semibold text-[15px] hover:bg-[#00BCD4] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
        >
          Next
        </button>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          width: 0;
          height: 0;
          background: transparent;
        }
        .scrollbar-hide {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
    </div>
  );
};

export default ReviewTestViewer;