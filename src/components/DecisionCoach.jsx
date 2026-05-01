'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, HelpCircle, Terminal, Shield, Zap, RefreshCcw, Loader2 } from 'lucide-react';
import { useMindStore } from '@/lib/store';

export default function DecisionCoach() {
  const { userProfile, addXP } = useMindStore();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "SYSTEM ONLINE. I am your Decision Engine. Input the variables of your current crossroads. What is the choice you are contemplating?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0); // 0: Initial, 1-5: Layered Questions, 6: Final Clarity
  const [decisionContext, setDecisionContext] = useState(null);
  
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/decisions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          step,
          userProfile 
        })
      });
      
      const data = await res.json();
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.content
      }]);
      
      setStep(data.nextStep);
      
      if (data.nextStep === 6) {
        addXP(50); // Reward for completing a decision cycle
      }
    } catch (error) {
      console.error("Decision engine error:", error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "ERROR: LOGIC LOOP DETECTED. Please re-state your input."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[80vh] bg-[#0F172A]/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl relative">
      {/* Decorative Glows */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]" />

      <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)]">
            <Terminal className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="font-black text-xl uppercase italic tracking-tighter">Decision Engine v2.0</h2>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full animate-pulse ${step === 6 ? 'bg-growth' : 'bg-accent'}`} />
              <p className="text-[10px] font-black text-accent uppercase tracking-widest">
                {step === 0 ? 'AWAITING INPUT' : step === 6 ? 'CLARITY REACHED' : `LAYER 0${step} ANALYSIS`}
              </p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => { setMessages([{ role: 'assistant', content: "SYSTEM RESET. What is the new decision?" }]); setStep(0); }}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-slate-500 hover:text-accent"
        >
          <RefreshCcw className="w-5 h-5" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 relative z-10 scrollbar-hide scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: m.role === 'assistant' ? -20 : 20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              className={`flex ${m.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-[85%] flex flex-col ${m.role === 'assistant' ? 'items-start' : 'items-end'}`}>
                <div className={`p-6 rounded-[2rem] ${
                  m.role === 'assistant' 
                    ? 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none leading-relaxed' 
                    : 'bg-accent text-black font-bold rounded-tr-none shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                }`}>
                  <p className="text-sm md:text-base tracking-tight whitespace-pre-wrap">{m.content}</p>
                </div>
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-3 px-2">
                  {m.role === 'assistant' ? 'ENGINE_CORE' : 'NEURAL_INPUT'}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 p-6 rounded-3xl rounded-tl-none flex gap-3">
              <Loader2 className="w-5 h-5 text-accent animate-spin" />
              <span className="text-[10px] font-black text-accent uppercase tracking-widest self-center">Processing Logic Layers...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-white/5 bg-[#020617]/50 backdrop-blur-xl relative z-10">
        {step === 6 ? (
          <div className="text-center py-4">
            <p className="text-growth font-black uppercase tracking-[0.3em] mb-6 flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" /> Decision History Saved
            </p>
            <button 
              onClick={() => { setMessages([{ role: 'assistant', content: "SYSTEM RESET. What is the next choice?" }]); setStep(0); }}
              className="px-10 py-4 bg-white/5 border border-white/10 hover:border-accent text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all"
            >
              Start New Analysis
            </button>
          </div>
        ) : (
          <div className="flex gap-4 p-2 bg-white/5 border border-white/10 rounded-2xl focus-within:border-accent/50 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={step === 0 ? "EX: SHOULD I QUIT MY JOB?" : "INPUT YOUR RESPONSE..."}
              className="flex-1 p-3 bg-transparent outline-none text-xs font-bold uppercase tracking-widest text-white placeholder:text-slate-600"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-4 bg-accent text-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50"
            >
              <Send className="w-5 h-5 stroke-[3px]" />
            </button>
          </div>
        )}
        <div className="flex justify-center gap-8 mt-6">
          <div className="flex items-center gap-2 opacity-30">
            <Shield className="w-3 h-3 text-accent" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Values Alignment Active</span>
          </div>
          <div className="flex items-center gap-2 opacity-30">
            <Zap className="w-3 h-3 text-accent" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Fear Filter v2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
