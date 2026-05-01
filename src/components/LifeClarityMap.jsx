'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Star, Globe, Wallet, Target, Map } from 'lucide-react';

export default function LifeClarityMap() {
  const [step, setStep] = useState(0);
  
  const circles = [
    { id: 'love', title: 'What you LOVE', icon: <Heart className="text-red-500" />, color: 'bg-red-500' },
    { id: 'good_at', title: 'What you are GOOD AT', icon: <Star className="text-yellow-500" />, color: 'bg-yellow-500' },
    { id: 'world_needs', title: 'What the WORLD NEEDS', icon: <Globe className="text-blue-500" />, color: 'bg-blue-500' },
    { id: 'paid_for', title: 'What you can be PAID FOR', icon: <Wallet className="text-green-500" />, color: 'bg-green-500' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <Map className="w-8 h-8 text-accent" />
          Ikigai & Life Clarity Map
        </h1>
        <p className="text-text-secondary">Discover your purpose through deep introspection.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative h-[500px] flex items-center justify-center">
          {/* Ikigai Diagram Mockup */}
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute w-64 h-64 rounded-full bg-red-500/20 border-2 border-red-500/30 -translate-y-16" />
            <div className="absolute w-64 h-64 rounded-full bg-blue-500/20 border-2 border-blue-500/30 translate-y-16" />
            <div className="absolute w-64 h-64 rounded-full bg-yellow-500/20 border-2 border-yellow-500/30 -translate-x-16" />
            <div className="absolute w-64 h-64 rounded-full bg-green-500/20 border-2 border-green-500/30 translate-x-16" />
            <div className="absolute z-10 bg-white p-4 rounded-xl shadow-xl border border-border text-center">
              <Sparkles className="w-6 h-6 text-accent mx-auto mb-1" />
              <p className="font-bold text-xs uppercase tracking-widest">Your Ikigai</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
            <h3 className="text-xl font-bold mb-6">Current Exercise: {circles[step].title}</h3>
            <p className="text-text-secondary mb-8">List 3-5 things that make your heart race with excitement. Don't think about money or skills yet.</p>
            
            <div className="space-y-4 mb-8">
              <input type="text" placeholder="1. Writing code for impact" className="w-full p-4 bg-soft rounded-xl border border-border" />
              <input type="text" placeholder="2. Mentoring young talent" className="w-full p-4 bg-soft rounded-xl border border-border" />
            </div>

            <button 
              onClick={() => setStep((step + 1) % 4)}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Save & Continue
            </button>
          </div>

          <section className="bg-accent text-white p-6 rounded-2xl shadow-lg">
            <h4 className="font-bold flex items-center gap-2 mb-2">
              <Target className="w-5 h-5" />
              AI Purpose Insight
            </h4>
            <p className="text-sm opacity-90 leading-relaxed">
              "Based on your inputs, your unique intersection is **'Building accessible mental health tools'**. This bridges your technical skill with your deep empathy for the underserved."
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
