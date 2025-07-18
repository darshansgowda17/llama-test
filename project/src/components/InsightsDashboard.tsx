import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Target, Brain, Award, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function InsightsDashboard() {
  const { state } = useApp();
  
  if (!state.currentSession) {
    return null;
  }

  const { insights } = state.currentSession;

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    suffix = '' 
  }: { 
    title: string; 
    value: number; 
    icon: React.ComponentType<any>; 
    color: string; 
    suffix?: string; 
  }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl p-6 border border-gray-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center`} style={{ backgroundColor: color + '20' }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-800">{value}{suffix}</p>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Learning Insights</h2>
            <p className="text-orange-100 text-sm">Performance analytics and recommendations</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Attention Score"
            value={insights.attention_score}
            icon={Brain}
            color="#f59e0b"
            suffix="%"
          />
          <StatCard
            title="Understanding"
            value={insights.understanding_score}
            icon={Target}
            color="#10b981"
            suffix="%"
          />
          <StatCard
            title="Completion Rate"
            value={insights.completion_rate}
            icon={Award}
            color="#3b82f6"
            suffix="%"
          />
          <StatCard
            title="Time Spent"
            value={insights.time_spent}
            icon={Clock}
            color="#8b5cf6"
            suffix=" min"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Award className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="font-semibold text-green-800">Strengths</h3>
            </div>
            <ul className="space-y-2">
              {insights.strengths.map((strength, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-2"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-green-700">{strength}</p>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-semibold text-blue-800">Areas for Improvement</h3>
            </div>
            <ul className="space-y-2">
              {insights.areas_for_improvement.map((area, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-2"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-blue-700">{area}</p>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-yellow-800">Personalized Recommendations</h3>
          </div>
          <ul className="space-y-2">
            {insights.recommendations.map((recommendation, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-2"
              >
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-yellow-700">{recommendation}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}