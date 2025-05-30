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

Please provide a detailed system design that includes:

1. **Architecture Overview**: Explain the overall system architecture and how components interact, specifically addressing the core problem: "{core_problem}"

2. **Technology Stack**: Recommend specific libraries, frameworks, and tools with website links and reasons for selection that align with the solution idea: "{solution_idea}" and platform choice: "{platform}"

3. **Implementation Strategy**: Describe how each component should be implemented to serve the target user: "{ideal_user}"

4. **Data Flow**: Explain how data moves through the system, considering the data storage requirements: "{data_storage}"

5. **Scalability Considerations**: How the system handles growth and performance for the intended use case

6. **Security & Best Practices**: Important security measures and development best practices relevant to this specific product

Be specific about:
- Exact library/framework names with links (e.g., "React (https://reactjs.org/) for frontend because...")
- Why certain architectural decisions make sense for solving "{core_problem}"
- How the platform choice "{platform}" influences the technical stack and architecture
- How inspiration from "{inspirations}" can inform architectural choices and feature implementation
- Trade-offs and alternatives considered for this specific use case

Provide a thorough, technical explanation that demonstrates deep understanding of system design principles while staying focused on the product intent: "{product_intent}".
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

Convert this into a graph structure with the following requirements:

1. **Node Count**: Minimum 5 nodes, maximum 20 nodes. Try to aim closer to 20 nodes for comprehensive representation.
2. **Node Labels**: Each node should have a maximum of one sentence describing the component
3. **Logical Flow Design**: 
   - Arrange nodes to show clear data/process flow from input to output
   - Position frontend components on the left, backend services in the middle, databases on the right
   - Use top-to-bottom or left-to-right flow patterns that make intuitive sense
   - Group related components (e.g., authentication services, data processing, UI components)
4. **Edge Logic**: 
   - Edges should represent actual data flow, API calls, or logical dependencies
   - Connect components that genuinely interact with each other
   - Avoid random connections - each edge should have a clear purpose
   - Show the flow of information through the system (user input → processing → storage → output)
   - Include bidirectional edges where data flows both ways

Return the response in the following JSON format:
{{
    "nodes": [
        {{
            "id": "string",
            "position": {{"x": float, "y": float}},
            "data": {{"label": "string (max one sentence)"}}
        }} // This represents one node in the graph
    ],
    "edges": [
        {{
            "id": "string",
            "source": "string",
            "target": "string"
        }}
    ]
}}

Make sure to:
- Include all major components from the detailed design
- Use clear, concise labels (two sentence max per node)
- Position nodes logically based on system flow (e.g., User Interface → API Gateway → Business Logic → Database)
- Connect related components with meaningful edges that represent actual system interactions
- Create a visually intuitive flow that tells the story of how the system works
- Aim for 15-20 nodes when possible to show comprehensive system detail
- Ensure every edge represents a real connection (API calls, data flow, dependencies, etc.)
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