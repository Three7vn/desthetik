from typing import Dict, Any
import json
from openai import OpenAI
import os 
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def get_detailed_system_design_prompt(
    product_intent: str,
    core_problem: str, 
    solution_idea: str,
    ideal_user: str,
    platform: str,
    inspirations: str,
    data_storage: str
) -> str:
    """
    Generate the first prompt for detailed system design explanation.
    
    Args:
        product_intent: What the product is intended to do/achieve
        core_problem: The main problem this product solves
        solution_idea: High-level description of the proposed solution
        ideal_user: Target user demographics and characteristics
        platform: Web app, mobile app, or both
        inspirations: Similar products or inspirations mentioned
        data_storage: Whether user data collection or backend storage is needed
        
    Returns:
        Formatted prompt string for detailed system design
        
    Note:
        # TODO: Import form data from frontend input fields
        # These parameters will be populated from the 7-question form:
        # Q1: product_intent (What are you trying to build?)
        # Q2: core_problem (What is the core problem you're solving?)
        # Q3: solution_idea (Do you have an idea of how the solution should work?)
        # Q4: ideal_user (Who is your ideal user?)
        # Q5: platform (Are you thinking of launching as a web app, mobile app, or both?)
        # Q6: inspirations (What are similar products or inspirations?)
        # Q7: data_storage (Will you collect user data or require backend storage?)
    """
    return f"""
You are an expert system architect. Create a comprehensive system design based on the following project details:

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
- **RELATE TO USER BEHAVIOR** - EXPLAIN HOW EACH FEATURE SERVES THE TARGET USER: "{ideal_user}"
- **JUSTIFY AGAINST REQUIREMENTS** - CONNECT EVERY COMPONENT TO THE CORE PROBLEM: "{core_problem}"
- **DO NOT OVER-ENGINEER** - KEEP SOLUTIONS SIMPLE AND FOCUSED ON THE ACTUAL REQUIREMENTS
- **AVOID UNNECESSARY COMPLEXITY** - ONLY INCLUDE FEATURES THAT DIRECTLY SOLVE THE STATED PROBLEM

Please provide a detailed system design that includes:

1. **Architecture Overview**: Explain the overall system architecture and how components interact, specifically addressing the core problem: "{core_problem}". EXPLAIN WHY each architectural choice directly serves the target user "{ideal_user}" and their specific needs.

2. **Technology Stack**: Recommend specific libraries, frameworks, and tools with ACTUAL WEBSITE LINKS and detailed reasons for selection that align with the solution idea: "{solution_idea}" and platform choice: "{platform}". For each technology choice, EXPLAIN:
   - WHY this specific tool solves the user's problem
   - HOW it supports the target user behavior
   - WHAT alternatives were considered and rejected

3. **Implementation Strategy**: Describe how each component should be implemented to serve the target user: "{ideal_user}". CONNECT each implementation detail to specific user behaviors and needs. AVOID features that don't directly address the core problem.

4. **Data Flow**: Explain how data moves through the system, considering the data storage requirements: "{data_storage}". DETAIL how this data flow supports the user's workflow and solves their specific pain points.

5. **Scalability Considerations**: How the system handles growth and performance for the intended use case. FOCUS ONLY on scaling needs that are realistic for the target user base and problem scope.

6. **Security & Best Practices**: Important security measures and development best practices relevant to this specific product. PRIORITIZE security measures that protect the target user's specific data and use cases.

**MANDATORY REQUIREMENTS:**
- INCLUDE ACTUAL WORKING LINKS (e.g., "React (https://reactjs.org/) for frontend because...")
- EXPLAIN WHY each architectural decision makes sense for solving "{core_problem}"
- DETAIL HOW the platform choice "{platform}" influences the technical stack and architecture
- DESCRIBE HOW inspiration from "{inspirations}" can inform architectural choices and feature implementation
- ANALYZE trade-offs and alternatives considered for this specific use case
- CONNECT every feature to the target user's actual behavior and needs
- KEEP THE SOLUTION SIMPLE - DO NOT ADD UNNECESSARY COMPLEXITY
- FOCUS ON THE MINIMUM VIABLE ARCHITECTURE that solves the core problem

Provide a thorough, technical explanation that demonstrates deep understanding of system design principles while staying laser-focused on the product intent: "{product_intent}" and avoiding over-engineering.
"""

