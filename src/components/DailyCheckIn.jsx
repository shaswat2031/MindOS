'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Target, 
  ArrowRight, 
  Activity, 
  Battery, 
  Flame, 
  Smile, 
  MessageSquare,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';
import { useMindStore } from '@/lib/store';

export default function DailyCheckIn({ onComplete }) {
  const { addXP } = useMindStore();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [flowType, setFlowType] = useState('morning'); // 'morning' or 'evening'
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [morningData, setMorningData] = useState(null);

  useEffect(() => {
    const initFlow = async () => {
      try {
        const res = await fetch('/api/checkins/daily-plan');
        const data = await res.json();
        setQuestions(data.questions);
        setFlowType(data.type);
        setMorningData(data.morningData);
      } catch (err) {
        setQuestions(["What is your primary focus?", "One thing you will ignore?", "Energy level check?"]);
      } finally {
        setLoading(false);
      }
    };
    initFlow();
  }, []);

  const handleNext = (val) => {
    const currentQ = step === 0 ? 'energy' : step === 1 ? 'mood' : questions[step - 2];
    setAnswers(prev => ({ ...prev, [currentQ]: val }));
    
    if (step < questions.length + 1) {
      setStep(step + 1);
    } else {
      submitCheckIn();
    }
  };

  const submitCheckIn = async () => {
    setLoading(true);
    try {
      await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...answers,
          type: flowType
        })
      });
      addXP(flowType === 'morning' ? 20 : 30);
      onComplete?.();
    } catch (err) {
      console.error("Submission failed", err);
      onComplete?.();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Syncing Mindset Data...</p>
      </div>
    );
  }

  if (flowType === 'evening') {
    return (
      <div className="max-w-xl mx-auto py-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0F172A]/80 backdrop-blur-2xl p-12 rounded-[3rem] border border-white/5 shadow-2xl text-center"
        >
          <div className="mb-10 inline-flex p-6 bg-growth/10 rounded-[2rem]">
            <Flame className="w-8 h-8 text-growth" />
          </div>
          <h2 className="text-4xl font-black mb-12 uppercase italic tracking-tighter text-white leading-none">
            Evening <br/> <span className="text-accent">Reflection</span>
          </h2>
          
          <div className="mb-10 text-left bg-white/5 p-6 rounded-2xl border border-white/10">
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Morning Intention</p>
            <p className="text-lg font-bold italic text-white">"{morningData?.intentions?.[0] || "Stay Focused"}"</p>
          </div>

          <p className="text-slate-400 mb-10 font-bold italic">Did you follow through on your intention today?</p>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => submitCheckIn()}
              className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-growth/10 border border-growth/20 hover:bg-growth/20 transition-all group"
            >
              <CheckCircle2 className="w-10 h-10 text-growth group-hover:scale-110 transition-transform" />
              <span className="font-black text-xs uppercase tracking-widest text-growth">Executed</span>
            </button>
            <button 
              onClick={() => submitCheckIn()}
              className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-danger/10 border border-danger/20 hover:bg-danger/20 transition-all group"
            >
              <XCircle className="w-10 h-10 text-danger group-hover:scale-110 transition-transform" />
              <span className="font-black text-xs uppercase tracking-widest text-danger">Failed</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          className="bg-[#0F172A]/80 backdrop-blur-2xl p-12 rounded-[3rem] border border-white/5 shadow-2xl text-center relative overflow-hidden"
        >
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
            <motion.div 
              className="h-full bg-accent shadow-[0_0_10px_rgba(34,211,238,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / (questions.length + 2)) * 100}%` }}
            />
          </div>

          <div className="mb-10 inline-flex p-6 bg-white/5 rounded-[2rem] shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            {step === 0 ? <Battery className="w-8 h-8 text-accent" /> : 
             step === 1 ? <Smile className="w-8 h-8 text-purple-400" /> : 
             <MessageSquare className="w-8 h-8 text-growth" />}
          </div>

          <h2 className="text-4xl font-black mb-12 uppercase italic tracking-tighter text-white leading-none min-h-[5rem]">
            {step === 0 ? "Energy State" : 
             step === 1 ? "Current Mood" : 
             questions[step - 2]}
          </h2>

          <div className="grid gap-4">
            {step < 2 ? (
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                  <button
                    key={val}
                    onClick={() => handleNext(val)}
                    className="aspect-square flex items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:border-accent hover:text-accent font-black text-lg transition-all active:scale-90"
                  >
                    {val}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="TYPE RESPONSE..."
                  className="w-full p-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-accent font-bold uppercase tracking-widest text-white text-center"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleNext(e.target.value);
                  }}
                />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Press Enter to Proceed</p>
              </div>
            )}
          </div>
          
          <div className="mt-12 flex justify-center gap-2 opacity-30">
            <Activity className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Sync Active</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
