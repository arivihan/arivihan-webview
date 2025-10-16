// import React, { useState, useRef, useEffect } from 'react';
// import { ChevronLeft, AlertTriangle, CheckCircle, Clock, Star, X } from 'lucide-react';
// import { IoIosArrowRoundDown } from "react-icons/io";
// import { CiBookmark } from "react-icons/ci";
// import cup from "../../assets/cup.png";
// import { useNavigate } from 'react-router-dom';
// import CorrectAnswer from '../../components/Practive_view/timely_active_popups/CorrectAnswer';
// import WrongAnswer from '../../components/Practive_view/timely_active_popups/WrongAnswer';
// import sandclock from "../../components/Practive_view/temp_icons/sandclock.png";
// // Sample data with only single and multi choice questions
// const questionData = {
//   level1: {
//     title: "Electric Charges And Fields",
//     level: 1,
//     showTimer: false,
//     questions: [
//       {
//         questionId: "l1_q1",
//         type: "SINGLE_CHOICE",
//         question: "Which of the following is not a type of charge?",
//         options: [
//           { id: 'A', text: 'Positive charge' },
//           { id: 'B', text: 'Negative charge' },
//           { id: 'C', text: 'Neutral charge' },
//           { id: 'D', text: 'Magnetic charge' }
//         ],
//         answer: "D",
//         answerEx: "There are only two types of electric charges: positive and negative. Neutral means no charge. Magnetic charge doesn't exist - magnets have poles (north and south), not charges.",
//         marks: "1",
//         difficulty: "Easy"
//       },
//       {
//         questionId: "l1_q2", 
//         type: "SINGLE_CHOICE",
//         question: "What is the SI unit of electric charge?",
//         options: [
//           { id: 'A', text: 'Volt' },
//           { id: 'B', text: 'Ampere' },
//           { id: 'C', text: 'Coulomb' },
//           { id: 'D', text: 'Ohm' }
//         ],
//         answer: "C",
//         answerEx: "The coulomb (C) is the SI unit of electric charge. It is defined as the amount of charge transported by a constant current of one ampere in one second.",
//         marks: "1",
//         difficulty: "Easy"
//       }
//     ]
//   },
//   level2: {
//     title: "Electric Charges And Fields",
//     level: 2,
//     showTimer: false,
//     questions: [
//       {
//         questionId: "l2_q1",
//         type: "MULTI_CHOICE", 
//         question: "Which of the following are properties of electric field lines? (Select all that apply)",
//         options: [
//           { id: 'A', text: 'They never intersect' },
//           { id: 'B', text: 'They start from positive charges' },
//           { id: 'C', text: 'They can form closed loops' },
//           { id: 'D', text: 'They end on negative charges' }
//         ],
//         answer: ["A", "B", "D"],
//         answerEx: "Electric field lines never intersect, originate from positive charges, and terminate on negative charges. They do not form closed loops in electrostatics.",
//         marks: "2",
//         difficulty: "Medium"
//       },
//       {
//         questionId: "l2_q2",
//         type: "SINGLE_CHOICE",
//         question: "Coulomb's law states that the force between two point charges is:",
//         options: [
//           { id: 'A', text: 'Directly proportional to the square of distance' },
//           { id: 'B', text: 'Inversely proportional to the square of distance' },
//           { id: 'C', text: 'Directly proportional to the distance' },
//           { id: 'D', text: 'Independent of distance' }
//         ],
//         answer: "B",
//         answerEx: "According to Coulomb's law, the electrostatic force between two point charges is inversely proportional to the square of the distance between them. F = kq₁q₂/r²",
//         marks: "1",
//         difficulty: "Medium"
//       }
//     ]
//   },
//   level3: {
//     title: "Coulomb Law",
//     level: 3,
//     showTimer: true,
//     timeLimit: 120,
//     questions: [
//       {
//         questionId: "l3_q1",
//         type: "SINGLE_CHOICE",
//         question: "If the distance between two charges is doubled, by what factor does the electrostatic force change?",
//         options: [
//           { id: 'A', text: 'Becomes 2 times' },
//           { id: 'B', text: 'Becomes 4 times' },
//           { id: 'C', text: 'Becomes 1/2 times' },
//           { id: 'D', text: 'Becomes 1/4 times' }
//         ],
//         answer: "D",
//         answerEx: "When distance is doubled, the force becomes 1/4 times the original force because force is inversely proportional to the square of distance (1/r²). So it changes by a factor of 4.",
//         marks: "2",
//         difficulty: "Medium"
//       },
//       {
//         questionId: "l3_q2",
//         type: "MULTI_CHOICE",
//         question: "Select all correct statements about Coulomb's law:",
//         options: [
//           { id: 'A', text: 'Force is directly proportional to product of charges' },
//           { id: 'B', text: 'Force is inversely proportional to distance' },
//           { id: 'C', text: 'Force acts along the line joining the charges' },
//           { id: 'D', text: 'Like charges attract each other' }
//         ],
//         answer: ["A", "C"],
//         answerEx: "Force is directly proportional to the product of charges and acts along the line joining them. Force is inversely proportional to the square of distance (not just distance), and like charges repel.",
//         marks: "2",
//         difficulty: "Hard"
//       }
//     ]
//   },
//   level4: {
//     title: "Coulomb Law",
//     level: 4,
//     showTimer: true,
//     timeLimit: 90,
//     questions: [
//       {
//         questionId: "l4_q1",
//         type: "SINGLE_CHOICE",
//         question: "What happens to the electric force between two charges when the distance is doubled?",
//         options: [
//           { id: 'A', text: 'Force becomes half' },
//           { id: 'B', text: 'Force becomes double' },
//           { id: 'C', text: 'Force becomes one-fourth' },
//           { id: 'D', text: 'Force remains same' }
//         ],
//         answer: "C",
//         answerEx: "When distance is doubled, the force becomes 1/4 times the original force because force is inversely proportional to the square of distance (1/r²).",
//         marks: "1",
//         difficulty: "Medium"
//       },
//       {
//         questionId: "l4_q2",
//         type: "MULTI_CHOICE",
//         question: "Which of the following are true about electric charges?",
//         options: [
//           { id: 'A', text: 'Charge is quantized' },
//           { id: 'B', text: 'Charge is conserved' },
//           { id: 'C', text: 'Charge can be created' },
//           { id: 'D', text: 'Charge is additive' }
//         ],
//         answer: ["A", "B", "D"],
//         answerEx: "Electric charge is quantized (exists in discrete units), conserved (total charge remains constant), and additive (total charge is the algebraic sum). Charge cannot be created or destroyed, only transferred.",
//         marks: "2",
//         difficulty: "Hard"
//       }
//     ]
//   }
// };

