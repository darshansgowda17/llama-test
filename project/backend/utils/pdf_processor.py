import fitz  # PyMuPDF
import re
from typing import Dict, List, Optional

class PDFProcessor:
    """Handles PDF text extraction and preprocessing"""
    
    def __init__(self):
        self.min_text_length = 100
        
    def extract_text(self, pdf_path: str) -> Dict[str, any]:
        """Extract text and metadata from PDF"""
        try:
            doc = fitz.open(pdf_path)
            
            # Extract text from all pages
            full_text = ""
            page_texts = []
            
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                page_text = page.get_text()
                page_texts.append(page_text)
                full_text += page_text + "\n"
            
            # Get document metadata
            metadata = doc.metadata
            
            doc.close()
            
            # Clean and preprocess text
            cleaned_text = self._clean_text(full_text)
            
            if len(cleaned_text) < self.min_text_length:
                raise ValueError("PDF contains insufficient text content")
            
            return {
                "full_text": cleaned_text,
                "page_texts": [self._clean_text(text) for text in page_texts],
                "page_count": len(page_texts),
                "word_count": len(cleaned_text.split()),
                "title": metadata.get("title", "Untitled Document"),
                "author": metadata.get("author", "Unknown"),
                "subject": metadata.get("subject", ""),
                "creator": metadata.get("creator", "")
            }
            
        except Exception as e:
            raise Exception(f"Error processing PDF: {str(e)}")
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize extracted text"""
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove special characters but keep punctuation
        text = re.sub(r'[^\w\s\.\,\!\?\;\:\-\(\)\[\]\"\']+', '', text)
        
        # Remove very short lines (likely artifacts)
        lines = text.split('\n')
        cleaned_lines = [line.strip() for line in lines if len(line.strip()) > 3]
        
        return ' '.join(cleaned_lines).strip()
    
    def chunk_text(self, text: str, chunk_size: int = 2000, overlap: int = 200) -> List[str]:
        """Split text into overlapping chunks for processing"""
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size - overlap):
            chunk = ' '.join(words[i:i + chunk_size])
            chunks.append(chunk)
            
            if i + chunk_size >= len(words):
                break
                
        return chunks