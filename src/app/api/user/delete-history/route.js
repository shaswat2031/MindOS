import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import { Decision } from '@/lib/models';

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    
    const result = await Decision.deleteMany({ userId });

    return NextResponse.json({ 
      success: true, 
      message: `${result.deletedCount} neural logs permanently wiped.` 
    });
  } catch (error) {
    console.error('Delete History API Error:', error);
    return NextResponse.json({ error: 'Failed to wipe history' }, { status: 500 });
  }
}
