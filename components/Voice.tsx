import React, { useState } from 'react';

interface VoiceProps {
  onTranscription: (text: string) => void;
  fieldName: string;
}

const Voice: React.FC<VoiceProps> = ({ onTranscription, fieldName }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleMicrophoneClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

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
            <clipPath id="clip0_2_5">
              <rect width="24" height="24" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      </div>

      {showPopup && (
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
              Voice Mode Coming Soon
            </h2>
            <p style={{ 
              fontSize: '14px', 
              color: '#666', 
              marginBottom: '16px',
              lineHeight: '1.4'
            }}>
              We're working on adding voice input functionality.
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
    </>
  );
};

export default Voice; 