// // Success Popup Component
// const SuccessPopup = ({ show, message, icon, onClose }) => {
//   useEffect(() => {
//     if (show) {
//       const timer = setTimeout(onClose, 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [show, onClose]);

//   if (!show) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
//       <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center animate-bounce shadow-2xl">
//         <div className="mb-4 flex justify-center">
//           {icon}
//         </div>
//         <h3 className="text-lg font-semibold text-gray-800 mb-2">{message}</h3>
        
//       </div>
//     </div>
//   );
// };

// // Report Popup Component
// const ReportPopup = ({ show, onClose, questionId }) => {
//   const [selectedIssue, setSelectedIssue] = useState('');
//   const [feedback, setFeedback] = useState('');

//   const issues = [
//     'Incorrect or incomplete question',
//     'Incorrect or incomplete options',
//     'Formatting or image quality issue',
//     'Other'
//   ];

//   const handleSubmit = () => {
//     console.log('Report submitted:', { questionId, issue: selectedIssue, feedback });
//     onClose();
//     setSelectedIssue('');
//     setFeedback('');
//   };

//   if (!show) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
//         <div className="flex items-center justify-between p-4 border-b">
//           <h3 className="text-lg font-semibold text-gray-800">Report Question</h3>
//           <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
//             <X className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>
        
//         <div className="p-4 space-y-4">
//           <div className="space-y-3">
//             {issues.map((issue, index) => (
//               <label key={index} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
//                 <input
//                   type="radio"
//                   name="issue"
//                   value={issue}
//                   checked={selectedIssue === issue}
//                   onChange={(e) => setSelectedIssue(e.target.value)}
//                   className="w-4 h-4 text-cyan-400 focus:ring-cyan-400"
//                 />
//                 <span className="text-sm text-gray-700">{issue}</span>
//               </label>
//             ))}
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Additional Feedback
//             </label>
//             <textarea
//               value={feedback}
//               onChange={(e) => setFeedback(e.target.value)}
//               placeholder="Please provide additional details..."
//               rows={4}
//               className="w-full p-3 border border-gray-300 rounded-xl focus:border-cyan-400 focus:outline-none resize-none text-sm"
//             />
//           </div>
//         </div>
        
//         <div className="p-4 border-t">
//           <button
//             onClick={handleSubmit}
//             disabled={!selectedIssue}
//             className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${
//               selectedIssue
//                 ? 'bg-cyan-400 text-white hover:bg-cyan-500 shadow-lg'
//                 : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//             }`}
//           >
//             Submit Report
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Timer Component
// const Timer = ({ timeLimit, onTimeUp, isPaused }) => {
//   const [timeLeft, setTimeLeft] = useState(timeLimit);

//   useEffect(() => {
//     if (timeLeft <= 0) {
//       onTimeUp();
//       return;
//     }

//     if (isPaused) return;

//     const timer = setInterval(() => {
//       setTimeLeft(prev => prev - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft, onTimeUp, isPaused]);

//   const minutes = Math.floor(timeLeft / 60);
//   const seconds = timeLeft % 60;

//   return (
//     <div className={`flex items-center gap-1 ${timeLeft <= 30 ? 'text-red-500' : 'text-gray-700'}`}>
//       <Clock size={16} />
//       <span className="text-sm font-semibold">{seconds.toString().padStart(2, '0')}s</span>
//       <span className="text-sm font-semibold">left</span>
//     </div>
//   );
// };

// // TimeOver Popup Component
// const TimeOverPopup = ({ show, onClose }) => {
//   useEffect(() => {
//     if (show) {
//       const timer = setTimeout(onClose, 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [show, onClose]);

//   if (!show) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
//       <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
//         <div className="mb-4 flex justify-center">
//           <img src={sandclock} alt="" />
//         </div>
//         <h3 className="text-xl font-semibold text-gray-800 mb-2">Time's Up!</h3>
//         <div className="text-sm text-gray-600">Moving to next question...</div>
//       </div>
//     </div>
//   );
// };

// // Single Choice Component
// const SingleChoice = ({ question, selectedAnswer, onAnswerSelect, isSubmitted }) => (
//   <div className="w-[90vw] space-y-4">
//     <div className="text-gray-800 text-base sm:text-lg leading-relaxed font-medium">
//       {question.question}
//     </div>
//     <div className="space-y-3">
//       <div className="text-[12px] text-gray-500 font-medium">
//         Select one option
//       </div>
//       {question.options.map((option) => (
//         <button
//           key={option.id}
//           onClick={() => !isSubmitted && onAnswerSelect(option.id)}
//           disabled={isSubmitted}
//           className={`w-full p-3 rounded-xl border text-left transition-all duration-200 ${
//             isSubmitted && option.id === question.answer
//               ? 'border-green-500 bg-green-50 shadow-md'
//               : isSubmitted && selectedAnswer === option.id && selectedAnswer !== question.answer
//               ? 'border-red-500 bg-red-50 shadow-md'
//               : selectedAnswer === option.id
//               ? 'border-cyan-400 bg-cyan-50 shadow-md'
//               : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
//           } ${isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02]'}`}
//         >
//           <span className="font-bold text-gray-700 mr-3">{option.id}.</span>
//           <span className="text-gray-800">{option.text}</span>
//         </button>
//       ))}
//     </div>
//   </div>
// );

// // Multi Choice Component
// const MultiChoice = ({ question, selectedAnswer = [], onAnswerSelect, isSubmitted }) => {
//   const handleToggle = (optionId) => {
//     if (isSubmitted) return;
    
//     const current = Array.isArray(selectedAnswer) ? selectedAnswer : [];
//     const newSelection = current.includes(optionId)
//       ? current.filter(id => id !== optionId)
//       : [...current, optionId];
//     onAnswerSelect(newSelection);
//   };

