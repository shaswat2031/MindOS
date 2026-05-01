'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Trophy, Target, Zap, TrendingUp, HelpCircle, Activity } from 'lucide-react';
import { useMindStore } from '@/lib/store';

const HabitCard = ({ id, name, status, onToggle, whyMissed }) => (
  <div className={`p-6 rounded-[2rem] border transition-all ${
    status === 'done' 
      ? 'bg-growth/5 border-growth/30 shadow-[0_0_20px_rgba(74,222,128,0.1)]' 
      : 'bg-[#0F172A]/50 border-white/5 hover:border-accent/30'
  }`}>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <button onClick={() => onToggle(id, status === 'done' ? 'pending' : 'done')} className="group">
          {status === 'done' ? 
            <div className="w-8 h-8 bg-growth rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(74,222,128,0.3)]">
              <CheckCircle2 className="w-5 h-5 text-black stroke-[3px]" />
            </div> : 
            <div className="w-8 h-8 border-2 border-slate-700 rounded-xl flex items-center justify-center group-hover:border-accent transition-colors">
              <div className="w-2 h-2 bg-slate-700 rounded-full group-hover:bg-accent transition-colors" />
            </div>
          }
        </button>
        <span className={`text-lg font-black uppercase italic tracking-tight ${status === 'done' ? 'text-growth opacity-50' : 'text-white'}`}>
          {name}
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
        <Zap className="w-3 h-3 text-warning" /> 12X
      </div>
    </div>
    {status !== 'done' && (
      <button 
        onClick={() => whyMissed(id)}
        className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] flex items-center gap-2 hover:text-accent transition-colors"
      >
        <HelpCircle className="w-4 h-4" /> REASON REQUIRED
      </button>
    )}
  </div>
);

export default function HabitSystem() {
  const { xp, level, habits, setHabits, updateHabit, userProfile } = useMindStore();
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useState(() => {
    const fetchHabits = async () => {
      try {
        const res = await fetch('/api/habits');
        const data = await res.json();
        if (data.length > 0) {
          setHabits(data);
        } else if (userProfile?.mindProfile?.recommendedHabits) {
          // Suggest habits from AI profile
          const suggested = userProfile.mindProfile.recommendedHabits.map((name, i) => ({
            id: `suggested-${i}`,
            name: name.toUpperCase(),
            status: 'pending'
          }));
          setHabits(suggested);
        }
      } catch (err) {
        console.error("Habit fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHabits();
  });

  const focusScore = 72;

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black text-accent uppercase tracking-[0.4em] mb-4">Integrity Check</p>
              <h2 className="text-4xl font-black flex items-center gap-4 uppercase italic tracking-tighter">
                Habit Systems
              </h2>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Efficiency</p>
              <span className="text-3xl font-black italic text-growth">66%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {habits.map((habit) => (
              <HabitCard 
                key={habit.id} 
                {...habit} 
                onToggle={updateHabit}
                whyMissed={() => setShowWhyModal(true)}
              />
            ))}
          </div>

          <section className="bg-[#0F172A]/40 border border-white/5 p-10 rounded-[2.5rem] relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-6 flex items-center gap-3 uppercase italic tracking-tight text-warning">
                <Activity className="w-6 h-6" />
                Focus Analysis
              </h3>
              <p className="text-lg text-slate-300 leading-relaxed italic mb-8">
                "System predicts a 40% probability of streak breakage tomorrow. Redirecting energy to 'Neural Reset' module is advised."
              </p>
              <div className="inline-flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5">
                <div className="p-3 bg-growth/20 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-growth" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Predicted Integrity</p>
                  <p className="font-black text-lg text-growth uppercase tracking-tighter">92% With Suggested Fix</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-primary border border-accent/20 p-10 rounded-[2.5rem] shadow-[0_0_40px_rgba(34,211,238,0.1)] text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-accent)_0%,_transparent_70%)] opacity-5" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-10">System Focus Output</h3>
            <div className="relative inline-flex items-center justify-center mb-10">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={465} strokeDashoffset={465 - (465 * focusScore / 100)} className="text-accent shadow-[0_0_15px_rgba(34,211,238,0.5)]" strokeLinecap="round" />
              </svg>
              <span className="absolute text-6xl font-black italic tracking-tighter text-white">{focusScore}</span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
              OPERATING IN <br/> <span className="text-accent">HIGH EFFICIENCY ZONE</span>
            </p>
          </section>

          <section className="bg-[#0F172A]/50 p-8 rounded-[2.5rem] border border-white/5">
            <h3 className="font-black mb-8 flex items-center gap-3 uppercase italic tracking-tight">
              <Trophy className="w-6 h-6 text-warning" />
              Progress Rank
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Rank</p>
                  <p className="font-black text-xl text-white italic uppercase tracking-tighter">Builder Lvl {level}</p>
                </div>
                <span className="text-[10px] font-black text-accent uppercase">{xp}/1000 XP</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(xp % 1000) / 10}%` }}
                  className="h-full bg-accent"
                />
              </div>
              <div className="flex gap-4 pt-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-12 h-12 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-help">
                    <Zap className="w-6 h-6 text-accent" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
