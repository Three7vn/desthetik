def get_detailed_system_design_prompt(project_type: str, scale: str, requirements: str) -> str:
    """
    Generate the first prompt for detailed system design explanation.
    
    Args:
        project_type: Type of project (e.g., web app, mobile app)
        scale: Scale of the project (e.g., small, medium, large)
        requirements: Detailed requirements and specifications
        
    Returns:
        Formatted prompt string for detailed system design
    """
    return f"""
You are an expert system architect. Create a comprehensive system design for a {project_type} project at {scale} scale.

Requirements: {requirements}

Please provide a detailed system design that includes:

1. **Architecture Overview**: Explain the overall system architecture and how components interact
2. **Technology Stack**: Recommend specific libraries, frameworks, and tools with website links and reasons for selection
3. **Implementation Strategy**: Describe how each component should be implemented and why
4. **Data Flow**: Explain how data moves through the system
5. **Scalability Considerations**: How the system handles growth and performance
6. **Security & Best Practices**: Important security measures and development best practices

Be specific about:
- Exact library/framework names with links (e.g., "React (https://reactjs.org/) for frontend because...")
- Why certain architectural decisions make sense for this specific use case
- How the functionality described in requirements maps to technical implementation
- Trade-offs and alternatives considered

Provide a thorough, technical explanation that demonstrates deep understanding of system design principles.
"""

def get_graph_structure_prompt(detailed_design: str) -> str:
    """
    Generate the second prompt for converting detailed design into graph structure.
    
    Args:
        detailed_design: The detailed system design from the first prompt
        
    Returns:
        Formatted prompt string for graph structure generation
    """
    return f"""
Based on the following detailed system design, create a visual graph structure that represents the key components and their relationships.

DETAILED SYSTEM DESIGN:
{detailed_design}

Convert this into a graph structure with the following requirements:

1. **Node Count**: Minimum 5 nodes, maximum 20 nodes. Try to aim closer to 20 nodes for comprehensive representation.
2. **Node Labels**: Each node should have a maximum of one sentence describing the component
3. **Relationships**: Show how components connect and interact with each other
4. **Positioning**: Arrange nodes in a logical flow (left-to-right or top-to-bottom based on data flow)

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
- Use clear, concise labels (one sentence max per node)
- Position nodes logically based on system flow
- Connect related components with edges
- Aim for 15-20 nodes when possible to show comprehensive system detail
""" 