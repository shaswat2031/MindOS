import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { User } from '@/lib/models';
import dbConnect from '@/lib/mongodb';

export async function GET(request) {
  console.log('GET /api/user/profile hit');
  try {
    console.time('auth');
    const { userId } = await auth();
    console.timeEnd('auth');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.time('dbConnect');
    await dbConnect();
    console.timeEnd('dbConnect');

    console.time('dbQuery');
    const profile = await User.findOne({ clerkId: userId });
    
    if (profile) {
      // Process pending downgrades if cycle ended
      const now = new Date();
      if (profile.pendingDowngradeTo && profile.nextBillingDate && now > profile.nextBillingDate) {
        console.log(`Processing scheduled downgrade for user ${userId} to ${profile.pendingDowngradeTo}`);
        profile.plan = profile.pendingDowngradeTo;
        profile.pendingDowngradeTo = null;
        profile.subscriptionStartedAt = now;
        profile.nextBillingDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        await profile.save();
      }

      // Safety check: Ensure nextBillingDate exists for older users
      if (!profile.nextBillingDate) {
        profile.nextBillingDate = new Date(profile.createdAt || Date.now());
        profile.nextBillingDate.setDate(profile.nextBillingDate.getDate() + 30);
        await profile.save();
      }

      return NextResponse.json(profile);
    }


    return NextResponse.json({ message: 'New user' });

  } catch (error) {
    console.error('Profile API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    console.time('post_auth');
    const { userId } = await auth();
    console.timeEnd('post_auth');

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const data = await req.json();

    console.time('post_dbConnect');
    await dbConnect();
    console.timeEnd('post_dbConnect');

    console.time('post_dbUpdate');
    const profile = await User.findOneAndUpdate(
      { clerkId: userId },
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
    console.timeEnd('post_dbUpdate');

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Profile POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
