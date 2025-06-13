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
import { jsPDF } from 'jspdf';
import LZString from 'lz-string';
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

// Compress and encode diagram data for URL sharing
const compressAndEncodeData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    console.log('Encoding data length:', jsonString.length);
    
    // Use LZ-String for compression and URL-safe encoding
    const compressed = LZString.compressToEncodedURIComponent(jsonString);
    
    console.log('Compressed data length:', compressed.length);
    return compressed;
  } catch (error) {
    console.error('Error encoding diagram data:', error);
    return null;
  }
};

// Decode and decompress diagram data from URL
const decodeAndDecompressData = (encodedData) => {
  try {
    console.log('Decoding data length:', encodedData.length);
    
    if (!encodedData || encodedData.trim() === '') {
      console.error('Empty encoded data received');
      return null;
    }
    
    // Use LZ-String for URL-safe decoding and decompression
    const jsonString = LZString.decompressFromEncodedURIComponent(encodedData);
    
    if (!jsonString) {
      console.error('Decompression failed - null or empty result');
      return null;
    }
    
    console.log('Decoded JSON length:', jsonString.length);
    
    try {
      const parsed = JSON.parse(jsonString);
      
      if (!parsed || typeof parsed !== 'object') {
        console.error('Parsed result is not a valid object');
        return null;
      }
      
      if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
        console.error('Parsed result missing nodes or edges arrays:', parsed);
        return null;
      }
      
      console.log('Decoded nodes count:', parsed.nodes.length);
      console.log('Decoded edges count:', parsed.edges.length);
      
      return parsed;
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('JSON string (first 100 chars):', jsonString.substring(0, 100));
      return null;
    }
  } catch (error) {
    console.error('Error decoding diagram data:', error);
    return null;
  }
};
 