//   const isCorrectOption = (optionId) => {
//     return question.answer.includes(optionId);
//   };

//   const isSelected = (optionId) => {
//     return Array.isArray(selectedAnswer) && selectedAnswer.includes(optionId);
//   };

//   return (
//     <div className="w-[90vw] space-y-4">
//       <div className="text-gray-800 text-base sm:text-lg leading-relaxed font-medium">
//         {question.question}
//       </div>
//       <div className="space-y-3">
//         <div className="text-[12px] text-gray-500 font-medium">
//           Select all that apply
//         </div>
//         {question.options.map((option) => (
//           <button
//             key={option.id}
//             onClick={() => handleToggle(option.id)}
//             disabled={isSubmitted}
//             className={`w-full p-3 rounded-xl border text-left transition-all duration-200 ${
//               isSubmitted && isCorrectOption(option.id)
//                 ? 'border-green-500 bg-green-50 shadow-md'
//                 : isSubmitted && isSelected(option.id) && !isCorrectOption(option.id)
//                 ? 'border-red-500 bg-red-50 shadow-md'
//                 : isSelected(option.id)
//                 ? 'border-cyan-400 bg-cyan-50 shadow-md'
//                 : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
//             } ${isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02]'}`}
//           >
//             <span className="font-bold text-gray-700 mr-3">{option.id}.</span>
//             <span className="text-gray-800">{option.text}</span>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default function PracticeQuestionsUI() {
//   const [currentLevel, setCurrentLevel] = useState('level3');
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [userAnswers, setUserAnswers] = useState({});
//   const [showSolution, setShowSolution] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState({});
//   const [startTime, setStartTime] = useState(null);
//   const [showPopup, setShowPopup] = useState(false);
//   const [popupData, setPopupData] = useState({ message: '', icon: null });
//   const [showReportPopup, setShowReportPopup] = useState(false);
//   const [showTimeOver, setShowTimeOver] = useState(false);
//   const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
//   const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const [swipeDirection, setSwipeDirection] = useState(null);
//   const [timerPaused, setTimerPaused] = useState(false);
//   const containerRef = useRef(null);
//   const solutionRef = useRef(null);
//   const levelData = questionData[currentLevel];
//   const questions = levelData?.questions || [];
//   const currentQuestion = questions[currentQuestionIndex];
//   const totalQuestions = questions.length;

//   useEffect(() => {
//     setStartTime(Date.now());
//   }, [currentQuestionIndex, currentLevel]);

//   const handleAnswerChange = (answer) => {
//     const key = `${currentLevel}_${currentQuestionIndex}`;
//     setUserAnswers(prev => ({ ...prev, [key]: answer }));
//   };

//   const getCurrentAnswer = () => {
//     const key = `${currentLevel}_${currentQuestionIndex}`;
//     return userAnswers[key];
//   };

//   const isCurrentQuestionSubmitted = () => {
//     const key = `${currentLevel}_${currentQuestionIndex}`;
//     return isSubmitted[key] || false;
//   };

//   const hasAnswered = () => {
//     const answer = getCurrentAnswer();
//     if (currentQuestion?.type === 'MULTI_CHOICE') {
//       return Array.isArray(answer) && answer.length > 0;
//     }
//     return answer !== undefined && answer !== null && answer !== '';
//   };

//   const checkAnswer = () => {
//     const userAnswer = getCurrentAnswer();
//     const correctAnswer = currentQuestion.answer;
    
//     if (currentQuestion.type === 'SINGLE_CHOICE') {
//       return userAnswer === correctAnswer;
//     } else if (currentQuestion.type === 'MULTI_CHOICE') {
//       const userSet = new Set(userAnswer || []);
//       const correctSet = new Set(correctAnswer);
//       return userSet.size === correctSet.size && [...userSet].every(val => correctSet.has(val));
//     }
//     return false;
//   };
//    const navigate = useNavigate()
//   const handleSubmit = () => {
//     const endTime = Date.now();
//     const timeTaken = (endTime - startTime) / 1000;
//     const key = `${currentLevel}_${currentQuestionIndex}`;
    
//     setIsSubmitted(prev => ({ ...prev, [key]: true }));
//     setShowSolution(true);
//     setTimerPaused(true);
    
//     const isCorrect = checkAnswer();
    
//     // if (isCorrect) {
//     //   if (timeTaken <= 5) {
//     //     setPopupData({ 
//     //       message: 'Brilliant!', 
//     //       icon: <Star className="w-12 h-12 text-yellow-500" /> 
//     //     });
//     //   } else if (timeTaken <= 10) {
//     //     setPopupData({ 
//     //       message: 'A little late but great!', 
//     //       icon: <Clock className="w-12 h-12 text-orange-500" /> 
//     //     });
//     //   } else {
//     //     setPopupData({ 
//     //       message: 'Good job!', 
//     //       icon: <CheckCircle className="w-12 h-12 text-green-500" /> 
//     //     });
//     //   }
//     // } else {
//     //   setPopupData({ 
//     //     message: 'Keep trying!', 
//     //     icon: <CheckCircle className="w-12 h-12 text-red-500" /> 
//     //   });
//     // }

//     if(isCorrect){ 
//       <CorrectAnswer/>
//     }else {
//       <WrongAnswer/>
//     }
    
//     setShowPopup(true);
//   };

//   const transitionToQuestion = (newIndex, direction) => {
//     setIsTransitioning(true);
//     setSwipeDirection(direction);
    
//     setTimeout(() => {
//       setCurrentQuestionIndex(newIndex);
//       setShowSolution(false);
//       setTimerPaused(false);
//       setTimeout(() => {
//         setIsTransitioning(false);
//         setSwipeDirection(null);
//       }, 50);
//     }, 150);
//   };

//   const nextQuestion = () => {
//     if (currentQuestionIndex < totalQuestions - 1) {
//       transitionToQuestion(currentQuestionIndex + 1, 'next');
//     }
//   };

//   const prevQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       transitionToQuestion(currentQuestionIndex - 1, 'prev');
//     }
//   };

//   const handleTouchStart = (e) => {
//     // Disable swipe for timed questions
//     if (levelData?.showTimer) return;
    
