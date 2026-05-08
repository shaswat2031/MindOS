'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Receipt, 
  ShieldCheck, 
  Zap, 
  ArrowUpRight, 
  Clock, 
  Banknote, 
  Landmark,
  ArrowRight,
  Info
} from 'lucide-react';
import { useMindStore } from '@/lib/store';
import Pricing from './Pricing';

const TransactionItem = ({ title, date, amount, status }) => (
  <div className="flex items-center justify-between py-6 border-b border-border last:border-0 hover:bg-soft/30 px-4 transition-colors rounded-xl group">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-soft flex items-center justify-center text-foreground/40 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
        <Receipt className="w-5 h-5" />
      </div>
      <div>
        <p className="text-sm font-bold uppercase tracking-wider">{title}</p>
        <p className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">{date}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-black tracking-tight">₹{amount}</p>
      <div className="flex items-center gap-2 justify-end">
        <div className={`w-1 h-1 rounded-full ${status === 'Paid' ? 'bg-green-500' : 'bg-orange-500'}`} />
        <p className={`text-[8px] font-black uppercase tracking-widest ${status === 'Paid' ? 'text-green-500' : 'text-orange-500'}`}>{status}</p>
      </div>
    </div>
  </div>
);

export default function Billing() {
  const { userProfile } = useMindStore();
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  const planFeatures = {
    'Free': ['3 reflections/month', 'Basic insight analysis', 'Decision journal'],
    'Elite': ['Unlimited reflections', 'Full perspective breakdown', 'Weekly clarity report', 'Full history archival'],
    'Growth': ['Everything in Elite', '3 Unique AI Perspectives', 'Complex impact analysis', 'Success Indicators']
  };

  const currentFeatures = planFeatures[userProfile?.plan || 'Free'] || planFeatures['Free'];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24">
      <header className="mb-16">
        <div className="flex items-center gap-3 mb-4">
           <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
           <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em]">Financial Matrix v2.5</p>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <h2 className="text-6xl md:text-8xl font-heading font-black uppercase tracking-tighter text-foreground leading-[0.8]">
            Billing <br/><span className="text-primary italic font-cursive normal-case px-2">Ledger</span>
          </h2>
          <div className="flex items-center gap-4 p-4 bg-white border border-border rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Secure Billing</p>
              <p className="text-[8px] font-bold uppercase tracking-widest text-foreground/40">Powered by Razorpay</p>
            </div>
          </div>
        </div>
      </header>

      {/* Sync Status Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-black rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 relative overflow-hidden shadow-2xl"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500">Subscription Active</p>
          </div>
          <p className="text-2xl md:text-3xl font-heading font-bold tracking-tight mb-2 italic">
            "Your decision intelligence is fully funded."
          </p>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Last synced: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
        </div>
        <div className="relative z-10">
          <button 
            onClick={() => setIsPricingOpen(true)}
            className="px-8 py-4 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl"
          >
            Change Specification
          </button>
        </div>
        <Landmark className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 -rotate-12" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Plan Card */}
        <div className="md:col-span-2 bg-white p-10 rounded-[4rem] border border-border shadow-sm flex flex-col justify-between hover:shadow-xl transition-shadow group">
          <div>
            <div className="flex items-center justify-between mb-12">
               <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest">Active Account</span>
               <div className="w-12 h-12 rounded-2xl bg-soft flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <Zap className="w-6 h-6 text-primary" />
               </div>
            </div>
            <div className="flex items-baseline gap-4 mb-4">
              <h3 className="text-6xl font-heading font-black text-foreground uppercase tracking-tight">{userProfile?.plan || 'FREE'}</h3>
              <span className="text-primary font-cursive text-3xl normal-case italic">tier</span>
            </div>
            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] mb-12 flex items-center gap-2">
              <Clock className="w-3 h-3" /> Auto-renews on {new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentFeatures.map(feature => (
                <div key={feature} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-foreground/60 p-4 bg-soft rounded-2xl border border-transparent hover:border-primary/20 transition-all">
                  <div className="w-2 h-2 bg-green-500 rounded-full" /> {feature}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-16 flex flex-col md:flex-row gap-4">
            <button 
              onClick={() => setIsPricingOpen(true)}
              className="flex-1 py-6 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-primary/20"
            >
              Upgrade Plan <ArrowUpRight className="w-4 h-4" />
            </button>
            <button className="flex-1 py-6 border border-border hover:border-foreground rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3">
              Download License <Receipt className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-8">
          <div className="p-10 bg-white border border-border rounded-[3.5rem] shadow-sm hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                <Banknote className="w-4 h-4" />
              </div>
              <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Available Credits</p>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-heading font-black">₹420</span>
              <span className="text-[10px] font-black text-green-500 uppercase mb-1">PROMO</span>
            </div>
            <p className="text-[8px] font-bold text-foreground/20 uppercase tracking-widest mt-4">Expiring in 12 days</p>
          </div>
          
          <div className="p-10 bg-white border border-border rounded-[3.5rem] shadow-sm hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Clock className="w-4 h-4" />
              </div>
              <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Audit Consumption</p>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-heading font-black">84%</span>
              <span className="text-[10px] font-black text-blue-500 uppercase mb-1">OPT</span>
            </div>
            <div className="mt-4 h-1.5 w-full bg-soft rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[84%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <section className="bg-white p-10 md:p-16 rounded-[4rem] border border-border shadow-sm">
        <div className="flex items-center justify-between mb-12">
           <div>
             <h3 className="text-2xl font-heading font-black text-foreground uppercase tracking-tight">Recent Manifests</h3>
             <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mt-2">History of all logical funding</p>
           </div>
           <button className="px-6 py-2 border border-border rounded-full text-[10px] font-black text-foreground uppercase tracking-widest hover:bg-soft transition-all">View All</button>
        </div>
        <div className="space-y-2">
          <TransactionItem title="MindOS Elite Monthly" date="MAY 01, 2026" amount="49" status="Paid" />
          <TransactionItem title="MindOS Growth Monthly" date="APR 01, 2026" amount="99" status="Paid" />
          <TransactionItem title="Waitlist Deposit" date="MAR 10, 2026" amount="9" status="Paid" />
        </div>
      </section>


      {/* Help Section */}
      <div className="p-12 bg-primary/5 rounded-[4rem] border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center text-primary shadow-xl">
            <Info className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-xl font-heading font-black text-foreground uppercase tracking-tight">Billing Inquiries?</h4>
            <p className="text-sm font-medium text-foreground/40 leading-relaxed">Our financial auditors are ready to assist you with any ledger discrepancies.</p>
          </div>
        </div>
        <button className="px-10 py-5 bg-white border border-border rounded-full text-[10px] font-black uppercase tracking-widest hover:border-primary transition-all flex items-center gap-3">
          Contact Support <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <Pricing 
        isOpen={isPricingOpen} 
        onClose={() => setIsPricingOpen(false)} 
        currentPlan={userProfile?.plan || 'Free'} 
      />
    </div>
  );
}

