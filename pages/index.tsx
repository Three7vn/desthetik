import React, { useState } from 'react';
import FlowCanvas from '../components/FlowCanvas';

// Main application page that combines:
// 1. Input form for system design requirements
// 2. FlowCanvas component for visualization
export default function Home() {
  // State for form inputs
  const [formData, setFormData] = useState({
    projectType: '',
    scale: '',
    requirements: '',
  });

  // State for graph data
  const [graphData, setGraphData] = useState(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call API to get graph data
    // TODO: Update graphData state
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        {/* TODO: Add form fields */}
      </form>
      
      <div className="canvas-container">
        <FlowCanvas graphData={graphData} />
      </div>
    </div>
  );
} 