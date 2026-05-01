'use client';

import { motion } from 'framer-motion';
import { Brain, AlertCircle, History, Tag, ArrowUpRight, Activity } from 'lucide-react';

const PatternCard = ({ title, count, trend, status }) => (
  <div className="bg-[#0F172A]/50 p-6 rounded-3xl border border-white/5 hover:border-accent/30 transition-all group">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-3 rounded-2xl ${status === 'critical' ? 'bg-danger/10 border border-danger/20' : 'bg-accent/10 border border-accent/20'}`}>
        <AlertCircle className={`w-6 h-6 ${status === 'critical' ? 'text-danger' : 'text-accent'}`} />
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Occurrences</p>
        <span className="text-2xl font-black italic">{count}</span>
      </div>
    </div>
    <h3 className="text-lg font-black text-white mb-4 uppercase italic tracking-tight leading-tight">{title}</h3>
    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
      <Activity className="w-3 h-3 text-accent" />
      <span>Trend: <span className={status === 'critical' ? 'text-danger' : 'text-growth'}>{trend}</span></span>
    </div>
  </div>
);

export default function PatternTracker() {
  const limitingBeliefs = [
    { title: '"I am not ready yet"', count: 11, trend: 'ACCELERATING', status: 'critical' },
    { title: '"Others are ahead"', count: 7, trend: 'STABLE', status: 'normal' },
    { title: '"Fear of judgment"', count: 15, trend: 'DECELERATING', status: 'normal' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black text-accent uppercase tracking-[0.4em] mb-4">Neural Analytics</p>
          <h2 className="text-4xl font-black flex items-center gap-4 uppercase italic tracking-tighter">
            Mind Pattern Tracker
          </h2>
        </div>
        <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
          FULL LOGS <History className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {limitingBeliefs.map((belief, i) => (
          <PatternCard key={i} {...belief} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-primary border border-white/5 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-8 flex items-center gap-3 uppercase italic tracking-tight text-accent">
              <Tag className="w-6 h-6" />
              Pattern Analysis
            </h3>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed italic">
              "Ravi, the <span className="text-danger font-black">'Not Ready'</span> loop is currently your primary bottleneck. It consistently activates when your energy score drops below 4."
            </p>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
              <p className="text-sm font-black text-accent uppercase tracking-widest mb-2">System Insight</p>
              <p className="text-sm text-slate-400 leading-relaxed italic">"Perfectionism is just procrastination in a suit. Ship it or delete it."</p>
            </div>
          </div>
          <div className="absolute -bottom-20 -right-20 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-1000">
            <Brain className="w-96 h-96" />
          </div>
        </section>

        <section className="bg-[#0F172A]/30 p-10 rounded-[2.5rem] border border-white/5">
          <h3 className="text-2xl font-black mb-8 uppercase italic tracking-tight">Active Library</h3>
          <div className="space-y-4">
            {['Perfectionism', 'Scarcity Mindset', 'Comparison Trap'].map((tag) => (
              <div key={tag} className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group">
                <span className="font-bold text-slate-300 group-hover:text-white uppercase tracking-tight">{tag}</span>
                <span className="text-[10px] font-black bg-accent text-black px-3 py-1 rounded-full uppercase">
                  Tracking
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-4 border border-dashed border-white/10 rounded-2xl text-slate-500 font-black uppercase tracking-widest hover:border-accent hover:text-accent transition-all text-xs">
            EXPAND DATASET
          </button>
        </section>
      </div>
    </div>
  );
}
