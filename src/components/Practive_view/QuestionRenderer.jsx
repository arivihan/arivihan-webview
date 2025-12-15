// components/QuestionRenderer.jsx

import FillInTheBlank from "./types/FillInTheBlank";
import LongAnswer from "./types/LongAnswer";
import MCQ from "./types/MCQ";
import OneWordAnswer from "./types/OneWordAnswer";
import ShortAnswer from "./types/ShortAnswer";
import TrueFalse from "./types/TrueFalse";
import VeryShortAnswer from "./types/VeryShortAnswer";


export default function QuestionRenderer({ question, index }) {
  const renderComponent = () => {
    switch (question.type) {
      case "FILL_IN_THE_BLANKS":
        return <FillInTheBlank question={question} index={index} />;
      case "TRUE_FALSE":
        return <TrueFalse question={question} index={index} />;
      case "SHORT_ANSWER":
        return <ShortAnswer question={question} index={index} />;
      case "MCQ":
        return <MCQ question={question} index={index} />;
      case "VERY_SHORT_ANSWER":
        return <VeryShortAnswer question={question} index={index} />;
      case "LONG_ANSWER":
        return <LongAnswer question={question} index={index} />;
      case "ONE_WORD_ANSWER":
        return <OneWordAnswer question={question} index={index} />;
      default:
        return (
          <div className="p-6 bg-white rounded-2xl shadow-md">
            <p className="text-red-500">Unsupported Question Type</p>
          </div>
        );
    }
  };

  return <div>{renderComponent()}</div>;
}
