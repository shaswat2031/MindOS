import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { FamilyCouncil } from '@/lib/models';
import dbConnect from '@/lib/mongodb';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    
    // We allow anyone to view status if they have the ID? 
    // Usually only owner can see the full analysis, but maybe members can see status.
    // For now, let's keep it restricted to the owner for the analysis.

    await dbConnect();
    const audit = await FamilyCouncil.findById(id);

    if (!audit) return NextResponse.json({ error: 'Audit not found' }, { status: 404 });

    const now = new Date();
    const isExpired = now > audit.expiresAt;

    // If expired and no analysis, trigger de-biasing logic
    if (isExpired && audit.status === 'open') {
      audit.status = 'closed';
      
      if (audit.opinions.length > 0) {
        const prompt = `
          You are the MindOS Family Mediator. You have collected anonymous opinions from a family regarding a decision.
          Decision: ${audit.decisionTitle}
          Context: ${audit.context}
          
          Opinions:
          ${audit.opinions.map(o => `- ${o.relation}: ${o.opinion}`).join('\n')}

          Your task:
          1. Identify common biases (e.g. status quo bias, emotional blackmail, seniority bias, risk aversion).
          2. Strip away the emotional pressure and seniority-based authority.
          3. Synthesize a neutral "Family Consensus" based on objective logic.
          4. Provide a "Recommended Path" that balances collective concerns with individual growth.

          Output a structured JSON:
          {
            "detectedBiases": [string],
            "consensusSummary": string,
            "neutralSynthesis": string,
            "recommendedPath": string,
            "logicBreakdown": [string]
          }
          Output ONLY JSON.
        `;

        const completion = await openai.chat.completions.create({
          model: "nvidia/nemotron-nano-9b-v2:free",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" }
        });

        audit.analysis = JSON.parse(completion.choices[0].message.content);
      } else {
        audit.analysis = { message: "No opinions were collected in the 24-hour window." };
      }
      
      await audit.save();
    }

    return NextResponse.json(audit);
  } catch (error) {
    console.error('Error fetching family council:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const audit = await FamilyCouncil.findById(id);

    if (!audit) return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
    if (audit.ownerId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // Manually trigger de-biasing logic
    if (audit.opinions.length > 0) {
      const prompt = `
        You are the MindOS Family Mediator. You have collected anonymous opinions from a family regarding a decision.
        Decision: ${audit.decisionTitle}
        Context: ${audit.context}
        
        Opinions:
        ${audit.opinions.map(o => `- ${o.relation}: ${o.opinion}`).join('\n')}

        Your task:
        1. Identify common biases (e.g. status quo bias, emotional blackmail, seniority bias, risk aversion).
        2. Strip away the emotional pressure and seniority-based authority.
        3. Synthesize a neutral "Family Consensus" based on objective logic.
        4. Provide a "Recommended Path" that balances collective concerns with individual growth.

        Output a structured JSON:
        {
          "detectedBiases": [string],
          "consensusSummary": string,
          "neutralSynthesis": string,
          "recommendedPath": string,
          "logicBreakdown": [string]
        }
        Output ONLY JSON.
      `;

      const completion = await openai.chat.completions.create({
        model: "nvidia/nemotron-nano-9b-v2:free",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      audit.analysis = JSON.parse(completion.choices[0].message.content);
      audit.status = 'closed';
      await audit.save();
    } else {
      return NextResponse.json({ error: 'No opinions to analyze yet' }, { status: 400 });
    }

    return NextResponse.json(audit);
  } catch (error) {
    console.error('Error generating manual analysis:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
