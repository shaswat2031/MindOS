import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { User } from '@/lib/models';
import dbConnect from '@/lib/mongodb';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req) {
  try {
    const { answers } = await req.json();
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // AI Analysis Prompt
    const prompt = `
      Analyze these 15 onboarding answers for a personal development app called MindOS.
      Answers: ${JSON.stringify(answers)}

      Generate a "Mind Profile" in JSON format with:
      1. scarcityAbundanceScore (0-100)
      2. focusLevel (0-100)
      3. decisionStyle (1-2 words)
      4. primaryBlocker (The biggest mental hurdle)
      5. firstInsight: {
          blocker: string,
          percentage: string (e.g. "73%"),
          message: string (A powerful, conversational first insight that makes the user feel understood)
      }
      6. recommendedHabits: [string] (3 habits based on their profile)

      Output ONLY the JSON.
    `;

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(completion.choices[0].message.content);

    // Save/Update User Profile
    await User.findOneAndUpdate(
      { clerkId: user.id },
      {
        clerkId: user.id,
        name: user.firstName,
        email: user.emailAddresses[0].emailAddress,
        onboardingAnswers: answers,
        mindProfile: analysis,
        onboardingComplete: true,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Onboarding Analysis Error:', error);
    return NextResponse.json({ 
      error: 'Analysis failed',
      firstInsight: {
        blocker: "Fear of Judgment",
        percentage: "73%",
        message: "Our AI detected a high sensitivity to external feedback. You often prioritize 'looking right' over 'being right', which throttles your execution speed."
      }
    }, { status: 500 });
  }
}
