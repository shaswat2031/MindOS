'use client';

import { motion } from 'framer-motion';
import { BarChart, TrendingUp, CheckCircle, AlertTriangle, Target, ArrowUpRight, Sparkles, Zap, Activity } from 'lucide-react';

export default function WeeklyReport() {
  const stats = [
    { label: 'WEEKLY FOCUS', value: '82', change: '+23%', trend: 'up', color: 'text-accent' },
    { label: 'RESOLVED LOGS', value: '04', change: 'MAX', trend: 'neutral', color: 'text-purple-400' },
    { label: 'SYSTEM INTEGRITY', value: '94%', change: '+05%', trend: 'up', color: 'text-growth' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-6">
        <div className="inline-flex p-5 bg-accent/10 rounded-3xl border border-accent/20 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
          <Activity className="w-10 h-10 text-accent" />
        </div>
        <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
          Weekly Performance <br/> <span className="text-accent underline decoration-4 underline-offset-8">Data Stream</span>
        </h1>
        <p className="text-slate-500 font-mono text-sm tracking-[0.3em]">LOG_PERIOD :: APR_24_APR_30</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-[#0F172A]/50 p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap className="w-20 h-20" />
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">{s.label}</p>
            <p className={`text-6xl font-black italic tracking-tighter mb-2 ${s.color}`}>{s.value}</p>
            <p className="text-xs font-black text-white/50 uppercase tracking-widest">{s.change} FROM PREV</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <section className="bg-white/5 p-12 rounded-[3rem] border border-white/5 space-y-10 relative overflow-hidden group">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-growth/5 rounded-full blur-3xl group-hover:bg-growth/10 transition-all duration-1000" />
          <h3 className="text-2xl font-black flex items-center gap-4 uppercase italic tracking-tight text-growth">
            <TrendingUp className="w-8 h-8" />
            Core Breakthroughs
          </h3>
          <div className="space-y-8 relative z-10">
            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 bg-growth/10 border border-growth/20 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-[0_0_15px_rgba(74,222,128,0.1)]">
                <CheckCircle className="w-6 h-6 text-growth stroke-[3px]" />
              </div>
              <div>
                <p className="font-black text-lg uppercase italic tracking-tight mb-2">Primary Decision Finalized</p>
                <p className="text-slate-400 leading-relaxed italic">Initiated 'Side Hustle' protocol after 92 days of recursive logic loops. System integrity restored.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 bg-growth/10 border border-growth/20 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-[0_0_15px_rgba(74,222,128,0.1)]">
                <CheckCircle className="w-6 h-6 text-growth stroke-[3px]" />
              </div>
              <div>
                <p className="font-black text-lg uppercase italic tracking-tight mb-2">Neural Consistency Maxed</p>
                <p className="text-slate-400 leading-relaxed italic">07-day 'Neural Reset' sequence completed. Cognitive clarity increased by 22%.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-danger/5 p-12 rounded-[3rem] border border-danger/10 space-y-10 relative overflow-hidden group">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-danger/5 rounded-full blur-3xl group-hover:bg-danger/10 transition-all duration-1000" />
          <h3 className="text-2xl font-black flex items-center gap-4 uppercase italic tracking-tight text-danger">
            <AlertTriangle className="w-8 h-8" />
            Vulnerability Detected
          </h3>
          <div className="space-y-6 relative z-10">
            <div className="p-8 bg-white/5 border border-white/5 rounded-[2rem] hover:bg-white/10 transition-all cursor-pointer group">
              <p className="text-xs font-black text-danger uppercase tracking-[0.3em] mb-3">Pattern Leak</p>
              <p className="text-xl font-black text-white italic uppercase tracking-tighter mb-2">"NOT_READY" LOOP</p>
              <p className="text-sm text-slate-500 leading-relaxed italic">Triggered 4 times during competitive data analysis. Logic filter suggested.</p>
            </div>
            <div className="p-8 bg-white/5 border border-white/5 rounded-[2rem] hover:bg-white/10 transition-all cursor-pointer group">
              <p className="text-xs font-black text-danger uppercase tracking-[0.3em] mb-3">Energy Drain</p>
              <p className="text-xl font-black text-white italic uppercase tracking-tighter mb-2">THURSDAY_SLUMP</p>
              <p className="text-sm text-slate-500 leading-relaxed italic">Efficiency drops to 45% post 14:00. Protocol 'Early Reset' required.</p>
            </div>
          </div>
        </section>
      </div>

      <section className="bg-accent p-12 rounded-[3.5rem] shadow-[0_0_60px_rgba(34,211,238,0.2)] relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
        <div className="relative z-10">
          <p className="text-xs font-black text-black/50 uppercase tracking-[0.5em] mb-8">NEXT WEEK CRITICAL TARGET</p>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-10">
            <div className="p-6 bg-black rounded-[2.5rem] shadow-2xl">
              <Target className="w-12 h-12 text-accent" />
            </div>
            <div>
              <p className="text-4xl font-black text-black leading-none uppercase italic tracking-tighter mb-4">
                Execute Mockup <br/> Protocol v1.0
              </p>
              <p className="text-black/70 text-lg font-medium max-w-md italic">
                "Ignore all peer feedback until 80% completion. Bypassing judgment trap is mission critical."
              </p>
            </div>
            <button className="ml-auto p-8 bg-black text-accent rounded-full hover:scale-110 active:scale-95 transition-all shadow-2xl">
              <ArrowUpRight className="w-10 h-10 stroke-[3px]" />
            </button>
          </div>
        </div>
        <div className="absolute -bottom-32 -right-32 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
          <Zap className="w-[30rem] h-[30rem] text-black" />
        </div>
      </section>
    </div>
  );
}
