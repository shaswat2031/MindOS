import { StateGraph, END, Annotation } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";

// Initialize LLM via OpenRouter
const llm = new ChatOpenAI({
  modelName: "google/gemini-2.0-flash-001",
  openAIApiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
  temperature: 0.7,
});

// Define the state of the graph
const GraphState = Annotation.Root({
  decision: Annotation({
    reducer: (x, y) => y ?? x,
  }),
  context: Annotation({
    reducer: (x, y) => y ?? x,
  }),
  persona: Annotation({
    reducer: (x, y) => y ?? x,
  }),
  personaViews: Annotation({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({}),
  }),
  initialAudit: Annotation({
    reducer: (x, y) => y ?? x,
  }),
  criticReview: Annotation({
    reducer: (x, y) => y ?? x,
  }),
  logicScore: Annotation({
    reducer: (x, y) => y ?? x,
  }),
  iterations: Annotation({
    reducer: (x, y) => x + y,
    default: () => 0,
  }),
  finalAudit: Annotation({
    reducer: (x, y) => y ?? x,
  }),
});

// 1. Parallel Persona Nodes
const stoicNode = async (state) => {
  const response = await llm.invoke([
    { role: "system", content: "You are a Stoic Philosopher (Marcus Aurelius style). Analyze the decision for emotional detachment, control, and long-term virtue." },
    { role: "user", content: `Decision: ${state.decision}. Context: ${state.context}` },
  ]);
  return { personaViews: { stoic: response.content } };
};

const ventureNode = async (state) => {
  const response = await llm.invoke([
    { role: "system", content: "You are a Venture Capitalist (Risk-Reward expert). Analyze the decision for ROI, asymmetric upside, and resource allocation." },
    { role: "user", content: `Decision: ${state.decision}. Context: ${state.context}` },
  ]);
  return { personaViews: { vc: response.content } };
};

const pragmatistNode = async (state) => {
  const response = await llm.invoke([
    { role: "system", content: "You are a High-Performance Pragmatist. Analyze the decision for execution speed, practicality, and immediate next steps." },
    { role: "user", content: `Decision: ${state.decision}. Context: ${state.context}` },
  ]);
  return { personaViews: { pragmatist: response.content } };
};

// 2. Analyst Node (Synthesizer)
const analystNode = async (state) => {
  const views = Object.entries(state.personaViews)
    .map(([name, view]) => `${name.toUpperCase()}: ${view}`)
    .join("\n\n");

  const prompt = `You are the MindOS Lead Analyst. Synthesize the following perspectives into a single, high-quality decision audit.
  
  PERSPECTIVES:
  ${views}
  
  DECISION: ${state.decision}
  
  Provide a structured audit in JSON format:
  {
    "verdict": "2-3 words uppercase",
    "fearAnalysis": "paragraph about hidden fears",
    "logicReasoning": "detailed reasoning",
    "successProbability": (0-100),
    "secondOrderEffects": "brief explanation of ripple effect",
    "nextSteps": ["action 1", "action 2", "action 3", "action 4"],
    "qualityScore": (1-100),
    "metaInsight": "one deep sentence"
  }`;

  const response = await llm.invoke([
    { role: "system", content: "You are a master of synthesis. Return ONLY valid JSON." },
    { role: "user", content: prompt },
  ]);

  try {
    const audit = JSON.parse(response.content.replace(/```json|```/g, ""));
    return { initialAudit: audit, logicScore: audit.qualityScore || 50 };
  } catch (e) {
    return { initialAudit: { verdict: "ERROR", logicReasoning: response.content, qualityScore: 50 }, logicScore: 50 };
  }
};

// 3. Critic Node
const criticNode = async (state) => {
  const prompt = `You are the MindOS Logic Critic. Review this audit for any remaining bias, sunk cost fallacy, or ego-driven logic.
  
  AUDIT:
  ${JSON.stringify(state.initialAudit)}
  
  Point out exactly what is weak. If the audit is perfect, say "PERFECT".`;

  const response = await llm.invoke([
    { role: "system", content: "Be brutal and objective. Do not be polite." },
    { role: "user", content: prompt },
  ]);

  return { criticReview: response.content };
};

