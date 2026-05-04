import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req) {
  try {
    const { decision } = await req.json();
    const user = await currentUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const systemPrompt = `You are a futuristic Scenario Simulator. Your job is to generate a 3D decision roadmap based on a user's choice.
    
    Decision: "${decision}"
    
    Generate 3 distinct paths for the next 1-2 years:
    1. "The High Growth Path" (High risk, high reward)
    2. "The Stable Path" (Low risk, steady progress)
    3. "The Pivot Path" (Unexpected turn, adaptation required)
    
    For each path, provide exactly 4 milestones. Each milestone must have:
    - label: A short name
    - description: One sentence of what happens
    - probability: 0-100
    - timing: In months (e.g., 3, 6, 12, 24)
    - x, y, z coordinates: For 3D placement (Path 1: x= -20, Path 2: x=0, Path 3: x=20. Y increases with time. Z should vary slightly for "depth")
    
    Provide your response in this strict JSON format:
    {
      "paths": [
        {
          "name": "Path Name",
          "color": "A hex color (Premium: #6366f1, #10b981, #f59e0b)",
          "milestones": [
            { "label": "", "description": "", "probability": 0, "months": 0, "position": [x, y, z] }
          ]
        }
      ]
    }`;

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: `Simulate the future for: ${decision}` }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Simulation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
