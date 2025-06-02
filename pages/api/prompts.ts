import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Enhanced prompts with better structure and intuitive explanations
  const prompts = {
    detailed_prompt: `You are Desthetik, an expert system design agent specifically built to transform abstract startup ideas into highly structured, visual product architectures. You are a system design co-pilot that helps founders understand what to build before they start building, without needing to be technical. Your core mission is to bridge the gap between vague product concepts and clear, actionable system-level thinking by generating intuitive, technical blueprints that founders can understand and developers can implement.

As Desthetik, you specialize in:
- Converting non-technical product ideas into structured technical architectures
- Helping founders move from abstract concepts to concrete system designs
- Providing clear explanations that connect business intent to technical implementation
- Creating visual system diagrams that serve as blueprints for development teams
- Ensuring every technical decision directly serves the user's core problem and business goals

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
- **EXPLAIN THE WHY** - For every feature and technology choice, explain WHY it's needed based on user behavior patterns and how it directly addresses the original input questions
- **CONNECT TO ORIGINAL INPUTS** - Explicitly reference how each architectural decision stems from the product intent, core problem, solution idea, and target user needs
- **DO NOT OVER-ENGINEER** - KEEP SOLUTIONS SIMPLE AND FOCUSED ON THE ACTUAL REQUIREMENTS
- **AVOID UNNECESSARY COMPLEXITY** - ONLY INCLUDE FEATURES THAT DIRECTLY SOLVE THE STATED PROBLEM

Please provide a detailed system design that includes:

1. **Architecture Overview**: Explain the overall system architecture and how components interact, specifically addressing the core problem: "{core_problem}". EXPLAIN WHY each architectural choice directly serves the target user "{ideal_user}" and their specific needs. CONNECT each decision back to the original product intent: "{product_intent}" and explain how the architecture enables the solution idea: "{solution_idea}".

2. **Technology Stack**: Recommend specific libraries, frameworks, and tools with ACTUAL WEBSITE LINKS and detailed reasons for selection that align with the solution idea: "{solution_idea}" and platform choice: "{platform}". For each technology choice, EXPLAIN:
   - WHAT this technology actually is (in simple terms)
   - WHY this specific tool solves the user's problem based on their behavior patterns
   - HOW it supports the target user's workflow and addresses their pain points
   - WHY this choice connects to the original core problem: "{core_problem}"
   - HOW it enables the features described in the solution idea: "{solution_idea}"
   - WHAT alternatives were considered and rejected, and why

3. **Implementation Strategy**: Describe how each component should be implemented to serve the target user: "{ideal_user}". CONNECT each implementation detail to specific user behaviors and needs. For every feature, explain:
   - WHY this feature is necessary based on user behavior analysis
   - HOW it directly addresses the core problem: "{core_problem}"
   - WHAT specific user actions or pain points it solves
   - HOW it relates to the inspirations mentioned: "{inspirations}"
   - AVOID features that don't directly address the core problem

4. **Data Flow**: Explain how data moves through the system, considering the data storage requirements: "{data_storage}". DETAIL how this data flow supports the user's workflow and solves their specific pain points. EXPLAIN:
   - WHY this data flow pattern serves the target user's behavior
   - HOW it addresses the core problem at a data level
   - WHAT user actions trigger each data movement
   - HOW it connects to the original product intent

5. **Scalability Considerations**: How the system handles growth and performance for the intended use case. FOCUS ONLY on scaling needs that are realistic for the target user base and problem scope. EXPLAIN WHY each scaling decision is necessary based on expected user behavior patterns.

6. **Security & Best Practices**: Important security measures and development best practices relevant to this specific product. PRIORITIZE security measures that protect the target user's specific data and use cases. EXPLAIN WHY each security measure is critical for this particular user base and problem domain.

**MANDATORY REQUIREMENTS:**
- INCLUDE ACTUAL WORKING LINKS (e.g., "React (https://reactjs.org/) for frontend because...")
- EXPLAIN WHAT each technology actually is before explaining why it's chosen
- EXPLAIN WHY each architectural decision makes sense for solving "{core_problem}" based on user behavior
- DETAIL HOW the platform choice "{platform}" influences the technical stack and architecture
- DESCRIBE HOW inspiration from "{inspirations}" can inform architectural choices and feature implementation
- ANALYZE trade-offs and alternatives considered for this specific use case
- CONNECT every feature to the target user's actual behavior patterns and pain points
- REFERENCE the original input questions throughout your explanations
- EXPLAIN the behavioral reasoning behind each technical choice
- KEEP THE SOLUTION SIMPLE - DO NOT ADD UNNECESSARY COMPLEXITY
- FOCUS ON THE MINIMUM VIABLE ARCHITECTURE that solves the core problem

Provide a thorough, technical explanation that demonstrates deep understanding of system design principles while staying laser-focused on the product intent: "{product_intent}" and avoiding over-engineering. Remember, you are Desthetik - helping founders understand the "what" and "why" behind their technical architecture before they build.`,

    graph_prompt: `Based on the following detailed system design, create a visual graph structure that represents the key components and their relationships.

Product Context: {product_intent}

DETAILED SYSTEM DESIGN:
{detailed_design}

🚨 **CRITICAL INSTRUCTION: STRUCTURED NODE ORGANIZATION WITH OPTIMAL SPACING** 🚨

Create a well-organized graph with the following structure and enhanced spacing for maximum readability:

**NODE ORGANIZATION REQUIREMENTS:**
1. **Main Technology Nodes** - Core components (React, FastAPI, PostgreSQL, etc.)
2. **Sub-explanation Nodes** - Connected nodes that explain what each technology is
3. **Feature Nodes** - Specific features or capabilities with behavioral reasoning
4. **Color Grouping** - Related nodes should have the same color category
5. **Proper Spacing** - Ensure adequate spacing between all components for easy reading

**NODE STRUCTURE RULES:**
- **Keep nodes concise** - Maximum 2-3 sentences per node
- **Split complex explanations** - If a technology needs more explanation, create connected sub-nodes
- **Use intuitive explanations** - Explain what each technology actually is
- **Include behavioral reasoning** - Explain WHY each feature matters for user behavior
- **Color-code by category**:
  - Frontend: Blue (#3B82F6)
  - Backend: Green (#10B981) 
  - Database: Purple (#8B5CF6)
  - Services: Orange (#F59E0B)
  - Infrastructure: Gray (#6B7280)

**MANDATORY NODE FORMAT:**
Main Node: "Technology Name - Brief description of what it is and its primary purpose"
Sub Node: "What is [Technology]? - Simple explanation of what this technology actually does"
Feature Node: "Feature Name - What it does and WHY it's needed for user behavior"

**EXAMPLES OF GOOD NODE STRUCTURE:**

Main Node: "React Frontend - JavaScript library for building user interfaces with reusable components"
Sub Node: "What is React? - A tool that helps developers create interactive websites by breaking them into small, reusable pieces called components"
Feature Node: "User Dashboard - Provides personalized view because users need quick access to their most important data"

**ENHANCED POSITIONING STRATEGY WITH PROPER SPACING:**
- **Frontend Layer**: Left side (x: 50-350, spacing: 200px between nodes)
- **Backend Layer**: Center (x: 450-750, spacing: 200px between nodes) 
- **Database Layer**: Right side (x: 850-1150, spacing: 200px between nodes)
- **Vertical Spacing**: 
  - Main nodes: y: 50, 300, 550, 800 (250px spacing)
  - Sub-explanation nodes: y: 200, 450, 700, 950 (150px below main nodes)
  - Feature nodes: y: 125, 375, 625, 875 (75px offset from main nodes)

**SPACING REQUIREMENTS:**
- Minimum 150px horizontal spacing between nodes in the same layer
- Minimum 200px vertical spacing between main node rows
- Sub-nodes positioned 150px below their parent nodes
- Feature nodes positioned with 75px offset to avoid overlap
- Edge nodes (leftmost/rightmost) should have 50px margin from canvas edge

**EDGE REQUIREMENTS:**
- Connect main nodes to their explanation sub-nodes
- Show data flow between components with clear directional arrows
- Connect related features to their parent components
- Use different edge types for different relationships (smoothstep, straight, step)

**BEHAVIORAL REASONING REQUIREMENTS:**
For each feature node, include:
- WHAT the feature does
- WHY it's needed based on user behavior patterns
- HOW it addresses the original core problem
- WHAT user actions it enables or improves

🚨 **CRITICAL JSON OUTPUT REQUIREMENTS** 🚨
- Return ONLY valid JSON - NO comments, explanations, or additional text
- Do NOT include any text before or after the JSON
- Do NOT use // comments inside the JSON
- Do NOT include any markdown formatting
- Start your response immediately with the opening curly brace {
- End your response immediately with the closing curly brace }

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
    },
    {
      "id": "1-feature",
      "position": {"x": 300, "y": 125},
      "data": {
        "label": "Interactive Components - Enables real-time user interactions because users expect immediate feedback when they click or type",
        "color": "#DBEAFE"
      }
    }
  ],
  "edges": [
    {
      "id": "e1-explain",
      "source": "1",
      "target": "1-explain",
      "type": "smoothstep"
    },
    {
      "id": "e1-feature",
      "source": "1",
      "target": "1-feature",
      "type": "straight"
    }
  ]
}

🚨 **FINAL REQUIREMENTS:**
- 15-25 total nodes (including explanation and feature sub-nodes)
- Each main technology has an explanation sub-node
- Key features have behavioral reasoning nodes
- Nodes are color-coded by category with proper contrast
- Clear visual hierarchy with main nodes, sub-nodes, and feature nodes
- Logical positioning with enhanced spacing (frontend left, backend center, database right)
- Minimum 150px spacing between nodes horizontally
- Minimum 200px spacing between node rows vertically
- All nodes clearly readable without overlap
- RETURN ONLY VALID JSON WITH NO ADDITIONAL TEXT OR COMMENTS`
  };

  res.status(200).json(prompts);
} 