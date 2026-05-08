import { NextResponse } from 'next/server';
import { FamilyCouncil } from '@/lib/models';
import dbConnect from '@/lib/mongodb';

export async function GET(req, { params }) {
  try {
    const { code } = await params;
    await dbConnect();

    const audit = await FamilyCouncil.findOne({ inviteCode: code, status: 'open' }).select('decisionTitle context expiresAt');

    if (!audit) {
      return NextResponse.json({ error: 'Audit not found or closed' }, { status: 404 });
    }

    if (new Date() > audit.expiresAt) {
      audit.status = 'closed';
      await audit.save();
      return NextResponse.json({ error: 'This audit has expired' }, { status: 403 });
    }

    return NextResponse.json(audit);
  } catch (error) {
    console.error('Error fetching public audit:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
