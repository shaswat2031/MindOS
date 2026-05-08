'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Sparkles, Shield, Rocket, Loader2, X } from 'lucide-react';
import { useMindStore } from '@/lib/store';
import { toast } from 'sonner';


const PLANS = [
  {
    name: 'Free',
    price: '₹0',
    duration: 'Forever free',
    features: [
      '3 reflections/month',
      'Basic insight analysis',
      'Decision journal',
      'Risk breakdown',
      'Clarity insights',
      'Standard mentor'
    ],
    cta: 'Current Plan',
    highlight: false,
    id: 'Free'
  },
  {
    name: 'Elite',
    price: '₹49',
    duration: 'per month',
    features: [
      'Unlimited reflections',
      'Full perspective breakdown',
      'Weekly clarity report',
      'Priority support',
      'Full history archival'
    ],
    cta: 'Upgrade to Elite',
    highlight: true,
    tag: 'Best Value',
    id: 'Elite'
  },
  {
    name: 'Growth',
    price: '₹99',
    duration: 'per month',
    features: [
      'Everything in Elite',
      '3 Unique AI Perspectives',
      'Complex impact analysis',
      'Success Indicators',
      'Early access features'
    ],
    cta: 'Go Growth',
    highlight: false,
    tag: 'Power Users',
    id: 'Growth'
  }
];


export default function Pricing({ isOpen, onClose, currentPlan = 'Free' }) {
  const { setUserProfile, userProfile } = useMindStore();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const currentPlanPrice = PLANS.find(p => p.id === userProfile?.plan)?.price?.replace('₹', '') || 0;


  const handleUpgrade = async (planId) => {
    if (planId === currentPlan) return;
    setLoadingPlan(planId);
    
    // Fake Payment Delay for premium feel
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const res = await fetch('/api/user/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, billingCycle: 'monthly' })
      });
      
      const data = await res.json();
      if (res.ok) {
        setUserProfile({ plan: data.plan });
        toast.success(`Upgraded to ${data.plan} tier`);
        onClose();
      } else {
        toast.error(data.error || 'Upgrade failed');
      }
    } catch (err) {
      console.error("Upgrade failed", err);
      toast.error('Connection failure during upgrade');
    } finally {
      setLoadingPlan(null);
    }
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-6xl bg-background border border-border rounded-none overflow-hidden shadow-2xl flex flex-col max-h-[95vh] md:max-h-[90vh]"
          >
            <div className="p-6 md:p-12 border-b border-border flex justify-between items-center bg-soft">
              <div>
                <h2 className="text-2xl md:text-4xl font-black text-foreground italic uppercase tracking-tighter font-heading">Choose Your <span className="text-primary">Clarity Tier</span></h2>
                <p className="text-foreground/40 font-bold uppercase tracking-widest text-[8px] md:text-[10px] mt-2">Scale your decision intelligence based on your ambition</p>
              </div>
              <button onClick={onClose} className="p-2 md:p-4 hover:bg-black/5 rounded-full transition-colors text-foreground/40 hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>


            <div className="p-6 md:p-12 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {PLANS.map((plan) => {
                  const targetPlanPrice = parseInt(plan.price.replace('₹', '')) || 0;
                  const isUpgrade = targetPlanPrice > currentPlanPrice;
                  
                  let proratedInfo = null;
                  if (isUpgrade && userProfile?.nextBillingDate) {
                    const now = new Date();
                    const nextBilling = new Date(userProfile.nextBillingDate);
                    const daysLeft = Math.max(0, Math.ceil((nextBilling - now) / (1000 * 60 * 60 * 24)));
                    const priceDiff = targetPlanPrice - currentPlanPrice;
                    const prorated = Math.ceil((priceDiff * daysLeft) / 30);
                    proratedInfo = { prorated, daysLeft };
                  }

                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`relative flex flex-col p-8 md:p-12 rounded-[3rem] border transition-all ${
                        plan.highlight 
                        ? 'bg-primary border-primary shadow-2xl shadow-primary/20 text-white scale-105 z-10' 
                        : 'bg-white border-border text-foreground hover:border-primary/30'
                      }`}
                    >
                      {plan.highlight && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-foreground text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                          <Sparkles className="w-3 h-3 text-primary" /> Recommended
                        </div>
                      )}

                      <div className="mb-10">
                        <h3 className={`text-xl font-black uppercase italic tracking-tight mb-2 font-heading ${plan.highlight ? 'text-white' : 'text-foreground'}`}>{plan.name}</h3>
                        <div className="flex items-baseline gap-2">
                          <span className={`text-5xl font-black tracking-tighter font-heading ${plan.highlight ? 'text-white' : 'text-foreground'}`}>
                            {plan.price}
                          </span>
                          <span className={`font-bold uppercase tracking-widest text-[10px] ${plan.highlight ? 'text-white/60' : 'text-foreground/40'}`}>
                            {plan.duration}
                          </span>
                        </div>
                      </div>

                      {/* Proration Info */}
                      {proratedInfo && (
                        <div className={`mb-6 p-4 rounded-xl border ${plan.highlight ? 'bg-white/10 border-white/20' : 'bg-soft border-border'}`}>
                          <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Prorated Upgrade</p>
                          <p className="text-sm font-bold tracking-tight">Pay only ₹{proratedInfo.prorated} today</p>
                          <p className="text-[7px] font-bold opacity-40 uppercase tracking-widest mt-1">for {proratedInfo.daysLeft} days remaining</p>
                        </div>
                      )}

                      <div className="space-y-4 mb-12 flex-1">
                        {plan.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.highlight ? 'bg-white/20' : 'bg-soft'}`}>
                              <Check className={`w-3 h-3 ${plan.highlight ? 'text-white' : 'text-primary'}`} />
                            </div>
                            <span className={`text-sm font-medium ${plan.highlight ? 'text-white/90' : 'text-foreground/70'}`}>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={currentPlan === plan.id || loadingPlan !== null || userProfile?.pendingDowngradeTo === plan.id}
                        className={`w-full py-5 font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 font-heading ${
                          currentPlan === plan.id 
                          ? 'bg-black/5 text-foreground/20 cursor-default' 
                          : plan.highlight
                            ? 'bg-white text-primary hover:bg-soft'
                            : 'bg-primary text-white hover:bg-primary/90'
                        }`}
                      >
                        {loadingPlan === plan.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          userProfile?.pendingDowngradeTo === plan.id 
                          ? 'Downgrade Scheduled' 
                          : currentPlan === 'Free' 
                            ? plan.cta 
                            : isUpgrade 
                              ? `Upgrade for Difference` 
                              : `Schedule Downgrade`
                        )}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="p-8 bg-soft border-t border-border text-center">
              <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">
                Trusted by 50,000+ ambitious minds. Secure SSL Encryption. 100% Data Privacy.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
