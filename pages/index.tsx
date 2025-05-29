import React, { useState, useEffect } from 'react';
import FlowCanvas from '../components/FlowCanvas';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Sidebar from '../components/Sidebar';
import Voice from '../components/Voice';
import { generateSystemDesign } from '../utils/api';

// Custom hook for typing animation
const useTypingAnimation = (text: string, speed: number = 100) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      // After typing is complete, show cursor for 2 more seconds then hide it
      const timeout = setTimeout(() => {
        setShowCursor(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
    setShowCursor(true);
  }, [text]);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return displayText + (showCursor && currentIndex <= text.length ? '|' : '');
};

// Main application page that combines:
// 1. Input form for system design requirements
// 2. FlowCanvas component for visualization
export default function Home() {
  // State for form inputs based on input.txt questions
  const [formData, setFormData] = useState({
    productIntent: '',
    idealUser: '',
    coreProblem: '',
    solutionIdea: '',
    platform: '',
    dataStorage: '',
    inspirations: ''
  });

  // State for graph data
  const [graphData, setGraphData] = useState(null);
  
  // State for loading status
  const [isLoading, setIsLoading] = useState(false);
  
  // State for active question
  const [activeQuestion, setActiveQuestion] = useState(0);
  const totalQuestions = 7;

  // State for page loading
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Placeholder texts for typing animation
  const placeholderTexts = [
    "Describe what you're building...",
    "Describe the core problem...",
    "Describe your solution idea...",
    "Describe your ideal user...",
    "",
    "List similar products or inspirations...",
    ""
  ];

  // Typing animation for current placeholder
  const currentPlaceholder = useTypingAnimation(
    placeholderTexts[activeQuestion] || "", 
    80
  );

  // Simulate initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Navigate between questions
  const nextQuestion = () => {
    if (activeQuestion < totalQuestions - 1) {
      setActiveQuestion(activeQuestion + 1);
    }
  };
  
  const prevQuestion = () => {
    if (activeQuestion > 0) {
      setActiveQuestion(activeQuestion - 1);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Generation functionality temporarily removed
    console.log('Generate button clicked - functionality disabled for now');
  };

  // Handle voice transcription
  const handleVoiceTranscription = (fieldName: string, transcription: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: transcription,
    }));
  };

  // Question components based on input.txt
  const questions = [
    // Question 1
    <div key="q1">
      <label htmlFor="productIntent" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
        1. What are you trying to build?
      </label>
      <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#666' }}>
        Free-text, core intent of product (e.g., a mobile app for freelancers to manage time).
      </p>
      <div style={{ position: 'relative' }}>
        <textarea
          id="productIntent"
          name="productIntent"
          value={formData.productIntent}
          onChange={handleInputChange}
          style={{ width: '100%', padding: '0.5rem', paddingRight: '2.5rem', minHeight: '60px', borderRadius: '10px', backgroundColor: '#F5F5F7', border: '1px solid #e9ecef' }}
          placeholder={currentPlaceholder}
        />
        <Voice 
          fieldName="productIntent"
          onTranscription={(text) => handleVoiceTranscription('productIntent', text)}
        />
      </div>
    </div>,
    
    // Question 2
    <div key="q2">
      <label htmlFor="coreProblem" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
        2. What is the core problem you're solving?
      </label>
      <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#666' }}>
        Get to the underlying utility, not just the product (e.g., procrastination, lack of structure).
      </p>
      <div style={{ position: 'relative' }}>
        <textarea
          id="coreProblem"
          name="coreProblem"
          value={formData.coreProblem}
          onChange={handleInputChange}
          style={{ width: '100%', padding: '0.5rem', paddingRight: '2.5rem', minHeight: '60px', borderRadius: '10px', backgroundColor: '#F5F5F7', border: '1px solid #e9ecef' }}
          placeholder={currentPlaceholder}
        />
        <Voice 
          fieldName="coreProblem"
          onTranscription={(text) => handleVoiceTranscription('coreProblem', text)}
        />
      </div>
    </div>,
    
    // Question 3
    <div key="q3">
      <label htmlFor="solutionIdea" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
        3. Do you have an idea of how the solution should work?
      </label>
      <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#666' }}>
        Early mental model: features, flow, interface, or lack thereof.
      </p>
      <div style={{ position: 'relative' }}>
        <textarea
          id="solutionIdea"
          name="solutionIdea"
          value={formData.solutionIdea}
          onChange={handleInputChange}
          style={{ width: '100%', padding: '0.5rem', paddingRight: '2.5rem', minHeight: '60px', borderRadius: '10px', backgroundColor: '#F5F5F7', border: '1px solid #e9ecef' }}
          placeholder={currentPlaceholder}
        />
        <Voice 
          fieldName="solutionIdea"
          onTranscription={(text) => handleVoiceTranscription('solutionIdea', text)}
        />
      </div>
    </div>,
    
    // Question 4
    <div key="q4">
      <label htmlFor="idealUser" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
        4. Who is your ideal user?
      </label>
      <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#666' }}>
        Persona + pain points (e.g., freelance designers who struggle with time tracking).
      </p>
      <div style={{ position: 'relative' }}>
        <textarea
          id="idealUser"
          name="idealUser"
          value={formData.idealUser}
          onChange={handleInputChange}
          style={{ width: '100%', padding: '0.5rem', paddingRight: '2.5rem', minHeight: '60px', borderRadius: '10px', backgroundColor: '#F5F5F7', border: '1px solid #e9ecef' }}
          placeholder={currentPlaceholder}
        />
        <Voice 
          fieldName="idealUser"
          onTranscription={(text) => handleVoiceTranscription('idealUser', text)}
        />
      </div>
    </div>,
    
    // Question 5
    <div key="q5">
      <label htmlFor="platform" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
        5. Are you thinking of launching as a web app, mobile app, or both?
      </label>
      <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#666' }}>
        Platform affects stack and system suggestions.
      </p>
      <select
        id="platform"
        name="platform"
        value={formData.platform}
        onChange={handleInputChange}
        style={{ width: '100%', padding: '0.5rem', borderRadius: '10px', backgroundColor: '#F5F5F7', border: '1px solid #e9ecef' }}
      >
        <option value="">Select platform</option>
        <option value="Web App">Web App</option>
        <option value="Mobile App">Mobile App</option>
        <option value="Both">Both (Web + Mobile)</option>
        <option value="Desktop">Desktop Application</option>
      </select>
    </div>,
    
    // Question 6
    <div key="q6">
      <label htmlFor="inspirations" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
        6. What are similar products or inspirations?
      </label>
      <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#666' }}>
        Can guide user flow, features, or tradeoff mappings.
      </p>
      <div style={{ position: 'relative' }}>
        <textarea
          id="inspirations"
          name="inspirations"
          value={formData.inspirations}
          onChange={handleInputChange}
          style={{ width: '100%', padding: '0.5rem', paddingRight: '2.5rem', minHeight: '60px', borderRadius: '10px', backgroundColor: '#F5F5F7', border: '1px solid #e9ecef' }}
          placeholder={currentPlaceholder}
        />
        <Voice 
          fieldName="inspirations"
          onTranscription={(text) => handleVoiceTranscription('inspirations', text)}
        />
      </div>
    </div>,
    
    // Question 7
    <div key="q7">
      <label htmlFor="dataStorage" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
        7. Will you collect user data or require backend storage?
      </label>
      <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#666' }}>
        Yes/No → Triggers DB design vs static frontends.
      </p>
      <select
        id="dataStorage"
        name="dataStorage"
        value={formData.dataStorage}
        onChange={handleInputChange}
        style={{ width: '100%', padding: '0.5rem', borderRadius: '10px', backgroundColor: '#F5F5F7', border: '1px solid #e9ecef' }}
      >
        <option value="">Select option</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>,
  ];

  // If page is loading, show skeleton
  if (isPageLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div className="form-container">
          <h1 style={{ marginTop: '-1.5rem', marginBottom: '1rem', fontSize: '1.5rem', display: 'flex', alignItems: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '10px' }}>
              <path d="M15.7276 0.818098C15.6441 0.484223 15.3442 0.25 15 0.25C14.6558 0.25 14.3559 0.484223 14.2724 0.818098C14.0436 1.73333 13.7192 2.34514 13.2822 2.78217C12.8451 3.2192 12.2333 3.54358 11.3181 3.77239C10.9842 3.85586 10.75 4.15585 10.75 4.5C10.75 4.84415 10.9842 5.14414 11.3181 5.22761C12.2333 5.45642 12.8451 5.7808 13.2822 6.21783C13.7192 6.65486 14.0436 7.26667 14.2724 8.1819C14.3559 8.51578 14.6558 8.75 15 8.75C15.3442 8.75 15.6441 8.51578 15.7276 8.1819C15.9564 7.26667 16.2808 6.65486 16.7178 6.21783C17.1549 5.7808 17.7667 5.45642 18.6819 5.22761C19.0158 5.14414 19.25 4.84415 19.25 4.5C19.25 4.15585 19.0158 3.85586 18.6819 3.77239C17.7667 3.54358 17.1549 3.2192 16.7178 2.78217C16.2808 2.34514 15.9564 1.73333 15.7276 0.818098Z" fill="#292556"/>
              <path d="M8.72761 4.8181C8.64414 4.48422 8.34415 4.25 8 4.25C7.65585 4.25 7.35586 4.48422 7.27239 4.8181C6.8293 6.59048 6.18349 7.84514 5.26431 8.76431C4.34514 9.68349 3.09048 10.3293 1.3181 10.7724C0.984223 10.8559 0.75 11.1558 0.75 11.5C0.75 11.8442 0.984223 12.1441 1.3181 12.2276C3.09048 12.6707 4.34513 13.3165 5.26431 14.2357C6.18349 15.1549 6.8293 16.4095 7.27239 18.1819C7.35586 18.5158 7.65585 18.75 8 18.75C8.34415 18.75 8.64414 18.5158 8.72761 18.1819C9.1707 16.4095 9.81651 15.1549 10.7357 14.2357C11.6549 13.3165 12.9095 12.6707 14.6819 12.2276C15.0158 12.1441 15.25 11.8442 15.25 11.5C15.25 11.1558 15.0158 10.8559 14.6819 10.7724C12.9095 10.3293 11.6549 9.68349 10.7357 8.76431C9.81651 7.84514 9.1707 6.59048 8.72761 4.8181Z" fill="#292556"/>
            </svg>
            Idea to Technical Design in Seconds
          </h1>
          <form onSubmit={handleSubmit}>
            {/* Progress indicator */}
            <div style={{ display: 'flex', marginBottom: '1rem' }}>
              {Array.from({ length: totalQuestions }).map((_, i) => (
                <div 
                  key={i}
                  style={{ 
                    height: '4px', 
                    flex: 1, 
                    backgroundColor: i <= activeQuestion ? 'transparent' : '#e1e1e1',
                    background: i <= activeQuestion ? '#1F2328' : '#e1e1e1',
                    marginRight: i < totalQuestions - 1 ? '4px' : 0,
                    borderRadius: '4px'
                  }}
                />
              ))}
            </div>

            {/* Current question */}
            {questions[activeQuestion]}
            
            {/* Navigation buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <button 
                type="button"
                onClick={prevQuestion}
                disabled={activeQuestion === 0}
                style={{ 
                  padding: '0.5rem 1rem', 
                  backgroundColor: activeQuestion === 0 ? '#e1e1e1' : '#f8f9fa',
                  border: '1px solid #ced4da',
                  borderRadius: '8px',
                  cursor: activeQuestion === 0 ? 'not-allowed' : 'pointer',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '80px',
                }}
              >
                Previous
              </button>
              
              {activeQuestion < totalQuestions - 1 ? (
                <button 
                  type="button"
                  onClick={nextQuestion}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    background: 'linear-gradient(135deg, rgba(0, 112, 243, 0.9) 0%, rgba(0, 150, 255, 0.9) 50%, rgba(0, 112, 243, 0.9) 100%)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 112, 243, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    color: 'white', 
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 112, 243, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 112, 243, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                  }}
                >
                  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.59168 1.71245L2.38083 6.25004H7.25001C7.66422 6.25004 8.00001 6.58582 8.00001 7.00004C8.00001 7.41425 7.66422 7.75004 7.25001 7.75004H2.38083L1.59168 12.2876L13.9294 7.00004L1.59168 1.71245ZM0.988747 7.00004L0.0636748 1.68087C-0.0111098 1.25086 0.128032 0.811352 0.436661 0.502722C0.824446 0.114942 1.40926 0.00231168 1.91333 0.218342L15.3157 5.9622C15.7308 6.14013 16 6.54835 16 7.00004C16 7.45172 15.7308 7.85995 15.3157 8.03788L1.91333 13.7817C1.40926 13.9978 0.824446 13.8851 0.436661 13.4974C0.128032 13.1887 -0.01111 12.7492 0.0636748 12.3192L0.988747 7.00004Z" fill="white"/>
                  </svg>
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={isLoading}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    background: 'linear-gradient(135deg, rgba(0, 112, 243, 0.9) 0%, rgba(0, 150, 255, 0.9) 50%, rgba(0, 112, 243, 0.9) 100%)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 112, 243, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    color: 'white', 
                    borderRadius: '8px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 112, 243, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 112, 243, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                    }
                  }}
                >
                  {!isLoading && (
                    <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline', verticalAlign: 'middle' }}>
                      <path fillRule="evenodd" clipRule="evenodd" d="M9.27964 8.65143L0.479436 17.4516C0.186542 17.7445 0.186542 18.2194 0.479435 18.5123C0.772329 18.8052 1.2472 18.8052 1.5401 18.5123L10.3405 9.71187C10.3079 9.55633 10.2741 9.39456 10.239 9.22643L10.1573 8.83474L9.76564 8.75303C9.59731 8.71792 9.43535 8.68413 9.27964 8.65143Z" fill="#FFD700"/>
                      <path d="M12.8506 2.71736C11.2024 1.06914 10.3783 0.245029 9.7874 0.305354C9.45666 0.339121 9.15299 0.503254 8.94356 0.761456C8.56941 1.22273 8.80741 2.36364 9.28341 4.64545C7.22591 5.61253 6.19717 6.09607 6.07127 6.70964C6.01733 6.97248 6.04941 7.24571 6.16275 7.48891C6.42733 8.05664 7.5401 8.28877 9.76563 8.75303L10.1573 8.83474L10.239 9.22643C10.7033 11.452 10.9354 12.5647 11.5032 12.8293C11.7464 12.9427 12.0196 12.9747 12.2824 12.9208C12.896 12.7949 13.3795 11.7661 14.3466 9.70865C16.6284 10.1847 17.7693 10.4227 18.2306 10.0485C18.4888 9.83907 18.6529 9.53541 18.6867 9.20467C18.747 8.6138 17.9229 7.78969 16.2747 6.14147L16.1037 5.97044L16.1823 5.80315C17.158 3.72743 17.6458 2.68957 17.3028 2.11797C17.1972 1.94206 17.05 1.79482 16.8741 1.68927C16.3025 1.34629 15.2646 1.83412 13.1889 2.80976L13.0216 2.88839L12.8506 2.71736Z" fill="#FFD700"/>
                      <path d="M4.47761 0.818098C4.39414 0.484223 4.09415 0.25 3.75 0.25C3.40585 0.25 3.10586 0.484223 3.02239 0.818098C2.91858 1.23333 2.7817 1.47014 2.62592 1.62592C2.47014 1.7817 2.23333 1.91858 1.8181 2.02239C1.48422 2.10586 1.25 2.40585 1.25 2.75C1.25 3.09415 1.48422 3.39414 1.8181 3.47761C2.23333 3.58142 2.47014 3.7183 2.62592 3.87408C2.7817 4.02986 2.91858 4.26667 3.02239 4.6819C3.10586 5.01578 3.40585 5.25 3.75 5.25C4.09415 5.25 4.39414 5.01578 4.47761 4.6819C4.58142 4.26667 4.7183 4.02986 4.87408 3.87408C5.02986 3.7183 5.26667 3.58142 5.6819 3.47761C6.01578 3.39414 6.25 3.09415 6.25 2.75C6.25 2.40585 6.01578 2.10586 5.6819 2.02239C5.26667 1.91858 5.02986 1.7817 4.87408 1.62592C4.7183 1.47014 4.5814 1.23333 4.47761 0.818098Z" fill="#FFD700"/>
                      <path d="M14.9776 15.3181C14.8941 14.9842 14.5942 14.75 14.25 14.75C13.9058 14.75 13.6059 14.9842 13.5224 15.3181C13.4186 15.7333 13.2817 15.9701 13.1259 16.1259C12.9701 16.2817 12.7333 16.4186 12.3181 16.5224C11.9842 16.6059 11.75 16.9058 11.75 17.25C11.75 17.5942 11.9842 17.8941 12.3181 17.9776C12.7333 18.0814 12.9701 18.2183 13.1259 18.3741C13.2817 18.5299 13.4186 18.7667 13.5224 19.1819C13.6059 19.5158 13.9058 19.75 14.25 19.75C14.5942 19.75 14.8941 19.5158 14.9776 19.1819C15.0814 18.7667 15.2183 18.5299 15.3741 18.3741C15.5299 18.2183 15.7667 18.0814 16.1819 17.9776C16.5158 17.8941 16.75 17.5942 16.75 17.25C16.75 16.9058 16.5158 16.6059 16.1819 16.5224C15.7667 16.4186 15.5299 16.2817 15.3741 16.1259C15.2183 15.9701 15.0814 15.7333 14.9776 15.3181Z" fill="#FFD700"/>
                    </svg>
                  )}
                  {isLoading ? 'Generating...' : 'Generate System Design'}
                </button>
              )}
            </div>
          </form>
        </div>
        
        <div className="canvas-container">
          <FlowCanvas graphData={graphData} />
        </div>
      </div>
      <style jsx>{`
        .app-container {
          display: flex;
          min-height: 100vh;
        }
        .main-content {
          flex: 1;
          margin-left: 200px;
          padding: 2rem;
        }
        .form-container {
          max-width: 800px;
          margin: 0 auto;
          background-color: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: none;
        }
        .canvas-container {
          margin-top: 2rem;
        }
      `}</style>
    </div>
  );
} 