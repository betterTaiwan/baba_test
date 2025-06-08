import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import ScorePaperProps from './ScorePaperProps';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X } from "lucide-react";


const QuestionScreen: React.FC = () => {
  const { gameState, getCurrentQuestion, answerQuestion } = useGame();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showPoints, setShowPoints] = useState(false);
  const [pointsToAdd, setPointsToAdd] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const currentQuestion = getCurrentQuestion();
  const character = gameState.selectedCharacter;
  
  if (!currentQuestion || !character) return null;

  const handleOptionClick = (points: number, isCorrect: boolean, optionId: string) => {
    if (selectedOption) return; // Prevent multiple selections
    
    setSelectedOption(optionId);
    setPointsToAdd(points);
    setShowPoints(true);
    
    // Delay moving to next question to show the points animation
    setTimeout(() => {
      answerQuestion(points, isCorrect);
      setSelectedOption(null);
      setShowPoints(false);
    }, 1500);
  };

  // Maximum possible score (for the tree visualization)
  const maxScore = 200;

  return (
    <div className="h-screen bg-contain bg-[url('/baba_test/images/background_event.png')] bg-repeat-x bg-top py-6 px-4 font-pixel">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-row justify-between items-center flex-wrap">
          {/* Character and score display */}
          <div className="flex items-center mr-4">

            <div className="w-16 h-16 rounded-0 overflow-hidden bg-[url('/baba_test/images/Char_base.png')] bg-contain bg-cover bg-center">

              <img 
                src={character.avatar} 
                alt={character.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-4 font-pixel">
              <p className="text-gray-100 font-medium">{character.districts}</p>
              <p className="text-gray-100 font-medium">立法委員</p>
              <h3 className="font-semibold text-lg text-white">{character.name}</h3>
            </div>
          </div>
          
          {/* Tree visualization */}
          <div className="w-40 shrink-0">
            <ScorePaperProps score={gameState.score} maxScore={maxScore} />
          </div>
        </div>
          {/* Progress indicator */}
        <hr className="dotted-line" />
        <div className="flex flex-row justify-center gap-2 my-2">
          <p className="text-gray-100 font-pixel text-l flex items-center font-semibold">

            生存進度 {gameState.currentQuestionIndex + 1} / 10
            {Array(10).fill(null).map((_, index) => (
              <img
                key={index}
                src={`/baba_test/images/${index < gameState.currentQuestionIndex + 1 ? 'heart_red' : 'heart_white'}.png`}
                alt={`Heart ${index + 1}`}
                className="w-5 h-5 ml-1"
              />
            ))}
          </p>
        </div>
        <hr className="dotted-line" />
        


        {/* Question */}
        <motion.div 
          className="relative question-color p-6 my-2"
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
        {/* Explanation Button */}
        <motion.button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute -top-12 right-6 w-20 h-20 bg-[url('/baba_test/images/aboutmore_2.png')] bg-contain bg-center bg-no-repeat text-white transition-colors duration-200 flex items-center justify-center font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.99 }}
          >
          {/* <ExternalLink className="w-5 h-5 mr-2" />
          相關說明 */}
        </motion.button>

          {/* Lightbox */}
          <AnimatePresence>
            {isLightboxOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                onClick={() => setIsLightboxOpen(false)}
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">相關說明</h3>
                    <button
                      onClick={() => setIsLightboxOpen(false)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <X className="w-6 h-6 text-gray-500" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {currentQuestion.explanation?.image && (
                      <img
                        src={currentQuestion.explanation.image}
                        alt="相關說明圖片"
                        className="w-full rounded-lg"
                      />
                    )}
                    
                    {currentQuestion.explanation?.text && (
                      <p className="text-gray-700">{currentQuestion.explanation.text}</p>
                    )}
                    
                    {currentQuestion.explanation?.reference && (
                      <div className="pt-4 border-t">
                        <h4 className="font-medium text-gray-800 mb-2">參考資料</h4>
                        <a
                          href={currentQuestion.explanation.reference}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-700 flex items-center"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          查看來源
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute -top-3 -left-3 bg-black px-3 py-1 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold">
              事件{gameState.currentQuestionIndex + 1}
            </h2>
          </div>
          <p className="text-lg mb-4">{currentQuestion.text}</p>

        </motion.div>
        {/* Options */}
          <div className="w-3/4 mx-auto space-y-4">
          {currentQuestion.options.map((option) => (
            <motion.div 
              key={option.id}
              className={`relative p-4 question-option-color cursor-pointer transition-all duration-300 ${
                selectedOption === option.id 
                  ? 'hover:shadow-[4px_4px_0px_##c3c3c3]' 
                  : 'hover:shadow-[-4px_-4px_0px_#6b21a8]'
              }`}
              onClick={() => handleOptionClick(option.points, option.isCorrect, option.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <p className="text-gray-700">{option.text}</p>
              
              {/* Points animation */}
              <AnimatePresence>
                {showPoints && selectedOption === option.id && (
                  <motion.div 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 font-bold text-xl question-points-color"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    +{pointsToAdd}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>



      </div>
    </div>
  );
};

export default QuestionScreen;