import React, { useState, useRef, useEffect } from 'react';

interface VoiceProps {
  onTranscription: (text: string) => void;
  fieldName: string;
}

const Voice: React.FC<VoiceProps> = ({ onTranscription, fieldName }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [showUnsupportedPopup, setShowUnsupportedPopup] = useState(false);
  const recognitionRef = useRef<any>(null);

  const handleMicrophoneClick = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setShowUnsupportedPopup(true);
      return;
    }

    if (isRecording) {
      // Stop recording
      console.log('Stopping recording...');
      setIsRecording(false);
      if (recognitionRef.current) {
        const recognition = recognitionRef.current;
        recognitionRef.current = null; // Null first to prevent auto-restart
        recognition.stop();
      }
    } else {
      // Start recording
      console.log('Starting recording...');
      setIsRecording(true);
      
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      
      recognition.continuous = true; // Allow continuous recording through pauses
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      let finalTranscript = '';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
            console.log('Final transcript:', transcript);
            onTranscription(finalTranscript.trim());
          } else {
            interimTranscript += transcript;
            console.log('Interim transcript:', transcript);
            onTranscription((finalTranscript + interimTranscript).trim());
          }
        }
      };

      recognition.onstart = () => {
        console.log('Speech recognition actually started');
        setIsRecording(true);
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        // Only stop if user manually stopped (recognitionRef is null)
        // Otherwise, restart to handle browser timeouts
        if (recognitionRef.current && isRecording) {
          console.log('Auto-restarting recognition after timeout...');
          try {
            recognition.start();
          } catch (error) {
            console.error('Error restarting recognition:', error);
            setIsRecording(false);
            recognitionRef.current = null;
          }
        } else {
          setIsRecording(false);
          recognitionRef.current = null;
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        recognitionRef.current = null;
      };

      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        setIsRecording(false);
        recognitionRef.current = null;
      }
    }
  };

  const closePopup = () => {
    setShowUnsupportedPopup(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  return (
    <>
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
          backgroundColor: 'transparent',
          transition: 'all 0.2s ease',
        }}
      >
        {/* Pulsating animation rings when recording */}
        {isRecording && (
          <>
            <div
              style={{
                position: 'absolute',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                opacity: 0.3,
                animation: 'pulse-outer 2s infinite',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                opacity: 0.5,
                animation: 'pulse-middle 2s infinite 0.3s',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                opacity: 0.7,
                animation: 'pulse-inner 2s infinite 0.6s',
              }}
            />
          </>
        )}
        
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ zIndex: 10, position: 'relative' }}
        >
          <g clipPath="url(#clip0_2_5)">
            <path 
              d="M17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z" 
              fill={isRecording ? "#3b82f6" : "#666"}
            />
            <path 
              d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14ZM11 5C11 4.45 11.45 4 12 4C12.55 4 13 4.45 13 5V11C13 11.55 12.55 12 12 12C11.45 12 11 11.55 11 11V5Z" 
              fill={isRecording ? "#3b82f6" : "#666"}
            />
            <path 
              d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14Z" 
              fill={isRecording ? "#3b82f6" : "#666"}
            />
          </g>
          <defs>
            <clipPath id="clip0_2_5">
              <rect width="24" height="24" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      </div>

      {/* Browser not supported popup */}
      {showUnsupportedPopup && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={closePopup}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              maxWidth: '280px',
              margin: '20px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_popup)">
                  <path 
                    d="M17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z" 
                    fill="#666"
                  />
                  <path 
                    d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14ZM11 5C11 4.45 11.45 4 12 4C12.55 4 13 4.45 13 5V11C13 11.55 12.55 12 12 12C11.45 12 11 11.55 11 11V5Z" 
                    fill="#666"
                  />
                  <path 
                    d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14Z" 
                    fill="#666"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_popup">
                    <rect width="24" height="24" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '8px',
              color: '#333'
            }}>
              Voice Input Not Supported
            </h2>
            <p style={{ 
              fontSize: '14px', 
              color: '#666', 
              marginBottom: '16px',
              lineHeight: '1.4'
            }}>
              Your browser doesn't support voice input. Please try Chrome, Safari, or Edge.
            </p>
            <button
              onClick={closePopup}
              style={{
                background: '#000',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#333';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#000';
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* CSS animations for pulsating effect */}
      <style jsx>{`
        @keyframes pulse-outer {
          0% {
            transform: scale(0.8);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.1;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }

        @keyframes pulse-middle {
          0% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.2;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }

        @keyframes pulse-inner {
          0% {
            transform: scale(0.9);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.3;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default Voice; 