//     setTouchStart({
//       x: e.targetTouches[0].clientX,
//       y: e.targetTouches[0].clientY
//     });
//     setTouchEnd({ x: 0, y: 0 });
//   };

//   const handleTouchMove = (e) => {
//     // Disable swipe for timed questions
//     if (levelData?.showTimer) return;
    
//     setTouchEnd({
//       x: e.targetTouches[0].clientX,
//       y: e.targetTouches[0].clientY
//     });
//   };

//   const handleTouchEnd = (e) => {
//     // Disable swipe for timed questions
//     if (levelData?.showTimer) return;
    
//     if (!touchStart.x || !touchEnd.x) return;
    
//     const deltaX = touchStart.x - touchEnd.x;
//     const deltaY = touchStart.y - touchEnd.y;
    
//     if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
//       e.preventDefault();
      
//       const isLeftSwipe = deltaX > 0;
//       const isRightSwipe = deltaX < 0;

//       if (isLeftSwipe && currentQuestionIndex < totalQuestions - 1) {
//         nextQuestion();
//       }
//       if (isRightSwipe && currentQuestionIndex > 0) {
//         prevQuestion();
//       }
//     }

//     setTouchStart({ x: 0, y: 0 });
//     setTouchEnd({ x: 0, y: 0 });
//   };

//   const goToQuestion = (index) => {
//     // Disable navigation for timed questions
//     if (levelData?.showTimer) return;
    
//     if (index !== currentQuestionIndex) {
//       const direction = index > currentQuestionIndex ? 'next' : 'prev';
//       transitionToQuestion(index, direction);
//     }
//   };

//   const renderQuestion = () => {
//     if (!currentQuestion) return null;

//     const props = {
//       question: currentQuestion,
//       showSolution,
//       selectedAnswer: getCurrentAnswer(),
//       userAnswer: getCurrentAnswer(),
//       onAnswerSelect: handleAnswerChange,
//       onAnswerChange: handleAnswerChange,
//       isSubmitted: isCurrentQuestionSubmitted()
//     };

//     const QuestionComponent = {
//       'SINGLE_CHOICE': SingleChoice,
//       'MULTI_CHOICE': MultiChoice,
//     }[currentQuestion.type] || SingleChoice;

//     return <QuestionComponent {...props} />;
//   };

//   const getQuestionStatus = (index) => {
//     const key = `${currentLevel}_${index}`;
//     const hasAnswer = userAnswers[key] !== undefined && userAnswers[key] !== null && userAnswers[key] !== '';
//     const submitted = isSubmitted[key];
     
//     if (!submitted) return 'unanswered';
    
//     // Check if answer was correct
//     const question = questions[index];
//     const userAnswer = userAnswers[key];
//     let isCorrect = false;
    
//     if (question.type === 'SINGLE_CHOICE') {
//       isCorrect = userAnswer === question.answer;
//     } else if (question.type === 'MULTI_CHOICE') {
//       const userSet = new Set(userAnswer || []);
//       const correctSet = new Set(question.answer);
//       isCorrect = userSet.size === correctSet.size && [...userSet].every(val => correctSet.has(val));
//     }
    
//     return isCorrect ? 'correct' : 'incorrect';
//   };
  
//   const scrollToSolution = () => {
//     if (solutionRef.current) {
//       solutionRef.current.scrollIntoView({ behavior: "smooth" });
//     } else if (containerRef.current) {
//       containerRef.current.scrollTo({
//         top: containerRef.current.scrollHeight,
//         behavior: "smooth",
//       });
//     }
//     const solutionBtn = document.getElementById('solution');
//     if (solutionBtn) solutionBtn.style.display = 'none';
//   };

//   const handleTimeUp = () => {
//     if (levelData?.showTimer) {
//       setShowTimeOver(true);
//       setTimerPaused(true);
//     }
//   };

//   const handleTimeOverClose = () => {
//     setShowTimeOver(false);
//     if (currentQuestionIndex < totalQuestions - 1) {
//       nextQuestion();
//     }
//   };

//   const handleBack = () => {
//     navigate(-1)
//     console.log('Going back...');
//   };

//   return (
//     <div className="min-h-screen bg-white flex flex-col">
//       <SuccessPopup 
//         show={showPopup} 
//         message={popupData.message}
//         icon={popupData.icon}
//         onClose={() => setShowPopup(false)}
//       />

//       <TimeOverPopup 
//         show={showTimeOver}
//         onClose={handleTimeOverClose}
//       />

//       <ReportPopup
//         show={showReportPopup}
//         onClose={() => setShowReportPopup(false)}
//         questionId={currentQuestion?.questionId}
//       />

//       {/* Header */}
//       <div ref={containerRef} className="bg-white px-4 py-2 mt-2 flex items-center justify-between sticky top-0 z-20 flex-shrink-0">
//         <div className="flex items-center gap-1 flex-1 min-w-0">
//           <ChevronLeft onClick={handleBack} size={24} className='mb-1 flex-shrink-0 cursor-pointer' />
//           <h1 className="text-lg mt-1 font-semibold text-gray-800 truncate">
//             {levelData?.title} - Level {levelData?.level}
//           </h1>
//         </div>
//         {levelData?.showTimer && (
//           <div className="flex-shrink-0 mr-3">
//             <Timer 
//               timeLimit={levelData.timeLimit} 
//               onTimeUp={handleTimeUp}
//               isPaused={timerPaused}
//             />
//           </div>
//         )}
//       </div>

//       {/* Reward strip */}
//       <div className='w-full flex justify-center rounded-2xl items-center'>
//        <div className='w-[90%] flex gap-2  px-2 py-2 bg-[#E9FBFC99]'>
//         <img className='w-6 h-6 object-cover' src={cup} alt="" /> 
//         <p style={{fontWeight:600}} className='text-[15px]'>To win: <span className='text-[#696969]'>Solve 2 questions continously</span> </p>
//       </div>
//      </div>

