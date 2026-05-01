'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMindStore } from '@/lib/store';
import { 
  ChevronRight, 
  ChevronLeft, 
  Brain, 
  Target, 
  ShieldAlert, 
  Wallet, 
  Briefcase, 
  Terminal, 
  TrendingUp, 
  Users, 
  Heart, 
  Zap,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';

const QUESTIONS = [
  {
    id: 'life_stage',
    question: "INITIALIZING. WHAT IS YOUR CURRENT LIFE STAGE?",
    options: ['Student', 'Working Professional', 'Entrepreneur', 'Career Transition'],
    icon: <Terminal className="w-6 h-6 text-accent" />
  },
  {
    id: 'primary_goal',
    question: "CORE DRIVE SCAN. WHAT IS YOUR #1 GOAL FOR THE NEXT 12 MONTHS?",
    options: ['Scale Wealth', 'Build Skills', 'Improve Health', 'Mental Peace'],
    icon: <Target className="w-6 h-6 text-purple-400" />
  },
  {
    id: 'income_range',
    question: "RESOURCE STATUS. CURRENT MONTHLY INCOME RANGE (INR)?",
    options: ['Below 50k', '50k - 1.5L', '1.5L - 5L', '5L+'],
    icon: <Wallet className="w-6 h-6 text-growth" />
  },
  {
    id: 'fears',
    question: "VULNERABILITY SCAN. WHAT IS YOUR BIGGEST INVISIBLE BLOCKER?",
    options: ['Fear of Judgment', 'Fear of Failure', 'Fear of Regret', 'Fear of Success'],
    icon: <ShieldAlert className="w-6 h-6 text-danger" />
  },
  {
    id: 'decision_style',
    question: "LOGIC CHECK. HOW DO YOU MAKE TOUGH DECISIONS?",
    options: ['Overanalyze (2 weeks+)', 'Impulsive (Gut feel)', 'Data Driven', 'Ask 5 friends'],
    icon: <Brain className="w-6 h-6 text-accent" />
  },
  {
    id: 'focus_hours',
    question: "BANDWIDTH TEST. AVERAGE DAILY DEEP WORK HOURS?",
    options: ['< 1 Hour', '1 - 3 Hours', '3 - 6 Hours', '6+ Hours'],
    icon: <Zap className="w-6 h-6 text-warning" />
  },
  {
    id: 'career_status',
    question: "CAREER INTEGRITY. HOW DO YOU FEEL AT WORK/BUSINESS?",
    options: ['Stuck & Bored', 'Stable but No Growth', 'Growing Rapidly', 'Explosive/High Stakes'],
    icon: <Briefcase className="w-6 h-6 text-accent" />
  },
  {
    id: 'failure_response',
    question: "RECOVERY PROTOCOL. HOW DO YOU REACT TO A MAJOR SETBACK?",
    options: ['Shut down (3 days)', 'Analyze & Pivot', 'Blame external factors', 'Ignore & Move on'],
    icon: <TrendingUp className="w-6 h-6 text-purple-400" />
  },
  {
    id: 'mindset_bias',
    question: "BELIEF SYSTEM. LUCK VS HARD WORK?",
    options: ['90% Luck', '50/50 Split', '90% Effort', 'I create my luck'],
    icon: <Users className="w-6 h-6 text-growth" />
  },
  {
    id: 'morning_routine',
    question: "INITIATION SEQUENCE. HOW DOES YOUR DAY START?",
    options: ['Chaos / Social Media', 'Structured Habits', 'Reacting to Emails', 'Deep Work First'],
    icon: <Terminal className="w-6 h-6 text-accent" />
  },
  {
    id: 'blocker_id',
    question: "BOTTLENECK ID. WHAT STOPS YOU FROM REACHING 10X?",
    options: ['Procrastination', 'Lack of Clarity', 'Resource Scarcity', 'Bad Habits'],
    icon: <Lock className="w-6 h-6 text-danger" />
  },
  {
    id: 'risk_appetite',
    question: "RISK TOLERANCE. LOSING 1 YEAR SAVINGS FOR A 10X GAIN?",
    options: ['Never', 'Small Bet only', 'Aggressive Bet', 'All In'],
    icon: <Zap className="w-6 h-6 text-warning" />
  },
  {
    id: 'circle_quality',
    question: "ENVIRONMENT SCAN. YOUR TOP 5 FRIENDS ARE...",
    options: ['Average/Chill', 'Negative/Draining', 'High Achievers', 'Builders/Founders'],
    icon: <Users className="w-6 h-6 text-accent" />
  },
  {
    id: 'health_priority',
    question: "BIOLOGICAL INTEGRITY. DO YOU TREAT YOUR BODY LIKE A MACHINE?",
    options: ['Ignore it', 'Casual Workout', 'Bio-hacker level', 'Strict Athlete'],
    icon: <Heart className="w-6 h-6 text-danger" />
  },
  {
    id: 'success_definition',
    question: "FINAL VARIABLE. WHAT IS SUCCESS TO YOU?",
    options: ['Absolute Freedom', 'Status & Power', 'Family & Peace', 'Global Impact'],
    icon: <CheckCircle2 className="w-6 h-6 text-growth" />
  }
];

export default function OnboardingEngine() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [firstInsight, setFirstInsight] = useState(null);
  
  const { setOnboardingComplete, setOnboardingAnswers, setUserProfile } = useMindStore();

  const handleAnswer = (answer) => {
    const newAnswers = { ...answers, [QUESTIONS[currentStep].id]: answer };
    setAnswers(newAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      runAIAnalysis(newAnswers);
    }
  };

  const runAIAnalysis = async (finalAnswers) => {
    setIsAnalyzing(true);
    
    // Simulate complex AI calculation progress
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 40);

    // Call API to analyze
    try {
      const res = await fetch('/api/onboarding/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers })
      });
      const data = await res.json();
      
      setFirstInsight(data.firstInsight);
      setOnboardingAnswers(finalAnswers);
      // We don't set complete yet, we show the insight first
    } catch (error) {
      console.error("Analysis failed", error);
      // Fallback insight
      setFirstInsight({
        blocker: "Fear of Judgment",
        percentage: "73%",
        message: "Ravi, your data suggests 'Fear of Judgment' is your primary throttle. You're holding back 40% of your potential to avoid being watched."
      });
    }
  };

  const currentQ = QUESTIONS[currentStep];

  if (firstInsight) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto bg-[#0F172A]/80 backdrop-blur-3xl p-12 rounded-[3rem] border border-accent/20 shadow-[0_0_50px_rgba(34,211,238,0.15)] text-center"
      >
        <div className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
          <Brain className="w-10 h-10 text-black" />
        </div>
        <p className="text-xs font-black text-accent uppercase tracking-[0.5em] mb-4">Neural Profile Built</p>
        <h2 className="text-4xl font-black mb-8 italic uppercase tracking-tighter leading-tight">
          System Insight: <span className="text-accent">{firstInsight.blocker}</span>
        </h2>
        <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] mb-10 text-left">
          <p className="text-xl text-slate-300 italic leading-relaxed">
            "{firstInsight.message} Like <span className="text-accent font-black">{firstInsight.percentage}</span> of high-achievers in your bracket, you are stuck in a 'Safety Loop'."
          </p>
        </div>
        <button 
          onClick={() => setOnboardingComplete(true)}
          className="w-full py-5 bg-accent text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl"
        >
          Initialize MindOS <ArrowRight className="w-5 h-5 stroke-[3px]" />
        </button>
      </motion.div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="relative mb-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-48 h-48 border-4 border-accent border-t-transparent border-dashed rounded-full"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black italic text-accent">{analysisProgress}%</span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Neural Mapping</span>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter animate-pulse">Analyzing Consciousness...</h2>
          <div className="flex gap-2 justify-center">
            <div className="h-1 w-12 bg-accent rounded-full" />
            <div className={`h-1 w-12 bg-accent rounded-full transition-opacity duration-500 ${analysisProgress > 40 ? 'opacity-100' : 'opacity-20'}`} />
            <div className={`h-1 w-12 bg-accent rounded-full transition-opacity duration-500 ${analysisProgress > 80 ? 'opacity-100' : 'opacity-20'}`} />
          </div>
          <p className="text-slate-500 font-mono text-xs max-w-xs mx-auto">
            DETECTING SCARCITY LOOPS... <br/>
            MAPPING RISK APPETITE... <br/>
            IDENTIFYING COGNITIVE BOTTLE-NECKS...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full p-6">
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">
            SYSTEM_INIT :: 0{currentStep + 1} / 15
          </span>
          <div className="flex-1 mx-8 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / 15) * 100}%` }}
              className="h-full bg-accent shadow-[0_0_10px_rgba(34,211,238,0.5)]"
            />
          </div>
          {currentStep > 0 && (
            <button onClick={() => setCurrentStep(currentStep - 1)} className="p-2 text-slate-500 hover:text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-[#0F172A]/80 backdrop-blur-2xl p-10 md:p-14 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
             {currentQ.icon}
          </div>
          
          <div className="mb-10 inline-flex p-4 bg-accent/10 rounded-2xl shadow-[0_0_20px_rgba(34,211,238,0.1)]">
            {currentQ.icon}
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-12 text-white uppercase italic tracking-tighter leading-tight">
            {currentQ.question}
          </h2>

          <div className="grid gap-4">
            {currentQ.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className="flex items-center justify-between p-7 rounded-[2rem] border border-white/5 hover:border-accent hover:bg-accent/10 transition-all text-left group active:scale-[0.98] relative overflow-hidden"
              >
                <span className="font-bold text-xl text-slate-300 group-hover:text-white uppercase tracking-tight relative z-10">{option}</span>
                <ChevronRight className="w-6 h-6 text-slate-600 group-hover:text-accent group-hover:translate-x-1 transition-all relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