def get_graph_structure_prompt(detailed_design: str, product_intent: str = "") -> str:
    """
    Generate the second prompt for converting detailed design into graph structure.
    
    Args:
        detailed_design: The detailed system design from the first prompt
        product_intent: Optional context about what the product is intended to do
        
    Returns:
        Formatted prompt string for graph structure generation
        
    Note:
        # TODO: Pass product_intent from form data for better context
        # This helps create more relevant node labels and structure
    """
    context_note = f"\nProduct Context: {product_intent}" if product_intent else ""
    
    return f"""
Based on the following detailed system design, create a visual graph structure that represents the key components and their relationships.{context_note}

DETAILED SYSTEM DESIGN:
{detailed_design}

🚨 **CRITICAL INSTRUCTION: DETAILED LABELS ARE MANDATORY** 🚨

You MUST create detailed, explanatory labels for every single node. This is NOT optional.

❌ **ABSOLUTELY FORBIDDEN**: Short labels like "React Native", "Database", "API", "Frontend", "Backend"
✅ **REQUIRED FORMAT**: "React Native Mobile Framework - Cross-platform development framework that enables building native iOS and Android apps with JavaScript, chosen specifically to serve freelancers who need apps on both platforms while maintaining a single codebase for faster development and lower costs"

**EVERY SINGLE NODE LABEL MUST:**
1. Start with the technology/component name
2. Include a dash (-)
3. Explain what it does (2-3 sentences)
4. Explain why it's needed for this specific system
5. Explain how it serves the target user's needs

**MANDATORY LABEL EXAMPLES YOU MUST FOLLOW:**
- "PostgreSQL Database - Relational database system that stores user time tracking records, project data, and billing information with ACID compliance and complex query capabilities. Essential for freelancers who need reliable data integrity when managing multiple client projects and generating accurate invoices for their business operations."

- "JWT Authentication Service - JSON Web Token-based authentication system that securely manages user sessions and API access across mobile and web platforms. Critical for freelancers who need secure access to their sensitive time tracking and billing data from multiple devices while maintaining session persistence."

- "React Native Timer Component - Custom mobile component that provides real-time time tracking with start/stop/pause functionality and background operation capabilities. Specifically designed for freelancers who need accurate billable hour tracking even when switching between apps or when the phone is locked during work sessions."

Convert this into a graph structure with these requirements:

1. **Node Count**: 10-20 nodes for comprehensive representation
2. **Node Labels**: EVERY label must be 2-3 sentences following the pattern above
3. **Positioning**: Frontend left, backend middle, databases right
4. **Edges**: Show actual data flow and API connections

🚨 **BEFORE YOU RESPOND**: Check every single label to ensure it's detailed and explanatory, not just a technology name.

Return ONLY valid JSON in this exact format:
{{
    "nodes": [
        {{
            "id": "1",
            "position": {{"x": 100, "y": 50}},
            "data": {{"label": "Technology Name - Detailed explanation of what this component does, why it's essential for this specific system, and how it directly serves the target user's workflow and business needs"}}
        }},
        {{
            "id": "2", 
            "position": {{"x": 300, "y": 50}},
            "data": {{"label": "Another Technology - Another detailed explanation following the same pattern with what, why, and how it helps users"}}
        }}
    ],
    "edges": [
        {{
            "id": "e1-2",
            "source": "1",
            "target": "2"
        }}
    ]
}}

🚨 **FINAL CHECK**: Before submitting, verify that EVERY SINGLE label is detailed and explanatory, not just a technology name. If any label is short, rewrite it to be detailed.
"""

async def generate_graph_structure(
    product_intent: str,
    ideal_user: str,
    core_problem: str,
    solution_idea: str,
    platform: str,
    data_storage: str,
    inspirations: str
) -> Dict[str, Any]:
    """
    Generate a graph structure based on the system design request using a two-stage LLM process.
    
    Stage 1: Generate detailed system design with libraries, reasoning, and implementation details
    Stage 2: Convert detailed design into concise graph structure with 5-20 nodes
    
    Args:
        product_intent: What the product is intended to do/achieve
        ideal_user: Target user demographics and characteristics
        core_problem: The main problem this product solves
        solution_idea: High-level description of the proposed solution
        platform: Web app, mobile app, or both
        data_storage: Whether user data collection or backend storage is needed
        inspirations: Similar products or inspirations mentioned
        
    Returns:
        Dictionary containing nodes and edges for the graph
        
    Note:
        # TODO: Import form data from frontend input fields
        # These parameters will be populated from the 7-question form:
        # Q1: product_intent (What are you trying to build?)
        # Q2: core_problem (What is the core problem you're solving?)
        # Q3: solution_idea (Do you have an idea of how the solution should work?)
        # Q4: ideal_user (Who is your ideal user?)
        # Q5: platform (Are you thinking of launching as a web app, mobile app, or both?)
        # Q6: inspirations (What are similar products or inspirations?)
        # Q7: data_storage (Will you collect user data or require backend storage?)
    """
    
    try:
        # Get API key from environment variable
        api_key = os.getenv("OPENAI_API_KEY")
        
        if not api_key:
            raise Exception("OPENAI_API_KEY environment variable is not set")
            
        openai = OpenAI(api_key=api_key)
        
        # Stage 1: Generate detailed system design
        detailed_prompt = get_detailed_system_design_prompt(
            product_intent=product_intent,
            core_problem=core_problem,
            solution_idea=solution_idea,
            ideal_user=ideal_user,
            platform=platform,
            inspirations=inspirations,
            data_storage=data_storage
        )
        
        detailed_response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": detailed_prompt}],
            temperature=0.7  # Add some creativity while maintaining coherence
        )
        
        detailed_design = detailed_response.choices[0].message.content
        
        # Stage 2: Convert detailed design to graph structure
        graph_prompt = get_graph_structure_prompt(detailed_design, product_intent)
        
        graph_response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": graph_prompt}],
            temperature=0.3  # Lower temperature for more structured JSON output
        )
        
        # Parse the JSON response
        graph_json = graph_response.choices[0].message.content
        graph_data = json.loads(graph_json)
        
        return graph_data
        
    except json.JSONDecodeError as e:
        # If JSON parsing fails, return example data
        print(f"JSON parsing error: {e}")
        return {
            "nodes": [
                {"id": "1", "position": {"x": 0, "y": 0}, "data": {"label": "Frontend Application"}},
                {"id": "2", "position": {"x": 0, "y": 100}, "data": {"label": "Backend API"}},
                {"id": "3", "position": {"x": 0, "y": 200}, "data": {"label": "Database"}}
            ],
            "edges": [
                {"id": "e1-2", "source": "1", "target": "2"},
                {"id": "e2-3", "source": "2", "target": "3"}
            ]
        }
    except Exception as e:
        raise Exception(f"Failed to generate graph structure: {str(e)}") 