"""
Example graph structures for testing and fallback purposes.
These can be used when llm is unavailable or for testing the frontend.
"""

EXAMPLE_GRAPH = {
    "nodes": [
        {
            "id": "frontend",
            "position": {"x": 0, "y": 0},
            "data": {"label": "Frontend (React)"}
        },
        {
            "id": "backend",
            "position": {"x": 200, "y": 0},
            "data": {"label": "Backend (FastAPI)"}
        },
        {
            "id": "database",
            "position": {"x": 400, "y": 0},
            "data": {"label": "Database"}
        },
        {
            "id": "ai",
            "position": {"x": 200, "y": 100},
            "data": {"label": "AI Service (GPT)"}
        }
    ],
    "edges": [
        {
            "id": "frontend-backend",
            "source": "frontend",
            "target": "backend"
        },
        {
            "id": "backend-database",
            "source": "backend",
            "target": "database"
        },
        {
            "id": "backend-ai",
            "source": "backend",
            "target": "ai"
        }
    ]
}

def get_example_graph():
    """Return the example graph structure."""
    return EXAMPLE_GRAPH 