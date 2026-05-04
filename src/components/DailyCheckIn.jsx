'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Send, CheckCircle2, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { useMindStore } from '@/lib/store';

const QUESTIONS = [
  "What are you avoiding today?",
  "What decision are you delaying?",
  "What's the one thing that would make everything else easier?",
  "What are you dreading most right now?",
  "If you had infinite courage, what would you do today?",
  "What is the most high-leverage thing you can do in the next hour?",
  "Is your current mood influencing your logic? (Be honest)",
];

export default function DailyCheckIn({ onClose }) {
  const { addXP, userProfile } = useMindStore();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Pick a random question for the day
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    setQuestion(QUESTIONS[dayOfYear % QUESTIONS.length]);
  }, []);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/user/daily-checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer })
      });
      if (res.ok) {
        setCompleted(true);
        addXP(20);
        setTimeout(() => onClose(), 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white border border-border p-8 md:p-12 max-w-xl w-full rounded-[3rem] shadow-2xl relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {!completed ? (
            <motion.div 
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <HelpCircle className="w-6 h-6" />
                 </div>
                 <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em]">Daily Clarity Probe</p>
              </div>

              <h2 className="text-3xl md:text-4xl font-heading font-black uppercase tracking-tighter leading-tight mb-10 text-foreground">
                {question}
              </h2>

              <textarea 
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your raw, unfiltered truth..."
                className="w-full h-40 bg-soft border border-border rounded-3xl p-6 text-lg font-heading font-bold text-foreground placeholder:text-foreground/20 outline-none focus:border-primary transition-all mb-8 resize-none"
              />

              <div className="flex gap-4">
                <button 
                  onClick={onClose}
                  className="flex-1 py-5 border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:border-primary transition-all"
                >
                  Skip for now
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={loading || !answer.trim()}
                  className="flex-[2] py-5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-30"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Log Truth</>}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-green-50 border border-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-heading font-black uppercase tracking-tighter mb-4 text-foreground">Truth Logged</h2>
              <p className="text-primary font-bold uppercase tracking-widest text-[10px] mb-8">+20 XP Awarded for Self-Honesty</p>
              <div className="flex items-center justify-center gap-3 text-foreground/40 text-[9px] font-black uppercase tracking-widest">
                <Sparkles className="w-4 h-4" /> Synthesizing weekly patterns...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
