import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import OpenAI from 'openai';
import dbConnect from '@/lib/mongodb';
import { User, Decision } from '@/lib/models';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req) {
  try {
    const { decision, persona } = await req.json();
    const user = await currentUser();
    
    let profile = null;

    if (user) {
      await dbConnect();
      profile = await User.findOne({ clerkId: user.id });

      if (profile) {
        if (profile.plan === 'Free' && (profile.monthlyUsage || 0) >= 3) {
          return NextResponse.json({ 
            error: 'Limit Reached', 
            message: 'You have used your 3 free checks this month. Upgrade to keep going.' 
          }, { status: 403 });
        }
      }
    }

    const systemPrompt = `You are a world-class AI Decision Coach. A user is facing a choice and you need to ask smart, deep questions to help them see the truth.
    
    DYNAMIC QUESTION COUNT:
    - If the decision is simple (e.g., what to eat, what movie to watch), ask 3 questions.
    - If it is medium (e.g., buying a phone, planning a trip), ask 4 questions.
    - If it is life-changing or complex (e.g., career change, marriage, big investment), ask 5-6 questions.
    - YOU decide the number of questions based on complexity.

    TONE & STYLE:
    - Use relatable Indian English (Hinglish-lite is okay).
    - Talk like a smart, direct mentor who knows the user's situation.
    - AVOID all technical jargon. 
    - Be simple, direct, and slightly challenging.

    Decision: "${decision}"
    Persona: ${persona || 'Realist'} (If persona is IndianMentor, be extra street-smart and use more Indian cultural metaphors).

    Provide your response in this strict JSON format:
    {
      "questions": [
        {
          "question": "A smart, provocative question in Indian English",
          "options": ["Relatable Choice 1", "Relatable Choice 2", "Relatable Choice 3", "Relatable Choice 4"]
        }
        ... (generate the appropriate number of questions)
      ]
    }
    
    IMPORTANT: The options MUST be specific to the question. Do not use generic words like 'Safe choice'. Each option should feel like something a person would actually say or think.`;

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: `Generate questions for: ${decision}` }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Question Generation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
