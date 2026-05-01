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
    const { messages, step, userProfile } = await req.json();
    const user = await currentUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const chatHistory = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
    
    let prompt = "";
    let nextStep = step + 1;

    if (step === 0) {
      prompt = `
        User wants help with a decision. 
        Context from User Profile: ${JSON.stringify(userProfile?.mindProfile)}
        History: ${chatHistory}
        
        Task: Ask the FIRST layered question to clarify the decision. 
        Focus on 'Context & Variables'. 
        Tone: Serious, technical, high-end coach.
        Output: Just the question.
      `;
    } else if (step < 5) {
      const focusAreas = [
        "Variables & Context",
        "Values Alignment (How does this fit your 5-year goal?)",
        "Fear vs Logic (Are you avoiding pain or seeking growth?)",
        "Opportunity Cost (What do you lose if you say YES?)",
        "Worst Case Scenario (Can you survive the failure?)"
      ];
      
      prompt = `
        User is in a decision analysis flow.
        Step: ${step} of 5.
        Current Focus Area: ${focusAreas[step]}
        Context from User Profile: ${JSON.stringify(userProfile?.mindProfile)}
        History: ${chatHistory}
        
        Task: Ask the NEXT layered question based on the history and the current focus area.
        Don't repeat previous questions. Dig deeper.
        Output: Just the question.
      `;
    } else {
      prompt = `
        User has answered 5 layered questions.
        Context from User Profile: ${JSON.stringify(userProfile?.mindProfile)}
        History: ${chatHistory}
        
        Task: Generate a FINAL CLARITY STATEMENT.
        Structure:
        1. SUMMARY: What is actually happening here.
        2. FEAR VS LOGIC: Is the user's hesitation based on fear or valid logic?
        3. VALUES FIT: Does this match their primary goal from onboarding?
        4. VERDICT: High-impact, opinionated advice on what to do next.
        
        Tone: Very serious, technical, yet empowering.
        Output: The full statement.
      `;
      nextStep = 6; // Finished
    }

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "user", content: prompt }],
    });

    const aiResponse = completion.choices[0].message.content;

    // If finished, save to DB
    if (nextStep === 6) {
      await dbConnect();
      await Decision.create({
        userId: user.id,
        question: messages[1]?.content || "Unknown Decision",
        context: chatHistory,
        analysis: { verdict: aiResponse },
        status: 'resolved'
      });
    }

    return NextResponse.json({ 
      content: aiResponse,
      nextStep 
    });

  } catch (error) {
    console.error('Decision Chat Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
