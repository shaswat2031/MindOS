import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { CheckIn, Habit, Decision } from '@/lib/models';
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

    // Fetch all relevant data for pattern analysis
    const [checkIns, habits, decisions] = await Promise.all([
      CheckIn.find({ userId: user.id }).sort({ createdAt: -1 }).limit(10),
      Habit.find({ userId: user.id }),
      Decision.find({ userId: user.id }).sort({ createdAt: -1 }).limit(5)
    ]);

    const context = {
      recentCheckIns: checkIns.map(c => ({ energy: c.energy, mood: c.mood, focus: c.focus, date: c.createdAt })),
      habits: habits.map(h => ({ name: h.name, streak: h.streak, history: h.history.slice(-5) })),
      recentDecisions: decisions.map(d => ({ question: d.question, verdict: d.analysis.verdict }))
    };

    const prompt = `
      Analyze this user's data for MindOS to identify recurring psychological patterns, limiting beliefs, or productivity bottlenecks.
      Data: ${JSON.stringify(context)}

      Output a JSON object with:
      1. limitingBeliefs: [{ title: string, count: number, trend: 'UP' | 'DOWN' | 'STABLE', status: 'critical' | 'normal' }]
      2. topBottleneck: string
      3. insight: string (A deep, data-backed insight)
      4. suggestedFix: string

      Output ONLY JSON.
    `;

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const patterns = JSON.parse(completion.choices[0].message.content);

    return NextResponse.json(patterns);
  } catch (error) {
    console.error('Pattern Analysis Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
