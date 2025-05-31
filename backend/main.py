from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

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
    productIntent: str
    idealUser: str
    coreProblem: str
    solutionIdea: str
    platform: str
    dataStorage: str
    inspirations: str

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

@app.get("/")
async def root():
    return {"message": "Desthetik Backend API is running"}

@app.post("/generate-design", response_model=GraphResponse)
async def generate_design(request: SystemDesignRequest):
    try:
        # Generate graph structure using GPT with correct parameters
        graph_data = await generate_graph_structure(
            product_intent=request.productIntent,
            ideal_user=request.idealUser,
            core_problem=request.coreProblem,
            solution_idea=request.solutionIdea,
            platform=request.platform,
            data_storage=request.dataStorage,
            inspirations=request.inspirations
        )
        return graph_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 