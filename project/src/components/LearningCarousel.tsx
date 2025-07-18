import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Trophy, Medal, Star } from 'lucide-react';
import { mockCarouselItems } from '../data/mockData';

export default function LearningCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % mockCarouselItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + mockCarouselItems.length) % mockCarouselItems.length);
  };

  const currentItem = mockCarouselItems[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Learning Achievements</h2>
              <p className="text-yellow-100 text-sm">Your progress and badges</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={prevSlide}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl"
              style={{ backgroundColor: currentItem.color + '20' }}
            >
              {currentItem.icon}
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-2">{currentItem.title}</h3>
            <p className="text-gray-600 mb-4">{currentItem.description}</p>
            
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full"
                  style={{ backgroundColor: currentItem.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${currentItem.progress}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700">{currentItem.progress}%</span>
            </div>
            
            <div className="flex justify-center space-x-1">
              {currentItem.progress >= 100 ? (
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
              ) : currentItem.progress >= 75 ? (
                <Medal className="w-5 h-5 text-gray-400" />
              ) : (
                <Trophy className="w-5 h-5 text-gray-300" />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        
        <div className="flex justify-center space-x-2 mt-6">
          {mockCarouselItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}