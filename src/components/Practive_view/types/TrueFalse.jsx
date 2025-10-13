// const TrueFalse = ({ question, selectedAnswer, onAnswerSelect, showSolution, isSubmitted }) => (
//   <div className="space-y-4 w-[90vw]">
//     <div className="text-gray-800 text-base sm:text-lg leading-relaxed font-medium">
//       {question.question}
//     </div>
//     <div className="space-y-3">
//       {[
//         { id: 'true', text: 'True', value: true },
//         { id: 'false', text: 'False', value: false }
//       ].map((option) => (
//         <button
//           key={option.id}
//           onClick={() => !isSubmitted && onAnswerSelect(option.value)}
//           disabled={isSubmitted}
//           className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
//             isSubmitted && option.value === question.answer
//               ? 'border-green-500 bg-green-50 shadow-md'
//               : isSubmitted && selectedAnswer === option.value && selectedAnswer !== question.answer
//               ? 'border-red-500 bg-red-50 shadow-md'
//               : selectedAnswer === option.value
//               ? 'border-cyan-400 bg-cyan-50 shadow-md'
//               : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
//           } ${isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02]'}`}
//         >
//           <span className="text-gray-800 font-medium">{option.text}</span>
//         </button>
//       ))}
//     </div>
//   </div>
// );