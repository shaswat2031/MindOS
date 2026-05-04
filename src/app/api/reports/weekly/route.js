import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';
import { Decision, User, WeeklyReport } from '@/lib/models';
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
    const profile = await User.findOne({ clerkId: user.id });

    // Feature Lock: Weekly Report is for Core/Growth
    if (!profile || profile.plan === 'Free') {
      return NextResponse.json({
        error: 'Feature Locked',
        message: 'Weekly Pattern Reports require a Core or Growth subscription.'
      }, { status: 403 });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Calculate Week Identifier (YYYY-WW)
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNum = Math.ceil((((now - startOfYear) / 86400000) + startOfYear.getDay() + 1) / 7);
    const weekIdentifier = `${now.getFullYear()}-${weekNum}`;

    // 1. Check for existing cached report
    const existingReport = await mongoose.models.WeeklyReport.findOne({ 
      userId: user.id, 
      weekIdentifier 
    });

    if (existingReport) {
      return NextResponse.json(existingReport.reportData);
    }

    // 2. No report found? Check for minimum data to generate one
    const weeklyDecisions = await Decision.find({
      userId: user.id,
      createdAt: { $gte: sevenDaysAgo }
    });

    if (weeklyDecisions.length < 3) {
      return NextResponse.json({ 
        error: 'Insufficient Data',
        message: 'You need at least 3 decisions in your history to generate a Weekly Review. Keep going!' 
      }, { status: 400 });
    }

    const systemPrompt = `You are a world-class AI Decision Coach. Your task is to analyze a user's choices from the past week and find patterns in how they think.
    
    TONE & STYLE:
    - Use clear, relatable Indian English.
    - Talk like a smart, grounded mentor.
    - Use "Author Logic" (Naval, Taleb, Dalio) but explain it simply.
    
    DATA TO ANALYZE (A record of their choices this week):
    ${JSON.stringify(weeklyDecisions.map(d => ({ q: d.question, v: d.analysis.verdict, r: d.analysis.logicReasoning })))}

    Provide your weekly review in this strict JSON format:
    {
      "dominantBias": "A friendly name for their thinking style this week",
      "logicScore": (A number 1-100 reflecting their overall clarity),
      "growthMetric": "A simple phrase about how they are doing",
      "metaInsight": "A simple, deep observation about their mindset",
      "detailedSummary": "A deep 3-4 paragraph analysis in Indian English. Explain exactly what the history shows about their choices. Paragraph 1: Summary of their week. Paragraph 2: Where the history shows they are lagging. Paragraph 3: How to fix these specific historical mistakes. Paragraph 4: Final motivational advice.",
      "actionPlan": ["Specific practical step based on history 1", "Specific practical step based on history 2", "Specific practical step based on history 3"]
    }`;

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: "Analyze my week and return valid JSON only. Do not use unescaped double quotes inside the summary strings." }],
      response_format: { type: "json_object" }
    });

    if (!completion.choices?.[0]?.message?.content) {
      throw new Error("AI Meta-Analysis failed.");
    }

    let rawContent = completion.choices[0].message.content;
    // Basic cleanup for potential AI syntax glitches
    rawContent = rawContent.replace(/[\u0000-\u001F\u007F-\u009F]/g, ""); // Remove control characters
    
    try {
      const finalReport = JSON.parse(rawContent);
      
      // Save for caching
      await WeeklyReport.create({
        userId: user.id,
        weekIdentifier,
        reportData: finalReport
      });

      return NextResponse.json(finalReport);
    } catch (parseError) {
      console.error("Initial JSON parse failed, trying cleanup...", parseError);
      return NextResponse.json(JSON.parse(rawContent)); // Fallback parse
    }
  } catch (error) {
    console.error('Weekly Report Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
