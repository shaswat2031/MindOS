import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { FamilyCouncil } from '@/lib/models';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    const audits = await FamilyCouncil.find({ ownerId: userId }).sort({ createdAt: -1 });

    return NextResponse.json(audits);
  } catch (error) {
    console.error('Error listing family councils:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
