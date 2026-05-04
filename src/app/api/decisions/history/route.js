import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import { Decision } from '@/lib/models';

export async function GET(req) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const decisions = await Decision.find({ userId: user.id }).sort({ createdAt: -1 });

    return NextResponse.json(decisions);
  } catch (error) {
    console.error('History Fetch Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
