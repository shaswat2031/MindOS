import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.0-flash-001", // Or any other model
        "messages": [
          {
            "role": "system",
            "content": "You are MindOS Decision Coach. Your goal is to help users make better decisions by asking structured, values-aligned questions. Don't just give answers; guide them to find clarity. Use the user's past profile data (provided in context) to personalize responses."
          },
          ...messages
        ]
      })
    });

    const data = await response.json();
    return NextResponse.json(data.choices[0].message);
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch AI response' }, { status: 500 });
  }
}
