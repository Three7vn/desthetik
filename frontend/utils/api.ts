// API endpoint configuration
const API_BASE_URL = 'http://localhost:8000';

// Types for API requests and responses
interface SystemDesignRequest {
  projectType: string;
  scale: string;
  requirements: string;
}

interface GraphNode {
  id: string;
  position: { x: number; y: number };
  data: { label: string };
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
}

interface GraphResponse {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// Function to send system design request to backend
export async function generateSystemDesign(request: SystemDesignRequest): Promise<GraphResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-design`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to generate system design');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating system design:', error);
    throw error;
  }
} 