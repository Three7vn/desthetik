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

// Default example data for initial display
const initialNodes = [
  { id: '1', position: { x: 150, y: 50 }, data: { label: 'Enter your requirements above' } },
  { id: '2', position: { x: 150, y: 150 }, data: { label: 'Click "Generate System Design"' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
 
export default function FlowCanvas({ graphData }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 
  // Update nodes and edges when graphData changes
  useEffect(() => {
    if (graphData?.nodes && graphData?.edges) {
      setNodes(graphData.nodes);
      setEdges(graphData.edges);
    }
  }, [graphData, setNodes, setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );
 
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
} 