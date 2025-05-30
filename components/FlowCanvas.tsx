import React, { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
} from '@xyflow/react';
 
import '@xyflow/react/dist/style.css';

// PLACEHOLDER: Default example nodes shown before user submits the form
// These will be replaced with dynamically generated nodes after form submission
// Each system design will have a unique set of nodes and edges
// There will be around 10-15 nodes in total for each system design, these are the initial nodes pre-design
const initialNodes = [
  { id: '1', position: { x: 150, y: 50 }, data: { label: 'Enter your requirements above' } },
  { id: '2', position: { x: 150, y: 150 }, data: { label: 'Click "Generate System Design"' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
 
export default function FlowCanvas({ graphData }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 
  // This effect watches for new graph data from form submission
  // When form is submitted, the placeholder nodes are replaced with 
  // nodes generated based on user's answers
  useEffect(() => {
    if (graphData?.nodes && graphData?.edges) {
      setNodes(graphData.nodes);
      setEdges(graphData.edges);
    }
  }, [graphData, setNodes, setEdges]);

  // Handle connecting nodes manually if user wants to adjust the diagram
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );
 
  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      cursor: 'url("data:image/svg+xml;charset=utf8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 16 16\'%3E%3Cpath fill=\'white\' stroke=\'black\' stroke-width=\'0.5\' d=\'M0,0 L0,10 L3,7 L5,9 L7,7 L3,3 Z\'/%3E%3C/svg%3E") 1 1, auto'
    }}>
      {/* 
        ReactFlow renders the actual diagram
        This component handles the visualization and interaction with the nodes
        Initially shows placeholder nodes, then updates to show the real system design
      */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls style={{ marginBottom: 80 }} />
        <MiniMap style={{ marginBottom: 80 }} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
} 