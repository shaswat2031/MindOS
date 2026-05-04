import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { User, Decision } from '@/lib/models';
import dbConnect from '@/lib/mongodb';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req) {
  try {
    const { decision, answers, persona, clarityBefore } = await req.json();
    const user = await currentUser();
    
    let profile = null;
    let history = [];

    if (user) {
      await dbConnect();
      profile = await User.findOne({ clerkId: user.id });
      
      if (profile) {
        const now = new Date();
        const lastReset = new Date(profile.lastUsageReset || profile.createdAt);
        if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
          profile.monthlyUsage = 0;
          profile.lastUsageReset = now;
        }

        if (profile.plan === 'Free' && profile.monthlyUsage >= 3) {
          return NextResponse.json({ 
            error: 'Limit Reached', 
            message: 'You have used your 3 free checks this month. Upgrade to keep going.' 
          }, { status: 403 });
        }
      }
      history = await Decision.find({ userId: user.id }).sort({ createdAt: -1 }).limit(5);
    }

    const userContext = profile ? `
    USER PROFILE CONTEXT:
    - Name: ${profile.name}
    - Gender: ${profile.gender}
    - Age: ${profile.age}
    - Occupation: ${profile.occupation}
    - Fitness Level: ${profile.fitnessLevel}
    - Daily Work Load: ${profile.workLoad}
    - Social Media Usage: ${profile.socialMediaTime}h/day
    ` : '';

    const systemPrompt = `You are a world-class AI Decision Coach. 
    ${userContext}
    
    YOUR MISSION:
    Apply "genius-level" decision logic but explain it in "common-man" relatable Indian English.
    Take the user's specific context (age, job, workload, fitness) into account. 
    For example, if they have a high social media drain, mention how it might be affecting their focus.
    If they are a student with high workload, adjust the advice for academic/career pressure.

    The user is asking: "${decision}"
    Diagnostic context: ${JSON.stringify(answers)}
    
    Provide your analysis in this strict JSON format:
    {
      "verdict": "A short, 2-3 word final answer in all caps.",
      "fearAnalysis": "A friendly paragraph about hidden fears.",
      "logicReasoning": "A simple, clear explanation of the smart way to think about this.",
      "successProbability": (A number 0-100 representing the likelihood of a positive outcome),
      "secondOrderEffects": "A brief explanation of what happens *after* this choice (the ripple effect).",
      "expertPerspective": "A short note on which author's wisdom fits best here (e.g., 'Using Naval's logic on leverage...')",
      "nextSteps": ["Action 1", "Action 2", "Action 3", "Action 4"],
      "qualityScore": (A number 1-100),
      "metaInsight": "One deep sentence about the user's thinking style."
    }`;

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: `Analyze this: ${decision}` }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content);

    let decisionId = null;

    if (user && profile) {
      profile.monthlyUsage = (profile.monthlyUsage || 0) + 1;
      profile.xp = (profile.xp || 0) + 50;
      await profile.save();

      const newDecision = await Decision.create({
        userId: user.id,
        question: decision,
        context: JSON.stringify(answers),
        analysis: result,
        persona: persona || 'Pragmatist',
        clarityBefore,
        status: 'resolved',
        outcomeStatus: 'awaiting'
      });
      decisionId = newDecision._id;
    }

    return NextResponse.json({ ...result, decisionId });
  } catch (error) {
    console.error('Analysis Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
