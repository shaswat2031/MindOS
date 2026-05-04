import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { Decision } from '@/lib/models';
import dbConnect from '@/lib/mongodb';

export async function POST(req) {
  try {
    const { decisionId, deadlineDays } = await req.json();
    const user = await currentUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + parseInt(deadlineDays));

    const updatedDecision = await Decision.findOneAndUpdate(
      { _id: decisionId, userId: user.id },
      { 
        executionDeadline: deadlineDate,
        outcomeStatus: 'awaiting'
      },
      { new: true }
    );

    if (!updatedDecision) {
      return NextResponse.json({ error: 'Decision not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, deadline: deadlineDate });
  } catch (error) {
    console.error('Commit Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
