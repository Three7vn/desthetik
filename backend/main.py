from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

from prompt_logic import generate_graph_structure

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SystemDesignRequest(BaseModel):
    projectType: str
    scale: str
    requirements: str

class GraphNode(BaseModel):
    id: str
    position: Dict[str, float]
    data: Dict[str, str]

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str

class GraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]

@app.post("/generate-design", response_model=GraphResponse)
async def generate_design(request: SystemDesignRequest):
    try:
        # Generate graph structure using GPT
        graph_data = await generate_graph_structure(request)
        return graph_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 