//       {/* Question Navigation */}
//       <div className="bg-white px-4 py-1 flex-shrink-0 relative">
//         <div className="flex gap-2 overflow-x-auto pb-2 relative">
//           {questions.map((_, index) => {
//             const status = getQuestionStatus(index);
//             return (
//               <button
//                 key={index}
//                 onClick={() => goToQuestion(index)}
//                 disabled={levelData?.showTimer}
//                 className={`relative w-8 h-8 rounded-full mt-2 ml-1 text-sm font-semibold flex-shrink-0 transition-all duration-200
//                   ${
//                     status === "correct"
//                       ? "bg-green-400 text-white shadow-md"
//                       : status === "incorrect"
//                       ? "bg-red-400 text-white shadow-md"
//                       : "bg-transparent text-gray-600"
//                   }
//                   ${levelData?.showTimer ? 'cursor-not-allowed opacity-60' : 'hover:scale-110'}
//                 `}
//               >
//                 {index + 1}
//               </button>
//             );
//           })}

//           <div
//             className="absolute bottom-0 h-[3px] bg-cyan-400 rounded-full transition-all duration-300"
//             style={{
//               width: "2.5rem",
//               transform: `translateX(${currentQuestionIndex * (32 + 13)}px)` 
//             }}
//           />
//         </div>
//       </div>

//       {/* Question Content Container */}
//       <div className="flex-1 relative bg-white overflow-hidden">
//         <div 
//           className={`h-full overflow-y-auto max-h-[calc(100vh-200px)] transition-transform duration-300 ease-in-out ${
//             isTransitioning 
//               ? swipeDirection === 'next' 
//                 ? '-translate-x-full opacity-0' 
//                 : 'translate-x-full opacity-0'
//               : 'translate-x-0 opacity-100'
//           }`}
//           onTouchStart={handleTouchStart}
//           onTouchMove={handleTouchMove}
//           onTouchEnd={handleTouchEnd}
//           style={{ touchAction: 'pan-y' }}
//         >
//           <div className="h-full flex flex-col items-center overflow-y-auto pb-24" style={{ scrollbarWidth: 'thin' }}>
//             <div className="flex p-2 w-full px-6 items-center justify-between text-sm">
//               <span className="bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-medium">
//                 NEET 25-2026
//               </span>
//               <CiBookmark className='text-[#8C8D92]' size={20} />
//             </div>
            
//             <div className="p-2 sm:p-6 my-1 rounded-2xl">
//               {renderQuestion()}
//             </div>

//             {/* Solution Section */}
//             {showSolution && currentQuestion && (
//               <div ref={solutionRef} className="mx-4 mb-[12vh] rounded-2xl overflow-hidden">
//                 <div className="px-2 flex items-center justify-between">
//                   <div className="flex w-full justify-between gap-3">
//                     <div className="flex flex-col items-center gap-1">
//                       <span className="font-semibold text-[22px] text-gray-800">Solution</span>
//                       <span className="bg-cyan-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">
//                         <p className='text-[14px] text-cyan-600'>{currentQuestion.difficulty}</p>
//                       </span>
//                     </div>
//                     <div onClick={() => setShowReportPopup(true)} className="p-2 rounded-lg cursor-pointer">
//                       <AlertTriangle className="w-6 h-6 text-black" />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="px-4 py-2 text-sm sm:text-base text-gray-700 leading-relaxed">
//                   {currentQuestion.answerEx}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Bottom Actions */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white p-4 z-10 flex-shrink-0">
//         <div className="flex gap-3 mb-3">
//           {!isCurrentQuestionSubmitted() ? (
//             <>
//               {hasAnswered() ? (
//                 <button
//                   onClick={handleSubmit}
//                   className="bg-[#26C6DA] max-w-[35vw] ml-auto text-white px-8 py-3 rounded-xl font-semibold text-base flex-1 transition-all duration-200 shadow-lg transform"
//                 >
//                   Submit
//                 </button>
//               ) : (
//                 <button
//                   onClick={nextQuestion}
//                   disabled={currentQuestionIndex >= totalQuestions - 1 || levelData?.showTimer}
//                   className={`px-2 max-w-[30vw] ml-auto text-white py-3 rounded-xl font-semibold text-base flex-1 transition-all duration-200 ${
//                     currentQuestionIndex >= totalQuestions - 1 || levelData?.showTimer
//                       ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                       : 'bg-cyan-500'
//                   }`}
//                 >
//                   {levelData?.showTimer ? 'Submit' : 'Next'}
//                 </button>
//               )}
//             </>
//           ) : (
//             <button
//               onClick={nextQuestion}
//               disabled={currentQuestionIndex >= totalQuestions - 1}
//               className={`px-8 py-3 text-white max-w-[30vw] ml-auto rounded-xl font-semibold text-base flex-1 transition-all duration-200 ${
//                 currentQuestionIndex >= totalQuestions - 1
//                   ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                   : 'bg-[#26C6DA] shadow-lg transform hover:scale-105'
//               }`}
//             >
//               Next
//             </button>
//           )}
//         </div>
//       </div>  
         
//       {showSolution && (
//         <div onClick={scrollToSolution} id='solution' className='absolute bottom-24 w-fit h-fit left-1/2 transform -translate-x-1/2 bg-black/70 text-white flex justify-center p-1 text-sm px-3 rounded-full z-10 cursor-pointer'>
//           <p>view solution</p> 
//           <IoIosArrowRoundDown size={18} />
//         </div>
//       )}
//     </div>
//   );
// }




import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, AlertTriangle, CheckCircle, Clock, X, Trophy } from 'lucide-react';
import cup from "../../assets/cup.png"
import { useNavigate } from 'react-router-dom';

