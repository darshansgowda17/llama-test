from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
import time
import uuid
from datetime import datetime
from werkzeug.utils import secure_filename

from config import Config
from utils.pdf_processor import PDFProcessor
from utils.ollama_client import OllamaClient

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

# Initialize processors
pdf_processor = PDFProcessor()
ollama_client = OllamaClient()

# In-memory storage for demo (use database in production)
sessions = {}
uploaded_files = {}

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    ollama_status = ollama_client.check_connection()
    
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0",
        "ollama_connected": ollama_status,
        "ollama_model": Config.OLLAMA_MODEL
    })

@app.route('/api/upload', methods=['POST'])
def upload_pdf():
    """Handle PDF file upload"""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not allowed_file(file.filename):
            return jsonify({"error": "Only PDF files are allowed"}), 400
        
        # Generate unique filename and save
        pdf_id = str(uuid.uuid4())
        filename = secure_filename(f"{pdf_id}.pdf")
        filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        # Extract text from PDF
        pdf_data = pdf_processor.extract_text(filepath)
        
        # Store file info
        uploaded_files[pdf_id] = {
            "filename": file.filename,
            "filepath": filepath,
            "upload_time": datetime.now().isoformat(),
            "pdf_data": pdf_data
        }
        
        return jsonify({
            "success": True,
            "pdf_id": pdf_id,
            "filename": file.filename,
            "word_count": pdf_data["word_count"],
            "page_count": pdf_data["page_count"],
            "title": pdf_data["title"],
            "message": "PDF uploaded and processed successfully"
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/summary', methods=['GET'])
def get_summary():
    """Generate AI summary for uploaded PDF"""
    try:
        pdf_id = request.args.get('pdf_id')
        if not pdf_id or pdf_id not in uploaded_files:
            return jsonify({"error": "Invalid PDF ID"}), 400
        
        pdf_data = uploaded_files[pdf_id]["pdf_data"]
        
        # Check if Ollama is available
        if not ollama_client.check_connection():
            return jsonify({"error": "AI service unavailable. Please ensure Ollama is running."}), 503
        
        # Generate summary using Ollama
        summary = ollama_client.generate_summary(pdf_data["full_text"])
        
        response = {
            "pdf_id": pdf_id,
            "title": pdf_data["title"],
            "summary": summary,
            "word_count": pdf_data["word_count"],
            "page_count": pdf_data["page_count"],
            "reading_time": max(1, pdf_data["word_count"] // 200),  # Estimate reading time
            "generated_at": datetime.now().isoformat()
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/questions', methods=['GET'])
def get_questions():
    """Generate questions using AI"""
    try:
        pdf_id = request.args.get('pdf_id')
        if not pdf_id or pdf_id not in uploaded_files:
            return jsonify({"error": "Invalid PDF ID"}), 400
        
        pdf_data = uploaded_files[pdf_id]["pdf_data"]
        
        if not ollama_client.check_connection():
            return jsonify({"error": "AI service unavailable. Please ensure Ollama is running."}), 503
        
        # Generate questions using Ollama
        questions = ollama_client.generate_questions(pdf_data["full_text"], Config.NUM_QUESTIONS)
        
        response = {
            "pdf_id": pdf_id,
            "questions": questions,
            "generated_at": datetime.now().isoformat()
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/concepts', methods=['GET'])
def get_concepts():
    """Generate concept map using AI"""
    try:
        pdf_id = request.args.get('pdf_id')
        if not pdf_id or pdf_id not in uploaded_files:
            return jsonify({"error": "Invalid PDF ID"}), 400
        
        pdf_data = uploaded_files[pdf_id]["pdf_data"]
        
        if not ollama_client.check_connection():
            return jsonify({"error": "AI service unavailable. Please ensure Ollama is running."}), 503
        
        # Generate concept map using Ollama
        concept_map = ollama_client.generate_concepts(pdf_data["full_text"], Config.MAX_CONCEPTS)
        
        response = {
            "pdf_id": pdf_id,
            "concept_map": concept_map,
            "generated_at": datetime.now().isoformat()
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/insights', methods=['GET'])
def get_insights():
    """Generate learning insights using AI"""
    try:
        pdf_id = request.args.get('pdf_id')
        if not pdf_id or pdf_id not in uploaded_files:
            return jsonify({"error": "Invalid PDF ID"}), 400
        
        pdf_data = uploaded_files[pdf_id]["pdf_data"]
        
        if not ollama_client.check_connection():
            return jsonify({"error": "AI service unavailable. Please ensure Ollama is running."}), 503
        
        # Get user performance data if available
        user_performance = request.args.get('performance')
        performance_data = None
        if user_performance:
            try:
                performance_data = json.loads(user_performance)
            except:
                pass
        
        # Generate insights using Ollama
        insights = ollama_client.generate_insights(pdf_data["full_text"], performance_data)
        
        response = {
            "pdf_id": pdf_id,
            "insights": insights,
            "generated_at": datetime.now().isoformat()
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/process', methods=['POST'])
def process_pdf():
    """Complete PDF processing pipeline with AI"""
    try:
        data = request.get_json()
        pdf_id = data.get('pdf_id')
        
        if not pdf_id or pdf_id not in uploaded_files:
            return jsonify({"error": "Invalid PDF ID"}), 400
        
        if not ollama_client.check_connection():
            return jsonify({"error": "AI service unavailable. Please ensure Ollama is running."}), 503
        
        pdf_data = uploaded_files[pdf_id]["pdf_data"]
        
        # Generate all content using AI
        summary = ollama_client.generate_summary(pdf_data["full_text"])
        questions = ollama_client.generate_questions(pdf_data["full_text"], Config.NUM_QUESTIONS)
        concept_map = ollama_client.generate_concepts(pdf_data["full_text"], Config.MAX_CONCEPTS)
        insights = ollama_client.generate_insights(pdf_data["full_text"])
        
        # Create complete session
        session_id = str(uuid.uuid4())
        session_data = {
            "id": session_id,
            "pdf_id": pdf_id,
            "title": pdf_data["title"],
            "summary": summary,
            "questions": questions,
            "concept_map": concept_map,
            "insights": insights,
            "created_at": datetime.now().isoformat(),
            "progress": 0,
            "status": "completed"
        }
        
        # Store session
        sessions[session_id] = session_data
        
        return jsonify(session_data)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sessions/<session_id>', methods=['GET'])
def get_session(session_id):
    """Retrieve a learning session"""
    if session_id not in sessions:
        return jsonify({"error": "Session not found"}), 404
    
    return jsonify(sessions[session_id])

@app.route('/api/sessions/<session_id>/progress', methods=['PUT'])
def update_progress(session_id):
    """Update session progress"""
    if session_id not in sessions:
        return jsonify({"error": "Session not found"}), 404
    
    data = request.get_json()
    progress = data.get('progress', 0)
    
    sessions[session_id]['progress'] = progress
    sessions[session_id]['updated_at'] = datetime.now().isoformat()
    
    return jsonify({"success": True, "progress": progress})

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    print("🚀 PDF-Guru AI-Powered Backend Starting...")
    print("📊 Available endpoints:")
    print("   - GET  /api/health")
    print("   - POST /api/upload")
    print("   - GET  /api/summary?pdf_id=<id>")
    print("   - GET  /api/questions?pdf_id=<id>")
    print("   - GET  /api/concepts?pdf_id=<id>")
    print("   - GET  /api/insights?pdf_id=<id>")
    print("   - POST /api/process")
    print("   - GET  /api/sessions/<session_id>")
    print("   - PUT  /api/sessions/<session_id>/progress")
    print("🤖 AI-powered by Ollama")
    print("📝 Real PDF processing with PyMuPDF")
    print("⚠️  Make sure Ollama is running: ollama serve")
    
    # Check Ollama connection on startup
    if ollama_client.check_connection():
        print("✅ Ollama connection successful")
    else:
        print("❌ Ollama not accessible - AI features will be unavailable")
        print("   Start Ollama with: ollama serve")
        print("   Pull a model with: ollama pull llama2")
    
    app.run(debug=True, host='0.0.0.0', port=5000)