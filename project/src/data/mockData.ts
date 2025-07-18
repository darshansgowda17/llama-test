import { LearningSession } from '../types';

export const mockLearningSession: LearningSession = {
  id: "session_001",
  pdf_id: "pdf_001",
  title: "Machine Learning in Education: Transforming Learning Experiences",
  summary: "This comprehensive document explores the revolutionary impact of machine learning on educational technology. It covers adaptive learning systems, personalized content delivery, automated assessment tools, and intelligent tutoring systems. The paper discusses how ML algorithms can analyze student behavior patterns to create customized learning paths, improve engagement rates, and enhance overall educational outcomes. Key topics include natural language processing for content analysis, computer vision for automated grading, and predictive analytics for early intervention strategies.",
  questions: [
    {
      id: "q1",
      type: "mcq",
      question: "What is the primary advantage of adaptive learning systems in education?",
      options: ["Reduced costs", "Personalized learning paths", "Faster content delivery", "Automated grading"],
      answer: "Personalized learning paths",
      explanation: "Adaptive learning systems excel at creating personalized learning experiences by adjusting content difficulty, pacing, and style based on individual student performance and preferences."
    },
    {
      id: "q2",
      type: "mcq",
      question: "Which ML technique is most commonly used for automated essay grading?",
      options: ["Computer Vision", "Natural Language Processing", "Reinforcement Learning", "Clustering"],
      answer: "Natural Language Processing",
      explanation: "Natural Language Processing (NLP) is the primary technique used for automated essay grading as it can analyze text structure, grammar, coherence, and content quality."
    },
    {
      id: "q3",
      type: "mcq",
      question: "What role does predictive analytics play in education?",
      options: ["Content creation", "Early intervention", "System optimization", "Cost reduction"],
      answer: "Early intervention",
      explanation: "Predictive analytics in education primarily helps identify students at risk of falling behind, enabling early intervention strategies to improve success rates."
    },
    {
      id: "q4",
      type: "short-answer",
      question: "Explain how machine learning can enhance student engagement in online learning platforms.",
      answer: "Machine learning enhances student engagement by personalizing content recommendations, optimizing learning schedules, providing intelligent feedback, and creating adaptive challenges that match individual skill levels.",
      explanation: "ML algorithms analyze student interaction patterns, learning preferences, and performance data to create engaging, personalized experiences that keep students motivated and actively participating."
    }
  ],
  concept_map: {
    nodes: [
      { id: "ML", label: "Machine Learning", position: [0, 0, 0], color: "#2563eb", size: 1.5 },
      { id: "AI", label: "Artificial Intelligence", position: [3, 2, 0], color: "#7c3aed", size: 1.2 },
      { id: "NLP", label: "Natural Language Processing", position: [-3, 1, 0], color: "#059669", size: 1.0 },
      { id: "CV", label: "Computer Vision", position: [2, -2, 0], color: "#dc2626", size: 1.0 },
      { id: "AL", label: "Adaptive Learning", position: [0, 3, 0], color: "#f59e0b", size: 1.3 },
      { id: "PA", label: "Predictive Analytics", position: [-2, -1, 0], color: "#8b5cf6", size: 1.1 },
      { id: "ITS", label: "Intelligent Tutoring", position: [1, 1, 2], color: "#06b6d4", size: 1.2 },
      { id: "Assessment", label: "Automated Assessment", position: [-1, -3, 0], color: "#ef4444", size: 1.0 }
    ],
    edges: [
      { from: "ML", to: "AI", strength: 0.9 },
      { from: "ML", to: "NLP", strength: 0.8 },
      { from: "ML", to: "CV", strength: 0.7 },
      { from: "AI", to: "AL", strength: 0.8 },
      { from: "ML", to: "PA", strength: 0.9 },
      { from: "AI", to: "ITS", strength: 0.7 },
      { from: "NLP", to: "Assessment", strength: 0.6 },
      { from: "CV", to: "Assessment", strength: 0.5 },
      { from: "AL", to: "ITS", strength: 0.8 }
    ]
  },
  insights: {
    attention_score: 85,
    understanding_score: 78,
    time_spent: 45,
    completion_rate: 92,
    recommendations: [
      "Review concept: Backpropagation algorithms",
      "Take advanced quiz on AI vs ML distinctions",
      "Explore practical applications of NLP in education"
    ],
    strengths: [
      "Strong understanding of adaptive learning principles",
      "Excellent grasp of predictive analytics applications",
      "Good performance on conceptual questions"
    ],
    areas_for_improvement: [
      "Deep learning architectures need more attention",
      "Mathematical foundations could be strengthened",
      "Practical implementation examples would help"
    ]
  },
  created_at: "2024-01-15T10:30:00Z",
  progress: 78
};

export const mockCarouselItems = [
  {
    id: "badge_1",
    title: "ML Fundamentals",
    description: "Completed basic machine learning concepts",
    icon: "🧠",
    progress: 100,
    color: "#2563eb"
  },
  {
    id: "badge_2",
    title: "NLP Explorer",
    description: "Mastered natural language processing basics",
    icon: "💬",
    progress: 85,
    color: "#059669"
  },
  {
    id: "badge_3",
    title: "Data Analyst",
    description: "Excelled in predictive analytics",
    icon: "📊",
    progress: 92,
    color: "#f59e0b"
  },
  {
    id: "badge_4",
    title: "Quick Learner",
    description: "Completed session in record time",
    icon: "⚡",
    progress: 78,
    color: "#8b5cf6"
  }
];