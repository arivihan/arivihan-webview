// components/types/FillInTheBlank.jsx
export default function FillInTheBlank({ question, index }) {
  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
      <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
        Q{index + 1}. {question.question}
      </h2>

      <input
        type="text"
        placeholder="Your Answer..."
        className="mt-4 w-full border border-gray-300 rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
      />

      <div className="mt-4 text-xs sm:text-sm text-gray-600">
        <p>
          <strong>Answer:</strong> {question.answer}
        </p>
        
      </div>
    </div>
  );
}
