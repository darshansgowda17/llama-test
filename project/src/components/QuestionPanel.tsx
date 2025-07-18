import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, ArrowLeft, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Question } from '../types';

export default function QuestionPanel() {
  const { state } = useApp();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  if (!state.currentSession) {
    return null;
  }

  const { questions } = state.currentSession;
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleShowResult = (questionId: string) => {
    setShowResults(prev => ({ ...prev, [questionId]: true }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const getScore = () => {
    const correctAnswers = questions.filter(q => selectedAnswers[q.id] === q.answer).length;
    return Math.round((correctAnswers / questions.length) * 100);
  };

  const isCorrect = (question: Question) => selectedAnswers[question.id] === question.answer;

  if (quizCompleted) {
    const score = getScore();
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Award className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Quiz Complete!</h3>
        <p className="text-gray-600 mb-6">You scored {score}% on this learning session</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">Correct Answers</p>
            <p className="text-2xl font-bold text-green-700">
              {questions.filter(q => selectedAnswers[q.id] === q.answer).length}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm text-red-600 font-medium">Incorrect Answers</p>
            <p className="text-2xl font-bold text-red-700">
              {questions.filter(q => selectedAnswers[q.id] !== q.answer).length}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => {
            setQuizCompleted(false);
            setCurrentQuestionIndex(0);
            setSelectedAnswers({});
            setShowResults({});
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retake Quiz
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Learning Assessment</h2>
              <p className="text-purple-100 text-sm">Test your understanding</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-purple-100">Question</p>
            <p className="text-sm font-semibold text-white">
              {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
        </div>
        
        <div className="w-full bg-white/20 rounded-full h-2">
          <motion.div
            className="bg-white h-2 rounded-full"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {currentQuestion.question}
            </h3>

            {currentQuestion.type === 'mcq' && currentQuestion.options && (
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === option;
                  const isCorrectAnswer = option === currentQuestion.answer;
                  const showResult = showResults[currentQuestion.id];
                  
                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                      disabled={showResult}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        showResult
                          ? isCorrectAnswer
                            ? 'border-green-500 bg-green-50'
                            : isSelected
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 bg-gray-50'
                          : isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: showResult ? 1 : 1.02 }}
                      whileTap={{ scale: showResult ? 1 : 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-800">{option}</span>
                        {showResult && (
                          <div className="flex items-center space-x-2">
                            {isCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                            {isSelected && !isCorrectAnswer && <XCircle className="w-5 h-5 text-red-600" />}
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === 'short-answer' && (
              <div className="mb-6">
                <textarea
                  value={selectedAnswers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
              </div>
            )}

            {showResults[currentQuestion.id] && currentQuestion.explanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
              >
                <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
                <p className="text-blue-700 text-sm">{currentQuestion.explanation}</p>
              </motion.div>
            )}

            <div className="flex items-center justify-between">
              <button
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex space-x-3">
                {selectedAnswers[currentQuestion.id] && !showResults[currentQuestion.id] && (
                  <button
                    onClick={() => handleShowResult(currentQuestion.id)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Show Answer
                  </button>
                )}
                
                <button
                  onClick={nextQuestion}
                  disabled={!selectedAnswers[currentQuestion.id]}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span>{currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}