// Sample data with levels 1-5
const questionData = {
  level1: {
    title: "Electric",
    level: 1,
    showTimer: false,
    requiredConsecutive: 2,
    questions: [
      {
        questionId: "l1_q1",
        type: "SINGLE_CHOICE",
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
        difficulty: "Easy"
      },
      {
        questionId: "l1_q2", 
        type: "SINGLE_CHOICE",
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
        difficulty: "Easy"
      },
      {
        questionId: "l1_q3",
        type: "SINGLE_CHOICE",
        question: "Like charges:",
        options: [
          { id: 'A', text: 'Attract each other' },
          { id: 'B', text: 'Repel each other' },
          { id: 'C', text: 'Neither attract nor repel' },
          { id: 'D', text: 'Sometimes attract, sometimes repel' }
        ],
        answer: "B",
        answerEx: "Like charges always repel each other. This is a fundamental property of electric charges.",
        marks: "1",
        difficulty: "Easy"
      },
      {
        questionId: "l1_q4",
        type: "SINGLE_CHOICE",
        question: "Unlike charges:",
        options: [
          { id: 'A', text: 'Attract each other' },
          { id: 'B', text: 'Repel each other' },
          { id: 'C', text: 'Neither attract nor repel' },
          { id: 'D', text: 'Create magnetic field' }
        ],
        answer: "A",
        answerEx: "Unlike charges (positive and negative) always attract each other.",
        marks: "1",
        difficulty: "Easy"
      }
    ]
  },
  level2: {
    title: "Electric Charges And Fields",
    level: 2,
    showTimer: false,
    requiredConsecutive: 3,
    questions: [
      {
        questionId: "l2_q1",
        type: "SINGLE_CHOICE", 
        question: "Which of the following are properties of electric field lines?",
        options: [
          { id: 'A', text: 'They never intersect' },
          { id: 'B', text: 'They start from positive charges' },
          { id: 'C', text: 'They can form closed loops' },
          { id: 'D', text: 'They end on negative charges' }
        ],
        answer: "A",
        answerEx: "Electric field lines never intersect, originate from positive charges, and terminate on negative charges. They do not form closed loops in electrostatics.",
        marks: "2",
        difficulty: "Medium"
      },
      {
        questionId: "l2_q2",
        type: "SINGLE_CHOICE",
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
        difficulty: "Medium"
      },
      {
        questionId: "l2_q3",
        type: "SINGLE_CHOICE",
        question: "The SI unit of electric field is:",
        options: [
          { id: 'A', text: 'N/C' },
          { id: 'B', text: 'C/N' },
          { id: 'C', text: 'V' },
          { id: 'D', text: 'A' }
        ],
        answer: "A",
        answerEx: "The SI unit of electric field is Newton per Coulomb (N/C) or Volt per meter (V/m).",
        marks: "1",
        difficulty: "Medium"
      },
      {
        questionId: "l2_q4",
        type: "SINGLE_CHOICE",
        question: "Electric flux is maximum when angle between field and area is:",
        options: [
          { id: 'A', text: '0°' },
          { id: 'B', text: '45°' },
          { id: 'C', text: '90°' },
          { id: 'D', text: '180°' }
        ],
        answer: "A",
        answerEx: "Electric flux is maximum when the electric field is perpendicular to the surface (angle = 0°).",
        marks: "1",
        difficulty: "Medium"
      }
    ]
  },
  level3: {
    title: "Electric",
    level: 3,
    showTimer: true,
    requiredConsecutive: 4,
    questions: [
      {
        questionId: "l3_q1",
        type: "SINGLE_CHOICE", 
        timer: 30,
        question: "Which of the following are properties of electric field lines?",
        options: [
          { id: 'A', text: 'They never intersect' },
          { id: 'B', text: 'They start from positive charges' },
          { id: 'C', text: 'They can form closed loops' },
          { id: 'D', text: 'They end on negative charges' }
        ],
        answer: "A",
        answerEx: "Electric field lines never intersect, originate from positive charges, and terminate on negative charges. They do not form closed loops in electrostatics.",
        marks: "2",
        difficulty: "Hard"
      },
      {
        questionId: "l3_q2",
        type: "SINGLE_CHOICE",
        timer: 40,
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
        difficulty: "Hard"
      },
      {
        questionId: "l3_q3",
        type: "SINGLE_CHOICE",
        timer: 45,
        question: "The SI unit of electric field is:",
        options: [
          { id: 'A', text: 'N/C' },
          { id: 'B', text: 'C/N' },
          { id: 'C', text: 'V' },
          { id: 'D', text: 'A' }
        ],
        answer: "A",
        answerEx: "The SI unit of electric field is Newton per Coulomb (N/C) or Volt per meter (V/m).",
        marks: "1",
        difficulty: "Hard"
      },
      {
        questionId: "l3_q4",
        type: "SINGLE_CHOICE",
        timer: 25,
        question: "Electric flux is maximum when angle between field and area is:",
        options: [
          { id: 'A', text: '0°' },
          { id: 'B', text: '45°' },
          { id: 'C', text: '90°' },
          { id: 'D', text: '180°' }
        ],
        answer: "A",
        answerEx: "Electric flux is maximum when the electric field is perpendicular to the surface (angle = 0°).",
        marks: "1",
        difficulty: "Hard"
      }
    ]
  }
};

// Time's Up Popup
const TimeUpPopup = ({ show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
        <div className="mb-4 flex justify-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
            <Clock className="w-12 h-12 text-orange-500" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-orange-600 mb-2">Time's Up!</h3>
        <p className="text-gray-600">Redirecting to next question...</p>
      </div>
    </div>
  );
};

// Correct Answer Popup
const CorrectAnswerPopup = ({ show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
        <div className="mb-4 flex justify-center">
          
            <CheckCircle className="w-12 h-12 text-green-500" />
          
        </div>
        
        <p className="text-gray-600">Correct Answer ! Keep going ! you're doing great</p>
      </div>
    </div>
  );
};

// Wrong Answer Popup
const WrongAnswerPopup = ({ show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 10000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);
  
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-[85%] text-center shadow-2xl">
        <div className="mb-4 flex justify-center">
          
            <X className="w-12 h-12 text-red-500" />
          
        </div>
        
        <p className="text-gray-600">hhhj, thoda socket or time leke answer dein!</p>
      </div>
    </div>
  );
};

