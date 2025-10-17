import React, { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';
import { IoIosArrowBack } from "react-icons/io";
import { useTranslation } from "react-i18next";
import "./Neet_Adaptive.css"
import { useNavigate } from 'react-router-dom';
import vector1 from '../../components/Practive_view/temp_icons/Vector1.png';
import vector2 from '../../components/Practive_view/temp_icons/Vector4.svg';
import vector3 from '../../components/Practive_view/temp_icons/Vector3.svg';
import vector4 from '../../components/Practive_view/temp_icons/Vector2.svg';
import vector5 from '../../components/Practive_view/temp_icons/Vector5.png';
const AdaptiveLevelPage = () => {
  const { i18n, t } = useTranslation();
  const [currentLevel, setCurrentLevel] = useState(2);
  const [dotPositions, setDotPositions] = useState([]);
  const levelRefs = useRef([]);
  const navigate = useNavigate();
  const levels = [
    { 
      id: 1, 
      title: t('Level 1'), 
      text_title: t('Basic concepts clear karo💡'), 
      icon: vector1,
      completed: true 
    },
    { 
      id: 2, 
      title: t('Level 2'), 
      text_title: t('Concepts ko apply karo ⏳'), 
      icon: vector2,
      completed: false 
    },
    { 
      id: 3, 
      title: t('Level 3'), 
      text_title: t("Now, let's beat the clock ⏰"), 
      icon: vector3,
      completed: false 
    },
    { 
      id: 4, 
      title: t('NEET Level'), 
      text_title: t('Previous Year Questions 📝'), 
      icon: vector4,
      completed: false 
    },
    { 
      id: 5, 
      title: t('Neet++ Level'), 
      text_title: t('Ek kadam aage ki taiyari 🏋️‍♀️'), 
      icon: vector5,
      completed: false 
    }
  ];

  useEffect(() => {
    const calculatePositions = () => {
      const positions = levelRefs.current.map(ref => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          return rect.top + rect.height / 2;
        }
        return 0;
      });
      setDotPositions(positions);
    };

    calculatePositions();
    window.addEventListener('resize', calculatePositions);
    return () => window.removeEventListener('resize', calculatePositions);
  }, []);

