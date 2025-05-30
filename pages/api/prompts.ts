import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Enhanced prompts with better structure and intuitive explanations
  const prompts = {
    detailed_prompt: `You are an expert system architect. Create a comprehensive system design based on the following project details:

**PROJECT CONTEXT:**
- Product Intent: {product_intent}
- Core Problem: {core_problem}
- Solution Idea: {solution_idea}
- Target User: {ideal_user}
- Platform: {platform}
- Inspirations: {inspirations}
- Data Storage Needs: {data_storage}

**CRITICAL REQUIREMENTS:**
- **BE EXTREMELY DETAILED** - EXPLAIN EVERY ARCHITECTURAL DECISION WITH REASONING
- **PROVIDE ACTUAL LINKS** - INCLUDE REAL WEBSITE URLS FOR ALL LIBRARIES AND FRAMEWORKS
- **EXPLAIN INTUITIVELY** - For each technology, explain what it actually is in simple terms
- **RELATE TO USER BEHAVIOR** - EXPLAIN HOW EACH FEATURE SERVES THE TARGET USER: "{ideal_user}"
- **JUSTIFY AGAINST REQUIREMENTS** - CONNECT EVERY COMPONENT TO THE CORE PROBLEM: "{core_problem}"
- **DO NOT OVER-ENGINEER** - KEEP SOLUTIONS SIMPLE AND FOCUSED ON THE ACTUAL REQUIREMENTS
- **AVOID UNNECESSARY COMPLEXITY** - ONLY INCLUDE FEATURES THAT DIRECTLY SOLVE THE STATED PROBLEM

Please provide a detailed system design that includes:

1. **Architecture Overview**: Explain the overall system architecture and how components interact, specifically addressing the core problem: "{core_problem}". EXPLAIN WHY each architectural choice directly serves the target user "{ideal_user}" and their specific needs.

2. **Technology Stack**: Recommend specific libraries, frameworks, and tools with ACTUAL WEBSITE LINKS and detailed reasons for selection that align with the solution idea: "{solution_idea}" and platform choice: "{platform}". For each technology choice, EXPLAIN:
   - WHAT this technology actually is (in simple terms)
   - WHY this specific tool solves the user's problem
   - HOW it supports the target user behavior
   - WHAT alternatives were considered and rejected

3. **Implementation Strategy**: Describe how each component should be implemented to serve the target user: "{ideal_user}". CONNECT each implementation detail to specific user behaviors and needs. AVOID features that don't directly address the core problem.

4. **Data Flow**: Explain how data moves through the system, considering the data storage requirements: "{data_storage}". DETAIL how this data flow supports the user's workflow and solves their specific pain points.

5. **Scalability Considerations**: How the system handles growth and performance for the intended use case. FOCUS ONLY on scaling needs that are realistic for the target user base and problem scope.

6. **Security & Best Practices**: Important security measures and development best practices relevant to this specific product. PRIORITIZE security measures that protect the target user's specific data and use cases.

**MANDATORY REQUIREMENTS:**
- INCLUDE ACTUAL WORKING LINKS (e.g., "React (https://reactjs.org/) for frontend because...")
- EXPLAIN WHAT each technology actually is before explaining why it's chosen
- EXPLAIN WHY each architectural decision makes sense for solving "{core_problem}"
- DETAIL HOW the platform choice "{platform}" influences the technical stack and architecture
- DESCRIBE HOW inspiration from "{inspirations}" can inform architectural choices and feature implementation
- ANALYZE trade-offs and alternatives considered for this specific use case
- CONNECT every feature to the target user's actual behavior and needs
- KEEP THE SOLUTION SIMPLE - DO NOT ADD UNNECESSARY COMPLEXITY
- FOCUS ON THE MINIMUM VIABLE ARCHITECTURE that solves the core problem

Provide a thorough, technical explanation that demonstrates deep understanding of system design principles while staying laser-focused on the product intent: "{product_intent}" and avoiding over-engineering.`,

    graph_prompt: `Based on the following detailed system design, create a visual graph structure that represents the key components and their relationships.

Product Context: {product_intent}

DETAILED SYSTEM DESIGN:
{detailed_design}

🚨 **CRITICAL INSTRUCTION: STRUCTURED NODE ORGANIZATION** 🚨

Create a well-organized graph with the following structure:

**NODE ORGANIZATION REQUIREMENTS:**
1. **Main Technology Nodes** - Core components (React, FastAPI, PostgreSQL, etc.)
2. **Sub-explanation Nodes** - Connected nodes that explain what each technology is
3. **Feature Nodes** - Specific features or capabilities
4. **Color Grouping** - Related nodes should have the same color category

**NODE STRUCTURE RULES:**
- **Keep nodes concise** - Maximum 2-3 sentences per node
- **Split complex explanations** - If a technology needs more explanation, create connected sub-nodes
- **Use intuitive explanations** - Explain what each technology actually is
- **Color-code by category**:
  - Frontend: Blue (#3B82F6)
  - Backend: Green (#10B981) 
  - Database: Purple (#8B5CF6)
  - Services: Orange (#F59E0B)
  - Infrastructure: Gray (#6B7280)

**MANDATORY NODE FORMAT:**
Main Node: "Technology Name - Brief description of what it is and its primary purpose"
Sub Node: "What is [Technology]? - Simple explanation of what this technology actually does"

**EXAMPLES OF GOOD NODE STRUCTURE:**

Main Node: "React Frontend - JavaScript library for building user interfaces with reusable components"
Sub Node: "What is React? - A tool that helps developers create interactive websites by breaking them into small, reusable pieces called components"

Main Node: "FastAPI Backend - Modern Python web framework for building high-performance APIs"  
Sub Node: "What is FastAPI? - A tool that helps create the server-side logic that handles requests from the frontend and communicates with databases"

**POSITIONING STRATEGY:**
- Frontend components: Left side (x: 0-300)
- Backend components: Center (x: 400-700) 
- Database/Storage: Right side (x: 800-1100)
- Sub-explanation nodes: Below main nodes (y + 150)

**EDGE REQUIREMENTS:**
- Connect main nodes to their explanation sub-nodes
- Show data flow between components
- Connect related features to their parent components

Return ONLY valid JSON in this exact format:
{
  "nodes": [
    {
      "id": "1",
      "position": {"x": 100, "y": 50},
      "data": {
        "label": "React Frontend - JavaScript library for building user interfaces with reusable components",
        "color": "#3B82F6"
      }
    },
    {
      "id": "1-explain", 
      "position": {"x": 100, "y": 200},
      "data": {
        "label": "What is React? - A tool that helps developers create interactive websites by breaking them into small, reusable pieces called components",
        "color": "#93C5FD"
      }
    }
  ],
  "edges": [
    {
      "id": "e1-explain",
      "source": "1",
      "target": "1-explain",
      "type": "smoothstep"
    }
  ]
}

🚨 **FINAL REQUIREMENTS:**
- 15-25 total nodes (including explanation sub-nodes)
- Each main technology has an explanation sub-node
- Nodes are color-coded by category
- Clear visual hierarchy with main nodes and sub-nodes
- Logical positioning (frontend left, backend center, database right)`
  };

  res.status(200).json(prompts);
} 