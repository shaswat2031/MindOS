import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { User } from '@/lib/models';
import dbConnect from '@/lib/mongodb';

export async function POST(req) {
  try {
    const { plan, billingCycle } = await req.json();
    const user = await currentUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: user.id },
      { 
        plan: plan,
        planType: billingCycle === 'yearly' ? 'yearly' : 'monthly'
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, plan: updatedUser.plan });
  } catch (error) {
    console.error('Upgrade Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
