import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function SummaryViewer() {
  const { state } = useApp();
  
  if (!state.currentSession) {
    return null;
  }

  const { summary, title, insights } = state.currentSession;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Document Summary</h2>
            <p className="text-blue-100 text-sm">AI-Generated Overview</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <Clock className="w-5 h-5 text-white mx-auto mb-1" />
            <p className="text-xs text-blue-100">Reading Time</p>
            <p className="text-sm font-semibold text-white">{insights.time_spent} min</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <Target className="w-5 h-5 text-white mx-auto mb-1" />
            <p className="text-xs text-blue-100">Completion</p>
            <p className="text-sm font-semibold text-white">{insights.completion_rate}%</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <BookOpen className="w-5 h-5 text-white mx-auto mb-1" />
            <p className="text-xs text-blue-100">Understanding</p>
            <p className="text-sm font-semibold text-white">{insights.understanding_score}%</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3">{title}</h3>
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">Key Strengths</h4>
          <div className="space-y-2">
            {insights.strengths.map((strength, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-2"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                <p className="text-sm text-gray-700">{strength}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}