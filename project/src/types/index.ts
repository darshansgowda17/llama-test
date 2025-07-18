export interface Question {
  id: string;
  type: 'mcq' | 'short-answer';
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
}

export interface ConceptNode {
  id: string;
  label: string;
  position: [number, number, number];
  color: string;
  size: number;
}

export interface ConceptEdge {
  from: string;
  to: string;
  strength: number;
}

export interface ConceptMap {
  nodes: ConceptNode[];
  edges: ConceptEdge[];
}

export interface Insights {
  attention_score: number;
  understanding_score: number;
  time_spent: number;
  completion_rate: number;
  recommendations: string[];
  strengths: string[];
  areas_for_improvement: string[];
}

export interface LearningSession {
  id: string;
  pdf_id: string;
  title: string;
  summary: string;
  questions: Question[];
  concept_map: ConceptMap;
  insights: Insights;
  created_at: string;
  progress: number;
}