// 4. Refiner Node
const refinerNode = async (state) => {
  const prompt = `You are the MindOS Chief Refiner. Rewrite the initial audit based on the Critic's feedback to make it bulletproof.
  
  INITIAL AUDIT: ${JSON.stringify(state.initialAudit)}
  CRITIC FEEDBACK: ${state.criticReview}
  
  Return the final JSON version with the same structure:
  {
    "verdict": "...",
    "fearAnalysis": "...",
    "logicReasoning": "...",
    "successProbability": ...,
    "secondOrderEffects": "...",
    "nextSteps": [...],
    "qualityScore": ...,
    "metaInsight": "..."
  }`;

  const response = await llm.invoke([
    { role: "system", content: "Apply the feedback and return valid JSON." },
    { role: "user", content: prompt },
  ]);

  try {
    const final = JSON.parse(response.content.replace(/```json|```/g, ""));
    return { finalAudit: final, iterations: 1 };
  } catch (e) {
    return { finalAudit: state.initialAudit, iterations: 1 };
  }
};


// Define the logic flow
const workflow = new StateGraph(GraphState)
  .addNode("stoic", stoicNode)
  .addNode("vc", ventureNode)
  .addNode("pragmatist", pragmatistNode)
  .addNode("analyst", analystNode)
  .addNode("critic", criticNode)
  .addNode("refiner", refinerNode);

// Parallel persona analysis
workflow.addEdge("__start__", "stoic");
workflow.addEdge("__start__", "vc");
workflow.addEdge("__start__", "pragmatist");

// All personas feed into the analyst
workflow.addEdge("stoic", "analyst");
workflow.addEdge("vc", "analyst");
workflow.addEdge("pragmatist", "analyst");

// Analyst to Critic
workflow.addEdge("analyst", "critic");

// Router based on Critic feedback
workflow.addConditionalEdges("critic", (state) => {
  if (state.criticReview.includes("PERFECT") || state.iterations >= 1) {
    return "end";
  }
  return "refiner";
}, {
  end: END,
  refiner: "refiner"
});

// Refiner goes to end
workflow.addEdge("refiner", END);

// --- MIND PROFILE EVOLUTION GRAPH ---

const ProfileState = Annotation.Root({
  currentProfile: Annotation({ reducer: (x, y) => y ?? x }),
  latestDecision: Annotation({ reducer: (x, y) => y ?? x }),
  updates: Annotation({ reducer: (x, y) => ({ ...x, ...y }), default: () => ({}) }),
});

const profileAnalystNode = async (state) => {
  const prompt = `Analyze the user's latest decision behavior against their current Mind Profile.
  
  DECISION: ${JSON.stringify(state.latestDecision)}
  CURRENT PROFILE: ${JSON.stringify(state.currentProfile)}
  
  Determine if their "Focus Level" or "Scarcity/Abundance Score" should shift.
  Focus Level shifts if they are committing to long-term actions.
  Scarcity shifts if they are acting out of fear (Scarcity) or opportunity (Abundance).
  
  Return a JSON update:
  {
    "focusShift": number (-5 to +5),
    "scarcityShift": number (-5 to +5),
    "newInsight": "one sentence observation about their growth"
  }`;

  const response = await llm.invoke([{ role: "user", content: prompt }]);
  try {
    return { updates: JSON.parse(response.content.replace(/```json|```/g, "")) };
  } catch (e) {
    return { updates: { focusShift: 0, scarcityShift: 0 } };
  }
};

const profileUpdateWorkflow = new StateGraph(ProfileState)
  .addNode("analyze", profileAnalystNode)
  .addEdge("__start__", "analyze")
  .addEdge("analyze", END);

export const profileGraph = profileUpdateWorkflow.compile();


