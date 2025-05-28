import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="container">
      <div className="form-container">
        {/* Header skeleton */}
        <div style={{ 
          height: '32px', 
          width: '200px', 
          backgroundColor: '#e1e1e1',
          borderRadius: '4px',
          marginBottom: '1rem',
          animation: 'pulse 1.5s infinite'
        }} />

        {/* Progress bars skeleton */}
        <div style={{ 
          display: 'flex', 
          marginBottom: '1rem',
          gap: '4px'
        }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i}
              style={{ 
                height: '8px', 
                flex: 1, 
                backgroundColor: '#e1e1e1',
                borderRadius: '4px',
                animation: 'pulse 1.5s infinite'
              }}
            />
          ))}
        </div>

        {/* Question skeleton */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ 
            height: '24px', 
            width: '80%', 
            backgroundColor: '#e1e1e1',
            borderRadius: '4px',
            marginBottom: '0.5rem',
            animation: 'pulse 1.5s infinite'
          }} />
          <div style={{ 
            height: '16px', 
            width: '60%', 
            backgroundColor: '#e1e1e1',
            borderRadius: '4px',
            marginBottom: '0.5rem',
            animation: 'pulse 1.5s infinite'
          }} />
          <div style={{ 
            height: '60px', 
            width: '100%', 
            backgroundColor: '#e1e1e1',
            borderRadius: '4px',
            animation: 'pulse 1.5s infinite'
          }} />
        </div>

        {/* Navigation buttons skeleton */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '1rem' 
        }}>
          <div style={{ 
            height: '36px', 
            width: '100px', 
            backgroundColor: '#e1e1e1',
            borderRadius: '6px',
            animation: 'pulse 1.5s infinite'
          }} />
          <div style={{ 
            height: '36px', 
            width: '150px', 
            backgroundColor: '#e1e1e1',
            borderRadius: '6px',
            animation: 'pulse 1.5s infinite'
          }} />
        </div>
      </div>

      <div className="canvas-container">
        {/* Flow canvas skeleton */}
        <div style={{ 
          width: '100%', 
          height: '100%', 
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ 
            width: '80%', 
            height: '80%', 
            backgroundColor: '#e1e1e1',
            borderRadius: '8px',
            animation: 'pulse 1.5s infinite'
          }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.8; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
} 