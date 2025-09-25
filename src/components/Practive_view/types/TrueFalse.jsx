// components/types/TrueFalse.jsx
export default function TrueFalse({ question, index }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-lg font-semibold text-gray-800">
        Q{index + 1}. {question.question}
      </h2>
      <div className="mt-4 flex gap-4">
        <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
          True
        </button>
        <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
          False
        </button>
      </div>
    </div>
  );
}
