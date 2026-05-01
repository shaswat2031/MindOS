import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { Decision } from '@/lib/models';
import dbConnect from '@/lib/mongodb';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req) {
  try {
    const { question, context } = await req.json();
    const user = await currentUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    // AI Decision Analysis
    const prompt = `
      You are the MindOS Decision Engine. Help the user with this decision:
      Question: ${question}
      Context: ${context}

      Output a structured analysis in JSON:
      1. frameworkUsed (e.g. "Regret Minimization", "Values Alignment")
      2. keyInsights [string]
      3. verdict (A strong, opinionated suggestion)
      4. risks [string]

      Output ONLY JSON.
    `;

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(completion.choices[0].message.content);

    const newDecision = await Decision.create({
      userId: user.id,
      question,
      context,
      analysis
    });

    return NextResponse.json(newDecision);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const decisions = await Decision.find({ userId: user.id }).sort({ createdAt: -1 });

    return NextResponse.json(decisions);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
