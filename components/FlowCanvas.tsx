import React, { useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  Node,
} from '@xyflow/react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
 
import '@xyflow/react/dist/style.css';

// Custom node styles based on color categories
const getNodeStyle = (color: string) => ({
  background: color,
  color: color === '#6B7280' ? 'white' : 'white',
  border: `2px solid ${color}`,
  borderRadius: '8px',
  padding: '10px',
  fontSize: '12px',
  fontWeight: '500',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  minWidth: '200px',
  textAlign: 'center' as const,
});

// PLACEHOLDER: Default example nodes shown before user submits the form
// These will be replaced with dynamically generated nodes after form submission
// Each system design will have a unique set of nodes and edges
// There will be around 10-15 nodes in total for each system design, these are the initial nodes pre-design
const initialNodes = [
  { 
    id: '1', 
    position: { x: 150, y: 50 }, 
    data: { label: 'Enter your requirements above' },
    style: {
      background: 'transparent',
      color: '#000000',
      border: '1px solid #000000',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '12px',
      fontWeight: '500',
      minWidth: '200px',
      textAlign: 'center' as const,
    }
  },
  { 
    id: '2', 
    position: { x: 150, y: 150 }, 
    data: { label: 'Click "Generate System Design"' },
    style: {
      background: 'transparent',
      color: '#000000',
      border: '1px solid #000000',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '12px',
      fontWeight: '500',
      minWidth: '200px',
      textAlign: 'center' as const,
    }
  },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
 
export default function FlowCanvas({ graphData }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const flowRef = useRef<HTMLDivElement>(null);
 
  // This effect watches for new graph data from form submission
  // When form is submitted, the placeholder nodes are replaced with 
  // nodes generated based on user's answers
  useEffect(() => {
    if (graphData?.nodes && graphData?.edges) {
      const styledNodes = graphData.nodes.map((node: any) => ({
        ...node,
        style: getNodeStyle(node.data.color || '#6B7280'),
        data: {
          ...node.data,
          label: node.data.label
        }
      }));
      
      setNodes(styledNodes);
      setEdges(graphData.edges);
    }
  }, [graphData, setNodes, setEdges]);

  // Handle connecting nodes manually if user wants to adjust the diagram
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Download diagram as PDF
  const downloadPDF = useCallback(async () => {
    if (!flowRef.current) return;
    
    try {
      // Hide controls and minimap temporarily for cleaner PDF
      const controls = flowRef.current.querySelector('.react-flow__controls');
      const minimap = flowRef.current.querySelector('.react-flow__minimap');
      const originalControlsDisplay = controls ? (controls as HTMLElement).style.display : '';
      const originalMinimapDisplay = minimap ? (minimap as HTMLElement).style.display : '';
      
      if (controls) (controls as HTMLElement).style.display = 'none';
      if (minimap) (minimap as HTMLElement).style.display = 'none';

      // Capture the canvas
      const canvas = await html2canvas(flowRef.current, {
        useCORS: true,
        allowTaint: true,
      });

      // Restore controls and minimap
      if (controls) (controls as HTMLElement).style.display = originalControlsDisplay;
      if (minimap) (minimap as HTMLElement).style.display = originalMinimapDisplay;

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('system-design.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }, []);
 
  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      cursor: 'url("data:image/svg+xml;charset=utf8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 16 16\'%3E%3Cpath fill=\'white\' stroke=\'black\' stroke-width=\'0.5\' d=\'M0,0 L0,10 L3,7 L5,9 L7,7 L3,3 Z\'/%3E%3C/svg%3E") 1 1, auto',
      position: 'relative'
    }}>
      {/* Download PDF Button */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 1000,
        }}
        className="tooltip-container"
      >
        <button
          onClick={downloadPDF}
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f9fafb';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
          }}
        >
          <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M1.75 13C0.783501 13 1.51525e-07 12.2165 1.09278e-07 11.25L0 8.74998C-1.81059e-08 8.33576 0.335786 7.99998 0.75 7.99998C1.16421 7.99998 1.5 8.33576 1.5 8.74998L1.5 11.25C1.5 11.388 1.61193 11.5 1.75 11.5H12.25C12.3881 11.5 12.5 11.388 12.5 11.25V8.74998C12.5 8.33576 12.8358 7.99998 13.25 7.99998C13.6642 7.99998 14 8.33576 14 8.74998V11.25C14 12.2165 13.2165 13 12.25 13H1.75Z" fill="#1F2328"/>
            <path d="M6.25 6.68932L6.25 1C6.25 0.585787 6.58578 0.25 7 0.25C7.41421 0.25 7.75 0.585786 7.75 1L7.75 6.68932L9.71967 4.71965C10.0126 4.42675 10.4874 4.42675 10.7803 4.71965C11.0732 5.01254 11.0732 5.48741 10.7803 5.78031L7.53033 9.03031C7.23744 9.3232 6.76256 9.3232 6.46967 9.03031L3.21967 5.78031C2.92678 5.48741 2.92678 5.01254 3.21967 4.71965C3.51256 4.42675 3.98744 4.42675 4.28033 4.71965L6.25 6.68932Z" fill="#1F2328"/>
          </svg>
        </button>
        <div className="tooltip">Download as PDF</div>
      </div>

      {/* 
        ReactFlow renders the actual diagram
        This component handles the visualization and interaction with the nodes
        Initially shows placeholder nodes, then updates to show the real system design
      */}
      <div ref={flowRef} style={{ width: '100%', height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          defaultEdgeOptions={{
            type: 'smoothstep',
            style: { strokeWidth: 2, stroke: '#64748B' }
          }}
        >
          <Controls style={{ marginBottom: 80 }} />
          <MiniMap 
            style={{ marginBottom: 80 }}
            nodeColor={(node: Node) => {
              const bg = node.style?.background;
              if (!bg || bg === 'transparent') return '#d1d5db';
              return bg as string;
            }}
            nodeStrokeWidth={1}
            nodeBorderRadius={2}
            nodeClassName={() => 'minimap-node'}
          />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>

      {/* Tooltip CSS */}
      <style jsx>{`
        .tooltip-container {
          position: relative;
        }
        
        .tooltip {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 6px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.2s ease, visibility 0.2s ease;
          pointer-events: none;
          z-index: 1001;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
        
        .tooltip::before {
          content: '';
          position: absolute;
          bottom: 100%;
          right: 12px;
          border: 4px solid transparent;
          border-bottom-color: rgba(0, 0, 0, 0.8);
        }
        
        .tooltip-container:hover .tooltip {
          opacity: 1;
          visibility: visible;
        }
      `}</style>

      <style jsx global>{`
        .react-flow__minimap .minimap-node {
          transform: scale(0.5);
          transform-origin: center;
        }
      `}</style>
    </div>
  );
} 