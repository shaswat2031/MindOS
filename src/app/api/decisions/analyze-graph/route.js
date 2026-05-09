import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { User, Decision } from '@/lib/models';
import dbConnect from '@/lib/mongodb';
import { mindGraph, profileGraph, timeTravelGraph } from '@/lib/langgraph';



export async function POST(req) {
  try {
    const { decision, answers, persona, clarityBefore } = await req.json();
    const user = await currentUser();
    
    let profile = null;

    if (user) {
      await dbConnect();
      profile = await User.findOne({ clerkId: user.id });
      
      if (profile) {
        if (profile.plan === 'Free' && (profile.monthlyUsage || 0) >= 3) {
          return NextResponse.json({ 
            error: 'Limit Reached', 
            message: 'You have used your 3 free checks this month. Upgrade to keep going.' 
          }, { status: 403 });
        }
      }
    }
    
    const contextString = JSON.stringify(answers);

    // Invoke LangGraph

    console.log("Starting LangGraph Reasoning Engine...");
    const result = await mindGraph.invoke({
      decision: decision,
      context: contextString,
      persona: persona || 'Pragmatist',
    });

    const finalData = result.finalAudit || result.initialAudit;

    // Direct mapping from LangGraph structured output
    let timeTravel = null;
    if (profile?.plan !== 'Free') {
       console.log("Generating Time-Travel Projections via LangGraph...");
       const ttResult = await timeTravelGraph.invoke({
          decision,
          context: contextString
       });
       timeTravel = ttResult.projections;
    }

    const formattedResult = {
      verdict: finalData.verdict,
      fearAnalysis: finalData.fearAnalysis,
      logicReasoning: finalData.logicReasoning,
      successProbability: finalData.successProbability || 85,
      secondOrderEffects: finalData.secondOrderEffects,
      expertPerspective: `Analyzed by the Council (Stoic, VC, Pragmatist). Reviewed by the Logic Critic.`,
      nextSteps: finalData.nextSteps,
      qualityScore: finalData.qualityScore || 90,
      metaInsight: finalData.metaInsight,
      timeTravel
    };



    let decisionId = null;

    if (user && profile) {
      // EVOLVE MIND PROFILE
      console.log("Evolving Mind Profile via LangGraph...");
      const profileResult = await profileGraph.invoke({
        currentProfile: profile.mindProfile,
        latestDecision: formattedResult
      });

      if (profileResult.updates) {
        const { focusShift, scarcityShift, newInsight } = profileResult.updates;
        profile.mindProfile = {
          ...profile.mindProfile,
          focusLevel: Math.min(100, Math.max(0, (profile.mindProfile?.focusLevel || 50) + (focusShift || 0))),
          scarcityAbundanceScore: Math.min(100, Math.max(0, (profile.mindProfile?.scarcityAbundanceScore || 50) + (scarcityShift || 0))),
          insights: [...(profile.mindProfile?.insights || []).slice(-4), newInsight]
        };
      }

      profile.monthlyUsage = (profile.monthlyUsage || 0) + 1;
      profile.xp = (profile.xp || 0) + 100;
      await profile.save();

      const newDecision = await Decision.create({
        userId: user.id,
        question: decision,
        context: contextString,
        analysis: formattedResult,
        persona: persona || 'Pragmatist',
        clarityBefore,
        status: 'resolved',
        outcomeStatus: 'awaiting'
      });
      decisionId = newDecision._id;
    }


    return NextResponse.json({ 
      ...formattedResult, 
      decisionId,
      updatedProfile: profile?.mindProfile 
    });

  } catch (error) {
    console.error('LangGraph Analysis Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
