import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { CheckIn, User } from '@/lib/models';
import dbConnect from '@/lib/mongodb';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function GET(req) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    // Fetch user profile and recent check-ins for context
    const profile = await User.findOne({ clerkId: user.id });
    const recentLogs = await CheckIn.find({ userId: user.id }).sort({ createdAt: -1 }).limit(5);

    // AI generates 3 rotating questions based on weak areas
    const prompt = `
      User Profile: ${JSON.stringify(profile?.mindProfile)}
      Recent Logs: ${JSON.stringify(recentLogs)}

      Task: Generate 3 short, high-impact questions for today's morning mindset check-in.
      - Rotate them based on weak areas (e.g. if focus is low, ask about distractions).
      - Keep them "funky and serious".
      - Output as JSON array of strings.
    `;

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const { questions } = JSON.parse(completion.choices[0].message.content);

    // Check if evening reflection is needed (if morning check-in exists for today)
    const today = new Date();
    today.setHours(0,0,0,0);
    const morningLog = await CheckIn.findOne({ 
      userId: user.id, 
      createdAt: { $gte: today } 
    });

    return NextResponse.json({
      questions: questions || ["What is your primary focus?", "One thing you will ignore?", "Energy level check?"],
      type: morningLog ? 'evening' : 'morning',
      morningData: morningLog
    });
  } catch (error) {
    return NextResponse.json({ 
      questions: ["Primary goal today?", "Main distraction?", "Energy level?"],
      type: 'morning'
    });
  }
}
