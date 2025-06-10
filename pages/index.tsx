import React, { useState, useEffect } from 'react';
import FlowCanvas from '../components/FlowCanvas';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Sidebar from '../components/Sidebar';
import Voice from '../components/Voice';
import OpenAI from 'openai';

// Custom hook for rotating text animation
const useRotatingText = (words: string[], interval: number = 3000) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeout(() => {
        setIsFlipping(true);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % words.length);
          setIsFlipping(false);
        }, 300); // Half of the flip animation duration
      }, 200); // 0.2 second delay before starting the flip
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return { currentWord: words[currentIndex], isFlipping };
};

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

// Import prompt functions from backend
const getPrompts = async () => {
  const response = await fetch('/api/prompts');
  return response.json();
};

// Generate graph structure using backend prompts
const generateGraphStructure = async (formData: any) => {
  // Helper function to extract JSON from GPT response
  const extractJSON = (text: string) => {
    try {
      // First try to parse the text directly
      return JSON.parse(text);
    } catch (e) {
      // If direct parsing fails, try to find JSON in code blocks
      const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch (e2) {
          console.log("Failed to parse JSON from code block:", e2);
        }
      }
      
      // Try to extract the largest JSON object in the text
      const objectMatch = text.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        try {
          return JSON.parse(objectMatch[0]);
        } catch (e3) {
          console.log("Failed to parse JSON from object match:", e3);
          
          // Last resort: try to clean up the JSON string and parse again
          try {
            const cleanedText = objectMatch[0]
              .replace(/[\u201C\u201D]/g, '"') // Replace smart quotes
              .replace(/[\n\r]+/g, ' ')        // Replace newlines with spaces
              .replace(/,\s*}/g, '}')          // Remove trailing commas
              .replace(/,\s*]/g, ']')          // Remove trailing commas in arrays
              .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":'); // Ensure property names are quoted
              
            return JSON.parse(cleanedText);
          } catch (e4) {
            console.log("Failed to parse cleaned JSON:", e4);
          }
        }
      }
      
      // If all parsing attempts fail, log the response for debugging
      console.error("Raw response that couldn't be parsed:", text);
      throw new Error('Could not extract valid JSON from response');
    }
  };

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
    dangerouslyAllowBrowser: true
  });

  // Get prompts from backend
  const prompts = await getPrompts();

  // Stage 1: Generate detailed system design using backend prompt
  const detailedPrompt = prompts.detailed_prompt
    .replace('{product_intent}', formData.productIntent)
    .replace('{core_problem}', formData.coreProblem)
    .replace('{solution_idea}', formData.solutionIdea)
    .replace('{ideal_user}', formData.idealUser)
    .replace('{platform}', formData.platform)
    .replace('{inspirations}', formData.inspirations)
    .replace('{data_storage}', formData.dataStorage);

  const detailedResponse = await openai.chat.completions.create({
    model: "gpt-4.1",
    messages: [{"role": "user", "content": detailedPrompt}],
    temperature: 0.7
  });

  const detailedDesign = detailedResponse.choices[0].message.content;

  // Stage 2: Convert to graph structure using enhanced backend prompt
  const graphPrompt = prompts.graph_prompt
    .replace('{detailed_design}', detailedDesign)
    .replace('{product_intent}', formData.productIntent);

  const graphResponse = await openai.chat.completions.create({
    model: "gpt-4.1",
    messages: [{"role": "user", "content": graphPrompt}],
    temperature: 0.1,
    response_format: { type: "json_object" }
  });

  return extractJSON(graphResponse.choices[0].message.content);
};

