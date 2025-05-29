import React, { useState, useEffect, useRef } from 'react';

interface VoiceProps {
  onTranscription: (text: string) => void;
  fieldName: string;
}

const Voice: React.FC<VoiceProps> = ({ onTranscription, fieldName }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  // Process audio with OpenAI Whisper API (skeleton implementation)
  const processAudio = async (audioBlob: Blob) => {
    try {
      // TODO: Implement actual OpenAI Whisper API call
      // const formData = new FormData();
      // formData.append('file', audioBlob, 'audio.wav');
      // formData.append('model', 'whisper-1');
      
      // const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      //   },
      //   body: formData,
      // });
      
      // const result = await response.json();
      // const transcription = result.text;

      // Simulate API call delay and mock transcription
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockTranscription = `Mock transcription for ${fieldName} field`;
      
      onTranscription(mockTranscription);
      setIsProcessing(false);
    } catch (error) {
      console.error('Error processing audio:', error);
      setIsProcessing(false);
    }
  };

  // Handle microphone click
  const handleMicrophoneClick = () => {
    if (isRecording) {
      stopRecording();
    } else if (!isProcessing) {
      startRecording();
    }
  };

  return (
    <div 
      onClick={handleMicrophoneClick}
      style={{ 
        position: 'absolute', 
        bottom: '8px', 
        right: '8px', 
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: isRecording || isProcessing ? '#007AFF' : 'transparent',
        transition: 'all 0.2s ease',
        ...(isRecording && {
          animation: 'pulse 1.5s infinite',
          boxShadow: '0 0 0 4px rgba(0, 122, 255, 0.3)',
        }),
        ...(isProcessing && {
          animation: 'spin 1s linear infinite',
        })
      }}
    >
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_2_5)">
          <path 
            d="M17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z" 
            fill={isRecording || isProcessing ? "white" : "#666"}
          />
          <path 
            d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14ZM11 5C11 4.45 11.45 4 12 4C12.55 4 13 4.45 13 5V11C13 11.55 12.55 12 12 12C11.45 12 11 11.55 11 11V5Z" 
            fill={isRecording || isProcessing ? "white" : "#666"}
          />
          <path 
            d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14Z" 
            fill={isRecording || isProcessing ? "white" : "#666"}
          />
        </g>
        <defs>
          <clipPath id="clip0_2_5">
            <rect width="24" height="24" fill="white"/>
          </clipPath>
        </defs>
      </svg>

      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 122, 255, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(0, 122, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(0, 122, 255, 0);
          }
        }
        
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Voice; 