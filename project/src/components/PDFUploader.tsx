import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, mockAPI } from '../context/AppContext';

export default function PDFUploader() {
  const { state, dispatch } = useApp();
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    dispatch({ type: 'SET_UPLOADED_FILE', payload: file });
    setUploadStatus('uploading');
    setProgress(0);

    try {
      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(uploadInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      const { pdf_id } = await mockAPI.uploadPDF(file);
      
      setUploadStatus('processing');
      setProgress(0);

      // Simulate processing progress
      const processingInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(processingInterval);
            return 100;
          }
          return prev + 2;
        });
      }, 300);

      const session = await mockAPI.generateSession(pdf_id);
      
      dispatch({ type: 'SET_SESSION', payload: session });
      setUploadStatus('success');
      
    } catch (error) {
      setUploadStatus('error');
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to process PDF' });
    }
  }, [dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: uploadStatus === 'uploading' || uploadStatus === 'processing'
  });

  const resetUpload = () => {
    setUploadStatus('idle');
    setProgress(0);
    dispatch({ type: 'RESET_SESSION' });
  };

  if (uploadStatus === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </motion.div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">PDF Processed Successfully!</h3>
          <p className="text-gray-600 mb-6">Your learning session is ready. Explore the insights below.</p>
          <button
            onClick={resetUpload}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Process Another PDF
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
      >
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Your PDF</h2>
            <p className="text-gray-600">Transform your documents into interactive learning experiences</p>
          </div>

          <AnimatePresence mode="wait">
            {uploadStatus === 'idle' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-700 font-medium mb-2">
                  {isDragActive ? 'Drop the PDF here' : 'Drag & drop a PDF file'}
                </p>
                <p className="text-sm text-gray-500">or click to browse</p>
              </motion.div>
            )}

            {(uploadStatus === 'uploading' || uploadStatus === 'processing') && (
              <motion.div
                key="progress"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Upload className="w-8 h-8 text-blue-600" />
                  </motion.div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {uploadStatus === 'uploading' ? 'Uploading PDF...' : 'Processing with AI...'}
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {uploadStatus === 'uploading' 
                    ? 'Uploading your document...' 
                    : 'Generating summary, questions, and concept maps...'}
                </p>
              </motion.div>
            )}

            {uploadStatus === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload Failed</h3>
                <p className="text-gray-600 mb-4">There was an error processing your PDF. Please try again.</p>
                <button
                  onClick={resetUpload}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}