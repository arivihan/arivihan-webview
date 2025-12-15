// components/types/OneWordAnswer.jsx
export default function OneWordAnswer({ question, index }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-lg font-semibold text-gray-800">
        Q{index + 1}. {question.question}
      </h2>
      <input
        type="text"
        placeholder="One word answer..."
        className="mt-4 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
