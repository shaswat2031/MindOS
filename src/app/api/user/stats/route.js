import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import { Decision } from '@/lib/models';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    
    const decisions = await Decision.find({ userId });
    
    const totalAudited = decisions.length;
    const scores = decisions
      .map(d => d.analysis?.qualityScore)
      .filter(s => s !== undefined && s !== null);
      
    const averageLogicScore = scores.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
      : 0;

    return NextResponse.json({
      totalAudited,
      averageLogicScore,
      memberSince: '2026'
    });
  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
