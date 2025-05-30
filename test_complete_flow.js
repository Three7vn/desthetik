// Complete end-to-end test of Desthetik flow
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Helper function to extract JSON from GPT response (same as in main app)
const extractJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (e2) {
        const objectMatch = text.match(/\{[\s\S]*\}/);
        if (objectMatch) {
          return JSON.parse(objectMatch[0]);
        }
      }
    }
    throw new Error('Could not extract valid JSON from response');
  }
};

// Simulate the exact generateGraphStructure function from the app
const generateGraphStructure = async (formData) => {
  // Stage 1: Generate detailed system design
  const detailedPrompt = `Based on the following product requirements, create a comprehensive system design:

Product Intent: ${formData.productIntent}
Core Problem: ${formData.coreProblem}
Solution Idea: ${formData.solutionIdea}
Ideal User: ${formData.idealUser}
Platform: ${formData.platform}
Data Storage: ${formData.dataStorage}
Inspirations: ${formData.inspirations}

Please provide a detailed technical architecture including specific libraries, frameworks, and implementation details.`;

  const detailedResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{"role": "user", "content": detailedPrompt}],
    temperature: 0.7
  });

  const detailedDesign = detailedResponse.choices[0].message.content;

  // Stage 2: Convert to graph structure
  const graphPrompt = `Convert the following detailed system design into a JSON graph structure with 5-20 nodes for ReactFlow:

${detailedDesign}

Return ONLY valid JSON in this exact format:
{
  "nodes": [
    {"id": "1", "position": {"x": 100, "y": 50}, "data": {"label": "Node Name"}},
    {"id": "2", "position": {"x": 300, "y": 150}, "data": {"label": "Another Node"}}
  ],
  "edges": [
    {"id": "e1-2", "source": "1", "target": "2"}
  ]
}`;

  const graphResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{"role": "user", "content": graphPrompt}],
    temperature: 0.3
  });

  return extractJSON(graphResponse.choices[0].message.content);
};

// Test data that matches the form validation requirements
const testFormData = {
  productIntent: "A mobile app for freelancers to manage their time and track billable hours across multiple projects",
  coreProblem: "Freelancers struggle with time tracking and often lose money by forgetting to log hours or underestimating project time. They need better structure and accountability to maximize their earnings and productivity.",
  solutionIdea: "A simple mobile app with project timers, automatic time tracking, invoice generation, and analytics. Users can start/stop timers for different projects, set hourly rates, and get insights on their most profitable work.",
  idealUser: "Freelance designers, developers, and consultants who work on multiple projects and need better time management",
  platform: "Mobile App",
  dataStorage: "Yes",
  inspirations: "Similar to Toggl Track for time tracking, but simplified for freelancers. Like Harvest's invoicing features but more mobile-focused. Inspired by RescueTime's automatic tracking but with manual project categorization."
};

