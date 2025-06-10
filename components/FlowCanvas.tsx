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
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
} from '@xyflow/react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
 
import '@xyflow/react/dist/style.css';

// Function to determine if a color is light or dark
const isLightColor = (color: string): boolean => {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance using the relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return true if the color is light (luminance > 0.5)
  return luminance > 0.5;
};

// Custom node styles based on color categories with proper text contrast
const getNodeStyle = (color: string) => ({
  background: color,
  color: isLightColor(color) ? '#000000' : '#ffffff',
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

  // Download diagram as PDF - Complete rewrite for proper capture
  const downloadPDF = useCallback(async () => {
    if (!flowRef.current) return;
    
    try {
      console.log('Starting PDF generation...');
      
      // Get the entire React Flow container (includes background, nodes, edges)
      const reactFlowElement = flowRef.current;
      
      // Temporarily hide UI elements that shouldn't be in PDF
      const downloadButton = document.querySelector('[class*="tooltip-container"]') as HTMLElement;
      const expandButton = document.querySelector('[class*="expand-tooltip-container"]') as HTMLElement;
      const controls = reactFlowElement.querySelector('.react-flow__controls') as HTMLElement;
      const minimap = reactFlowElement.querySelector('.react-flow__minimap') as HTMLElement;
      const attribution = reactFlowElement.querySelector('.react-flow__attribution') as HTMLElement;
      
      const originalDownloadDisplay = downloadButton?.style.display || '';
      const originalExpandDisplay = expandButton?.style.display || '';
      const originalControlsDisplay = controls?.style.display || '';
      const originalMinimapDisplay = minimap?.style.display || '';
      const originalAttributionDisplay = attribution?.style.display || '';
      
      if (downloadButton) downloadButton.style.display = 'none';
      if (expandButton) expandButton.style.display = 'none';
      if (controls) controls.style.display = 'none';
      if (minimap) minimap.style.display = 'none';
      if (attribution) attribution.style.display = 'none';
      
      // Wait a moment for UI changes to apply
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Capture the entire React Flow container with all its content
      const canvas = await html2canvas(reactFlowElement, {
        background: null, // Let the actual background show through
        width: reactFlowElement.offsetWidth,
        height: reactFlowElement.offsetHeight,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });
      
      // Restore UI elements
      if (downloadButton) downloadButton.style.display = originalDownloadDisplay;
      if (expandButton) expandButton.style.display = originalExpandDisplay;
      if (controls) controls.style.display = originalControlsDisplay;
      if (minimap) minimap.style.display = originalMinimapDisplay;
      if (attribution) attribution.style.display = originalAttributionDisplay;
      
      console.log('Canvas captured:', canvas.width, 'x', canvas.height);
      
      // Convert canvas to high-quality image
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Calculate PDF dimensions based on canvas size
      const pixelsToMM = 0.264583;
      const canvasWidthMM = canvas.width * pixelsToMM;
      const canvasHeightMM = canvas.height * pixelsToMM;
      
      // Ensure minimum A4 size but scale up if content is larger
      const minWidth = 210; // A4 width
      const minHeight = 297; // A4 height
      
      const pdfWidth = Math.max(minWidth, canvasWidthMM);
      const pdfHeight = Math.max(minHeight, canvasHeightMM);
      
      console.log('Creating PDF:', pdfWidth, 'x', pdfHeight, 'mm');
      
      // Create PDF document
      const pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [pdfWidth, pdfHeight],
        compress: false
      });
      
      // Add the captured image to PDF at full size
      pdf.addImage(
        imgData,
        'PNG',
        0,
        0,
        pdfWidth,
        pdfHeight,
        undefined,
        'FAST'
      );
      
      // Save the PDF
      pdf.save('system-design.pdf');
      console.log('PDF saved successfully');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
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
          <Controls />
          <MiniMap 
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