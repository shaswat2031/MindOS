import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { FamilyCouncil } from '@/lib/models';
import dbConnect from '@/lib/mongodb';
import { familyGraph } from '@/lib/langgraph';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    
    await dbConnect();
    const audit = await FamilyCouncil.findById(id);

    if (!audit) return NextResponse.json({ error: 'Audit not found' }, { status: 404 });

    const now = new Date();
    const isExpired = now > audit.expiresAt;

    // If expired and no analysis, trigger de-biasing logic
    if (isExpired && audit.status === 'open') {
      audit.status = 'closed';
      
      if (audit.opinions.length > 0) {
        console.log("Starting Family Council Mediation via LangGraph...");
        const result = await familyGraph.invoke({
          decisionTitle: audit.decisionTitle,
          context: audit.context,
          opinions: audit.opinions
        });
        audit.analysis = result.analysis;
      } else {
        audit.analysis = { message: "No opinions were collected in the 24-hour window." };
      }
      
      await audit.save();
    }

    return NextResponse.json(audit);
  } catch (error) {
    console.error('Error fetching family council:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const audit = await FamilyCouncil.findById(id);

    if (!audit) return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
    if (audit.ownerId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // Manually trigger de-biasing logic
    if (audit.opinions.length > 0) {
      console.log("Starting Manual Family Council Mediation via LangGraph...");
      const result = await familyGraph.invoke({
        decisionTitle: audit.decisionTitle,
        context: audit.context,
        opinions: audit.opinions
      });
      
      audit.analysis = result.analysis;
      audit.status = 'closed';
      await audit.save();
    } else {
      return NextResponse.json({ error: 'No opinions to analyze yet' }, { status: 400 });
    }

    return NextResponse.json(audit);
  } catch (error) {
    console.error('Error generating manual analysis:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

