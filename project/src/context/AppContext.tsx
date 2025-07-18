import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { LearningSession } from '../types';

interface AppState {
  currentSession: LearningSession | null;
  isLoading: boolean;
  error: string | null;
  uploadedFile: File | null;
}

type AppAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SESSION'; payload: LearningSession }
  | { type: 'SET_UPLOADED_FILE'; payload: File | null }
  | { type: 'RESET_SESSION' };

const initialState: AppState = {
  currentSession: null,
  isLoading: false,
  error: null,
  uploadedFile: null
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SESSION':
      return { ...state, currentSession: action.payload, isLoading: false };
    case 'SET_UPLOADED_FILE':
      return { ...state, uploadedFile: action.payload };
    case 'RESET_SESSION':
      return { ...initialState };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Real API functions
export const mockAPI = {
  uploadPDF: async (file: File): Promise<{ pdf_id: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }
    
    const result = await response.json();
    return { pdf_id: result.pdf_id };
  },

  generateSession: async (pdfId: string): Promise<LearningSession> => {
    const response = await fetch('http://localhost:5000/api/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pdf_id: pdfId }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Processing failed');
    }
    
    return await response.json();
  }
};