const handleLevelClick = (levelId) => {
  setCurrentLevel(levelId);
  setTimeout(() => 
       navigate("/Practice-question-view", { state: { level: levelId } })
      , 1000);
};

  return (
    <div id='Neet_Adaptive' className="min-h-screen relative overflow-hidden">
      {/* Background decoration */}

      {/* Main Container */}
      <div className="relative w-full max-w-md mx-auto min-h-screen flex flex-col px-4 sm:px-0">
        {/* Header */}
        <div className="flex  items-center px-2 py-2">
          <IoIosArrowBack
  onClick={() => {
    setTimeout(() => navigate(-1), 2000);
  }}
  size={23}
  className="text-gray-800 "
/>

          <h1 className="text-2xl sm:text-xl mt-2 font-semibold text-gray-800 ml-2">{t('Coulomb Law')}</h1>
        </div>

        {/* Progress Section */}
        <div className="px-1 justify-center flex flex-col items-center sm:px-5 pb-4 sm:pb-6">
          <p className="text-[16px] sm:text-sm text-gray-600 mb-2 sm:mb-3 font-bold">
            {currentLevel}/5 {t('level completed')}
          </p>
          <div className="flex gap-1.5 sm:gap-2">
            {levels.map((level) => (
              <div
                key={level.id}
                className={`h-2 w-14 flex-1 rounded-full transition-all duration-700 ${
                  level.id <= currentLevel ? 'bg-gradient-to-r from-cyan-400 to-cyan-500' : 'bg-white/60'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Levels Section */}
        <div className="flex-1 relative mt-6 pb-8" id="levels-container">
          {/* Left side - Navigation line with dots and avatar */}
          <div className="absolute left-2 sm:left-12 top-8 bottom-0 w-11">
            <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full" style={{ width: '2px' }}>
              {levels.map((level, index) => {
                if (index === levels.length - 1 || !dotPositions[index] || !dotPositions[index + 1]) return null;
                
                const y1 = dotPositions[index] - dotPositions[0];
                const y2 = dotPositions[index + 1] - dotPositions[0];
                const isCompleted = level.completed;
                const isPassed = currentLevel > level.id;
                
                return (
                  <line
                    key={`line-${level.id}`}
                    x1="1"
                    y1={y1}
                    x2="1"
                    y2={y2}
                    className={`transition-all duration-1000 ${
                      isCompleted || isPassed
                        ? 'stroke-[#24C6D6]'
                        : 'stroke-[#24C6D6]'
                    }`}
                    strokeWidth="2"
                    strokeDasharray={isCompleted || isPassed ? '0' : '5,5'}
                    style={{
                      strokeDashoffset: isCompleted ? '0' : undefined,
                    }}
                  />
                );
              })}
            </svg>

            {/* Avatar - moves smoothly between levels */}
            {dotPositions[currentLevel - 1] && (
              <div
                className="absolute left-1/2 transition-all duration-700 ease-in-out z-20"
                style={{
                  top: `${dotPositions[currentLevel - 1] - dotPositions[0]}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div 
                  id='Neet_Avatar'
                  className="w-[55px] h-[55px] sm:w-11 sm:h-11 rounded-full border-1.5 border-[white]  shadow-lg overflow-hidden flex items-center justify-center"
                >
                  
                </div>
              </div>
            )}

            {/* Dots for all levels */}
            {levels.map((level, index) => {
              if (!dotPositions[index]) return null;
              
              const topPosition = dotPositions[index] - dotPositions[0];
              
              return (
                <div
                  key={`dot-${level.id}`}
                  className="absolute left-1/2 transition-all duration-700 ease-in-out z-10"
                  style={{
                    top: `${topPosition}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div 
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all duration-700 bg-[#24C6D6]"
                  ></div>
                </div>
              );
            })}
          </div>

          {/* Right side - Level cards */}
          <div className="ml-[70px] w-[76%] flex flex-col gap-6 sm:ml-20 pr-1 sm:pr-0">
            {levels.map((level, index) => (
              <div
                key={level.id}
                ref={el => levelRefs.current[index] = el}
                onClick={() => handleLevelClick(level.id)}
                className={`relative bg-white rounded-xl sm:rounded-2xl px-4 py-[10px] transition-all duration-500 cursor-pointer hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] ${
                  level.id === currentLevel ? 'ring-2 ring-[#24C6D6] shadow-[0_0_5px_3px_rgba(156,163,175,0.6)] ' : ''
                } ${level.completed ? 'opacity-100' : 'opacity-90'}`}
                style={{
                  animation: `slideIn 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                {level.completed && (
                  <div 
                    className="absolute -top-1.5 sm:-top-2 -right-1.5 sm:-right-2  border-2 border-white bg-green-500 rounded-full p-1 sm:p-1 shadow-lg"
                    style={{
                      animation: 'checkBounce 0.6s ease-out'
                    }}
                  >
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}

                <div className="flex items-center  gap-2">
                  <div className={`w-14 h-11 rounded-lg flex items-center justify-center transition-colors duration-300 
                    
                  `}>
                    <span className="text-xl w-8  h-auto sm:text-2xl">
                      <img className=' w-full h-full object-cover' src={level.icon} alt="" />
                    </span>
                  </div>

                  <div className="flex-1 leading-tight min-w-0">
                    <h3 className="text-[18px] font-bold text-gray-800 leading-3">{level.title}</h3>
                    <p className="text-[11px] font-medium leading-3 text-[#7A7A7C]">
                      {level.text_title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-4 sm:h-0"></div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes checkBounce {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(10deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @media (max-width: 640px) {
          .border-3 {
            border-width: 3px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdaptiveLevelPage;