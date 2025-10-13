import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, AlertTriangle, MoreHorizontal, CheckCircle, Clock, Star, Flag, X } from 'lucide-react';
import { IoIosArrowRoundDown } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import cup from "../../assets/cup.png"
import { CiBookmark } from "react-icons/ci";
// Sample data for different question types
const questionData = {
  mcq: [
    {
      questionId: "mcq1",
      type: "MULTIPLE_CHOICE",
      question: "Which of the following is not a type of charge?",
      options: [
        { id: 'A', text: 'Positive charge' },
        { id: 'B', text: 'Negative charge' },
        { id: 'C', text: 'Neutral charge' },
        { id: 'D', text: 'Magnetic charge' }
      ],
      answer: "D",
      answerEx: "There are only two types of electric charges: positive and negative. Neutral means no charge. Magnetic charge doesn't exist - magnets have poles (north and south), not charges.",
      marks: "1",
      pos: 1
    },
    {
      questionId: "mcq2", 
      type: "MULTIPLE_CHOICE",
      question: "What is the SI unit of electric charge?",
      options: [
        { id: 'A', text: 'Volt' },
        { id: 'B', text: 'Ampere' },
        { id: 'C', text: 'Coulomb' },
        { id: 'D', text: 'Ohm' }
      ],
      answer: "C",
      answerEx: "The coulomb (C) is the SI unit of electric charge. It is defined as the amount of charge transported by a constant current of one ampere in one second.",
      marks: "1", 
      pos: 2
    },
    {
      questionId: "mcq3",
      type: "MULTIPLE_CHOICE", 
      question: "Coulomb's law states that the force between two point charges is:",
      options: [
        { id: 'A', text: 'Directly proportional to the square of distance' },
        { id: 'B', text: 'Inversely proportional to the square of distance' },
        { id: 'C', text: 'Directly proportional to the distance' },
        { id: 'D', text: 'Independent of distance' }
      ],
      answer: "B",
      answerEx: "According to Coulomb's law, the electrostatic force between two point charges is inversely proportional to the square of the distance between them. F = kq₁q₂/r²",
      marks: "1",
      pos: 3
    },
    {
      questionId: "mcq4",
      type: "MULTIPLE_CHOICE", 
      question: "What happens to the electric force between two charges when the distance is doubled?",
      options: [
        { id: 'A', text: 'Force becomes half' },
        { id: 'B', text: 'Force becomes double' },
        { id: 'C', text: 'Force becomes one-fourth' },
        { id: 'D', text: 'Force remains same' }
      ],
      answer: "C",
      answerEx: "When distance is doubled, the force becomes 1/4 times the original force because force is inversely proportional to the square of distance (1/r²).",
      marks: "1",
      pos: 4
    }
  ],
  // fillInTheBlanks: [
  //   {
  //     questionId: "fill1",
  //     type: "FILL_IN_THE_BLANKS",
  //     question: "The unit of electric current in the SI system is ________.",
  //     answer: "ampere",
  //     answerEx: "ampere (A) - The ampere is the SI unit of electric current, defined as the flow of one coulomb of charge per second.",
  //     marks: "1",
  //     pos: 1
  //   },
  //   {
  //     questionId: "fill2",
  //     type: "FILL_IN_THE_BLANKS", 
  //     question: "The instantaneous current is mathematically represented as ________.",
  //     answer: "dq/dt",
  //     answerEx: "dq/dt - Instantaneous current is defined as the rate of flow of charge at a specific moment, which is represented mathematically as the derivative of charge with respect to time (dq/dt).",
  //     marks: "1",
  //     pos: 2
  //   },
  //   {
  //     questionId: "fill3",
  //     type: "FILL_IN_THE_BLANKS", 
  //     question: "Electric field intensity is measured in ________.",
  //     answer: "N/C",
  //     answerEx: "N/C (Newton per Coulomb) - Electric field intensity is defined as force per unit charge, hence measured in N/C or V/m.",
  //     marks: "1",
  //     pos: 3
  //   }
  // ],
  // trueFalse: [
  //   {
  //     questionId: "tf1",
  //     type: "TRUE_FALSE",
  //     question: "Electric current can flow through a vacuum.",
  //     answer: false,
  //     answerEx: "False - Electric current requires charge carriers (like electrons) to flow, which are not present in a vacuum under normal conditions.",
  //     marks: "1",
  //     pos: 1
  //   },
  //   {
  //     questionId: "tf2",
  //     type: "TRUE_FALSE",
  //     question: "Conventional current flows from positive to negative terminal.",
  //     answer: true,
  //     answerEx: "True - By convention, current is said to flow from positive to negative terminal, even though electrons actually flow from negative to positive.",
  //     marks: "1",
  //     pos: 2
  //   },
  //   {
  //     questionId: "tf3",
  //     type: "TRUE_FALSE",
  //     question: "Electric field lines can intersect each other.",
  //     answer: false,
  //     answerEx: "False - Electric field lines never intersect because at any point in space, the electric field has a unique direction.",
  //     marks: "1",
  //     pos: 3
  //   }
  // ],
  // shortAnswer: [
  //   {
  //     questionId: "short1",
  //     type: "SHORT_ANSWER",
  //     question: "What is the SI unit of electric charge?",
  //     answer: "Coulomb",
  //     answerEx: "Coulomb (C) is the SI unit of electric charge. It is defined as the amount of charge transported by a constant current of one ampere in one second.",
  //     marks: "1",
  //     pos: 1
  //   }
  // ],
  // longAnswer: [
  //   {
  //     questionId: "long1",
  //     type: "LONG_ANSWER",
  //     question: "What is the definition of electric field intensity?",
  //     answer: "The force per unit charge of an electric field.",
  //     answerEx: "Electric field intensity is defined as the force per unit charge of an electric field. It is measured in Newton per Coulomb (N/C).",
  //     marks: "1",
  //     pos: 1
  //   }
  // ]

};

