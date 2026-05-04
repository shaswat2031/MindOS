import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { User } from '@/lib/models';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const profile = await User.findOne({ clerkId: user.id });

    if (!profile) {
      return NextResponse.json({ message: 'New user' });
    }

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await req.json();
    await dbConnect();

    const profile = await User.findOneAndUpdate(
      { clerkId: user.id },
      { 
        $set: {
          name: data.name,
          gender: data.gender,
          age: data.age,
          dob: data.dob,
          occupation: data.occupation,
          fitnessLevel: data.fitnessLevel,
          workLoad: data.workLoad,
          socialMediaTime: data.socialMediaTime,
          onboardingComplete: true
        }
      },
      { returnDocument: 'after', upsert: true }
    );

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