// How It Works component
const HowItWorksPage = () => {
  return (
    <div style={{ 
      padding: '0',
      maxWidth: '100%',
      margin: '0',
      background: '#ffffff',
      overflow: 'auto'
    }}>
      {/* Hero Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 2rem 2rem 2rem',
        textAlign: 'center'
      }}>
        {/* Date and Tags */}
        <div style={{
          marginBottom: '3rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.72rem',
          color: '#666'
        }}>
          <span>May 30, 2025</span>
        </div>

        {/* Main Heading */}
        <h1 style={{
          color: '#000',
          fontSize: '3.2rem',
          fontWeight: '600',
          marginBottom: '2rem',
          lineHeight: '1.1',
          letterSpacing: '-0.02em'
        }}>
          Introducing Desthetik
        </h1>

        {/* Description */}
        <p style={{
          color: '#666',
          fontSize: '1.04rem',
          lineHeight: '1.6',
          marginBottom: '3rem',
          maxWidth: '800px',
          margin: '0 auto 3rem auto'
        }}>
          A system design co-pilot that turns abstract startup ideas into highly structured, visual product architectures in seconds—so founders know <i>what</i> to build before they start building, without needing to be technical. It generates intuitive, editable flow diagrams in a Figma-style interface, helping users move from vague ideas to clear system-level thinking.
        </p>

        {/* CTA Button */}
        <button style={{
          background: '#2C2C2C',
          border: 'none',
          color: 'white',
          padding: '0.6rem 1rem',
          borderRadius: '8px',
          fontSize: '0.8rem',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          marginBottom: '4rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          margin: '0 auto 4rem auto'
        }}
        onClick={() => window.location.hash = '#playground'}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#1A1A1A';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#2C2C2C';
        }}
        >
          Try Desthetik
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M4.53033 4.75C4.53033 4.33579 4.86612 4 5.28033 4H11.2907C11.705 4 12.0407 4.33579 12.0407 4.75V10.7604C12.0407 11.1746 11.705 11.5104 11.2907 11.5104C10.8765 11.5104 10.5407 11.1746 10.5407 10.7604V6.56066L5.28033 11.8211C4.98744 12.114 4.51256 12.114 4.21967 11.8211C3.92678 11.5282 3.92678 11.0533 4.21967 10.7604L9.48008 5.5H5.28033C4.86612 5.5 4.53033 5.16421 4.53033 4.75Z" fill="white"/>
          </svg>
        </button>
      </div>

      {/* Hero Image Section */}
      <div style={{
        maxWidth: '1442px',
        margin: '0 auto',
        padding: '0 2rem 4rem 2rem'
      }}>
        <img 
          src="/Desthetik.png" 
          alt="Desthetik System Design Interface"
          style={{
            width: '100%',
            maxWidth: '1236px',
            height: 'auto',
            display: 'block',
            margin: '0 auto'
          }}
          onError={(e) => {
            console.log('Image failed to load');
            e.currentTarget.src = './Desthetik.png';
          }}
        />
      </div>

      {/* Content Section */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
        lineHeight: '1.8',
        fontSize: '0.88rem',
        color: '#333'
      }}>
        <p style={{ marginBottom: '2rem' }}>
          Today we're launching Desthetik — a system design agent that helps founders turn abstract startup ideas into structured, visual product architectures in seconds. Because the truth is, some of the best ideas in the world never get built. Not because they're bad ideas, but because the people behind them never knew where to start. The early-stage product journey is riddled with ambiguity: founders pour money into consultants, waste time spinning in circles, or skip foundational thinking altogether. What they're left with is a half-baked prototype that doesn't reflect the real problem or the user's needs, or nothing at all. Desthetik bridges that gap—giving you clarity before you even write a single line of code, so you know what to build, before you build.
        </p>
        
        <p style={{ marginBottom: '2rem' }}>
          AI tools like Cursor or Copilot can generate code, but they don't understand why something should be built a certain way. They don't know your customer, your goals, or your edge. That contextual intelligence—the "why" behind each system component—is what Desthetik captures. Through a conversational multi-step input flow, it maps your responses to pre-defined graph types and outputs a dynamic, editable system diagram in a Figma-style interface. You're not just getting code snippets—you're getting a blueprint for how your product should work based on your actual business intent.
        </p>

        <p style={{ marginBottom: '2rem' }}>
          As software development becomes more democratized, the playing field is shifting. The difference won't be who can code—it'll be who can design systems that matter. Great system design informs great UX. It shapes how products feel, scale, and solve real-world problems. Desthetik is for those who want to build with intention from day one. More features, more graph types, and deeper reasoning layers are coming soon.
        </p>

        <p style={{ marginTop: '3rem', fontStyle: 'italic', color: '#666' }}>
          Best,<br />
          Avram Dada, Creator
        </p>
      </div>
    </div>
  );
};

