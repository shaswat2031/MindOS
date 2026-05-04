import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import OpenAI from 'openai';
import dbConnect from '@/lib/mongodb';
import { User } from '@/lib/models';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req) {
  try {
    const { decision } = await req.json();
    const user = await currentUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const profile = await User.findOne({ clerkId: user.id });

    const userContext = profile ? `
    USER BIOMETRIC & CONTEXTUAL DATA:
    - Age/Gender: ${profile.age} / ${profile.gender}
    - Role: ${profile.occupation}
    - Cognitive Load (Burnout Risk): ${profile.workLoad}
    - Physical Energy (Fitness): ${profile.fitnessLevel}
    - Digital Drain (Social Media): ${profile.socialMediaTime} hours/day
    ` : '';

    const systemPrompt = `You are a futuristic Scenario Simulator for MindOS. 
    ${userContext}
    
    CRITICAL PERSONALIZATION RULES:
    1. FACTOR IN BIOLOGY: Adjust "Success Probabilities" based on Age and Fitness Level.
    2. FACTOR IN HABITS: If Digital Drain is high, add specific focus/distraction milestones.
    3. FACTOR IN CAPACITY: If Cognitive Load is high, the Alpha path must account for short-term fatigue before long-term growth.
    
    Generate 3 distinct parallel future trees based on the user's profile and choice:
    1. "Commitment Alpha" (Full Action) - Path of maximum personal ROI and alignment.
    2. "Stagnation Beta" (Hesitation) - Path of missed leverage and neutral stagnation.
    3. "Regret Gamma" (Ignored Logic) - Path of critical failure and resource drain.
    
    For each path, provide exactly 4 milestones with probabilities and timing (months).
    
    Decide which path is objectively BEST for the user's long-term growth and explain WHY in one short sentence.
    
    Provide your response in this strict JSON format:
    {
      "recommendation": {
        "path": "Alpha | Beta | Gamma",
        "reason": "One sentence explanation of why this path is mathematically superior."
      },
      "paths": [
        {
          "name": "Path Name",
          "color": "Hex color (#6366f1 for Alpha, #94a3b8 for Beta, #ef4444 for Gamma)",
          "milestones": [
            { "label": "", "description": "", "probability": 0, "months": 0 }
          ]
        }
      ]
    }`;

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        { role: "system", content: systemPrompt }, 
        { role: "user", content: `Simulate the future for this specific user based on their context: ${decision}` }
      ],
      response_format: { type: "json_object" }
    });

    let content = completion.choices[0].message.content;
    content = content.replace(/```json\n?|```/g, '').trim();
    
    const result = JSON.parse(content);
    console.log("SIMULATION_AI_RESULT_SUCCESSFUL_PERSONALIZED_DYNAMIC");
    return NextResponse.json(result);
  } catch (error) {
    console.error('SIMULATION_CRITICAL_ERROR:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