// Success Popup Component
const SuccessPopup = ({ show, message, icon, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center animate-bounce shadow-2xl">
        <div className="mb-4 flex justify-center">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{message}</h3>
        <div className="text-sm text-gray-600">Great work!</div>
      </div>
    </div>
  );
};

// Report Popup Component
const ReportPopup = ({ show, onClose, questionId }) => {
  const [selectedIssue, setSelectedIssue] = useState('');
  const [feedback, setFeedback] = useState('');

  const issues = [
    'Incorrect or incomplete question',
    'Incorrect or incomplete options',
    'Formatting or image quality issue',
    'Other'
  ];

  const handleSubmit = () => {
    console.log('Report submitted:', { questionId, issue: selectedIssue, feedback });
    onClose();
    setSelectedIssue('');
    setFeedback('');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Report Question</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="space-y-3">
            {issues.map((issue, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                <input
                  type="radio"
                  name="issue"
                  value={issue}
                  checked={selectedIssue === issue}
                  onChange={(e) => setSelectedIssue(e.target.value)}
                  className="w-4 h-4 text-cyan-400 focus:ring-cyan-400"
                />
                <span className="text-sm text-gray-700">{issue}</span>
              </label>
            ))}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Please provide additional details..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-xl focus:border-cyan-400 focus:outline-none resize-none text-sm"
            />
          </div>
        </div>
        
        <div className="p-4 border-t">
          <button
            onClick={handleSubmit}
            disabled={!selectedIssue}
            className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${
              selectedIssue
                ? 'bg-cyan-400 text-white hover:bg-cyan-500 shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
};

// Question Type Components
const MCQ = ({ question, selectedAnswer, onAnswerSelect, showSolution, isSubmitted }) => (
  <div className=" w-[90vw] space-y-4">
    <div className="text-gray-800 text-base sm:text-lg leading-relaxed font-medium">
      {question.question}
    </div>
    <div className="space-y-3"> 
      <div className=" text-[12px] text-gray-500 font-medium">
                Select one option
              </div>
      {question.options.map((option) => (
        <button
          key={option.id}
          onClick={() => !isSubmitted && onAnswerSelect(option.id)}
          disabled={isSubmitted}
          className={`w-full p-3 rounded-xl border text-left transition-all duration-200 ${
            isSubmitted && option.id === question.answer
              ? 'border-green-500 bg-green-50 shadow-md'
              : isSubmitted && selectedAnswer === option.id && selectedAnswer !== question.answer
              ? 'border-red-500 bg-red-50 shadow-md'
              : selectedAnswer === option.id
              ? 'border-cyan-400 bg-cyan-50 shadow-md'
              : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
          } ${isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02]'}`}
        >
          <span className="font-bold text-gray-700 mr-3">{option.id}.</span>
          <span className="text-gray-800">{option.text}</span>
        </button>
      ))}
    </div>
  </div>
);









export default function PracticeQuestionsUI() {
  const [currentQuestionType, setCurrentQuestionType] = useState('mcq');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showSolution, setShowSolution] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({ message: '', icon: null });
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
      const containerRef = useRef(null);
  const solutionRef = useRef(null);
  const questions = questionData[currentQuestionType] || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const navigate = useNavigate();
  // Start timer when question loads or changes
  useEffect(() => {
    setStartTime(Date.now());
  }, [currentQuestionIndex, currentQuestionType]);

  const handleAnswerChange = (answer) => {
    const key = `${currentQuestionType}_${currentQuestionIndex}`;
    setUserAnswers(prev => ({ ...prev, [key]: answer }));
  };

  const getCurrentAnswer = () => {
    const key = `${currentQuestionType}_${currentQuestionIndex}`;
    return userAnswers[key];
  };

  const isCurrentQuestionSubmitted = () => {
    const key = `${currentQuestionType}_${currentQuestionIndex}`;
    return isSubmitted[key] || false;
  };

  const hasAnswered = () => {
    const answer = getCurrentAnswer();
    return answer !== undefined && answer !== null && answer !== '';
  };

  const checkAnswer = () => {
    const userAnswer = getCurrentAnswer();
    const correctAnswer = currentQuestion.answer;
    
    if (currentQuestion.type === 'MULTIPLE_CHOICE' || currentQuestion.type === 'TRUE_FALSE') {
      return userAnswer === correctAnswer;
    } else {
      return userAnswer?.toLowerCase()?.trim() === correctAnswer?.toLowerCase()?.trim();
    }
  };

  const handleSubmit = () => {
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000;
    const key = `${currentQuestionType}_${currentQuestionIndex}`;
    
    setIsSubmitted(prev => ({ ...prev, [key]: true }));
    setShowSolution(true);
    
    const isCorrect = checkAnswer();
    
    if (isCorrect) {
      if (timeTaken <= 5) {
        setPopupData({ 
          message: 'Brilliant!', 
          icon: <Star className="w-12 h-12 text-yellow-500" /> 
        });
      } else if (timeTaken <= 10) {
        setPopupData({ 
          message: 'A little late but great!', 
          icon: <Clock className="w-12 h-12 text-orange-500" /> 
        });
      } else {
        setPopupData({ 
          message: 'Good job!', 
          icon: <CheckCircle className="w-12 h-12 text-green-500" /> 
        });
      }
    } else {
      setPopupData({ 
        message: 'Keep trying!', 
        icon: <CheckCircle className="w-12 h-12 text-red-500" /> 
      });
    }
    
    setShowPopup(true);
  };

  const transitionToQuestion = (newIndex, direction) => {
    setIsTransitioning(true);
    setSwipeDirection(direction);
    
    setTimeout(() => {
      setCurrentQuestionIndex(newIndex);
      setShowSolution(false);
      setTimeout(() => {
        setIsTransitioning(false);
        setSwipeDirection(null);
      }, 50);
    }, 150);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      transitionToQuestion(currentQuestionIndex + 1, 'next');
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      transitionToQuestion(currentQuestionIndex - 1, 'prev');
    }
  };

  // Enhanced touch handlers for horizontal swiping only
  const handleTouchStart = (e) => {
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
    setTouchEnd({ x: 0, y: 0 });
  };

  const handleTouchMove = (e) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const handleTouchEnd = (e) => {
    if (!touchStart.x || !touchEnd.x) return;
    
    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;
    
    // Check if the swipe is more horizontal than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      // Prevent default scrolling behavior for horizontal swipes
      e.preventDefault();
      
      const isLeftSwipe = deltaX > 0;
      const isRightSwipe = deltaX < 0;

      if (isLeftSwipe && currentQuestionIndex < totalQuestions - 1) {
        nextQuestion();
      }
      if (isRightSwipe && currentQuestionIndex > 0) {
        prevQuestion();
      }
    }

    setTouchStart({ x: 0, y: 0 });
    setTouchEnd({ x: 0, y: 0 });
  };
 
  const goToQuestion = (index) => {
    if (index !== currentQuestionIndex) {
      const direction = index > currentQuestionIndex ? 'next' : 'prev';
      transitionToQuestion(index, direction);
    }
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    const props = {
      question: currentQuestion,
      showSolution,
      selectedAnswer: getCurrentAnswer(),
      userAnswer: getCurrentAnswer(),
      onAnswerSelect: handleAnswerChange,
      onAnswerChange: handleAnswerChange,
      isSubmitted: isCurrentQuestionSubmitted()
    };

    const QuestionComponent = {
      'MULTIPLE_CHOICE': MCQ,
      // 'FILL_IN_THE_BLANKS': FillInTheBlank,
      // 'TRUE_FALSE': TrueFalse ,
      // 'SHORT_ANSWER': ShortAnswer,
      // 'LONG_ANSWER': LongAnswer,
    }[currentQuestion.type] || MCQ;

    return <QuestionComponent {...props} />;
  };

  const getQuestionStatus = (index) => {
    const key = `${currentQuestionType}_${index}`;
    const hasAnswer = userAnswers[key] !== undefined && userAnswers[key] !== null && userAnswers[key] !== '';
    const submitted = isSubmitted[key];
     
    if (submitted) return 'submitted';
    if (hasAnswer) return 'answered';
    return 'unanswered';


   

  };
  
    const scrollToSolution = () => {
    if (solutionRef.current) {
      solutionRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
    document.getElementById('solution').style.display='none'
  };  
  const isScrollAtBottom = (container) => {
  if (!container) return false;
  const { scrollTop, scrollHeight, clientHeight } = container;
  // Agar scroll bottom par ho toh true return kare
  return scrollTop + clientHeight >= scrollHeight - 5; // 5px tolerance
};

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Success Popup */}
      <SuccessPopup 
        show={showPopup} 
        message={popupData.message}
        icon={popupData.icon}
        onClose={() => setShowPopup(false)}
      />

      {/* Report Popup */}
      <ReportPopup
        show={showReportPopup}
        onClose={() => setShowReportPopup(false)}
        questionId={currentQuestion?.questionId}
      />

      {/* Header */}
      <div ref={containerRef} className="bg-white px-4 py-2 mt-2 flex items-center justify-between sticky top-0 z-20 flex-shrink-0">
        <div className="flex items-center  gap-3">
          <ChevronLeft onClick={() => navigate(-1)} size={24}  className='mb-1'/>
          <h1 className="text-lg mt-1 font-semibold text-gray-800 truncate">Electric Charges And Fields</h1>
        </div>
      </div>

      {/* Question Type Selector */}
      {/* <div className="bg-white border-b px-4 py-2 shadow-sm flex-shrink-0">
        <select 
          value={currentQuestionType}
          onChange={(e) => {
            setCurrentQuestionType(e.target.value);
            setCurrentQuestionIndex(0);
            setShowSolution(false);
          }}
          className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:border-cyan-400 focus:outline-none bg-white shadow-sm transition-all duration-200"
        >
          <option value="mcq">Multiple Choice Questions</option>
          <option value="fillInTheBlanks">Fill in the Blanks</option>
          <option value="trueFalse">True/False</option>
          <option value="shortAnswer">Short Answer</option>
          <option value="longAnswer">Long Answer</option>
        </select>
      </div> */}
         
      {/* reward strip */}
     <div className='w-full flex justify-center items-center'>
       <div className='w-[90%] flex gap-2  px-2 py-2 bg-[#E9FBFC99]'>
        <img className='w-6 h-6 object-cover' src={cup} alt="" /> 
        <p>To win: <span className='text-[#696969]'>Solve 2 questions continously</span> </p>
      </div>
     </div>


      {/* Question Navigation */}
     <div className="bg-white px-4 py-1 flex-shrink-0 relative">
  <div className="flex gap-2 overflow-x-auto pb-2 relative">
    {questions.map((_, index) => {
      const status = getQuestionStatus(index);
      return (
        <button
          key={index}
          onClick={() => goToQuestion(index)}
          className={`relative w-8 h-8 rounded-full mt-2 ml-1 text-sm font-semibold flex-shrink-0 transition-all duration-200
            ${
              status === "submitted"
                ? "bg-[#A8E0BE] text-black shadow-md hover:bg-[#A8E0BE]"
                : status === "answered"
                ? "bg-[#F7DCE3] text-black shadow-md hover:bg-[#F7DCE3]"
                : "bg-transparent text-gray-600 hover:bg-red-300 shadow-sm"
            }
          `}
        >
          {index + 1}
        </button>
      );
    })}

    {/* Sliding Cyan Underline */}
    <div
      className="absolute bottom-0 h-[3px] bg-cyan-400 rounded-full transition-all duration-300"
      style={{
        width: "2.5rem", // same as button width (w-8 = 2rem)
        transform: `translateX(${currentQuestionIndex * (32 + 13)}px)` 
        // 32px button + ~8px gap
      }}
    />
  </div>
