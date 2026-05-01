'use client';

import { useMindStore } from '@/lib/store';
import OnboardingEngine from '@/components/OnboardingEngine';
import Dashboard from '@/components/Dashboard';
import { UserButton, SignInButton, useAuth } from '@clerk/nextjs';
import { Sparkles, Brain, Zap, Shield, Target, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { onboardingComplete } = useMindStore();
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex-1 bg-[#020617] text-white selection:bg-accent selection:text-black min-h-screen">
      <nav className="border-b border-white/5 bg-[#020617]/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <Brain className="w-6 h-6 text-black" />
            </div>
            <span className="font-black text-2xl tracking-tighter uppercase italic">MindOS</span>
          </div>
          
          <div className="flex items-center gap-6">
            {!isSignedIn ? (
              <SignInButton mode="modal">
                <button className="px-6 py-2.5 border border-white/10 hover:border-accent hover:text-accent rounded-xl text-sm font-black uppercase tracking-widest transition-all">
                  Sign In
                </button>
              </SignInButton>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest hidden sm:block">Authentication Active</span>
                <UserButton afterSignOutUrl="/" />
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="relative">
        {/* Background Gradients */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] -z-10" />

        <div className="py-20 px-6">
          {isSignedIn ? (
            !onboardingComplete ? (
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                  <p className="text-[10px] font-black text-accent uppercase tracking-[0.5em] mb-4">Neural Handshake Initiation</p>
                  <h1 className="text-6xl md:text-7xl font-black mb-6 text-white uppercase italic tracking-tighter leading-none">
                    Welcome to <br/> <span className="text-accent underline decoration-4 underline-offset-8">MindOS v1.0</span>
                  </h1>
                </div>
                <OnboardingEngine />
              </div>
            ) : (
              <Dashboard />
            )
          ) : (
            <div className="max-w-5xl mx-auto text-center py-20 lg:py-32">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-10"
              >
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Neural-powered coaching engine</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-7xl md:text-9xl font-black mb-12 leading-none uppercase italic tracking-tighter text-white"
              >
                Think Better. <br/>
                <span className="text-accent">Grow Faster.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-slate-400 mb-16 max-w-2xl mx-auto font-medium tracking-tight italic"
              >
                The ultimate operating system for your mindset. Bridge the gap between logic and execution with AI-driven clarity.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-6"
              >
                <SignInButton mode="modal">
                  <button className="group relative px-10 py-5 bg-accent text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(34,211,238,0.2)] flex items-center gap-3">
                    Initialize System
                    <ArrowRight className="w-5 h-5 stroke-[3px] group-hover:translate-x-1 transition-transform" />
                  </button>
                </SignInButton>
                <button className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">
                  Read Documentation
                </button>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 text-left">
                <LandingCard icon={<Zap className="text-accent" />} title="Decision Engine" desc="Bypass cognitive bias with 5-layer logic checks." />
                <LandingCard icon={<Brain className="text-purple-400" />} title="Neural Tracking" desc="Map recursive limiting beliefs automatically." />
                <LandingCard icon={<Target className="text-growth" />} title="Focus Mastery" desc="Data-driven habits optimized for flow state." />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

const LandingCard = ({ icon, title, desc }) => (
  <div className="bg-[#0F172A]/40 border border-white/5 p-8 rounded-[2rem] hover:bg-[#0F172A]/60 transition-all group">
    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-3">{title}</h3>
    <p className="text-slate-500 text-sm font-medium leading-relaxed italic">{desc}</p>
  </div>
);
