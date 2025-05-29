from typing import Dict, Any
import json
from openai import OpenAI
import os 
from .prompt import get_detailed_system_design_prompt, get_graph_structure_prompt

async def generate_graph_structure(request: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate a graph structure based on the system design request using a two-stage LLM process.
    
    Stage 1: Generate detailed system design with libraries, reasoning, and implementation details
    Stage 2: Convert detailed design into concise graph structure with 5-20 nodes
    
    Args:
        request: Dictionary containing projectType, scale, and requirements
        
    Returns:
        Dictionary containing nodes and edges for the graph
    """
    
    try:
        openai = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        # Stage 1: Generate detailed system design
        detailed_prompt = get_detailed_system_design_prompt(
            project_type=request['projectType'],
            scale=request['scale'],
            requirements=request['requirements']
        )
        
        detailed_response = await openai.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": detailed_prompt}],
            temperature=0.7  # Add some creativity while maintaining coherence
        )
        
        detailed_design = detailed_response.choices[0].message.content
        
        # Stage 2: Convert detailed design to graph structure
        graph_prompt = get_graph_structure_prompt(detailed_design)
        
        graph_response = await openai.chat.completions.create(
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