// Main application page that combines:
// 1. Input form for system design requirements
// 2. FlowCanvas component for visualization
export default function Home() {
  // State for navigation
  const [currentPage, setCurrentPage] = useState('how-it-works');

  // Rotating text animation for the heading
  const rotatingWords = ['idea', 'dreams', 'vision', 'concept', 'thoughts'];
  const { currentWord, isFlipping } = useRotatingText(rotatingWords, 3000);

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
  
  // State for summary data
  const [summaryData, setSummaryData] = useState(null);
  const [isSummaryVisible, setIsSummaryVisible] = useState(true);
  
  // State for loading status
  const [isLoading, setIsLoading] = useState(false);
  
  // State for active question
  const [activeQuestion, setActiveQuestion] = useState(0);
  const totalQuestions = 7;

  // State for page loading
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isFormCollapsed, setIsFormCollapsed] = useState(false);

  // Placeholder texts for typing animation
  const placeholderTexts = [
    "Tell Desthetik what you're building...",
    "Describe the core problem...",
    "Describe your solution idea and features...",
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

  // Listen for navigation events from sidebar
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#how-it-works') {
        setCurrentPage('how-it-works');
      } else if (hash === '#playground') {
        setCurrentPage('playground');
      } else {
        // Default to 'how-it-works' when no hash is present
        setCurrentPage('how-it-works');
      }
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Check initial hash
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
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
    
    // Validate that all required fields are filled
    const requiredFields = [
      { key: 'productIntent', min: 35, max: 500 },
      { key: 'coreProblem', min: 100, max: 500 },
      { key: 'solutionIdea', min: 100, max: 2000 },
      { key: 'idealUser', min: 20, max: 150 },
      { key: 'platform', min: 1, max: 100 },
      { key: 'inspirations', min: 100, max: 2000 },
      { key: 'dataStorage', min: 1, max: 100 }
    ];

    for (const field of requiredFields) {
      const value = formData[field.key as keyof typeof formData];
      if (!value || value.length < field.min || value.length > field.max) {
        alert(`Please complete all questions with the required character limits before generating.`);
        return;
      }
    }

    setIsLoading(true);
    setIsSummaryVisible(true);
    
    try {
      const graphData = await generateGraphStructure(formData);
      setGraphData(graphData);
      
      // Generate summary
      if (graphData && graphData.nodes) {
        const openai = new OpenAI({
          apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
          dangerouslyAllowBrowser: true
        });
        
        const summaryPrompt = `
        Based on the user's requirements and the technical system design I've created, provide a concise executive summary of:
        
        1. The key features and components of the system
        2. The engineering feasibility (easy, moderate, or challenging)
        3. Potential technical challenges to be aware of
        4. Estimated timeline for an MVP (provide two estimates: one without using AI coding tools, and one with AI coding tools like Cursor or GitHub Copilot, noting that AI tools help with front-end and back-end code but database configuration may still require manual work)
        
        User Requirements:
        - Product: ${formData.productIntent}
        - Problem: ${formData.coreProblem}
        - Solution: ${formData.solutionIdea}
        - Target User: ${formData.idealUser}
        - Platform: ${formData.platform}
        
        System Design: ${JSON.stringify(graphData)}
        
        Format the response in clean paragraphs with clear section headings (Key Features and Components, Engineering Feasibility, Technical Challenges, Estimated Timeline).
        Do NOT use markdown syntax like asterisks or bold formatting.
        Keep the summary under 400 words, focus on business value and technical insights.
        `;
        
        const summaryResponse = await openai.chat.completions.create({
          model: "gpt-4.1",
          messages: [{"role": "user", "content": summaryPrompt}],
          temperature: 0.7
        });
        
        setSummaryData(summaryResponse.choices[0].message.content);
      }
      
      // Optional: Show success message
      console.log('System design generated successfully!');
      
    } catch (error) {
      console.error('Generation failed:', error);
      alert(`Failed to generate system design: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
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
      {!isFormCollapsed && (
        <>
          <label htmlFor="productIntent" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            1. What are you trying to build?
          </label>
          <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#666' }}>
            E.g., a mobile app for freelancers to manage time.
          </p>
        </>
      )}
      <div style={{ position: 'relative' }}>
      <textarea
        id="productIntent"
        name="productIntent"
        value={formData.productIntent}
        onChange={handleInputChange}
          style={{ 
            width: '100%', 
            padding: '0.5rem', 
            paddingRight: '2.5rem', 
            minHeight: '60px', 
            borderRadius: '10px', 
            backgroundColor: '#F5F5F7', 
            border: formData.productIntent.length > 500 ? '1px solid #dc3545' : '1px solid #e9ecef'
          }}
          placeholder={currentPlaceholder}
        />
        <Voice 
          fieldName="productIntent"
          onTranscription={(text) => handleVoiceTranscription('productIntent', text)}
        />
      </div>
      <div style={{ 
        fontSize: '10px', 
        color: formData.productIntent.length > 500 ? '#dc3545' : '#666',
        fontWeight: 'normal',
        marginTop: '4px'
      }}>
        {formData.productIntent.length}/500 CHARACTERS • MIN 35 • MAX 500
      </div>
    </div>,
    
    // Question 2
    <div key="q2">
      {!isFormCollapsed && (
        <>
          <label htmlFor="coreProblem" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            2. What is the core problem you're solving?
          </label>
          <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#666' }}>
            Get to the underlying utility, not just the product (e.g., procrastination, lack of structure).
          </p>
        </>
      )}
      <div style={{ position: 'relative' }}>
      <textarea
          id="coreProblem"
          name="coreProblem"
          value={formData.coreProblem}
        onChange={handleInputChange}
          style={{ 
            width: '100%', 
            padding: '0.5rem', 
            paddingRight: '2.5rem', 
            minHeight: '60px', 
            borderRadius: '10px', 
            backgroundColor: '#F5F5F7', 
            border: formData.coreProblem.length > 500 ? '1px solid #dc3545' : '1px solid #e9ecef'
          }}
          placeholder={currentPlaceholder}
        />
        <Voice 
          fieldName="coreProblem"
          onTranscription={(text) => handleVoiceTranscription('coreProblem', text)}
        />
      </div>
      <div style={{ 
        fontSize: '10px', 
        color: formData.coreProblem.length > 500 ? '#dc3545' : '#666',
        fontWeight: 'normal',
        marginTop: '4px'
      }}>
        {formData.coreProblem.length}/500 CHARACTERS • MIN 100 • MAX 500
      </div>
    </div>,
    
    // Question 3
    <div key="q3">
      {!isFormCollapsed && (
        <>
          <label htmlFor="solutionIdea" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            3. Do you have an idea of how the solution should work?
          </label>
          <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#666' }}>
            Early mental model: features, flow, user experience.
          </p>
        </>
      )}
      <div style={{ position: 'relative' }}>
      <textarea
          id="solutionIdea"
          name="solutionIdea"
          value={formData.solutionIdea}
        onChange={handleInputChange}
          style={{ 
            width: '100%', 
            padding: '0.5rem', 
            paddingRight: '2.5rem', 
            minHeight: '60px', 
            borderRadius: '10px', 
            backgroundColor: '#F5F5F7', 
            border: formData.solutionIdea.length > 2000 ? '1px solid #dc3545' : '1px solid #e9ecef'
          }}
          placeholder={currentPlaceholder}
        />
        <Voice 
          fieldName="solutionIdea"
          onTranscription={(text) => handleVoiceTranscription('solutionIdea', text)}
        />
      </div>
      <div style={{ 
        fontSize: '10px', 
        color: formData.solutionIdea.length > 2000 ? '#dc3545' : '#666',
        fontWeight: 'normal',
        marginTop: '4px'
      }}>
        {formData.solutionIdea.length}/2000 CHARACTERS • MIN 100 • MAX 2000
      </div>
    </div>,
    
    // Question 4
    <div key="q4">
      {!isFormCollapsed && (
        <>
          <label htmlFor="idealUser" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            4. Who is your ideal user?
          </label>
          <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#666' }}>
            Persona + pain points (e.g., freelance designers who struggle with time tracking).
          </p>
        </>
      )}
      <div style={{ position: 'relative' }}>
      <textarea
          id="idealUser"
          name="idealUser"
          value={formData.idealUser}
        onChange={handleInputChange}
          style={{ 
            width: '100%', 
            padding: '0.5rem', 
            paddingRight: '2.5rem', 
            minHeight: '60px', 
            borderRadius: '10px', 
            backgroundColor: '#F5F5F7', 
            border: formData.idealUser.length > 150 ? '1px solid #dc3545' : '1px solid #e9ecef'
          }}
          placeholder={currentPlaceholder}
        />
        <Voice 
          fieldName="idealUser"
          onTranscription={(text) => handleVoiceTranscription('idealUser', text)}
        />
      </div>
      <div style={{ 
        fontSize: '10px', 
        color: formData.idealUser.length > 150 ? '#dc3545' : '#666',
        fontWeight: 'normal',
        marginTop: '4px'
      }}>
        {formData.idealUser.length}/150 CHARACTERS • MIN 20 • MAX 150
      </div>
    </div>,
    
    // Question 5
    <div key="q5">
      {!isFormCollapsed && (
        <>
          <label htmlFor="platform" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            5. Are you thinking of launching as a web app, mobile app, or both?
          </label>
          <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#666' }}>
            Platform affects stack and system suggestions.
          </p>
        </>
      )}
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
      {!isFormCollapsed && (
        <>
          <label htmlFor="inspirations" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            6. What are similar products or inspirations?
          </label>
          <p style={{ fontSize: '0.8rem', marginBottom: '0.5rem', color: '#666' }}>
            For example, if you're building a productivity tool, Notion might be a similar product. You could mention how Notion's 'lego-like' building blocks give users flexibility to manage their schedules while adding notes and other content.
          </p>
        </>
      )}
      <div style={{ position: 'relative' }}>
        <textarea
          id="inspirations"
          name="inspirations"
          value={formData.inspirations}
        onChange={handleInputChange}
          style={{ 
            width: '100%', 
            padding: '0.5rem', 
            paddingRight: '2.5rem', 
            minHeight: '60px', 
            borderRadius: '10px', 
            backgroundColor: '#F5F5F7', 
            border: formData.inspirations.length > 2000 ? '1px solid #dc3545' : '1px solid #e9ecef'
          }}
          placeholder={currentPlaceholder}
        />
        <Voice 
          fieldName="inspirations"
          onTranscription={(text) => handleVoiceTranscription('inspirations', text)}
        />
      </div>
      <div style={{ 
        fontSize: '10px', 
        color: formData.inspirations.length > 2000 ? '#dc3545' : '#666',
        fontWeight: 'normal',
        marginTop: '4px'
      }}>
        {formData.inspirations.length}/2000 CHARACTERS • MIN 100 • MAX 2000
      </div>
    </div>,
    
    // Question 7
    <div key="q7">
      {!isFormCollapsed && (
        <label htmlFor="dataStorage" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          7. Will you collect user data or require backend storage?
        </label>
      )}
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

  // Check if current question meets minimum requirements
  const isCurrentQuestionValid = () => {
    // Map question index to correct field name
    const fieldMapping = [
      'productIntent',  // Question 0
      'coreProblem',    // Question 1
      'solutionIdea',   // Question 2
      'idealUser',      // Question 3
      'platform',       // Question 4
      'inspirations',   // Question 5
      'dataStorage'     // Question 6
    ];
    
    const currentField = fieldMapping[activeQuestion];
    const currentValue = formData[currentField as keyof typeof formData];
    
    // For productIntent field (question 0), check 35-200 character count
    if (activeQuestion === 0) {
      return currentValue.length >= 35 && currentValue.length <= 200;
    }
    
    // For idealUser field (question 3), check 20-150 character count
    if (activeQuestion === 3) {
      return currentValue.length >= 20 && currentValue.length <= 150;
    }
    
    // For question 0 (productIntent), check 35-500 character count
    if (activeQuestion === 0) {
      return currentValue.length >= 35 && currentValue.length <= 500;
    }
    
    // For question 1 (coreProblem), check 100-500 character count
    if (activeQuestion === 1) {
      return currentValue.length >= 100 && currentValue.length <= 500;
    }
    
    // For question 2 (solutionIdea), check 100-2000 character count
    if (activeQuestion === 2) {
      return currentValue.length >= 100 && currentValue.length <= 2000;
    }
    
    // For question 5 (inspirations), check 100-2000 character count
    if (activeQuestion === 5) {
      return currentValue.length >= 100 && currentValue.length <= 2000;
    }
    
    // For select fields (questions 4, 6), just check if something is selected
    if ([4, 6].includes(activeQuestion)) {
      return currentValue.trim() !== '';
    }
    
    return true;
  };

  // If page is loading, show skeleton
  if (isPageLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        {currentPage === 'playground' ? (
          <>
        <div className="form-container">
          {/* Collapse/Expand Button - Only show when form is expanded */}
          {!isFormCollapsed && (
            <div style={{ 
              position: 'absolute', 
              top: '1rem', 
              right: '1rem', 
              zIndex: 1000 
            }}
            className="expand-tooltip-container"
            >
              <button
                onClick={() => setIsFormCollapsed(!isFormCollapsed)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f9fafb';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M4.25 0C4.66421 0 5 0.33579 5 0.75V3.25C5 4.2165 4.2165 5 3.25 5H0.75C0.33579 5 0 4.66421 0 4.25C0 3.83579 0.33579 3.5 0.75 3.5H3.25C3.38807 3.5 3.5 3.38807 3.5 3.25V0.75C3.5 0.33579 3.83579 0 4.25 0ZM9.75 0C10.1642 0 10.5 0.33579 10.5 0.75V3.25C10.5 3.38807 10.6119 3.5 10.75 3.5H13.25C13.6642 3.5 14 3.83579 14 4.25C14 4.66421 13.6642 5 13.25 5H10.75C9.7835 5 9 4.2165 9 3.25V0.75C9 0.33579 9.3358 0 9.75 0ZM0 9.75C0 9.3358 0.33579 9 0.75 9H3.25C4.2165 9 5 9.7835 5 10.75V13.25C5 13.6642 4.66421 14 4.25 14C3.83579 14 3.5 13.6642 3.5 13.25V10.75C3.5 10.6119 3.38807 10.5 3.25 10.5H0.75C0.33579 10.5 0 10.1642 0 9.75ZM9 10.75C9 9.7835 9.7835 9 10.75 9H13.25C13.6642 9 14 9.3358 14 9.75C14 10.1642 13.6642 10.5 13.25 10.5H10.75C10.6119 10.5 10.5 10.6119 10.5 10.75V13.25C10.5 13.6642 10.1642 14 9.75 14C9.3358 14 9 13.6642 9 13.25V10.75Z" fill="#1F2328"/>
                </svg>
              </button>
              <div className="expand-tooltip">Collapse</div>
            </div>
          )}

              {!isFormCollapsed && (
            <h1 style={{ marginTop: '-1.5rem', marginBottom: '5rem', fontWeight: '500', fontSize: '2rem', textAlign: 'center', lineHeight: '1.3' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '10px' }}>
                          <defs>
                            <linearGradient id="pulsatingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#667eea">
                                <animate attributeName="stop-color" values="#667eea;#764ba2;#0070f3;#667eea" dur="3s" repeatCount="indefinite" />
                              </stop>
                              <stop offset="50%" stopColor="#764ba2">
                                <animate attributeName="stop-color" values="#764ba2;#0070f3;#667eea;#764ba2" dur="3s" repeatCount="indefinite" />
                              </stop>
                              <stop offset="100%" stopColor="#0070f3">
                                <animate attributeName="stop-color" values="#0070f3;#667eea;#764ba2;#0070f3" dur="3s" repeatCount="indefinite" />
                              </stop>
                            </linearGradient>
                          </defs>
                          <path d="M15.7276 0.818098C15.6441 0.484223 15.3442 0.25 15 0.25C14.6558 0.25 14.3559 0.484223 14.2724 0.818098C14.0436 1.73333 13.7192 2.34514 13.2822 2.78217C12.8451 3.2192 12.2333 3.54358 11.3181 3.77239C10.9842 3.85586 10.75 4.15585 10.75 4.5C10.75 4.84415 10.9842 5.14414 11.3181 5.22761C12.2333 5.45642 12.8451 5.7808 13.2822 6.21783C13.7192 6.65486 14.0436 7.26667 14.2724 8.1819C14.3559 8.51578 14.6558 8.75 15 8.75C15.3442 8.75 15.6441 8.51578 15.7276 8.1819C15.9564 7.26667 16.2808 6.65486 16.7178 6.21783C17.1549 5.7808 17.7667 5.45642 18.6819 5.22761C19.0158 5.14414 19.25 4.84415 19.25 4.5C19.25 4.15585 19.0158 3.85586 18.6819 3.77239C17.7667 3.54358 17.1549 3.2192 16.7178 2.78217C16.2808 2.34514 15.9564 1.73333 15.7276 0.818098Z" fill="url(#pulsatingGradient)"/>
                          <path d="M8.72761 4.8181C8.64414 4.48422 8.34415 4.25 8 4.25C7.65585 4.25 7.35586 4.48422 7.27239 4.8181C6.8293 6.59048 6.18349 7.84514 5.26431 8.76431C4.34514 9.68349 3.09048 10.3293 1.3181 10.7724C0.984223 10.8559 0.75 11.1558 0.75 11.5C0.75 11.8442 0.984223 12.1441 1.3181 12.2276C3.09048 12.6707 4.34513 13.3165 5.26431 14.2357C6.18349 15.1549 6.8293 16.4095 7.27239 18.1819C7.35586 18.5158 7.65585 18.75 8 18.75C8.34415 18.75 8.64414 18.5158 8.72761 18.1819C9.1707 16.4095 9.81651 15.1549 10.7357 14.2357C11.6549 13.3165 12.9095 12.6707 14.6819 12.2276C15.0158 12.1441 15.25 11.8442 15.25 11.5C15.25 11.1558 15.0158 10.8559 14.6819 10.7724C12.9095 10.3293 11.6549 9.68349 10.7357 8.76431C9.81651 7.84514 9.1707 6.59048 8.72761 4.8181Z" fill="url(#pulsatingGradient)"/>
              </svg>
                        Turn your{' '}
                        <span 
                          style={{
                            display: 'inline-block',
                            perspective: '1000px',
                            marginLeft: '0.3rem',
                            width: '85px',
                            textAlign: 'left'
                          }}
                        >
                          <span
                            style={{
                              display: 'inline-block',
                              transformStyle: 'preserve-3d',
                              transition: 'transform 0.6s ease-in-out',
                              transform: isFlipping ? 'rotateX(90deg)' : 'rotateX(0deg)',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #0070f3 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                              fontWeight: '600'
                            }}
                          >
                            {currentWord}
                          </span>
                        </span>
                  </div>
                  <div>
                    into a technical system design, fast.
                  </div>
            </h1>
          )}
          <form onSubmit={handleSubmit}>
            {/* Progress indicator */}
            {!isFormCollapsed && (
              <div style={{ display: 'flex', marginBottom: '1rem' }}>
                {Array.from({ length: totalQuestions }).map((_, i) => (
                  <div 
                    key={i}
                    style={{ 
                      height: '4px', 
                      flex: 1, 
                          backgroundColor: '#e1e1e1',
                      marginRight: i < totalQuestions - 1 ? '4px' : 0,
                          borderRadius: '4px',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: i <= activeQuestion ? '100%' : '0%',
                            backgroundColor: '#1F2328',
                            borderRadius: '4px',
                            transition: 'width 0.5s ease-in-out',
                            transitionDelay: i <= activeQuestion ? `${(i) * 0.1}s` : '0s',
                    }}
                  />
                      </div>
                ))}
              </div>
            )}

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
                      disabled={!isCurrentQuestionValid()}
                  style={{ 
                    padding: '0.5rem 1rem', 
                        background: !isCurrentQuestionValid() 
                          ? '#e1e1e1' 
                          : 'linear-gradient(135deg, rgba(0, 112, 243, 0.9) 0%, rgba(0, 150, 255, 0.9) 50%, rgba(0, 112, 243, 0.9) 100%)',
                        backdropFilter: !isCurrentQuestionValid() ? 'none' : 'blur(10px)',
                        WebkitBackdropFilter: !isCurrentQuestionValid() ? 'none' : 'blur(10px)',
                        border: !isCurrentQuestionValid() 
                          ? '1px solid #ced4da' 
                          : '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: !isCurrentQuestionValid() 
                          ? 'none' 
                          : '0 8px 32px rgba(0, 112, 243, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                        color: !isCurrentQuestionValid() ? '#666' : 'white', 
                        borderRadius: '8px',
                        cursor: !isCurrentQuestionValid() ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        opacity: !isCurrentQuestionValid() ? 0.6 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (isCurrentQuestionValid()) {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 112, 243, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isCurrentQuestionValid()) {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 112, 243, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                        }
                  }}
                >
                  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.59168 1.71245L2.38083 6.25004H7.25001C7.66422 6.25004 8.00001 6.58582 8.00001 7.00004C8.00001 7.41425 7.66422 7.75004 7.25001 7.75004H2.38083L1.59168 12.2876L13.9294 7.00004L1.59168 1.71245ZM0.988747 7.00004L0.0636748 1.68087C-0.0111098 1.25086 0.128032 0.811352 0.436661 0.502722C0.824446 0.114942 1.40926 0.00231168 1.91333 0.218342L15.3157 5.9622C15.7308 6.14013 16 6.54835 16 7.00004C16 7.45172 15.7308 7.85995 15.3157 8.03788L1.91333 13.7817C1.40926 13.9978 0.824446 13.8851 0.436661 13.4974C0.128032 13.1887 -0.01111 12.7492 0.0636748 12.3192L0.988747 7.00004Z" fill={!isCurrentQuestionValid() ? '#666' : 'white'}/>
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
          {/* Expand Button - Only show when form is collapsed */}
          {isFormCollapsed && (
            <div style={{ 
              position: 'absolute', 
              top: '16px', 
              right: '64px', 
              zIndex: 1000 
            }}
            className="expand-tooltip-container"
            >
              <button
                onClick={() => setIsFormCollapsed(!isFormCollapsed)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f9fafb';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M1.75 1.5C1.61193 1.5 1.5 1.61193 1.5 1.75V4.25C1.5 4.66421 1.16421 5 0.75 5C0.33579 5 0 4.66421 0 4.25V1.75C0 0.7835 0.7835 0 1.75 0H4.25C4.66421 0 5 0.33579 5 0.75C5 1.16421 4.66421 1.5 4.25 1.5H1.75ZM9 0.75C9 0.33579 9.3358 0 9.75 0H12.25C13.2165 0 14 0.7835 14 1.75V4.25C14 4.66421 13.6642 5 13.25 5C12.8358 5 12.5 4.66421 12.5 4.25V1.75C12.5 1.61193 12.3881 1.5 12.25 1.5H9.75C9.3358 1.5 9 1.16421 9 0.75ZM0 9.75C0 9.3358 0.33579 9 0.75 9H3.25C4.2165 9 5 9.7835 5 10.75V13.25C5 13.6642 4.66421 14 4.25 14C3.83579 14 3.5 13.6642 3.5 13.25V10.75C3.5 10.6119 3.38807 10.5 3.25 10.5H0.75C0.33579 10.5 0 10.1642 0 9.75ZM9 10.75C9 9.7835 9.7835 9 10.75 9H13.25C13.6642 9 14 9.3358 14 9.75C14 10.1642 13.6642 10.5 13.25 10.5H10.75C10.6119 10.5 10.5 10.6119 10.5 10.75V13.25C10.5 13.6642 10.1642 14 9.75 14C9.3358 14 9 13.6642 9 13.25V10.75Z" fill="#1F2328"/>
                </svg>
              </button>
              <div className="expand-tooltip">Expand</div>
            </div>
          )}
          <FlowCanvas graphData={graphData} />
          
          {/* Summary Section - Only show when graph data exists */}
          {summaryData && isSummaryVisible && (
            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              width: '380px',
              maxWidth: '90%',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              zIndex: 1000,
              fontSize: '14px',
              lineHeight: '1.5',
              maxHeight: '70vh',
              overflowY: 'auto',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '12px',
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                paddingBottom: '8px'
              }}>
                <h3 style={{ 
                  margin: '0', 
                  fontSize: '16px', 
                  fontWeight: '600'
                }}>
                  Executive Summary
                </h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {/* Copy button */}
                  <div className="tooltip-container">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(summaryData);
                        // You could add a toast notification here
                      }}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        padding: '4px',
                        height: '24px',
                        width: '24px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f9fafb';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#ffffff';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                                         >
                       <svg width="14" height="15" viewBox="0 0 115.77 122.88">
                         <path fillRule="evenodd" clipRule="evenodd" d="M89.62,13.96v7.73h12.19h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02v0.02 v73.27v0.01h-0.02c-0.01,3.84-1.57,7.33-4.1,9.86c-2.51,2.5-5.98,4.06-9.82,4.07v0.02h-0.02h-61.7H40.1v-0.02 c-3.84-0.01-7.34-1.57-9.86-4.1c-2.5-2.51-4.06-5.98-4.07-9.82h-0.02v-0.02V92.51H13.96h-0.01v-0.02c-3.84-0.01-7.34-1.57-9.86-4.1 c-2.5-2.51-4.06-5.98-4.07-9.82H0v-0.02V13.96v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07V0h0.02h61.7 h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02V13.96L89.62,13.96z M79.04,21.69v-7.73v-0.02h0.02 c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v64.59v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h12.19V35.65 v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07v-0.02h0.02H79.04L79.04,21.69z M105.18,108.92V35.65v-0.02 h0.02c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v73.27v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h61.7h0.02 v0.02c0.91,0,1.75-0.39,2.37-1.01c0.61-0.61,1-1.46,1-2.37h-0.02V108.92L105.18,108.92z" fill="#1F2328"/>
                      </svg>
                    </button>
                    <div className="tooltip">Copy to Cursor/VS Code</div>
                  </div>
                  
                  {/* Close button */}
                  <button
                    onClick={() => setIsSummaryVisible(false)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      padding: '4px',
                      height: '24px',
                      width: '24px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f9fafb';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 1L1 13" stroke="#1F2328" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M1 1L13 13" stroke="#1F2328" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div style={{ whiteSpace: 'pre-line' }}>
                {summaryData}
              </div>
            </div>
          )}
        </div>
          </>
        ) : currentPage === 'how-it-works' ? (
          <HowItWorksPage />
        ) : null}
      </div>
      <style jsx>{`
        .app-container {
          display: flex;
          min-height: 100vh;
        }
        .main-content {
          flex: 1;
          margin-left: 120px;
          padding: 2rem;
          overflow-y: auto;
          height: 100vh;
        }
        .form-container {
          max-width: ${isFormCollapsed ? '90vw' : '1500px'};
          min-height: ${isFormCollapsed ? 'auto' : '45vh'};
          margin: 0 auto;
          background-color: ${isFormCollapsed ? 'transparent' : 'white'};
          padding: ${isFormCollapsed ? '0' : '2rem'};
          border-radius: ${isFormCollapsed ? '0' : '12px'};
          box-shadow: none;
          position: ${isFormCollapsed ? 'fixed' : 'relative'};
          top: ${isFormCollapsed ? '10px' : 'auto'};
          left: ${isFormCollapsed ? '50%' : 'auto'};
          transform: ${isFormCollapsed ? 'translateX(-50%)' : 'none'};
          z-index: ${isFormCollapsed ? '1000' : 'auto'};
          transition: all 0.3s ease;
        }
        .canvas-container {
          margin-top: ${isFormCollapsed ? '0' : '2rem'};
          height: ${isFormCollapsed ? '100vh' : '50vh'};
          position: ${isFormCollapsed ? 'fixed' : 'relative'};
          top: ${isFormCollapsed ? '0' : 'auto'};
          left: ${isFormCollapsed ? '0' : 'auto'};
          width: ${isFormCollapsed ? '100vw' : '100%'};
          transition: all 0.3s ease;
        }
        .expand-tooltip-container {
          position: relative;
        }
        
        .expand-tooltip {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 6px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.2s ease, visibility 0.2s ease;
          pointer-events: none;
          z-index: 1001;
        }
        
        .expand-tooltip::before {
          content: '';
          position: absolute;
          bottom: 100%;
          right: 12px;
          border: 4px solid transparent;
          border-bottom-color: rgba(0, 0, 0, 0.8);
        }
        
        .expand-tooltip-container:hover .expand-tooltip {
          opacity: 1;
          visibility: visible;
        }
        
        .form-container input,
        .form-container textarea,
        .form-container select {
          min-width: ${isFormCollapsed ? '1200px' : 'auto'};
          max-width: ${isFormCollapsed ? '1400px' : '100%'};
          width: ${isFormCollapsed ? '85vw' : '100%'};
        }
        .tooltip-container {
          position: relative;
        }
        
        .tooltip {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 6px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.2s ease, visibility 0.2s ease;
          pointer-events: none;
          z-index: 1001;
        }
        
        .tooltip::before {
          content: '';
          position: absolute;
          bottom: 100%;
          right: 12px;
          border: 4px solid transparent;
          border-bottom-color: rgba(0, 0, 0, 0.8);
        }
        
        .tooltip-container:hover .tooltip {
          opacity: 1;
          visibility: visible;
        }
      `}</style>
    </div>
  );
} 
