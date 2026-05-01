'use client';

import { motion } from 'framer-motion';
import { Layers, Plus, Star, ArrowRight, Zap, Target, Lock } from 'lucide-react';
import { useMindStore } from '@/lib/store';

const SkillCard = ({ name, level, progress, color }) => (
  <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <div className={`p-2 rounded-lg ${color}`}>
        <Star className="w-5 h-5 text-white" />
      </div>
      <span className="text-xs font-bold text-text-secondary">Level {level}</span>
    </div>
    <h4 className="font-bold mb-3">{name}</h4>
    <div className="space-y-2">
      <div className="h-1.5 bg-soft rounded-full overflow-hidden">
        <div className={`h-full ${color.replace('bg-', 'bg-')}`} style={{ width: `${progress}%` }} />
      </div>
      <p className="text-[10px] text-text-secondary text-right">{progress}% to Mastery</p>
    </div>
  </div>
);

export default function SkillStackBuilder() {
  const { userProfile } = useMindStore();
  const isFree = userProfile?.plan === 'Free';

  if (isFree) {
    return (
      <div className="bg-card p-12 rounded-3xl border border-border shadow-sm text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-growth/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Layers className="w-8 h-8 text-growth" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Stack your skills.</h2>
        <p className="text-text-secondary mb-8">
          Build a unique skill stack and track your path to mastery. 
          Available on **Core** and **Growth** plans.
        </p>
        <button className="px-8 py-4 bg-growth text-white rounded-xl font-bold hover:shadow-lg transition-all">
          Unlock Skill Builder — ₹99/mo
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Layers className="w-8 h-8 text-accent" />
            Skill Stack Builder
          </h1>
          <p className="text-text-secondary">Combine your unique talents into a competitive advantage.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:shadow-md transition-all">
          <Plus className="w-5 h-5" />
          Add Skill
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SkillCard name="Full Stack Dev" level={4} progress={75} color="bg-accent" />
        <SkillCard name="Product Design" level={3} progress={40} color="bg-growth" />
        <SkillCard name="Data Analysis" level={2} progress={20} color="bg-primary" />
        <div className="border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center p-6 text-text-secondary hover:border-accent hover:text-accent cursor-pointer transition-all">
          <Plus className="w-8 h-8 mb-2" />
          <span className="font-bold text-sm">New Skill Slot</span>
        </div>
      </div>

      <section className="bg-card p-10 rounded-3xl border border-border shadow-sm">
        <div className="max-w-2xl">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-warning" />
            AI Stack Insight
          </h3>
          <p className="text-lg text-text-primary leading-relaxed mb-8">
            "Ravi, your combination of **Next.js Development** and **Behavioral Psychology** puts you in the top 1% of product-led growth engineers. Focus on 'Applied Gamification' as your next skill to complete this elite stack."
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-soft rounded-xl border border-border">
              <p className="text-xs font-bold text-text-secondary uppercase mb-1">Market Demand</p>
              <p className="font-bold text-growth">Very High</p>
            </div>
            <div className="p-4 bg-soft rounded-xl border border-border">
              <p className="text-xs font-bold text-text-secondary uppercase mb-1">Unique Advantage</p>
              <p className="font-bold text-accent">Top 1% Combo</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