// Level Completion Popup
const LevelCompletionPopup = ({ show, level, onClose, onContinue }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onContinue();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onContinue]);

  // Level-wise messages
  const getLevelMessage = (level) => {
    const messages = {
      1: {
        title: "Level 1 crossed",
        message: "Apne basic concepts clear kar liye, ab unhe apply karne ke liye tayyar ho jao 💪",
        bgColor: "bg-[#D0FDFF]",
        levelImage:"../../assets/level1st.png"
      },
      2: {
        title: "Level 2 crossed",
        message: "Apne concepts to apply kar liye hain, ab time ko beat karne ke liye ready raho ⏱",
        bgColor: "bg-[#FFE4D0]",
        levelImage:"../../assets/level2nd.png"
      },
      3: {
        title: "Level 3 crossed",
        message: "Apne time beat kar liya hai, ab actual NEET ke questions solve karne ke liye ready ho jao 🚀",
        bgColor: "bg-[#E4D0FF]",
        levelImage:"../../assets/level3rd.png"
      },
      4: {
        title: "NEET Level Crossed",
        message: "Ab chahe exam kitna bhi tough ho, aap uske liye tayyar ho 💪",
        bgColor: "bg-[#FFD0E4]",
        levelImage:"../../assets/level4th.png"
      },
      5: {
        title: "Level 5 crossed",
        message: "Yeh topic NEET ke liye ready hai, ab aapko doctor banne se koi nahi rok sakta 🎯",
        bgColor: "bg-[#D0FFE4]",
        levelImage:"../../assets/level5th.png"
      }
    };
    
    return messages[level] || messages[1];
  };

  const levelData = getLevelMessage(level);

  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
        
        <div className="flex flex-col rounded-2xl items-center justify-center gap-4 mb-6">
          <div className={`w-[100px] h-[100px] ${levelData.bgColor} rounded-full overflow-hidden flex items-center justify-center flex-shrink-0`}>
            <img className='w-[95%] h-[95%] object-cover' src={levelData.levelImage} alt="" />
          </div>
          <div className="flex-1 w-[100%] text-center items-center justify-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{levelData.title}</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {levelData.message}
            </p>
          </div>
        </div>
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

