import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Clock, Bookmark, X } from 'lucide-react';
import axios from 'axios';
import overview from "../../assets/overview_icon.png"
import Ask_More from '../../components/TestSeries_components/Ask_More';
import { useLocation } from 'react-router-dom';
// Import overview icon - using a placeholder since we can't import assets


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


const TestSeriesViewer = () => {
  // Get params from URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const userId = queryParams.get("userId");
  const testId = queryParams.get("testId");
  const testSeriesId = queryParams.get("testSeriesListId");
  const token = queryParams.get("token");

  // State for test data
  const [testData, setTestData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // All state variables
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showOverview, setShowOverview] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60000);
  const [savedAnswers, setSavedAnswers] = useState({});
  const [tempSelections, setTempSelections] = useState({});
  const [bookmarked, setBookmarked] = useState({});
  const [snackbar, setSnackbar] = useState({ show: false, message: '' });
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // refs for timing and touch
  const questionStartTimeRef = useRef({});
  const testStartTimeRef = useRef(Date.now());
  const autoSubmitTimeoutRef = useRef(null);
  const navigationRef = useRef(null);
  const touchStartRef = useRef(null);

  const questions = testData?.testSeriesTypes?.[0]?.testSeriesQuestionList || [];


  useEffect(() => {
    console.log("Params from WebView:", { userId, testId, testSeriesId, token });
  }, []);

  // Fetch test data on component mount
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        console.log("🚀 Starting fetchTestData()...");

        setIsLoading(true);
        setError(null);

        const url = `https://platform-dev.arivihan.com:443/arivihan-platform/secure/testSeries/question?userId=${userId}&id=${testId}&testSeriesId=${testSeriesId}&reviewMode=false`;

        console.log("🌐 Fetch URL:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            accept: "*/*",
            token: token,
            Cookie:
              "AWSALB=fgHzbhBDxOroRZ7rYzqljMBG7/qbFBrGDDfOhyA6MPNDTz+gzaxnzo3GC/I0rzujujkU9iKkGbcmY8d5jJ00JW06kUhAs9GyNBhioHq0EMFmy8LZ3jXx0845iOZn; AWSALBCORS=fgHzbhBDxOroRZ7rYzqljMBG7/qbFBrGDDfOhyA6MPNDTz+gzaxnzo3GC/I0rzujujkU9iKkGbcmY8d5jJ00JW06kUhAs9GyNBhioHq0EMFmy8LZ3jXx0845iOZn",
          },
        });

        console.log("📡 Response status:", response.status);

        if (!response.ok) {
          const rawErrorText = await response.text();
          console.error("❌ Server returned error:", rawErrorText);
          throw new Error(`HTTP ${response.status}: ${rawErrorText}`);
        }

        const data = await response.json();
        console.log("✅ Parsed test data:", data);

        setTestData(data);
        setTimeLeft(data.totalTimeToAttempt);
        setIsLoading(false);
      } catch (err) {
        console.error("🚨 Error in fetchTestData():", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchTestData();
  }, [userId, testId, testSeriesId, token]);

  // Inject CSS keyframes/animation once
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slide-up {
        from { opacity: 0; transform: translate(-50%, 20px); }
        to { opacity: 1; transform: translate(-50%, 0);}
      }
      .animate-slide-up {
        animation: slide-up 0.25s cubic-bezier(.29,.22,.23,.96) backwards;
      }
      .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; background: transparent;}
      .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none;}
      .swipe-container { transition: transform 0.23s cubic-bezier(.29,.22,.23,.96); }
      .swipe-container.dragging { transition: none; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Track question start time
  useEffect(() => {
    if (questions.length > 0 && questions[currentQuestion]) {
      const question = questions[currentQuestion];
      const questionId = question.questionId;
      if (!questionStartTimeRef.current[questionId]) {
        questionStartTimeRef.current[questionId] = Date.now();
      }
    }
  }, [questions, currentQuestion]);

  // Timer for auto submit
  useEffect(() => {
    if (!testData) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1000) {
          clearInterval(timer);
          handleTimeExpired();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [testData]);

  // Snackbar auto-hide
  useEffect(() => {
    if (snackbar.show) {
      const timer = setTimeout(() => {
        setSnackbar({ show: false, message: '' });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.show]);

  // Clear submit timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSubmitTimeoutRef.current) {
        clearTimeout(autoSubmitTimeoutRef.current);
      }
    };
  }, []);

  // --- Touch events for swipe ---
  const handleTouchStart = e => {
    touchStartRef.current = e.targetTouches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = e => {
    if (!touchStartRef.current) return;
    const currentX = e.targetTouches[0].clientX;
    const diff = touchStartRef.current - currentX;
    let offset = -diff;
    if (currentQuestion === 0 && offset > 0) offset *= 0.5;
    else if (currentQuestion === questions.length - 1 && offset < 0) offset *= 0.5;
    setDragOffset(offset);
  };

  const handleTouchEnd = e => {
    let touchEnd = e.changedTouches ? e.changedTouches[0].clientX : null;
    if (touchStartRef.current != null && touchEnd != null) {
      const swipeDistance = touchStartRef.current - touchEnd;
      const threshold = 45;
      if (Math.abs(swipeDistance) > threshold) {
        if (swipeDistance > 0 && currentQuestion < questions.length - 1) {
          recordQuestionTime(questions[currentQuestion].questionId);
          const questionId = questions[currentQuestion].questionId;
          if (!savedAnswers[questionId]?.ans && !bookmarked[questionId]) {
            const newSelections = { ...tempSelections };
            delete newSelections[questionId];
            setTempSelections(newSelections);
          }
          setCurrentQuestion(q => q + 1);
          scrollNavigationToCenter(currentQuestion + 1);
        } else if (swipeDistance < 0 && currentQuestion > 0) {
          recordQuestionTime(questions[currentQuestion].questionId);
          const questionId = questions[currentQuestion].questionId;
          if (!savedAnswers[questionId]?.ans && !bookmarked[questionId]) {
            const newSelections = { ...tempSelections };
            delete newSelections[questionId];
            setTempSelections(newSelections);
          }
          setCurrentQuestion(q => q - 1);
          scrollNavigationToCenter(currentQuestion - 1);
        }
      }
    }
    setDragOffset(0);
    setIsDragging(false);
    touchStartRef.current = null;
  };

  // --- Answer status and save logic ---
  const recordQuestionTime = (questionId) => {
    if (questionStartTimeRef.current[questionId]) {
      const timeSpent = Date.now() - questionStartTimeRef.current[questionId];
      setSavedAnswers(prev => {
        const existing = prev[questionId] || { ans: null, t: 0 };
        return {
          ...prev,
          [questionId]: {
            ...existing,
            t: (existing.t || 0) + timeSpent
          }
        };
      });
      questionStartTimeRef.current[questionId] = null;
    }
  };

  // Select/deselect option logic
  const handleSingleAnswer = (optionIndex) => {
    const question = questions[currentQuestion];
    const questionId = question.questionId;
    const currentSelection = tempSelections[questionId];
    if (currentSelection === question.options[optionIndex]) {
      const newSelections = { ...tempSelections };
      delete newSelections[questionId];
      setTempSelections(newSelections);
    } else {
      setTempSelections(prev => ({
        ...prev,
        [questionId]: question.options[optionIndex]
      }));
    }
  };

  const handleMultiAnswer = (optionIndex) => {
    const question = questions[currentQuestion];
    const questionId = question.questionId;
    const currentSelections = Array.isArray(tempSelections[questionId])
      ? tempSelections[questionId]
      : [];
    const optionText = question.options[optionIndex];
    if (currentSelections.includes(optionText)) {
      const newSelections = currentSelections.filter(ans => ans !== optionText);
      if (newSelections.length === 0) {
        const newTemp = { ...tempSelections };
        delete newTemp[questionId];
        setTempSelections(newTemp);
      } else {
        setTempSelections(prev => ({
          ...prev,
          [questionId]: newSelections
        }));
      }
    } else {
      setTempSelections(prev => ({
        ...prev,
        [questionId]: [...currentSelections, optionText]
      }));
    }
  };

  const handleIntegerAnswer = (value) => {
    const questionId = questions[currentQuestion].questionId;
    if (value === '') {
      const newSelections = { ...tempSelections };
      delete newSelections[questionId];
      setTempSelections(newSelections);
    } else {
      setTempSelections(prev => ({
        ...prev,
        [questionId]: value
      }));
    }
  };

  const handleSaveNext = () => {
    const questionId = questions[currentQuestion].questionId;
    const selection = tempSelections[questionId];

    const hasSelection =
      selection !== undefined &&
      selection !== null &&
      (Array.isArray(selection) ? selection.length > 0 : selection !== '');

    if (!hasSelection) {
      setSnackbar({ show: true, message: 'Please select an option' });
      return;
    }

    recordQuestionTime(questionId);

    setSavedAnswers(prev => ({
      ...prev,
      [questionId]: {
        ans: selection,
        t: prev[questionId]?.t || 0,
      },
    }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      scrollNavigationToCenter(currentQuestion + 1);
    }
  };

  const handleClearAttempt = () => {
    const questionId = questions[currentQuestion].questionId;
    const newSelections = { ...tempSelections };
    delete newSelections[questionId];
    setTempSelections(newSelections);
    const newAnswers = { ...savedAnswers };
    delete newAnswers[questionId];
    setSavedAnswers(newAnswers);
  };

  // Toggle Mark/Bookmark
  const toggleBookmark = () => {
    const questionId = questions[currentQuestion].questionId;
    setBookmarked(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Time logic
  const handleTimeExpired = () => {
    setShowTimeoutModal(true);
    autoSubmitTimeoutRef.current = setTimeout(() => {
      handleSubmitTest();
    }, 2000);
  };
  
 const handleSubmitTest = async () => {
  if (autoSubmitTimeoutRef.current) {
    clearTimeout(autoSubmitTimeoutRef.current);
  }
  if (questions.length > 0 && questions[currentQuestion]) {
    recordQuestionTime(questions[currentQuestion].questionId);
  }
  
  const totalTimeTaken = Date.now() - testStartTimeRef.current;
  
  // Build ansMap with proper structure
  const ansMap = Object.keys(savedAnswers).reduce((acc, questionId) => {
    const answer = savedAnswers[questionId];
    if (answer && answer.ans !== null && answer.ans !== undefined) {
      acc[questionId] = {
        ans: answer.ans,
        t: Math.round(answer.t || 0)
      };
    }
    return acc;
  }, {});
  
  const submissionPayload = {
    ansMap: ansMap,
    board: false,
    id: testData.testSeriesId,
    listId: testData.testSeriesId || "test_list_id",
    listName: testData.testSeriesName,
    show: true,
    t: Math.round(totalTimeTaken),
    testName: testData.testSeriesName
  };
  
  console.log('📤 Submission Payload:', JSON.stringify(submissionPayload, null, 2));
  
  setIsSubmitting(true);
  
  try {
    const response = await axios.post(
      'https://platform-dev.arivihan.com:443/arivihan-platform/secure/testSeries/v2',
      submissionPayload,
      {
        headers: {
          'accept': 'application/json',
          'token': token,
          'userId': userId,
          'Content-Type': 'application/json',
          'Cookie': 'AWSALB=fgHzbhBDxOroRZ7rYzqljMBG7/qbFBrGDDfOhyA6MPNDTz+gzaxnzo3GC/I0rzujujkU9iKkGbcmY8d5jJ00JW06kUhAs9GyNBhioHq0EMFmy8LZ3jXx0845iOZn; AWSALBCORS=fgHzbhBDxOroRZ7rYzqljMBG7/qbFBrGDDfOhyA6MPNDTz+gzaxnzo3GC/I0rzujujkU9iKkGbcmY8d5jJ00JW06kUhAs9GyNBhioHq0EMFmy8LZ3jXx0845iOZn'
        }
      }
    );
    
    console.log('✅ Submission successful:', response.data);
    setSnackbar({ show: true, message: 'Test submitted successfully!' });
    
    // Close modals
    setShowSubmitModal(false);
    setShowTimeoutModal(false);
    setIsSubmitting(false);
    
    // Redirect to Android Activity after successful submission
    setTimeout(() => {
      // Prepare activity parameters
      const activityParams = {
        testSeriesId: testId,
        testSeriesListId: testSeriesId,
        afterAttempt: true,
        testSeriesName: testData.testSeriesName,
//         testSeriesListId: PHYNEETENGUND
// testSeriesId: PHYNEETENGUNDT1
// testSeriesName: Units and Measurements Test 1
      };
      
      const className = "arivihan.technologies.doubtbuzzter2.activity.MockTestAnalysisActivity";
      
      // Call Android interface to open the activity
      if (window.AndroidInterface && window.AndroidInterface.openActivity) {
        console.log('🔄 Redirecting to Android Activity:', className, activityParams);
        window.AndroidInterface.openActivity(className, JSON.stringify(activityParams));
      } else {
        console.warn('⚠️ AndroidInterface not available');
      }
    }, 1500); // Short delay to show success message
    
  } catch (error) {
    console.error('❌ Submit error:', error);
    
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      setSnackbar({ show: true, message: `Submission failed: ${error.response.status}` });
    } else if (error.request) {
      console.error('No response received:', error.request);
      setSnackbar({ show: true, message: 'Network error. Please check your connection.' });
    } else {
      console.error('Error:', error.message);
      setSnackbar({ show: true, message: 'Failed to submit test.' });
    }
    
    setIsSubmitting(false);
  }
};

  // --- Question navigation logic ---
  const navigateToQuestion = (index) => {
    if (isDragging || index === currentQuestion) return;
    if (questions[currentQuestion]) {
      recordQuestionTime(questions[currentQuestion].questionId);
    }
    setCurrentQuestion(index);
    scrollNavigationToCenter(index);
  };

  // --- Status logic based on props ---
  const getQuestionStatus = (idx) => {
    const questionId = questions[idx].questionId;
    const isSaved = savedAnswers[questionId]?.ans !== undefined && savedAnswers[questionId]?.ans !== null;
    const isMarked = bookmarked[questionId];
    if (isSaved && isMarked) return 'marked-answered';
    if (isSaved) return 'answered';
    if (isMarked) return 'marked-unanswered';
    return 'unanswered';
  };

  // Scroll navigation to center current question
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

  const getQuestionTypeLabel = (type) => {
    if (type === 'SINGLE_CHOICE') return 'Single-choice';
    if (type === 'MULTI_CHOICE') return 'Multi-choice';
    if (type === 'INTEGER') return 'Integer type';
    return 'Single-choice';
  };

  // --- UI ---
  if (isLoading) {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#26C6DA] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test...</p>
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
          <p className="text-gray-600 text-sm">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  // --- Counts for Overview ---
  const answeredCount = Object.keys(savedAnswers).filter(key => savedAnswers[key]?.ans !== undefined && savedAnswers[key]?.ans !== null).length;
  const markedAnsweredCount = questions.filter((q, idx) => getQuestionStatus(idx) === 'marked-answered').length;
  const markedUnansweredCount = questions.filter((q, idx) => getQuestionStatus(idx) === 'marked-unanswered').length;
  const unansweredCount = questions.filter((q, idx) => getQuestionStatus(idx) === 'unanswered').length;

  // --- Current question selection ---
  const question = questions[currentQuestion];
  const questionId = question.questionId;
  const currentSelection = tempSelections[questionId] ?? savedAnswers[questionId]?.ans;
  const isBookmarked = bookmarked[questionId];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const isQuestionSaved = savedAnswers[questionId]?.ans !== undefined && savedAnswers[questionId]?.ans !== null;

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-white flex flex-col relative overflow-hidden">
      {snackbar.show && (
        <div
          className={`fixed bottom-2 left-1/2 -translate-x-1/2 px-6 py-3 rounded 
                     ${snackbar.message.includes('success') ? 'bg-green-500' : 'bg-red-400'} 
                     text-white text-sm font-medium shadow-lg 
                     transition-all duration-300 w-[90%] max-w-sm text-center z-[9999]`}
        >
          {snackbar.message}
        </div>
      )}
       {/* <Ask_More/> */}
      {/* Top bar */}
      <div className="bg-white px-4 py-3 font-semibold flex items-center justify-between">
        <ChevronLeft className="w-6 h-6 text-[#000000]" />
        <div className="flex items-center gap-2 text-[#000000]">
          <Clock className="w-4 h-4" />
          <span className="text-[15px]">{Math.floor(timeLeft/60000)}:{Math.floor(timeLeft/1000)%60 < 10 ? '0':''}{Math.floor(timeLeft/1000)%60} Min</span>
        </div>
      </div>

      {/* Overview and Finish */}
      <div className="bg-white px-4 py-3 flex items-center justify-between">
        <button onClick={() => setShowOverview(true)} className="flex items-center gap-2 text-gray-700">
          <img className='w-[30px]' src={overview} alt="" />
          <span className="font-bold text-[16px]">Overview</span>
        </button>
        <button onClick={() => setShowSubmitModal(true)} className="text-[#000000] border-[#DDDDDD] bg-[#F8F9FA] border px-7 rounded font-medium">
          Finish
        </button>
      </div>

      {/* Navigation pills */}
      <div className="px-5 py-2 mb-2 overflow-x-auto scrollbar-hide">
        <div ref={navigationRef} className="flex gap-12 min-w-max">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => navigateToQuestion(idx)}
              className="relative pb-2"
            >
              <span className={`text-sm ${currentQuestion === idx ? 'text-[#191919] font-bold' : 'text-[#191919]/50 font-bold'}`}>
                {idx + 1}
              </span>
              {currentQuestion === idx && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-7 bg-[#26C6DA] rounded-full transition-all duration-300"/>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Swipe Questions */}
      <div
        className="flex-1 overflow-hidden relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'pan-y' }}
      >
        <div
          className={`flex h-full swipe-container ${isDragging ? 'dragging' : ''}`}
          style={{
            transform: `translateX(calc(-${currentQuestion * (100 / questions.length)}% + ${dragOffset}px))`,
            width: `${questions.length * 100}%`,
            transition: isDragging ? 'none' : 'transform 300ms cubic-bezier(.2,.9,.2,1)',
            willChange: 'transform',
          }}
        >
          {questions.map((q, qIndex) => {
            const qSelection = tempSelections[q.questionId] ?? savedAnswers[q.questionId]?.ans;
            const qIsBookmarked = bookmarked[q.questionId];
            return (
              <div
                key={q.questionId}
                className="flex-shrink-0 overflow-y-auto px-4"
                style={{ width: `${100 / questions.length}%` }}
              >
                <div className="bg-white rounded-lg px-2 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={qIndex === currentQuestion ? toggleBookmark : undefined}
                      className="flex items-center gap-1 text-gray-600"
                      aria-pressed={qIsBookmarked}
                    >
                      <Bookmark className={`w-[18px] h-5 ${qIsBookmarked ? 'fill-orange-200 text-orange-200' : ''}`} />
                      <span className="text-[14px]">{qIsBookmarked ? 'Marked' : 'Unmarked'}</span>
                    </button>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-[2px] bg-[#D3F8FA] text-[#02858D] text-[12px] font-bold rounded">
                        {getQuestionTypeLabel(q.questionType)}
                      </span>
                      <span className="px-3 py-[2px] bg-[#D3F8FA] text-[#02858D] text-[12px] font-bold rounded">
                        +{q.score}
                      </span>
                      {q.negativeScore > 0 && (
                        <span className="px-3 py-[2px] bg-[#FADFE6] text-[#A90202] text-[12px] font-bold rounded">
                          -{q.negativeScore}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-[#191919] font-semibold text-base">
                      <LatexRenderer text={q.questionText} />
                    </p>
                  </div>

                  {/* Render different question types */}
                  {q.questionType === 'SINGLE_CHOICE' && q.options && (
                    <>
                      <div className="text-[13px] text-[#696969] mb-4">Select an option:</div>
                      <div className="space-y-3">
                        {q.options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={qIndex === currentQuestion ? () => handleSingleAnswer(idx) : undefined}
                            className={`w-full text-left p-2 rounded-lg border transition-all ${
                              qSelection === option
                                ? 'border-[#26C6DA] bg-[#E9FBFC]'
                                : 'border-[#EEEEEE] hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="font-medium text-gray-700 mt-0.5">{String.fromCharCode(65 + idx)}</span>
                              <span className="text-gray-900 flex-1">
                                <LatexRenderer text={option} />
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {q.questionType === 'MULTI_CHOICE' && q.options && (
                    <>
                      <div className="text-sm text-gray-600 mb-4">Select one or more options:</div>
                      <div className="space-y-3">
                        {q.options.map((option, idx) => {
                          const isSelected = Array.isArray(qSelection) && qSelection.includes(option);
                          return (
                            <button
                              key={idx}
                              onClick={qIndex === currentQuestion ? () => handleMultiAnswer(idx) : undefined}
                              className={`w-full text-left p-3 rounded-lg border transition-all ${
                                isSelected ? 'border-[#26C6DA] bg-[#E9FBFC]' : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <span className="font-medium text-gray-700 mt-0.5">{String.fromCharCode(65 + idx)}</span>
                                <span className="text-gray-900 flex-1">
                                  <LatexRenderer text={option} />
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {q.questionType === 'INTEGER' && (
                    <>
                      <div className="text-sm text-gray-600 mb-4">Enter your answer as an integer:</div>
                      <input
                        type="number"
                        value={qSelection || ''}
                        onChange={qIndex === currentQuestion ? (e) => handleIntegerAnswer(e.target.value) : undefined}
                        placeholder="Enter integer value"
                        className="w-full p-3 rounded-lg border border-[#E9FBFC] focus:border-[#26C6DA] focus:outline-none text-gray-900 text-base"
                      />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Button row */}
      <div className="bg-white p-4">
        <div className="bg-white flex justify-between gap-3">
          <button
            onClick={handleClearAttempt}
            className={`bg-[#E9FBFC] text-[#26C6DA] text-[16px] py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-all ${!isQuestionSaved ? 'invisible' : ''}`}
          >
            Clear Attempt
          </button>
          {isLastQuestion ? (
  <button
    onClick={() => {
      handleSaveNext();
      setShowSubmitModal(true);
    }}
    className="bg-[#26C6DA] text-white text-[16px] py-2 px-3 rounded-lg font-medium hover:bg-opacity-90 transition-all"
  >
    Finish
  </button>
) : (
  <button
    onClick={handleSaveNext}
    className="bg-[#26C6DA] text-white text-[16px] py-2 px-3 rounded-lg font-medium hover:bg-opacity-90 transition-all"
  >
    Save & Next
  </button>
)}

        </div>
      </div>

      {/* Overview Modal */}
      {showOverview && (
        <div className="absolute inset-0 bg-white w-screen h-screen p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Overview</h3>
              <button onClick={() => setShowOverview(false)}>
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center text-[8px] justify-between mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#26C6DA] rotate-45"></div>
                  <span className="text-[#696969]">{answeredCount} Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rotate-45"></div>
                  <span className="text-[#696969]">{markedAnsweredCount} Marked & Answered</span>
                </div>
              </div>
              <div className="flex items-center text-[8px] justify-between mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rotate-45"></div>
                  <span className="text-[#696969]">{unansweredCount} Unanswered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rotate-45"></div>
                  <span className="text-[#696969]">{markedUnansweredCount} Marked & Unanswered</span>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-5">
                {questions.map((_, idx) => {
                  const status = getQuestionStatus(idx);
                  let bgColor = 'bg-gray-300';
                  let textColor = 'text-gray-700';
                  if (status === 'answered') {
                    bgColor = 'bg-[#26C6DA]';
                    textColor = 'text-white';
                  } else if (status === 'marked-answered') {
                    bgColor = 'bg-red-400';
                    textColor = 'text-white';
                  } else if (status === 'marked-unanswered') {
                    bgColor = 'bg-orange-400';
                    textColor = 'text-white';
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        navigateToQuestion(idx);
                        setShowOverview(false);
                      }}
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium ${bgColor} ${textColor}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
              Submit Test
            </h3>
            <p className="text-gray-600 text-center mb-6 text-sm">
              Once you click submit, you will not be able to change your answer
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-center gap-2 text-[#26C6DA]">
                <div className="w-3 h-3 bg-[#26C6DA] rounded"></div>
                <span className="font-medium">{answeredCount} Answered</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <div className="w-3 h-3 bg-red-400 rounded"></div>
                <span>{markedAnsweredCount} Marked & Answered</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <div className="w-3 h-3 bg-orange-400 rounded"></div>
                <span>{markedUnansweredCount} Marked & Unanswered</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <div className="w-3 h-3 bg-gray-300 rounded"></div>
                <span>{unansweredCount} Unanswered</span>
              </div>
            </div>
            <button 
              onClick={() => setShowSubmitModal(false)}
              disabled={isSubmitting}
              className="w-full text-[#26C6DA] py-3 rounded-lg font-medium mb-3 hover:bg-gray-50 disabled:opacity-50"
            >
              Resume
            </button>
            <button 
              onClick={handleSubmitTest}
              disabled={isSubmitting}
              className="w-full bg-[#26C6DA] text-white py-3 rounded-lg font-medium hover:bg-opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Timeout Modal */}
      {showTimeoutModal && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
              Time's Up!
            </h3>
            <p className="text-gray-600 text-center mb-6 text-sm">
              Your test will be submitted automatically in 2 seconds...
            </p>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#26C6DA]"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestSeriesViewer;