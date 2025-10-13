// const FillInTheBlank = ({ question, userAnswer, onAnswerChange, showSolution, isSubmitted }) => (
//   <div className="space-y-4 w-[90vw]">
//     <div className="text-gray-800 text-base sm:text-lg leading-relaxed font-medium">
//       {question.question}
//     </div>
//     <div className="space-y-3">
//       <p className='text-[12px] text-gray-600'>Type your answer here</p>
//       <input
//         type="text"
//         value={userAnswer || ''}
//         onChange={(e) => !isSubmitted && onAnswerChange(e.target.value)}
//         placeholder="Enter your answer..."
//         disabled={isSubmitted}
//         className={`w-full px-4 py-3 border rounded-xl text-base transition-all duration-200 ${
//           isSubmitted
//             ? userAnswer?.toLowerCase() === question.answer.toLowerCase()
//               ? 'border-green-500 bg-green-50 shadow-md'
//               : 'border-red-500 bg-red-50 shadow-md'
//             : 'border-gray-200 focus:border-cyan-400 focus:shadow-md'
//         } focus:outline-none ${isSubmitted ? 'cursor-not-allowed' : ''}`}
//       />
//       {isSubmitted && (
//         <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
//           <div className="text-sm font-medium text-green-800">
//             Correct Answer: <span className="font-bold">{question.answer}</span>
//           </div>
//         </div>
//       )}
//     </div>
//   </div>
// ); 
