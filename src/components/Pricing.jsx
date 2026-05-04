'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Sparkles, Shield, Rocket, Loader2, X } from 'lucide-react';

const PLANS = [
  {
    name: 'Free',
    price: '₹0',
    duration: 'Forever free',
    features: [
      '3 decisions/month',
      'Basic regret analysis',
      'Risk breakdown',
      'Decision memory',
      'Pattern insights',
      'AI mentor'
    ],
    cta: 'Current Plan',
    highlight: false,
    id: 'Free'
  },
  {
    name: 'Core',
    price: '₹99',
    duration: 'per month',
    features: [
      'Unlimited decisions',
      'Full decision framework',
      'Weekly pattern report',
      'Priority support',
      'Full history backup'
    ],
    cta: 'Upgrade to Core',
    highlight: true,
    tag: 'Best Value',
    id: 'Core'
  },
  {
    name: 'Growth',
    price: '₹249',
    duration: 'per month',
    features: [
      'Everything in Core',
      'AI mentor (3 personas)',
      'Deep pattern insights',
      'Decision quality score',
      'Early access to features'
    ],
    cta: 'Go Growth',
    highlight: false,
    tag: 'Power Users',
    id: 'Growth'
  }
];

export default function Pricing({ isOpen, onClose, currentPlan = 'Free' }) {
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handleUpgrade = async (planId) => {
    if (planId === currentPlan) return;
    setLoadingPlan(planId);
    
    // Fake Payment Delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const res = await fetch('/api/user/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, billingCycle: 'monthly' })
      });
      
      if (res.ok) {
        window.location.reload(); // Refresh to update store and UI
      }
    } catch (err) {
      console.error("Upgrade failed", err);
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {PLANS.map((plan) => (
                  <div 
                    key={plan.name}
                    className={`relative p-8 md:p-10 border transition-all flex flex-col h-full ${
                      plan.highlight 
                      ? 'bg-primary text-white border-primary shadow-2xl lg:scale-105 z-10' 
                      : 'bg-white border-border hover:border-primary'
                    }`}
                  >

                    {plan.tag && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-2 rounded-none font-black uppercase tracking-widest text-[8px] shadow-xl">
                        {plan.tag}
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
                      disabled={currentPlan === plan.id || loadingPlan !== null}
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
                        plan.cta
                      )}
                    </button>
                  </div>
                ))}
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
