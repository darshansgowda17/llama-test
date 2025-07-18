import requests
import json
from typing import Dict, List, Optional
from config import Config

class OllamaClient:
    """Client for interacting with Ollama API"""
    
    def __init__(self):
        self.base_url = Config.OLLAMA_BASE_URL
        self.model = Config.OLLAMA_MODEL
        
    def generate_completion(self, prompt: str, max_tokens: int = 1000) -> str:
        """Generate text completion using Ollama"""
        try:
            response = requests.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "num_predict": max_tokens,
                        "temperature": 0.7,
                        "top_p": 0.9
                    }
                },
                timeout=120
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get("response", "").strip()
            else:
                raise Exception(f"Ollama API error: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to connect to Ollama: {str(e)}")
    
    def generate_summary(self, text: str) -> str:
        """Generate document summary"""
        prompt = f"""
Please provide a comprehensive summary of the following document. Focus on:
1. Main topics and themes
2. Key concepts and ideas
3. Important findings or conclusions
4. Practical applications or implications

Keep the summary between 200-400 words and make it suitable for educational purposes.

Document text:
{text[:3000]}...

Summary:
"""
        return self.generate_completion(prompt, max_tokens=500)
    
    def generate_questions(self, text: str, num_questions: int = 5) -> List[Dict]:
        """Generate educational questions from text"""
        prompt = f"""
Based on the following document, create {num_questions} educational questions. 
For each question, provide:
1. The question text
2. Four multiple choice options (A, B, C, D)
3. The correct answer
4. A brief explanation

Format your response as a JSON array with this structure:
[
  {{
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": "Option A",
    "explanation": "Explanation here"
  }}
]

Document text:
{text[:2500]}...

Questions (JSON format):
"""
        
        response = self.generate_completion(prompt, max_tokens=800)
        
        try:
            # Try to parse JSON response
            questions = json.loads(response)
            
            # Validate and format questions
            formatted_questions = []
            for i, q in enumerate(questions[:num_questions]):
                formatted_q = {
                    "id": f"q{i+1}",
                    "type": "mcq",
                    "question": q.get("question", ""),
                    "options": q.get("options", [])[:4],
                    "answer": q.get("correct_answer", ""),
                    "explanation": q.get("explanation", "")
                }
                formatted_questions.append(formatted_q)
            
            return formatted_questions
            
        except json.JSONDecodeError:
            # Fallback: create basic questions if JSON parsing fails
            return self._create_fallback_questions(text, num_questions)
    
    def generate_concepts(self, text: str, max_concepts: int = 10) -> Dict:
        """Extract key concepts and relationships"""
        prompt = f"""
Analyze the following document and identify the key concepts and their relationships.
Provide your response as a JSON object with this structure:
{{
  "concepts": [
    {{"id": "concept1", "label": "Concept Name", "importance": 0.9}},
    {{"id": "concept2", "label": "Another Concept", "importance": 0.8}}
  ],
  "relationships": [
    {{"from": "concept1", "to": "concept2", "strength": 0.7, "type": "related_to"}}
  ]
}}

Focus on the most important {max_concepts} concepts. Importance should be between 0.1 and 1.0.

Document text:
{text[:2000]}...

Concepts (JSON format):
"""
        
        response = self.generate_completion(prompt, max_tokens=600)
        
        try:
            concepts_data = json.loads(response)
            return self._format_concept_map(concepts_data)
        except json.JSONDecodeError:
            return self._create_fallback_concepts(text)
    
    def generate_insights(self, text: str, user_performance: Dict = None) -> Dict:
        """Generate learning insights and recommendations"""
        performance_text = ""
        if user_performance:
            performance_text = f"""
User Performance Data:
- Questions answered: {user_performance.get('questions_answered', 0)}
- Correct answers: {user_performance.get('correct_answers', 0)}
- Time spent: {user_performance.get('time_spent', 0)} minutes
"""
        
        prompt = f"""
Based on the document content and user performance, provide learning insights and recommendations.
{performance_text}

Document summary: {text[:1000]}...

Provide recommendations for:
1. Areas that need more attention
2. Strengths to build upon
3. Next learning steps
4. Study strategies

Format as JSON:
{{
  "strengths": ["strength1", "strength2"],
  "areas_for_improvement": ["area1", "area2"],
  "recommendations": ["rec1", "rec2", "rec3"]
}}

Insights (JSON format):
"""
        
        response = self.generate_completion(prompt, max_tokens=400)
        
        try:
            insights = json.loads(response)
            return self._format_insights(insights, user_performance)
        except json.JSONDecodeError:
            return self._create_fallback_insights()
    
    def _create_fallback_questions(self, text: str, num_questions: int) -> List[Dict]:
        """Create basic questions when AI generation fails"""
        return [
            {
                "id": f"q{i+1}",
                "type": "mcq",
                "question": f"What is a key topic discussed in this document?",
                "options": ["Topic A", "Topic B", "Topic C", "Topic D"],
                "answer": "Topic A",
                "explanation": "Based on the document content analysis."
            }
            for i in range(num_questions)
        ]
    
    def _format_concept_map(self, concepts_data: Dict) -> Dict:
        """Format concept map for 3D visualization"""
        concepts = concepts_data.get("concepts", [])
        relationships = concepts_data.get("relationships", [])
        
        # Generate 3D positions
        import math
        nodes = []
        for i, concept in enumerate(concepts):
            angle = (i / len(concepts)) * 2 * math.pi
            radius = 3
            x = radius * math.cos(angle)
            z = radius * math.sin(angle)
            y = (concept.get("importance", 0.5) - 0.5) * 2
            
            nodes.append({
                "id": concept["id"],
                "label": concept["label"],
                "position": [x, y, z],
                "color": self._get_concept_color(i),
                "size": concept.get("importance", 0.5) * 1.5 + 0.5
            })
        
        edges = []
        for rel in relationships:
            edges.append({
                "from": rel["from"],
                "to": rel["to"],
                "strength": rel.get("strength", 0.5)
            })
        
        return {"nodes": nodes, "edges": edges}
    
    def _create_fallback_concepts(self, text: str) -> Dict:
        """Create basic concept map when AI generation fails"""
        words = text.split()[:100]
        # Simple keyword extraction
        concepts = ["Learning", "Knowledge", "Understanding", "Education"]
        
        nodes = []
        for i, concept in enumerate(concepts):
            angle = (i / len(concepts)) * 2 * 3.14159
            nodes.append({
                "id": f"concept_{i}",
                "label": concept,
                "position": [3 * math.cos(angle), 0, 3 * math.sin(angle)],
                "color": self._get_concept_color(i),
                "size": 1.0
            })
        
        edges = [{"from": "concept_0", "to": "concept_1", "strength": 0.7}]
        
        return {"nodes": nodes, "edges": edges}
    
    def _format_insights(self, insights: Dict, performance: Dict = None) -> Dict:
        """Format insights with performance metrics"""
        base_insights = {
            "attention_score": 75,
            "understanding_score": 70,
            "time_spent": 30,
            "completion_rate": 80,
            "strengths": insights.get("strengths", []),
            "areas_for_improvement": insights.get("areas_for_improvement", []),
            "recommendations": insights.get("recommendations", [])
        }
        
        if performance:
            total_questions = performance.get('questions_answered', 1)
            correct = performance.get('correct_answers', 0)
            base_insights["understanding_score"] = int((correct / total_questions) * 100)
            base_insights["time_spent"] = performance.get('time_spent', 30)
        
        return base_insights
    
    def _create_fallback_insights(self) -> Dict:
        """Create basic insights when AI generation fails"""
        return {
            "attention_score": 75,
            "understanding_score": 70,
            "time_spent": 30,
            "completion_rate": 80,
            "strengths": ["Good comprehension of main concepts"],
            "areas_for_improvement": ["Could benefit from more detailed study"],
            "recommendations": ["Review key concepts", "Practice with examples"]
        }
    
    def _get_concept_color(self, index: int) -> str:
        """Get color for concept visualization"""
        colors = ["#2563eb", "#7c3aed", "#059669", "#dc2626", "#f59e0b", "#8b5cf6"]
        return colors[index % len(colors)]
    
    def check_connection(self) -> bool:
        """Check if Ollama is running and accessible"""
        try:
            response = requests.get(f"{self.base_url}/api/tags", timeout=5)
            return response.status_code == 200
        except:
            return False