</div>


      {/* Question Content Container with Swiper Effect and Proper Scrolling */}
      <div  className="flex-1  relative bg-white overflow-hidden">
        
        <div 
          className={`h-full overflow-y-auto max-h-[calc(100vh-200px)] transition-transform duration-300 ease-in-out ${
            isTransitioning 
              ? swipeDirection === 'next' 
                ? '-translate-x-full opacity-0' 
                : 'translate-x-full opacity-0'
              : 'translate-x-0 opacity-100'
          }`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: 'pan-y' }} // Allow vertical scrolling, restrict horizontal
        >
          {/* Scrollable Content Area */}
          <div className="h-full flex flex-col items-center overflow-y-auto pb-24" style={{ scrollbarWidth: 'thin' }}>
            {/* Question Content */}
             <div className="flex p-2 w-full px-6 items-center justify-between text-sm">
          {/* <span className="text-gray-600 font-medium">
            <p className='text-[18px]'>Q{currentQuestionIndex + 1} of {totalQuestions}</p>
          </span> */}
          <span className="bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-medium">
            NEET 25-2026
          </span>
          <CiBookmark className='text-[#8C8D92]' size={20} />
        </div>
            <div className="p-2 sm:p-6  my-1 rounded-2xl">
              
              {renderQuestion()}
              
            </div>

            {/* Solution Section */}
            {showSolution && currentQuestion && (
              <div ref={solutionRef} className="mx-4  mb-[12vh] rounded-2xl  overflow-hidden">
                <div className="px-2 flex items-center justify-between">
                  <div className="flex w-full justify-between gap-3">
                     <div className="flex flex-col items-center gap-1">
                    <span className="font-semibold text-[22px] text-gray-800">Solution</span>
                    <span className="bg-cyan-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">
                      <p className='text-[14px] text-cyan-600'>Medium</p>
                    </span>
                  </div>
                    <div  onClick={() => setShowReportPopup(true)} className="p-2  rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-black" />
                    </div>
                    
                  </div>
                 
                </div>
                <div className="px-4 py-2 text-sm sm:text-base text-gray-700 leading-relaxed">
                  {currentQuestion.answerEx}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white  p-4 z-10 flex-shrink-0">
        <div className="flex gap-3 mb-3">
          {!isCurrentQuestionSubmitted() ? (
            <>
              {hasAnswered() ? (
                <button
                  onClick={handleSubmit}
                  className="bg-[#26C6DA] max-w-[35vw] ml-auto text-white px-8 py-3 rounded-xl font-semibold text-base flex-1 transition-all duration-200 shadow-lg transform"
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  disabled={currentQuestionIndex >= totalQuestions - 1}
                  className={`px-2 max-w-[30vw] ml-auto text-white py-3 rounded-xl font-semibold text-base flex-1 transition-all duration-200 ${
                    currentQuestionIndex >= totalQuestions - 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-cyan-500'
                  }`}
                >
                  Next
                </button>
              )}
            </>
          ) : (
            <button
              onClick={nextQuestion}
              disabled={currentQuestionIndex >= totalQuestions - 1}
              className={`px-8 py-3 max-w-[30vw] ml-auto rounded-xl font-semibold text-base flex-1 transition-all duration-200 ${
                currentQuestionIndex >= totalQuestions - 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-500 hover:to-blue-600 shadow-lg transform hover:scale-105'
              }`}
            >
              Next
            </button>
          )}
        </div>
      </div>  
         
         {showSolution &&  (
            <div onClick={scrollToSolution} id='solution' className='absolute bottom-24 w-fit h-fit left-1/2 transform -translate-x-1/2  bg-black/70 text-white flex justify-center p-1 text-sm px-3 rounded-full z-10 '>
               <p>view solution</p> 
               <IoIosArrowRoundDown size={18}  />
            </div>
         )}
        
    </div>
  );
}