'use client';

import { useState, useEffect } from 'react';
import { useMindStore } from '@/lib/store';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowLeft, Target, Sparkles, Brain, Box } from 'lucide-react';
import Link from 'next/link';

const DecisionSimulator = dynamic(() => import('@/components/DecisionSimulator'), { 
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <Loader2 className="w-16 h-16 text-primary animate-spin mb-8" />
      <h2 className="text-3xl font-heading font-black uppercase tracking-tighter text-white/40">Initializing Quantum Canvas...</h2>
    </div>
  )
});

export default function SimulatorPage() {
  const [latestDecision, setLatestDecision] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await fetch('/api/decisions/history');
        const data = await res.json();
        if (data && data.length > 0) {
          setLatestDecision(data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchLatest();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Loader2 className="w-16 h-16 text-primary animate-spin" />
    </div>
  );

  if (!latestDecision) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-6 text-center">
      <div className="w-24 h-24 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center text-white/20 mb-10">
        <Target className="w-12 h-12" />
      </div>
      <h2 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tighter text-white mb-6">Zero Signal</h2>
      <p className="text-white/40 max-w-sm font-black uppercase tracking-[0.3em] text-[10px] leading-relaxed mb-12">
        We need a recent decision to project. Run a diagnostic in the Smart Coach first.
      </p>
      <Link href="/dashboard" className="px-10 py-5 bg-white text-black rounded-full font-heading font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all">
        Back to Dashboard
      </Link>
    </div>
  );

  return (
    <main className="bg-black min-h-screen overflow-hidden">
      <DecisionSimulator 
        decision={latestDecision.question} 
        onBack={() => window.location.href = '/dashboard'} 
      />
    </main>
  );
}
