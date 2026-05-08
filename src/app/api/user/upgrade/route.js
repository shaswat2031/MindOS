import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { User } from '@/lib/models';
import dbConnect from '@/lib/mongodb';

const PLAN_PRICES = {
  'Free': 0,
  'Elite': 49,
  'Growth': 99
};

export async function POST(req) {
  try {
    const { plan, billingCycle } = await req.json();
    const user = await currentUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    const dbUser = await User.findOne({ clerkId: user.id });
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const currentPlan = dbUser.plan || 'Free';
    const currentPrice = PLAN_PRICES[currentPlan] || 0;
    const targetPrice = PLAN_PRICES[plan] || 0;

    // Upgrade vs Downgrade Logic
    if (targetPrice > currentPrice) {
      // IMMEDIATE UPGRADE with proration
      const now = new Date();
      const nextBilling = dbUser.nextBillingDate || new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const totalDaysInMonth = 30;
      const msLeft = nextBilling.getTime() - now.getTime();
      const daysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
      
      const priceDiff = targetPrice - currentPrice;
      const upgradeAmount = Math.ceil((priceDiff * daysLeft) / totalDaysInMonth);
      
      dbUser.plan = plan;
      dbUser.pendingDowngradeTo = null; // Clear any pending downgrades if they upgrade again
      
      if (currentPlan === 'Free') {
        dbUser.subscriptionStartedAt = new Date();
        dbUser.nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      }

      await dbUser.save();

      return NextResponse.json({ 
        success: true, 
        plan: dbUser.plan,
        amountCharged: upgradeAmount,
        message: upgradeAmount > 0 
          ? `Charged ₹${upgradeAmount} for the remaining ${daysLeft} days of your cycle.` 
          : 'Plan upgraded successfully'
      });

    } else if (targetPrice < currentPrice) {
      // SCHEDULED DOWNGRADE
      dbUser.pendingDowngradeTo = plan;
      
      // Ensure nextBillingDate exists
      if (!dbUser.nextBillingDate) {
        dbUser.nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      }
      
      await dbUser.save();

      return NextResponse.json({ 
        success: true, 
        plan: dbUser.plan, // Still the old plan
        pendingDowngradeTo: plan,
        message: `Downgrade to ${plan} scheduled for ${new Date(dbUser.nextBillingDate).toLocaleDateString()}. Your current benefits remain active until then.`
      });
    }


    return NextResponse.json({ message: 'No change detected' });

  } catch (error) {
    console.error('Upgrade Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

