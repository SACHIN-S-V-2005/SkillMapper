'use client';

import { useState, useEffect, useCallback } from 'react';

// Define the interface for the speech recognition object
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

// Extend the window object to include webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

let recognition: SpeechRecognition | null = null;

if (typeof window !== 'undefined') {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
  }
}

export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      setTranscript('');
      recognition.start();
      setIsListening(true);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [isListening]);
  
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(prev => prev + finalTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        // Handle microphone permission issues gracefully if needed
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
    
    // Clean up on unmount
    return () => {
        if(recognition) {
            recognition.stop();
        }
    };

  }, []);

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    hasRecognitionSupport: !!recognition,
  };
};
