# Idea to world-class system design in seconds, not weeks.

Desthetik is an open-source system design co-pilot.

## The Problem

People often talk about democratizing access to code and software development. And while it's true that more people can now build software—thanks to AI tools and low-code platforms—not everyone can build a successful company. The real differentiator in the next generation of startups won't be access to code; it'll be system design and user experience (UX).

AI tools like Cursor, Copilot, or even ChatGPT can write code once you know what to build, but they don't know why to build something a certain way. They lack contextual intuition — that sense of how design choices interact with the actual problem domain.

Most people don't have the human-level intuition necessary to translate an abstract idea into a well-designed, usable product that aligns with real-world user needs. You can tell an AI, "I want to build a productivity app," and it may generate code for one. But that doesn't mean the resulting app will be useful, usable, or desirable. The effectiveness of a product often lies in how it's designed, not just what it is.

Many founders, especially non-technical ones, either spend too much time trying to figure out how to build their product— or worse, they skip that phase entirely because it feels ambiguous or overwhelming. There's often a lack of structured thinking about system components, user interactions, and how the overall architecture fits with the philosophy of the business. And that's a core problem.

## The Solution

Desthetik combines a multi-turn input flow—like a conversational form—with backend logic that turns structured responses into flowchart-like visual diagrams. The system dynamically chooses a graph structure based on the user's context (e.g., experience level, goal, etc.), with predefined graph "types" that map user inputs to the right visualization.

<p align="center">
  <img src="./Desthetik.png" alt="Desthetik system design screenshot" width="700" />
  <br />
  <em>Natural language --> System design with full control </em>
</p>

<p align="center">
  <img src="./Screenshot 2025-05-31 at 20.24.32.png" alt="AI scam detection system architecture" width="700" />
  <br />
  <em>From abstract concept to concrete architecture: The business idea was to solve the emerging problem of AI-powered phone scams that will be indistinguishable from legitimate calls—whether from banks, institutions, or services. As AI becomes sophisticated enough to reason and sound completely human, people won't know what's real anymore. Desthetik transforms this abstract business idea into a comprehensive technical product: a real-time AI scam detection system with authentication layers, voice analysis, user verification flows, and privacy safeguards—complete with exportable architecture ready for implementation in AI IDEs like Cursor and Windsurf</em>
</p>

### Technical Implementation

Desthetik uses a voice-based approach to allow the rawest ideas—even if unstructured, unclear, or highly abstract—to be transformed into comprehensive and structured technical designs that can be immediately used for development.

The stack includes:
- Frontend: React/Next.js with a visual layout library (React Flow)
- Backend: Handles prompt generation and LLM interaction
- Voice Input: Captures natural speech to eliminate typing bottlenecks and enable stream-of-consciousness ideation

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Three7vn/desthetik.git
cd desthetik
```

npm install && npm run dev


This will install the dependencies and run the application on [http://localhost:3000](http://localhost:3000)


### Next Steps
1. Users can ask follow up questions on design
2. More user-behaviour/feature context
3. User can hover over nodes for a more in-depth explanation



### Contact
— Abraham (Avram) Dada: abraham@stoado.com
— @avramagb on X