// --- FAMILY COUNCIL MEDIATION GRAPH ---

const FamilyState = Annotation.Root({
  decisionTitle: Annotation({ reducer: (x, y) => y ?? x }),
  context: Annotation({ reducer: (x, y) => y ?? x }),
  opinions: Annotation({ reducer: (x, y) => y ?? x }),
  frictionPoints: Annotation({ reducer: (x, y) => y ?? x }),
  analysis: Annotation({ reducer: (x, y) => y ?? x }),
});

const crossExaminerNode = async (state) => {
  const prompt = `You are the MindOS Family Cross-Examiner. 
  Decision: ${state.decisionTitle}
  Opinions: ${JSON.stringify(state.opinions)}
  
  Identify hidden friction points. Where do people contradict each other? Who is using emotional blackmail? Who is hiding behind "seniority"?`;

  const response = await llm.invoke([{ role: "user", content: prompt }]);
  return { frictionPoints: response.content };
};

const mediatorNode = async (state) => {
  const prompt = `You are the MindOS Neutral Mediator. 
  Context: ${state.context}
  Friction Points: ${state.frictionPoints}
  Opinions: ${JSON.stringify(state.opinions)}
  
  Synthesize a neutral consensus. Strip the drama. Focus on objective family growth.
  
  Return JSON:
  {
    "detectedBiases": ["bias 1", "bias 2"],
    "consensusSummary": "short summary",
    "neutralSynthesis": "detailed breakdown",
    "recommendedPath": "actionable path",
    "logicBreakdown": ["point 1", "point 2"]
  }`;

  const response = await llm.invoke([
    { role: "system", content: "Return valid JSON ONLY." },
    { role: "user", content: prompt }
  ]);

  try {
    return { analysis: JSON.parse(response.content.replace(/```json|```/g, "")) };
  } catch (e) {
    return { analysis: { error: "Mediation failed to generate JSON" } };
  }
};

const familyWorkflow = new StateGraph(FamilyState)
  .addNode("examine", crossExaminerNode)
  .addNode("mediate", mediatorNode)
  .addEdge("__start__", "examine")
  .addEdge("examine", "mediate")
  .addEdge("mediate", END);

export const familyGraph = familyWorkflow.compile();


// --- TIME-TRAVELER PROJECTION GRAPH ---

const TimeTravelState = Annotation.Root({
  decision: Annotation({ reducer: (x, y) => y ?? x }),
  context: Annotation({ reducer: (x, y) => y ?? x }),
  projections: Annotation({ reducer: (x, y) => y ?? x }),
});

const projectionNode = async (state) => {
  const prompt = `You are the MindOS Chronos Agent. Project the ripple effects of this decision:
  DECISION: ${state.decision}
  CONTEXT: ${state.context}
  
  Predict the outcome across three horizons:
  1. The 1-Year Horizon (Immediate Ripple)
  2. The 5-Year Horizon (Compounding Identity Shift)
  3. The 10-Year Horizon (Legacy/Terminal Outcome)
  
  Return JSON:
  {
    "year1": { "title": "short title", "impact": "description", "risk": "low/med/high" },
    "year5": { "title": "short title", "impact": "description", "risk": "low/med/high" },
    "year10": { "title": "short title", "impact": "description", "risk": "low/med/high" },
    "compoundingFactor": "what one thing will grow the most?"
  }`;

  const response = await llm.invoke([
    { role: "system", content: "You are a master of second-order effects. Return valid JSON ONLY." },
    { role: "user", content: prompt }
  ]);
  
  try {
    return { projections: JSON.parse(response.content.replace(/```json|```/g, "")) };
  } catch (e) {
    return { projections: { error: "Failed to generate projection" } };
  }
};

const timeTravelWorkflow = new StateGraph(TimeTravelState)
  .addNode("project", projectionNode)
  .addEdge("__start__", "project")
  .addEdge("project", END);

export const timeTravelGraph = timeTravelWorkflow.compile();


export const mindGraph = workflow.compile();


