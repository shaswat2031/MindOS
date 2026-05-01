import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { CheckIn, User } from '@/lib/models';
import dbConnect from '@/lib/mongodb';

export async function POST(req) {
  try {
    const { energy, focus, mood, intentions } = await req.json();
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    
    const newCheckIn = await CheckIn.create({
      userId: user.id,
      energy,
      focus,
      mood,
      intentions
    });

    // Update user streak and last check-in
    await User.findOneAndUpdate(
      { clerkId: user.id },
      { 
        lastCheckIn: new Date(),
        $inc: { xp: 20 }
      }
    );

    return NextResponse.json(newCheckIn);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const checkIns = await CheckIn.find({ userId: user.id }).sort({ createdAt: -1 }).limit(7);

    return NextResponse.json(checkIns);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