// Single Choice Component
const SingleChoice = ({ question, selectedAnswer, onAnswerSelect, isSubmitted }) => (
  <div className="w-full space-y-4">
    <div className="text-gray-800 text-base sm:text-lg leading-relaxed font-medium">
      {question.question}
    </div>
    <div className="space-y-3">
      <div className="text-[12px] text-gray-500 font-medium">
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
  const [currentLevel, setCurrentLevel] = useState('level1');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showSolution, setShowSolution] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState({});
  const [showCorrectPopup, setShowCorrectPopup] = useState(false);
  const [showWrongPopup, setShowWrongPopup] = useState(false);
  const [showTimeUpPopup, setShowTimeUpPopup] = useState(false);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [visibleQuestions, setVisibleQuestions] = useState([0]);
  const [timeLeft, setTimeLeft] = useState(0);
  const containerRef = useRef(null);
  const solutionRef = useRef(null);
  const timerRef = useRef(null);
  const [showViewSolutionBtn, setShowViewSolutionBtn] = useState(true);
  const levelData = questionData[currentLevel];
  const questions = levelData?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const requiredConsecutive = levelData?.requiredConsecutive || 2;
  const showTimer = levelData?.showTimer || false;

  // Timer effect
  useEffect(() => {
    if (showTimer && currentQuestion?.timer && !isCurrentQuestionSubmitted()) {
      setTimeLeft(currentQuestion.timer);
      
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [currentQuestionIndex, currentLevel, showTimer]);

  const handleTimeUp = () => {
    const key = `${currentLevel}_${currentQuestionIndex}`;
    setIsSubmitted(prev => ({ ...prev, [key]: true }));
    setShowSolution(true);
    setShowTimeUpPopup(true);
    setConsecutiveCorrect(0);
    
    setTimeout(() => {
      setShowTimeUpPopup(false);
      moveToNextQuestion();
    }, 2000);
  };

  const handleAnswerChange = (answer) => {
    const key = `${currentLevel}_${currentQuestionIndex}`;
    setUserAnswers(prev => ({ ...prev, [key]: answer }));
  };

  const getCurrentAnswer = () => {
    const key = `${currentLevel}_${currentQuestionIndex}`;
    return userAnswers[key];
  };

  const isCurrentQuestionSubmitted = () => {
    const key = `${currentLevel}_${currentQuestionIndex}`;
    return isSubmitted[key] || false;
  };

  useEffect(() => {
    const key = `${currentLevel}_${currentQuestionIndex}`;
    if (isSubmitted[key]) {
      setShowSolution(true);
    } else {
      setShowSolution(false);
    }
  }, [currentLevel, currentQuestionIndex, isSubmitted]);

  const hasAnswered = () => {
    const answer = getCurrentAnswer();
    return answer !== undefined && answer !== null && answer !== '';
  };

  const checkAnswer = () => {
    const userAnswer = getCurrentAnswer();
    const correctAnswer = currentQuestion.answer;
    return userAnswer === correctAnswer;
  };

  const handleSubmit = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const key = `${currentLevel}_${currentQuestionIndex}`;
    const isCorrect = checkAnswer();
    
    setIsSubmitted(prev => ({ ...prev, [key]: true }));
    setShowSolution(true);
    
    if (isCorrect) {
      setShowCorrectPopup(true);
      const newConsecutive = consecutiveCorrect + 1;
      setConsecutiveCorrect(newConsecutive);
      
      setTimeout(() => {
        setShowCorrectPopup(false);
        
        if (newConsecutive >= requiredConsecutive) {
          setShowLevelComplete(true);
        } else {
          moveToNextQuestion();
        }
      }, 2000);
    } else {
      setShowWrongPopup(true);
      setConsecutiveCorrect(0);
      
      setTimeout(() => {
        setShowWrongPopup(false);
        moveToNextQuestion();
      }, 2000);
    }
  };

  const moveToNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      
      if (!visibleQuestions.includes(nextIndex)) {
        setVisibleQuestions(prev => [...prev, nextIndex]);
      }
      
      setShowSolution(false);
      
      if (containerRef.current) {
        containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleLevelContinue = () => {
    const nextLevelNum = levelData.level + 1;
    const nextLevelKey = `level${nextLevelNum}`;
    
    if (questionData[nextLevelKey]) {
      setCurrentLevel(nextLevelKey);
      setCurrentQuestionIndex(0);
      setVisibleQuestions([0]);
      setConsecutiveCorrect(0);
      setUserAnswers({});
      setIsSubmitted({});
      setShowSolution(false);
      setShowLevelComplete(false);
      setTimeLeft(0);
    }
  };
  const navigate = useNavigate()
  const handleBack = () => {
    navigate(-1)
  };

  const handleLevelCompleteClose = () => {
    handleLevelContinue();
  };

const scrollToSolution = () => {
  if (solutionRef.current && containerRef.current) {
    const container = containerRef.current;
    const solutionElement = solutionRef.current;
    const offsetTop = solutionElement.offsetTop - container.offsetTop;

    container.scrollTo({
      top: offsetTop,
      behavior: 'smooth',
    });
  }
};

// Add scroll listener to hide button when solution is visible
useEffect(() => {
  const container = containerRef.current;
  
  const handleScroll = () => {
    if (container && solutionRef.current) {
      const containerBottom = container.scrollTop + container.clientHeight;
      const solutionTop = solutionRef.current.offsetTop;
      
      // Hide button if solution is visible in viewport
      if (containerBottom >= solutionTop + 50) {
        setShowViewSolutionBtn(false);
      } else {
        setShowViewSolutionBtn(true);
      }
    }
  };

  if (container) {
    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initially
  }

  return () => {
    if (container) {
      container.removeEventListener('scroll', handleScroll);
    }
  };
}, [showSolution]);

  const handleQuestionNavigation = (index) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setCurrentQuestionIndex(index);
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <CorrectAnswerPopup 
        show={showCorrectPopup} 
        onClose={() => setShowCorrectPopup(false)}
      />

      <WrongAnswerPopup 
        show={showWrongPopup} 
        onClose={() => setShowWrongPopup(false)}
      />

      <TimeUpPopup 
        show={showTimeUpPopup} 
        onClose={() => setShowTimeUpPopup(false)}
      />

      <LevelCompletionPopup
        show={showLevelComplete}
        level={levelData?.level}
        onClose={handleLevelCompleteClose}
        onContinue={handleLevelContinue}
      />

      <ReportPopup
        show={showReportPopup}
        onClose={() => setShowReportPopup(false)}
        questionId={currentQuestion?.questionId}
      />

      {/* Header */}
      <div className="bg-white px-4 py-2 mt-2 flex items-center justify-between sticky top-0 z-20 flex-shrink-0">
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <ChevronLeft onClick={handleBack} size={24} className='mb-1 flex-shrink-0 cursor-pointer' />
          <h1 className="text-lg mt-1 font-semibold text-gray-800 truncate max-w-[70vw] overflow-hidden whitespace-nowrap">
            {levelData?.title} - Level {levelData?.level}
          </h1>
        </div>
        {showTimer && currentQuestion?.timer && !isCurrentQuestionSubmitted() && (
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className={`font-semibold ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-800'}`}>
              {timeLeft}s
            </span>
          </div>
        )}
      </div>

      {/* Reward strip */}
      <div className='w-full flex justify-center rounded-2xl items-center'>
       <div className='w-[90%] flex gap-2  px-2 py-2 bg-[#E9FBFC99]'>
        <img className='w-6 h-6 object-cover' src={cup} alt="" /> 
        <p style={{fontWeight:600}} className='text-[15px]'>To win: <span className='text-[#696969]'>Solve {requiredConsecutive} questions continously</span> </p>
      </div>
     </div>
       
      {/* Question Navigation */}
      <div className="bg-white px-4 py-1 flex-shrink-0 relative">
        <div className="flex gap-6 overflow-x-auto pb-2 relative">
          {visibleQuestions.map((index) => {
            const key = `${currentLevel}_${index}`;
            const submitted = isSubmitted[key];
            const question = questions[index];
            const userAnswer = userAnswers[key];
            const isCorrect = submitted && userAnswer === question.answer;
            const canNavigate = true;

            return (
              <button
                key={index}
                onClick={() => canNavigate && handleQuestionNavigation(index)}
                disabled={!canNavigate}
                className={`relative w-8 h-8 rounded-full mt-2 ml-1 text-sm font-semibold flex-shrink-0 transition-all duration-200
                  ${
                    isCorrect
                      ? "bg-[#A8E0BE] text-black shadow-md"
                      : submitted && !isCorrect
                      ? "bg-[#F7DCE3] text-black shadow-md"
                      : "bg-transparent text-gray-600"
                  }
                `}
              >
                {index + 1}
              </button>
            );
          })}

          {/* Cyan underline indicator */}
          <div
            className="absolute bottom-0 h-[3px] bg-cyan-400 rounded-full transition-all duration-300"
            style={{
              width: "2.5rem",
              transform: `translateX(${currentQuestionIndex * (32 + 25)}px)`,
            }}
          />
        </div>
      </div>

      {/* Question Content Container */}
      <div ref={containerRef} className="flex-1 overflow-y-auto pb-24">
        <div className="p-4" style={{ minHeight: '100%' }}>
          {/* Year tag and bookmark */}
          <div className="flex justify-between items-center mb-4">
            <span className="bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-medium">
              NEET 2025-2026
            </span>
            <button className="text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>

          {/* Question */}
          <div className="mb-6">
            <SingleChoice
              question={currentQuestion}
              selectedAnswer={getCurrentAnswer()}
              onAnswerSelect={handleAnswerChange}
              isSubmitted={isCurrentQuestionSubmitted()}
            />
          </div>

          {/* Solution Section */}
          {showSolution && currentQuestion && (
            <div ref={solutionRef} className="mt-6 bg-gray-50 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-lg text-gray-800">Solution</span>
                  <span className="bg-cyan-100 text-cyan-600 px-3 py-1 rounded-full text-xs font-medium">
                    {currentQuestion.difficulty}
                  </span>
                </div>
                <button 
                  onClick={() => setShowReportPopup(true)} 
                  className="p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
                >
                  <AlertTriangle className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="px-4 py-4 text-sm text-gray-700 leading-relaxed">
                {currentQuestion.answerEx}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10 flex-shrink-0">
        <div className="flex justify-end">
          {!isCurrentQuestionSubmitted() && hasAnswered() && (
            <button
              onClick={handleSubmit}
              className="bg-cyan-400 text-white px-8 py-3 rounded-xl font-semibold text-base transition-all duration-200 shadow-lg transform hover:scale-105"
            >
              Submit
            </button>
          )}
        </div>
      </div>

      {/* View Solution Button */}
     {showSolution && showViewSolutionBtn && (
  <button
    onClick={scrollToSolution}
    className='fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-black/70 text-white flex justify-center items-center gap-1 px-4 py-2 text-sm rounded-full z-10 cursor-pointer hover:bg-black/80 transition-colors'
  >
    <span>View solution</span>
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>
)}
    </div>
  );
}