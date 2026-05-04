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

    // FETCH_PROFILE log removed for cleaner output

    if (!profile) {
      return NextResponse.json({ message: 'New user' });
    }

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
