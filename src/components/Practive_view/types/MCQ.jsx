// components/types/MCQ.jsx
export default function MCQ({ question, index }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-lg font-semibold text-gray-800">
        Q{index + 1}. {question.question}
      </h2>
      <div className="mt-4 flex flex-col gap-3">
        {question.options.map((opt, i) => (
          <button
            key={i}
            className="w-full text-left px-4 py-2 border rounded-lg hover:bg-blue-50"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
