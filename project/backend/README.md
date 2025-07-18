# PDF-Guru AI-Powered Backend

Flask-based backend server with Ollama integration for real PDF processing and AI-powered content generation.

## Features

- **Real PDF Processing**: Extract text from uploaded PDFs using PyMuPDF
- **AI-Powered Analysis**: Generate summaries, questions, and insights using Ollama
- **Concept Mapping**: Create interactive 3D concept visualizations
- **RESTful API**: Clean API design for frontend integration
- **File Upload**: Secure PDF file handling with validation

## Prerequisites

### 1. Install Ollama
```bash
# Install Ollama (macOS/Linux)
curl -fsSL https://ollama.ai/install.sh | sh

# Or download from https://ollama.ai/download
```

### 2. Pull a Language Model
```bash
# Pull Llama2 (recommended)
ollama pull llama2

# Or try other models
ollama pull mistral
ollama pull codellama
```

### 3. Start Ollama Server
```bash
ollama serve
```

## Installation

1. **Install Python Dependencies**:
```bash
cd backend
pip install -r requirements.txt
```

2. **Create Environment File**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Create Upload Directory**:
```bash
mkdir uploads
```

## Running the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### File Upload
- **POST** `/api/upload` - Upload PDF file
- **POST** `/api/process` - Complete AI processing pipeline

### AI-Generated Content
- **GET** `/api/summary?pdf_id=<id>` - AI-generated summary
- **GET** `/api/questions?pdf_id=<id>` - AI-generated questions
- **GET** `/api/concepts?pdf_id=<id>` - AI-extracted concept map
- **GET** `/api/insights?pdf_id=<id>` - Learning insights and recommendations

### Session Management
- **GET** `/api/sessions/<session_id>` - Retrieve learning session
- **PUT** `/api/sessions/<session_id>/progress` - Update progress

### Health Check
- **GET** `/api/health` - Server and Ollama status

## Configuration

Edit `.env` file:

```env
# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2

# File Upload
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216

# AI Processing
NUM_QUESTIONS=5
MAX_CONCEPTS=10
```

## Supported Models

The backend works with any Ollama-compatible model:

- **llama2** (recommended) - Good balance of speed and quality
- **mistral** - Fast and efficient
- **codellama** - Better for technical documents
- **llama2:13b** - Higher quality, slower processing

## Architecture

```
backend/
├── app.py                 # Main Flask application
├── config.py             # Configuration management
├── utils/
│   ├── pdf_processor.py  # PDF text extraction
│   └── ollama_client.py  # Ollama API integration
├── uploads/              # PDF file storage
└── requirements.txt      # Python dependencies
```

## AI Processing Pipeline

1. **PDF Upload**: Secure file upload with validation
2. **Text Extraction**: PyMuPDF extracts clean text from PDF
3. **AI Analysis**: Ollama processes text for:
   - Comprehensive summaries
   - Educational questions with explanations
   - Key concept identification
   - Learning recommendations
4. **3D Visualization**: Concept relationships mapped to 3D coordinates
5. **Session Creation**: Complete learning session with all AI-generated content

## Error Handling

The backend includes comprehensive error handling:

- PDF processing errors
- Ollama connection issues
- Invalid file formats
- AI generation failures with fallbacks

## Performance Notes

- **Processing Time**: 30-60 seconds for typical documents
- **File Size Limit**: 16MB maximum
- **Concurrent Requests**: Limited by Ollama model capacity
- **Memory Usage**: Scales with document size and model complexity

## Troubleshooting

### Ollama Not Connected
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama if not running
ollama serve
```

### Model Not Found
```bash
# List available models
ollama list

# Pull required model
ollama pull llama2
```

### PDF Processing Errors
- Ensure PDF contains extractable text (not just images)
- Check file size is under 16MB limit
- Verify PDF is not password protected

## Development

For development with hot reload:
```bash
export FLASK_ENV=development
python app.py
```

## Production Deployment

For production use:
- Use a proper WSGI server (Gunicorn, uWSGI)
- Set up proper database storage instead of in-memory
- Configure file storage (AWS S3, etc.)
- Add authentication and rate limiting
- Use environment variables for all configuration