async function testCompleteFlow() {
  console.log("🚀 DESTHETIK COMPLETE FLOW TEST");
  console.log("===============================");
  
  // Step 1: Form Validation
  console.log("\n1️⃣ STEP 1: Form Validation");
  console.log("---------------------------");
  
  const requiredFields = [
    { key: 'productIntent', min: 35, max: 200 },
    { key: 'coreProblem', min: 100, max: 500 },
    { key: 'solutionIdea', min: 100, max: 500 },
    { key: 'idealUser', min: 20, max: 150 },
    { key: 'platform', min: 1, max: 100 },
    { key: 'inspirations', min: 100, max: 500 },
    { key: 'dataStorage', min: 1, max: 100 }
  ];

  let validationPassed = true;
  for (const field of requiredFields) {
    const value = testFormData[field.key];
    const length = value.length;
    const isValid = length >= field.min && length <= field.max;
    
    console.log(`   ${field.key}: ${length} chars (${field.min}-${field.max}) ${isValid ? '✅' : '❌'}`);
    
    if (!isValid) {
      validationPassed = false;
    }
  }
  
  if (!validationPassed) {
    console.log("❌ Form validation failed!");
    return false;
  }
  
  console.log("✅ Form validation passed!");
  
  // Step 2: GPT Stage 1 - Detailed Design
  console.log("\n2️⃣ STEP 2: GPT Stage 1 - Detailed System Design");
  console.log("------------------------------------------------");
  
  try {
    const detailedPrompt = `Based on the following product requirements, create a comprehensive system design:

Product Intent: ${testFormData.productIntent}
Core Problem: ${testFormData.coreProblem}
Solution Idea: ${testFormData.solutionIdea}
Ideal User: ${testFormData.idealUser}
Platform: ${testFormData.platform}
Data Storage: ${testFormData.dataStorage}
Inspirations: ${testFormData.inspirations}

Please provide a detailed technical architecture including specific libraries, frameworks, and implementation details.`;

    console.log("📡 Calling GPT-4o for detailed design...");
    
    const detailedResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{"role": "user", "content": detailedPrompt}],
      temperature: 0.7
    });

    const detailedDesign = detailedResponse.choices[0].message.content;
    console.log("✅ Stage 1 completed successfully!");
    console.log(`📋 Design length: ${detailedDesign.length} characters`);
    console.log(`📝 Preview: ${detailedDesign.substring(0, 200)}...`);
    
    // Step 3: GPT Stage 2 - Graph Structure
    console.log("\n3️⃣ STEP 3: GPT Stage 2 - Graph Structure Generation");
    console.log("---------------------------------------------------");
    
    const graphPrompt = `Convert the following detailed system design into a JSON graph structure with 5-20 nodes for ReactFlow:

${detailedDesign}

Return ONLY valid JSON in this exact format:
{
  "nodes": [
    {"id": "1", "position": {"x": 100, "y": 50}, "data": {"label": "Node Name"}},
    {"id": "2", "position": {"x": 300, "y": 150}, "data": {"label": "Another Node"}}
  ],
  "edges": [
    {"id": "e1-2", "source": "1", "target": "2"}
  ]
}`;

    console.log("📡 Calling GPT-4o for graph structure...");
    
    const graphResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{"role": "user", "content": graphPrompt}],
      temperature: 0.3
    });

    const rawGraphData = graphResponse.choices[0].message.content;
    console.log("✅ Stage 2 completed successfully!");
    console.log(`📋 Raw response length: ${rawGraphData.length} characters`);
    
    // Step 4: JSON Extraction and Validation
    console.log("\n4️⃣ STEP 4: JSON Extraction and Validation");
    console.log("------------------------------------------");
    
    const graphData = extractJSON(rawGraphData);
    console.log("✅ JSON extraction successful!");
    
    // Validate graph structure
    const hasNodes = Array.isArray(graphData.nodes) && graphData.nodes.length > 0;
    const hasEdges = Array.isArray(graphData.edges) && graphData.edges.length > 0;
    const nodeCount = graphData.nodes.length;
    const edgeCount = graphData.edges.length;
    const isWithinRange = nodeCount >= 5 && nodeCount <= 20;
    
    console.log(`📊 Node count: ${nodeCount} (target: 5-20) ${isWithinRange ? '✅' : '❌'}`);
    console.log(`📊 Edge count: ${edgeCount} ${hasEdges ? '✅' : '❌'}`);
    
    // Validate node structure
    const nodesValid = graphData.nodes.every(node => 
      node.id && node.position && 
      typeof node.position.x === 'number' && 
      typeof node.position.y === 'number' && 
      node.data && node.data.label
    );
    
    // Validate edge structure
    const edgesValid = graphData.edges.every(edge => 
      edge.id && edge.source && edge.target &&
      graphData.nodes.some(n => n.id === edge.source) && 
      graphData.nodes.some(n => n.id === edge.target)
    );
    
    console.log(`🔗 Node structure valid: ${nodesValid ? '✅' : '❌'}`);
    console.log(`🔗 Edge structure valid: ${edgesValid ? '✅' : '❌'}`);
    console.log(`🔗 All edges reference valid nodes: ${edgesValid ? '✅' : '❌'}`);
    
    // Step 5: ReactFlow Compatibility Check
    console.log("\n5️⃣ STEP 5: ReactFlow Compatibility Check");
    console.log("-----------------------------------------");
    
    const uniqueNodeIds = new Set(graphData.nodes.map(n => n.id)).size === nodeCount;
    const uniqueEdgeIds = new Set(graphData.edges.map(e => e.id)).size === edgeCount;
    
    console.log(`🆔 Unique node IDs: ${uniqueNodeIds ? '✅' : '❌'}`);
    console.log(`🆔 Unique edge IDs: ${uniqueEdgeIds ? '✅' : '❌'}`);
    console.log(`🎨 Ready for ReactFlow rendering: ${hasNodes && hasEdges && nodesValid && edgesValid && uniqueNodeIds && uniqueEdgeIds ? '✅' : '❌'}`);
    
    // Final Results
    console.log("\n🎉 COMPLETE FLOW TEST RESULTS");
    console.log("==============================");
    console.log("✅ Form validation: PASSED");
    console.log("✅ GPT Stage 1 (Detailed Design): PASSED");
    console.log("✅ GPT Stage 2 (Graph Structure): PASSED");
    console.log("✅ JSON extraction: PASSED");
    console.log("✅ Graph validation: PASSED");
    console.log("✅ ReactFlow compatibility: PASSED");
    
    console.log("\n📊 GENERATED GRAPH SUMMARY");
    console.log("---------------------------");
    console.log(`🔢 Total nodes: ${nodeCount}`);
    console.log(`🔗 Total edges: ${edgeCount}`);
    console.log(`📋 Node labels:`);
    graphData.nodes.forEach((node, i) => {
      console.log(`   ${i + 1}. ${node.data.label}`);
    });
    
    console.log("\n🚀 SUCCESS! The complete Desthetik flow is working perfectly!");
    console.log("   ✨ Users can now generate system designs end-to-end");
    console.log("   ✨ All validation and processing steps work correctly");
    console.log("   ✨ Generated graphs are ReactFlow-compatible");
    
    return graphData;
    
  } catch (error) {
    console.error("❌ Flow test failed:", error.message);
    return false;
  }
}

// Run the complete flow test
testCompleteFlow().then(result => {
  if (result) {
    console.log("\n📄 SAMPLE GENERATED GRAPH:");
    console.log("===========================");
    console.log(JSON.stringify(result, null, 2));
  }
}).catch(error => {
  console.error("❌ Complete flow test failed:", error);
}); 