import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { DailyCheckIn, User } from '@/lib/models';
import dbConnect from '@/lib/mongodb';

export async function POST(req) {
  try {
    const { question, answer } = await req.json();
    const user = await currentUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    // Check if already checked in today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const existingCheckIn = await DailyCheckIn.findOne({
      userId: user.id,
      createdAt: { $gte: startOfDay }
    });

    if (existingCheckIn) {
      return NextResponse.json({ message: 'Already checked in today' });
    }

    const checkIn = await DailyCheckIn.create({
      userId: user.id,
      question,
      answer
    });

    // Award XP and increment streak
    await User.findOneAndUpdate(
      { clerkId: user.id },
      { 
        $inc: { xp: 20 },
        $set: { lastCheckIn: new Date() }
      }
    );

    return NextResponse.json({ success: true, checkIn });
  } catch (error) {
    console.error('Daily Check-in Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