export default function FlowCanvas({ graphData }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const flowRef = useRef<HTMLDivElement>(null);
  const exportTooltipRef = useRef<HTMLDivElement>(null);
  const importTooltipRef = useRef<HTMLDivElement>(null);
  const shareTooltipRef = useRef<HTMLDivElement>(null);
 
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

  // Check URL hash for encoded diagram data on component mount
  useEffect(() => {
    const hash = window.location.hash;
    console.log('FlowCanvas: Current URL hash:', hash);
    
    if (hash && hash.startsWith('#playground/')) {
      try {
        const encodedData = hash.substring('#playground/'.length);
        console.log('Found encoded data in URL, length:', encodedData.length);
        
        if (!encodedData || encodedData.trim() === '') {
          console.error('Empty encoded data in URL hash');
          return;
        }
        
        const decodedData = decodeAndDecompressData(encodedData);
        if (decodedData && decodedData.nodes && decodedData.edges) {
          console.log('Successfully decoded data from URL');
          setNodes(decodedData.nodes);
          setEdges(decodedData.edges);
          
          // Show a notification that the design was loaded from URL
          setTimeout(() => {
            // Create more visible notification
            const notification = document.createElement('div');
            notification.style.position = 'fixed';
            notification.style.top = '50%';
            notification.style.left = '50%';
            notification.style.transform = 'translate(-50%, -50%)';
            notification.style.background = 'rgba(0, 0, 0, 0.8)';
            notification.style.color = '#fff';
            notification.style.padding = '20px 30px';
            notification.style.borderRadius = '10px';
            notification.style.fontSize = '16px';
            notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
            notification.style.zIndex = '9999';
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            notification.style.textAlign = 'center';
            notification.style.maxWidth = '80%';
            
            // Create a title for the notification
            const title = document.createElement('div');
            title.style.fontWeight = 'bold';
            title.style.marginBottom = '10px';
            title.style.fontSize = '18px';
            title.textContent = 'Design Loaded Successfully!';
            notification.appendChild(title);
            
            // Create message content
            const message = document.createElement('div');
            message.textContent = 'This design was loaded from a shared link. You can modify it or create your own shareable link.';
            notification.appendChild(message);
            
            document.body.appendChild(notification);
            
            // Fade in
            setTimeout(() => {
              notification.style.opacity = '1';
            }, 10);
            
            // Remove notification after 3 seconds
            setTimeout(() => {
              notification.style.opacity = '0';
              setTimeout(() => {
                document.body.removeChild(notification);
              }, 300);
            }, 3000);
          }, 500);
        } else {
          console.error('Failed to decode data from URL or missing nodes/edges');
          
          // Show error notification
          setTimeout(() => {
            alert('Failed to load design from URL. The link may be invalid or corrupted.');
          }, 500);
        }
      } catch (error) {
        console.error('Error loading diagram from URL:', error);
        
        // Show error notification
        setTimeout(() => {
          alert('Failed to load design from URL. The link may be invalid or corrupted.');
        }, 500);
      }
    } else {
      console.log('No encoded data in URL hash');
    }
  }, [setNodes, setEdges]);

  // Handle connecting nodes manually if user wants to adjust the diagram
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Export diagram as JSON
  const exportJSON = useCallback(() => {
    if (!nodes || !edges) return;
    
    const diagramData = {
      nodes,
      edges,
      viewport: {
        zoom: 1,
        x: 0,
        y: 0
      }
    };
    
    const jsonString = JSON.stringify(diagramData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create filename with current date and time
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timestamp = `${year}${month}${day}_${hours}${minutes}${seconds}`;
    const filename = `design_${timestamp}.json`;
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show subtle notification
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.background = '#222';
    notification.style.color = '#fff';
    notification.style.padding = '6px 14px';
    notification.style.borderRadius = '6px';
    notification.style.fontSize = '13px';
    notification.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    notification.style.zIndex = '9999';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';
    notification.textContent = 'JSON downloaded. Import into your AI coding environment to implement.';
    
    document.body.appendChild(notification);
    
    // Fade in
    setTimeout(() => {
      notification.style.opacity = '1';
    }, 10);
    
    // Remove notification after 3 seconds (slightly longer for this message)
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }, [nodes, edges]);

  // Import diagram from JSON
  const importJSON = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const diagramData = JSON.parse(e.target?.result as string);
        if (diagramData.nodes && diagramData.edges) {
          setNodes(diagramData.nodes);
          setEdges(diagramData.edges);
          if (diagramData.viewport) {
            // Apply viewport settings if available
            const { zoom, x, y } = diagramData.viewport;
            // You might need to implement viewport setting logic here
          }
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        alert('Invalid diagram JSON file');
      }
    };
    reader.readAsText(file);
  }, [setNodes, setEdges]);

  // Generate shareable link
  const shareDesign = useCallback(() => {
    if (!nodes || !edges) return;
    
    const diagramData = {
      nodes,
      edges,
      viewport: {
        zoom: 1,
        x: 0,
        y: 0
      }
    };
    
    console.log('Generating shareable link for nodes:', nodes.length, 'edges:', edges.length);
    
    const encodedData = compressAndEncodeData(diagramData);
    if (encodedData) {
      // Always use the current window.location.origin which includes the correct port
      const currentOrigin = window.location.origin;
      const shareableUrl = `${currentOrigin}/#playground/${encodedData}`;
      
      console.log('Generated shareable URL:', shareableUrl.substring(0, 100) + '...');
      console.log('URL length:', shareableUrl.length);
      
      // Copy to clipboard
      navigator.clipboard.writeText(shareableUrl)
        .then(() => {
          console.log('URL copied to clipboard successfully');
          
          // Create more visible notification
          const notification = document.createElement('div');
          notification.style.position = 'fixed';
          notification.style.top = '50%';
          notification.style.left = '50%';
          notification.style.transform = 'translate(-50%, -50%)';
          notification.style.background = 'rgba(0, 0, 0, 0.8)';
          notification.style.color = '#fff';
          notification.style.padding = '20px 30px';
          notification.style.borderRadius = '10px';
          notification.style.fontSize = '16px';
          notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
          notification.style.zIndex = '9999';
          notification.style.opacity = '0';
          notification.style.transition = 'opacity 0.3s ease';
          notification.style.textAlign = 'center';
          notification.style.maxWidth = '80%';
          
          // Create a title for the notification
          const title = document.createElement('div');
          title.style.fontWeight = 'bold';
          title.style.marginBottom = '10px';
          title.style.fontSize = '18px';
          title.textContent = 'Shareable Link Created!';
          notification.appendChild(title);
          
          // Create message content
          const message = document.createElement('div');
          message.textContent = 'A link to this design has been copied to your clipboard. You can share it with others or save it for later.';
          notification.appendChild(message);
          
          document.body.appendChild(notification);
          
          // Fade in
          setTimeout(() => {
            notification.style.opacity = '1';
          }, 10);
          
          // Remove notification after 3 seconds
          setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
              document.body.removeChild(notification);
            }, 300);
          }, 3000);
        })
        .catch(err => {
          console.error('Failed to copy link:', err);
          alert('Failed to copy link to clipboard. Please try again.');
        });
    } else {
      console.error('Failed to encode diagram data');
      alert('Failed to create shareable link. Please try again.');
    }
  }, [nodes, edges]);

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
      {/* Export/Import/Share Buttons */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 1000,
          display: 'flex',
          gap: '8px'
        }}
        className="tooltip-container"
      >
        {/* Share Button */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <button
            onClick={shareDesign}
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
            onMouseEnter={() => {
              if (shareTooltipRef.current) {
                shareTooltipRef.current.style.opacity = '1';
                shareTooltipRef.current.style.visibility = 'visible';
              }
            }}
            onMouseLeave={() => {
              if (shareTooltipRef.current) {
                shareTooltipRef.current.style.opacity = '0';
                shareTooltipRef.current.style.visibility = 'hidden';
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
          <div ref={shareTooltipRef} style={{
            position: 'absolute',
            bottom: '-36px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#222',
            color: '#fff',
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '13px',
            whiteSpace: 'nowrap',
            opacity: 0,
            visibility: 'hidden',
            pointerEvents: 'none',
            transition: 'opacity 0.2s',
            zIndex: 1001
          }}>
            Create shareable link
          </div>
        </div>

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <button
            onClick={exportJSON}
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
            onMouseEnter={() => {
              if (exportTooltipRef.current) {
                exportTooltipRef.current.style.opacity = '1';
                exportTooltipRef.current.style.visibility = 'visible';
              }
            }}
            onMouseLeave={() => {
              if (exportTooltipRef.current) {
                exportTooltipRef.current.style.opacity = '0';
                exportTooltipRef.current.style.visibility = 'hidden';
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
          <div ref={exportTooltipRef} style={{
            position: 'absolute',
            bottom: '-36px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#222',
            color: '#fff',
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '13px',
            whiteSpace: 'nowrap',
            opacity: 0,
            visibility: 'hidden',
            pointerEvents: 'none',
            transition: 'opacity 0.2s',
            zIndex: 1001
          }}>
            Export as JSON
          </div>
        </div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <label
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
            onMouseEnter={() => {
              if (importTooltipRef.current) {
                importTooltipRef.current.style.opacity = '1';
                importTooltipRef.current.style.visibility = 'visible';
              }
            }}
            onMouseLeave={() => {
              if (importTooltipRef.current) {
                importTooltipRef.current.style.opacity = '0';
                importTooltipRef.current.style.visibility = 'hidden';
              }
            }}
          >
            <input
              type="file"
              accept=".json"
              onChange={importJSON}
              style={{ display: 'none' }}
            />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </label>
          <div ref={importTooltipRef} style={{
            position: 'absolute',
            bottom: '-36px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#222',
            color: '#fff',
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '13px',
            whiteSpace: 'nowrap',
            opacity: 0,
            visibility: 'hidden',
            pointerEvents: 'none',
            transition: 'opacity 0.2s',
            zIndex: 1001
          }}>
            Import existing JSON design and visualize
          </div>
        </div>
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
        @keyframes pulse-outer {
          0% {
            transform: scale(0.8);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.1;
          }
          100% {
            transform: scale(0.8);
            opacity: 0.3;
          }
        }
        
        @keyframes pulse-middle {
          0% {
            transform: scale(0.85);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.25;
          }
          100% {
            transform: scale(0.85);
            opacity: 0.5;
          }
        }
        
        @keyframes pulse-inner {
          0% {
            transform: scale(0.9);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.5;
          }
          100% {
            transform: scale(0.9);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
} 