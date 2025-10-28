import React, { useState } from 'react';
import { ChevronLeft, Users } from 'lucide-react';

const TestInstructions = () => {
  const [testData] = useState({
    title: "Units and Measurements Test 2",
    questions: 50,
    marks: 180,
    time: "12Min",
    studentsAttempted: "1.5k",
    buttonText: "Start Test",
    isAttempted: false,
    instructions: [
      {
        title: "1. Procedure for answering a Multiple Choice Question (MCQ):",
        points: [
          "To select your answer, click on the button of the corresponding option.",
          "To deselect your answer, click on the button of the chosen option once again.",
          "To change your answer, click on the button of the newly identified answer."
        ]
      },
      {
        title: "2. How to submit the answers?",
        points: [
          "Click 'Save' to submit each answer and then only move next.",
          "If you don't 'Save' the answer, it won't get counted."
        ]
      },
      {
        title: "3. Marking Scheme:",
        points: [
          "This test contains 50 questions and the total marks of 100.",
          "Each question is allowed 4 marks for correct response and for incorrect response 1 mark will be deducted.",
          "Q21-Q30 are optional. You need to do any 5 out of the each set of 10 questions. All the questions are multiple choice questions with only 1 correct answer."
        ]
      },
      {
        title: "4. Navigating through the questions:",
        points: [
          "Swipe left or right to change a question.",
          "You can view the status of all the questions by clicking on the Question Paper icon that appears on the top left side of the screen."
        ]
      },
      {
        title: "5. You can only attempt this test once in one sitting. Best of luck!!"
      }
    ],
    avatars: [
      "https://i.pravatar.cc/150?img=1",
      "https://i.pravatar.cc/150?img=2",
      "https://i.pravatar.cc/150?img=3"
    ]
  });

  const handleStartTest = () => {
    console.log("Starting test...");
    // Add your navigation logic here
  };

  const handleBack = () => {
    console.log("Going back...");
    // Add your back navigation logic here
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-5 py-4 flex items-center gap-4 border-b border-gray-100">
        <button 
          onClick={handleBack}
          className="p-2 -ml-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 truncate flex-1">
          {testData.title}
        </h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="px-5 py-6">
          {/* Info Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
            {/* Stats Row */}
            <div className="flex items-center justify-around mb-5">
              <div className="flex flex-col items-start">
                <span className="text-xs font-semibold text-gray-500 mb-1">Questions</span>
                <span className="text-base font-extrabold text-gray-900">{testData.questions}</span>
              </div>
              
              <div className="w-px h-10 bg-gray-200"></div>
              
              <div className="flex flex-col items-center">
                <span className="text-xs font-semibold text-gray-500 mb-1">Marks</span>
                <span className="text-base font-extrabold text-gray-900">{testData.marks}</span>
              </div>
              
              <div className="w-px h-10 bg-gray-200"></div>
              
              <div className="flex flex-col items-end">
                <span className="text-xs font-semibold text-gray-500 mb-1">Time</span>
                <span className="text-base font-extrabold text-gray-900">{testData.time}</span>
              </div>
            </div>

            {/* Test Attempted */}
            <div className="flex items-center justify-between py-3 border-t border-gray-200">
              <span className="text-base font-bold text-gray-700">Test Attempted</span>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {testData.avatars.map((avatar, index) => (
                    <div key={index} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-200">
                      <img src={avatar} alt={`User ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-600">{testData.studentsAttempted}</span>
                <span className="text-sm text-gray-600">students</span>
              </div>
            </div>

            <div className="w-full h-px bg-gray-200 my-5"></div>

            {/* Instructions */}
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-4">Instructions</h2>
              
              <div className="space-y-4">
                {testData.instructions.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-base font-bold text-gray-900 mb-2">
                      {section.title}
                    </h3>
                    {section.points && (
                      <div className="bg-gray-50 rounded-xl p-3 space-y-3">
                        {section.points.map((point, pointIndex) => (
                          <p key={pointIndex} className="text-sm text-gray-700 leading-relaxed">
                            {pointIndex + 1}) {point}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <button
          onClick={handleStartTest}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-sm active:scale-[0.98] transform"
        >
          {testData.isAttempted ? "Re-attempt" : testData.buttonText}
        </button>
      </div>
    </div>
  );
};

export default TestInstructions;