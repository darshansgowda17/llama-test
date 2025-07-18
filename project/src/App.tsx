import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Sparkles } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import PDFUploader from './components/PDFUploader';
import SummaryViewer from './components/SummaryViewer';
import QuestionPanel from './components/QuestionPanel';
import ConceptMap3D from './components/ConceptMap3D';
import InsightsDashboard from './components/InsightsDashboard';
import LearningCarousel from './components/LearningCarousel';
import Navigation from './components/Navigation';

function AppContent() {
  const { state } = useApp();
  const [activeSection, setActiveSection] = useState('summary');

  const renderContent = () => {
    if (!state.currentSession) {
      return <PDFUploader />;
    }

    switch (activeSection) {
      case 'summary':
        return <SummaryViewer />;
      case 'questions':
        return <QuestionPanel />;
      case 'concepts':
        return <ConceptMap3D />;
      case 'insights':
        return <InsightsDashboard />;
      case 'achievements':
        return <LearningCarousel />;
      default:
        return <SummaryViewer />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">PDF-Guru</h1>
                <p className="text-sm text-gray-600">AI-Powered Learning Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Sparkles className="w-4 h-4" />
              <span>Powered by AI</span>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {state.currentSession && (
          <Navigation 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        )}
        
        {renderContent()}
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>© 2024 PDF-Guru. Transforming documents into interactive learning experiences.</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;