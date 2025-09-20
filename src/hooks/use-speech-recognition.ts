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
// Keep track of the final transcript separately
let finalTranscriptSinceLastStart = '';

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
      finalTranscriptSinceLastStart = ''; // Reset final transcript on start
      setTranscript('');
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error("Speech recognition couldn't be started.", error);
        // This can happen if start() is called too close to a previous stop().
        setIsListening(false);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [isListening]);
  
  const resetTranscript = useCallback(() => {
    finalTranscriptSinceLastStart = '';
    setTranscript('');
  }, []);

  useEffect(() => {
    if (!recognition) return;

    const handleResult = (event: any) => {
       let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscriptSinceLastStart += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        setTranscript(finalTranscriptSinceLastStart + interimTranscript);
    };

    const handleError = (event: any) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        // Handle microphone permission issues gracefully if needed
      }
      setIsListening(false);
    };

    const handleEnd = () => {
      setIsListening(false);
    };

    recognition.onresult = handleResult;
    recognition.onerror = handleError;
    recognition.onend = handleEnd;
    
    // Clean up on unmount
    return () => {
        if(recognition) {
            recognition.stop();
            recognition.onresult = null;
            recognition.onerror = null;
            recognition.onend = null;
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
