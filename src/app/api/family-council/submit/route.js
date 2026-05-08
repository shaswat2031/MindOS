import { NextResponse } from 'next/server';
import { FamilyCouncil } from '@/lib/models';
import dbConnect from '@/lib/mongodb';

export async function POST(req) {
  try {
    const { inviteCode, relation, opinion } = await req.json();

    if (!inviteCode || !relation || !opinion) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    const audit = await FamilyCouncil.findOne({ inviteCode, status: 'open' });

    if (!audit) {
      return NextResponse.json({ error: 'Audit not found or closed' }, { status: 404 });
    }

    if (new Date() > audit.expiresAt) {
      audit.status = 'closed';
      await audit.save();
      return NextResponse.json({ error: 'This audit has expired' }, { status: 403 });
    }

    audit.opinions.push({
      relation,
      opinion,
      submittedAt: new Date()
    });

    await audit.save();

    return NextResponse.json({ message: 'Opinion submitted successfully' });
  } catch (error) {
    console.error('Error submitting opinion:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
