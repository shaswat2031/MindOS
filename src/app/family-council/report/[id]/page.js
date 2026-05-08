'use client';

import React, { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft, BarChart2, Lightbulb, AlertTriangle, Target, CheckCircle2 } from 'lucide-react';

export default function FamilyReportPage({ params }) {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const res = await fetch(`/api/family-council/${id}`);
      const data = await res.json();
      if (res.ok) {
        setAudit(data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse text-center">
        <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Synthesizing Collective Logic...</p>
      </div>
    </div>
  );

  if (error || !audit?.analysis) return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="text-center max-w-md">
        <h2 className="text-3xl font-heading font-black uppercase mb-4">Analysis Unavailable</h2>
        <p className="text-foreground/40 font-bold uppercase tracking-widest leading-relaxed mb-8">{error || "This report hasn't been generated yet or no opinions were collected."}</p>
        <button onClick={() => window.history.back()} className="text-primary font-bold uppercase text-[10px] tracking-widest">Back to Dashboard</button>
      </div>
    </div>
  );

  const { analysis } = audit;

  return (
    <main className="min-h-screen bg-soft/30 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Audit Room
        </button>

        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6">
             <span className="px-4 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                <ShieldCheck className="w-3 h-3" /> Neutralized Report
             </span>
             <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">
                ID: {audit.inviteCode}
             </span>
          </div>
          <h1 className="text-6xl font-heading font-black tracking-tighter uppercase mb-6">{audit.decisionTitle}</h1>
          <p className="text-xl text-foreground/60 leading-relaxed font-medium">Family Consensus & Logic Synthesis</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <section className="bg-white p-10 rounded-[3rem] border border-border shadow-xl shadow-black/5">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                   <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-heading font-black uppercase tracking-tight">Detected Biases</h3>
             </div>
             <div className="flex flex-wrap gap-3">
                {analysis.detectedBiases?.map(bias => (
                  <span key={bias} className="px-4 py-2 bg-soft rounded-full text-[10px] font-black uppercase tracking-widest text-foreground/60 border border-border">
                    {bias}
                  </span>
                ))}
             </div>
          </section>

          <section className="bg-white p-10 rounded-[3rem] border border-border shadow-xl shadow-black/5">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                   <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-heading font-black uppercase tracking-tight">Recommended Path</h3>
             </div>
             <p className="text-lg font-bold leading-relaxed text-foreground/80">{analysis.recommendedPath}</p>
          </section>
        </div>

        <section className="bg-white p-12 rounded-[3.5rem] border border-border shadow-xl shadow-black/5 mb-12">
          <div className="flex items-center gap-4 mb-10">
             <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                <BarChart2 className="w-6 h-6" />
             </div>
             <h3 className="text-2xl font-heading font-black uppercase tracking-tight">Logical Synthesis</h3>
          </div>
          <div className="space-y-8">
            <div>
               <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground/20 mb-4">Consensus Summary</h4>
               <p className="text-2xl font-medium leading-relaxed text-foreground/80">{analysis.consensusSummary}</p>
            </div>
            <div className="h-px bg-border" />
            <div>
               <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground/20 mb-4">Neutral Perspective</h4>
               <p className="text-lg leading-relaxed text-foreground/60">{analysis.neutralSynthesis}</p>
            </div>
          </div>
        </section>

        <section className="bg-primary text-white p-12 rounded-[3.5rem] shadow-2xl shadow-primary/20">
           <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                 <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-heading font-black uppercase tracking-tight">Core Logic Breakdown</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {analysis.logicBreakdown?.map((point, i) => (
                <div key={i} className="flex gap-4">
                   <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black shrink-0">{i+1}</div>
                   <p className="text-sm font-bold uppercase tracking-wider leading-relaxed text-white/80">{point}</p>
                </div>
              ))}
           </div>
        </section>

        <footer className="mt-20 text-center">
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20">Report generated by MindOS Collective Intelligence Module</p>
        </footer>
      </div>
    </main>
  );
}
