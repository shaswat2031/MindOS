import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { Decision, User } from '@/lib/models';
import dbConnect from '@/lib/mongodb';

export async function POST(req) {
  try {
    const { decisionId, status, notes } = await req.json();
    const user = await currentUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    const updatedDecision = await Decision.findOneAndUpdate(
      { _id: decisionId, userId: user.id },
      { 
        outcomeStatus: status,
        outcomeNotes: notes,
        status: 'resolved'
      },
      { new: true }
    );

    if (!updatedDecision) {
      return NextResponse.json({ error: 'Decision not found' }, { status: 404 });
    }

    // Award XP for executing a decision
    if (status === 'executed') {
      await User.findOneAndUpdate(
        { clerkId: user.id },
        { $inc: { xp: 50 } }
      );
    }

    return NextResponse.json({ success: true, status, xpAwarded: status === 'executed' ? 50 : 0 });
  } catch (error) {
    console.error('Outcome Update Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
