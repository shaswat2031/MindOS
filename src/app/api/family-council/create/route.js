import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { FamilyCouncil } from '@/lib/models';
import dbConnect from '@/lib/mongodb';
import { nanoid } from 'nanoid';

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { decisionTitle, context } = await req.json();
    if (!decisionTitle) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    await dbConnect();

    const inviteCode = nanoid(6).toUpperCase();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    const audit = await FamilyCouncil.create({
      ownerId: userId,
      decisionTitle,
      context,
      inviteCode,
      expiresAt,
      status: 'open',
      opinions: []
    });

    return NextResponse.json(audit);
  } catch (error) {
    console.error('Error creating family council:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
