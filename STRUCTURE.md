# Desthetik Project Structure

## Overview
Desthetik is a system design agent that combines AI-powered analysis with visual flowchart generation.

## Tech Stack
- **Frontend**: React with TypeScript
- **Flowchart UI**: @xyflow/react (formerly ReactFlow)
- **Backend**: Python with FastAPI
- **AI**: GPT for structured JSON generation
- **Flow**: Python-based graph node mapping

## Directory Structure
```
desthetik/
├── frontend/
│   ├── pages/
│   │   └── index.tsx               # Main UI with xyflow & input form
│   ├── components/
│   │   └── FlowCanvas.tsx          # Xyflow diagram + node card renderer
│   └── utils/
│       └── api.ts                  # Handles POST to FastAPI backend
│
├── backend/
│   ├── main.py                     # FastAPI app w/ prompt building + LLM call
│   ├── prompt_logic.py             # Maps inputs → graph structure → JSON
│   └── example_graph.py            # (Optional) static fallback or test graph
│
├── requirements.txt                # Python backend dependencies
├── package.json                    # Frontend dependencies
└── README.md
```

## Component Descriptions

### Frontend
- **index.tsx**: Main application page that combines the input form and flowchart visualization
- **FlowCanvas.tsx**: Handles the xyflow diagram rendering and node card display
- **api.ts**: Manages communication with the FastAPI backend

### Backend
- **main.py**: FastAPI application entry point, handles API routes and LLM integration
- **prompt_logic.py**: Contains logic for converting user inputs into structured graph data
- **example_graph.py**: Provides example graph structures for testing and fallback

## Data Flow
1. User input → Frontend form
2. Frontend → Backend API call
3. Backend processes input with GPT
4. LLM generates structured JSON
5. Backend maps JSON to graph structure
6. Frontend renders graph using xyflow, which user can edit in 'playground'.