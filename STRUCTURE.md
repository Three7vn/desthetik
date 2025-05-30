# Desthetik Project Structure

## Overview
Desthetik is a system design agent that combines AI-powered analysis with visual flowchart generation.

## Tech Stack
- **Frontend**: React with TypeScript
- **Flowchart UI**: @xyflow/react (formerly ReactFlow)
- **AI**: OpenAI GPT-4o (called directly from frontend)
- **No Backend APIs**: Direct GPT integration

## Directory Structure
```
desthetik/
├── pages/
│   └── index.tsx                   # Main UI with form, navigation & FlowCanvas + LLM
├── components/
│   ├── FlowCanvas.tsx              # ReactFlow diagram renderer
│   └── Voice.tsx                   # Voice input component with speech recognition
├── backend/                        # Reference files (not actively used)
│   └── prompt_logic.py             # llm logic (for reference)
└── STRUCTURE.md                    # This file
```

## **DATA FLOW**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           🎯 USER INPUT COLLECTION                              │
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │   Question 1    │  │   Question 2    │  │   Question 3    │                │
│  │ Product Intent  │  │ Core Problem    │  │ Solution Idea   │                │
│  │   (35-200)      │  │   (100-500)     │  │   (100-500)     │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │   Question 4    │  │   Question 5    │  │   Question 6    │                │
│  │   Ideal User    │  │    Platform     │  │  Inspirations   │                │
│  │   (20-150)      │  │   (dropdown)    │  │   (100-500)     │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
│                                                                                 │
│  ┌─────────────────┐                                                           │
│  │   Question 7    │                                                           │
│  │ Data Storage    │                                                           │
│  │   (dropdown)    │                                                           │
│  └─────────────────┘                                                           │
│                                                                                 │
│                           ⬇️ FORM VALIDATION                                   │
│                    ✅ Character limits checked                                 │
│                    ✅ All required fields filled                               │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        ⬇️
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        🤖 DIRECT GPT PROCESSING                                │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                          STAGE 1: DETAILED DESIGN                      │   │
│  │                                                                         │   │
│  │  📝 Input: formData object with all 7 answers                         │   │
│  │  🎯 GPT-4o Call (temp: 0.7)                                           │   │
│  │  📋 Output: Comprehensive technical architecture                       │   │
│  │             - Libraries & frameworks                                   │   │
│  │             - Implementation details                                   │   │
│  │             - System reasoning                                         │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                        ⬇️                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                         STAGE 2: GRAPH CONVERSION                      │   │
│  │                                                                         │   │
│  │  📝 Input: Detailed design from Stage 1                               │   │
│  │  🎯 GPT-4o Call (temp: 0.3)                                           │   │
│  │  📋 Output: ReactFlow JSON structure                                   │   │
│  │             - 5-20 nodes with positions                               │   │
│  │             - Edges connecting nodes                                   │   │
│  │             - Ready for visualization                                  │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        ⬇️
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        🎨 REACTFLOW VISUALIZATION                              │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                         FlowCanvas.tsx                                 │   │
│  │                                                                         │   │
│  │  📊 Receives: JSON graph data                                         │   │
│  │  🎨 Renders: Interactive node diagram                                 │   │
│  │  ✨ Features: Drag, zoom, edit connections                            │   │
│  │  🎮 User can modify the generated graph                               │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Features
- **Character limits** with real-time validation (35-200, 100-500, etc.)
- **Form validation** before generation
- **Voice input** with speech recognition
- **Two-stage LLM processing** (detailed design → graph structure)
- **Interactive ReactFlow** playground
- **Rotating text animation** in header

## Technical Implementation

### API Structure
```
GET /api/prompts
Returns:
{
  "detailed_prompt": "Enhanced prompt with intuitive explanations...",
  "graph_prompt": "Structured node organization prompt..."
}
```

### Node Data Structure
```json
{
  "id": "1",
  "position": {"x": 100, "y": 50},
  "data": {
    "label": "React Frontend - JavaScript library for building user interfaces",
    "color": "#3B82F6"
  }
}
```

## How It Works
1. User fills out 7-question form with validation
2. Frontend directly calls OpenAI GPT-4o (2 stages)
3. GPT returns ReactFlow-compatible JSON
4. FlowCanvas renders interactive diagram
5. User can edit/modify the generated graph