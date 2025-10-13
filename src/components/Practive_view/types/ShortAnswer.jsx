// const ShortAnswer = ({ question, selectedAnswer, onAnswerSelect, showSolution, isSubmitted }) => (
//   <div className="space-y-4 w-[90vw]">
//     <div className="text-gray-800 text-base sm:text-lg leading-relaxed font-medium">
//       {question.question}
//     </div>
//     <p style={{fontWeight:600}} className='italic text-sm '>Option-1- Apna answer yha type karein</p>
//     <div className="space-y-3">
//       <input
//         type="text"
//         value={selectedAnswer || ''}
//         onChange={(e) => !isSubmitted && onAnswerSelect(e.target.value)}
//         placeholder="Enter your answer..."
//         disabled={isSubmitted}
//         className={`w-full p-3 border-2 rounded-md text-base transition-all duration-200 ${
//           isSubmitted
//             ? selectedAnswer?.toLowerCase() === question.answer.toLowerCase()
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
//     <p style={{fontWeight:600}} className='italic text-sm '>Option-2- ya photo click krke upload karein</p>
//     <div style={{border:'2px dashed gray'}} className='w-[90vw] h-[28vh] flex flex-col justify-center items-center rounded-md'>
//               <p className='text-cyan-300 text-[18px]'>Answer upload <span className='text-black'><b>Karein</b></span></p>
//                <p style={{fontWeight:400}} className='text-[15px]'>Maximum file size 10mb</p>
//                <button className='bg-cyan-400 text-white px-10 py-2 mt-2 rounded-lg hover:bg-cyan-500'>
//                  <p>Upload</p>
//                </button>
//     </div>
//   </div>
// );