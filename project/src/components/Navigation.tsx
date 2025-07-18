import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Brain, BarChart3, Trophy } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  const navItems = [
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'questions', label: 'Questions', icon: Brain },
    { id: 'concepts', label: 'Concepts', icon: BarChart3 },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2 mb-8"
    >
      <div className="flex space-x-2 overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
              activeSection === item.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </motion.nav>
  );
}