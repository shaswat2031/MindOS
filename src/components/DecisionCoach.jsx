'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Zap, Shield, ArrowRight, Loader2, RefreshCcw, CheckCircle2, AlertTriangle, Brain, Sparkles, TrendingUp, Circle, Box } from 'lucide-react';
import { useMindStore } from '@/lib/store';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';

const DecisionSimulator = dynamic(() => import('./DecisionSimulator'), { 
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-black rounded-[3rem]">
      <Loader2 className="w-16 h-16 text-primary animate-spin mb-8" />
      <h2 className="text-3xl font-heading font-black uppercase tracking-tighter text-white/40 text-center px-6">
        Initializing Quantum Canvas...
      </h2>
    </div>
  )
});

import { SpotlightCard } from '@/components/ui/SpotlightCard';

export default function DecisionCoach() {

  const { userProfile, addXP } = useMindStore();
  const [step, setStep] = useState('input'); // 'input', 'diagnostic', 'results'
  const [decision, setDecision] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [committing, setCommitting] = useState(false);
  const [committed, setCommitted] = useState(false);
  const [persona, setPersona] = useState('Pragmatist');
  const [clarityBefore, setClarityBefore] = useState(5);
  const [clarityAfter, setClarityAfter] = useState(null);
  const [showSimulator, setShowSimulator] = useState(false);

  const PERSONAS = [
    { id: 'Pragmatist', name: 'The Pragmatist', desc: 'Cold logic & efficiency', icon: <Brain className="w-5 h-5" /> },
    { id: 'Stoic', name: 'The Stoic', desc: 'Control & resilience', icon: <Shield className="w-5 h-5" /> },
    { id: 'VC', name: 'The VC', desc: 'Leverage & asymmetric ROI', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'IndianMentor', name: 'The Indian Mentor', desc: 'Street-smart & cultural wisdom', icon: <Sparkles className="w-5 h-5" /> }
  ];

  const startDiagnostics = async () => {
    if (!decision.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/decisions/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, userProfile, persona })
      });
      const data = await res.json();
      if (res.ok && data && data.questions) {
        setQuestions(data.questions);
        setStep('clarity-pre');
      } else {
        toast.error("Neural Analysis Error", { description: data.error || "Please try again shortly." });
      }
    } catch (err) {
      console.error("Failed to generate questions", err);
      toast.error("System Connection Error", { description: "Please check your connectivity and retry." });
    } finally {
      setLoading(false);
    }
  };

  const getVerdict = async () => {
    if (Object.keys(answers).length < questions.length) return;
    setLoading(true);
    try {
      const res = await fetch('/api/decisions/analyze-graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          decision, 
          answers, 
          questions, 
          userProfile, 
          persona,
          clarityBefore 
        })
      });
      const data = await res.json();
      setResult(data);
      if (data.updatedProfile) {
        setUserProfile({ ...userProfile, mindProfile: data.updatedProfile });
      }
      setStep('results');
      addXP(100); // More XP for deep analysis

    } catch (err) {
      console.error("Analysis failed", err);
      toast.error("Reasoning Engine Timeout", { description: "The council took too long to reach consensus. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const saveClarityAfter = async (val) => {
    setClarityAfter(val);
    if (!result?.decisionId) return;
    try {
      await fetch('/api/decisions/update-clarity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decisionId: result.decisionId, clarityAfter: val })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const commitToDecision = async (days) => {
    if (!result?.decisionId) return;
    setCommitting(true);
    try {
      const res = await fetch('/api/decisions/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decisionId: result.decisionId, deadlineDays: days })
      });
      if (res.ok) {
        setCommitted(true);
        addXP(100); 
      }
    } catch (err) {
      console.error("Commitment failed", err);
    } finally {
      setCommitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-16 h-16 text-primary animate-spin mb-8" />
        <h2 className="text-3xl font-heading font-black uppercase tracking-tighter text-foreground/40 animate-pulse text-center">
          {step === 'clarity-pre' ? (
            <>Initializing Reasoning Council...<br/><span className="text-sm font-bold opacity-50">Stoic, VC & Pragmatist are reviewing your case.</span></>
          ) : 'Finding the Truth...'}
        </h2>
      </div>
    );
  }


  return (
    <div className="max-w-4xl mx-auto pb-20">
      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-border shadow-sm relative overflow-hidden"
          >

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-16">
                <div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-soft border border-border rounded-full w-fit mb-6">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                    <span className="text-[9px] font-black text-foreground/60 uppercase tracking-[0.2em]">Smart Guidance v3.0</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-tighter leading-[0.9] text-foreground">
                    Let's explore <br/> your <span className="text-primary italic font-cursive normal-case px-2">choice</span>
                  </h2>

                </div>
                <div className="hidden md:block">
                  <div className="w-20 h-20 bg-soft border border-border rounded-[2rem] flex items-center justify-center">
                    <Brain className="w-10 h-10 text-primary/60" />
                  </div>
                </div>
              </div>

              <textarea 
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
                placeholder="EX: SHOULD I START MY OWN BUSINESS NOW?"
                className="w-full h-48 md:h-64 bg-soft border border-border rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 text-xl md:text-2xl font-heading font-bold tracking-tight text-foreground placeholder:text-foreground/30 outline-none focus:border-primary transition-all mb-12 resize-none"
              />


              <div className="mb-12">
                <p className="text-[10px] font-black text-foreground/60 uppercase tracking-[0.3em] mb-6">Select Your Mentor</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {PERSONAS.map((p) => {
                    const isLocked = p.id !== 'Pragmatist' && userProfile?.plan !== 'Growth';
                    return (
                      <SpotlightCard
                        key={p.id}
                        className={`rounded-3xl border transition-all relative group ${
                          persona === p.id 
                          ? 'bg-primary border-primary text-white shadow-xl' 
                          : 'bg-white border-border text-foreground/60 hover:border-primary/50'
                        } ${isLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        <button
                          onClick={() => !isLocked && setPersona(p.id)}
                          className="w-full h-full p-8 text-left"
                        >
                          <div className={`mb-4 transition-colors ${persona === p.id ? 'text-white' : 'text-primary'}`}>
                            {p.icon}
                          </div>
                          <div className="font-heading font-black uppercase text-[10px] tracking-[0.2em] mb-1">{p.name}</div>
                          <div className={`text-[9px] font-bold ${persona === p.id ? 'text-white/80' : 'text-foreground/40'}`}>{p.desc}</div>
                          {isLocked && (
                            <div className="absolute top-4 right-4">
                              <Shield className="w-3 h-3 text-foreground/40" />
                            </div>
                          )}
                        </button>
                      </SpotlightCard>
                    );
                  })}
                </div>

              </div>

              <button 
                onClick={startDiagnostics}
                disabled={!decision.trim()}
                className="w-full py-8 bg-primary text-white font-heading font-black uppercase tracking-[0.3em] rounded-[2.5rem] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 shadow-xl shadow-primary/20 disabled:opacity-30"
              >
                Begin Deep Dive <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 'clarity-pre' && (
          <motion.div
            key="clarity-pre"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 md:p-16 rounded-[3rem] border border-border shadow-sm text-center"
          >
            <div className="w-20 h-20 bg-soft rounded-3xl flex items-center justify-center mx-auto mb-10">
              <AlertTriangle className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-tighter leading-tight mb-6">
              How <span className="text-primary italic font-cursive normal-case px-2">confused</span> <br/> are you right now?
            </h2>
            <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em] mb-12">Select your current mental fog level (1 = Clear, 10 = Paralysis)</p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setClarityBefore(num)}
                  className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl border font-heading font-black text-xl transition-all ${
                    clarityBefore === num 
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-110' 
                    : 'bg-soft border-border text-foreground/40 hover:border-primary/30'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setStep('diagnostic')}
              className="w-full py-8 bg-primary text-white font-heading font-black uppercase tracking-[0.3em] rounded-[2.5rem] hover:scale-[1.02] transition-all flex items-center justify-center gap-4"
            >
              Continue <ArrowRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}

        {step === 'diagnostic' && (
          <motion.div
            key="diag"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-12"
          >
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-tighter leading-[0.9] mb-4 text-foreground px-4">Deep Reflection</h2>
              <p className="text-foreground/60 font-bold uppercase tracking-[0.3em] text-[10px] px-6">Think carefully about these perspective-shifting questions</p>
            </div>


            <div className="space-y-10">
              {questions?.map((q, i) => (
                <div key={i} className="bg-white border border-border p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-sm hover:shadow-md transition-all">
                  <h3 className="text-xl md:text-2xl font-heading font-black text-foreground tracking-tight mb-8 md:mb-10 leading-[1.1]">
                    <span className="text-primary/40 mr-4 font-mono">{i+1}.</span> {q.question}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((opt, j) => (
                      <button
                        key={j}
                        onClick={() => setAnswers({...answers, [i]: opt})}
                        className={`p-8 rounded-2xl border text-left transition-all font-bold text-[10px] uppercase tracking-[0.2em] ${
                          answers[i] === opt 
                          ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                          : 'bg-soft border-border text-foreground/60 hover:border-primary/30'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={getVerdict}
              disabled={Object.keys(answers).length < questions.length}
              className="w-full py-10 bg-primary text-white font-heading font-black uppercase tracking-[0.3em] rounded-[3rem] hover:scale-[1.02] transition-all shadow-2xl shadow-primary/30 disabled:opacity-30"
            >
              Get My Path Forward
            </button>
          </motion.div>
        )}

        {step === 'results' && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 px-2 md:px-0">
              <section className="bg-white p-8 md:p-16 rounded-[3rem] md:rounded-[4rem] border border-border shadow-sm relative overflow-hidden group">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-8 md:mb-12">Your Clarity Result</p>
                <div className="space-y-8 md:space-y-12 relative z-10">
                  <div>
                    <h4 className="text-[9px] font-black text-foreground/40 uppercase tracking-[0.3em] mb-4">The core logic</h4>
                    <p className="text-xl md:text-2xl font-heading font-bold text-foreground leading-[1.2]">{result.logicReasoning}</p>
                  </div>
                  <div className={`p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border ${result.verdict?.includes('NO-GO') ? 'bg-red-50 border-red-100 text-red-600' : result.verdict?.includes('PIVOT') ? 'bg-orange-50 border-orange-100 text-orange-600' : 'bg-green-50 border-green-100 text-green-600'}`}>
                    <h4 className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 md:mb-6 opacity-60">Final Path</h4>
                    <p className="text-4xl md:text-5xl font-heading font-black tracking-tighter uppercase leading-[0.8]">
                      {result.verdict}
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-white p-8 md:p-16 rounded-[3rem] md:rounded-[4rem] border border-border space-y-10 md:space-y-12">

                  </div>
                )}
              </section>

              {/* Time Traveler Projection */}
              {result.timeTravel && (
                <div className="md:col-span-2">
                  <TimeTraveler data={result.timeTravel} />
                </div>
              )}


                {/* Expert Perspective */}
                {result.expertPerspective && (
                  <div className="p-8 bg-soft rounded-3xl border border-border">
                     <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-4">Mentor Perspective</p>
                     <p className="text-lg text-foreground/80 font-bold leading-snug">"{result.expertPerspective}"</p>
                  </div>
                )}

                {/* Ripple Effect */}
                <div>
                   <h4 className="text-[9px] font-black text-foreground/40 uppercase tracking-[0.3em] mb-4">Long-term Impact</h4>
                   <p className="text-xl font-heading font-bold text-foreground leading-relaxed">"{result.secondOrderEffects || result.fearAnalysis}"</p>
                </div>

                {/* Next Steps */}
                <div className="bg-primary p-10 rounded-[3rem] text-white">
                   <h4 className="text-[9px] font-black uppercase tracking-[0.3em] mb-8 opacity-60">Your Action Plan</h4>
                   <ul className="space-y-6">
                     {result.nextSteps?.map((step, idx) => (
                       <li key={idx} className="text-lg font-heading font-bold flex items-start gap-4 leading-tight">
                         <span className="opacity-40 text-sm mt-1">0{idx+1}</span>
                         {step}
                       </li>
                     ))}
                   </ul>
                </div>
              </section>
            </div>

            <div className="bg-white p-12 rounded-[3rem] border border-border text-center">
               <h3 className="text-2xl font-heading font-black text-foreground uppercase tracking-tight mb-8">How <span className="text-primary italic font-cursive normal-case px-2">clear</span> are you now?</h3>
               <div className="flex flex-wrap justify-center gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => saveClarityAfter(num)}
                      className={`w-10 h-10 md:w-14 md:h-14 rounded-xl border font-heading font-black text-lg transition-all ${
                        clarityAfter === num 
                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-110' 
                        : 'bg-soft border-border text-foreground/40 hover:border-primary/30'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
               </div>
               {clarityAfter !== null && (
                 <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 text-primary font-bold uppercase tracking-widest text-[10px]"
                 >
                   Clarity Gained: {Math.max(0, clarityAfter - (10 - clarityBefore))} Points
                 </motion.p>
               )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => setShowSimulator(true)}
                className="w-full py-8 bg-black text-white rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-900 transition-all flex items-center justify-center gap-4 border border-white/10"
              >
                <Box className="w-5 h-5 text-primary" /> Visualize Future Path
              </button>
              <button 
                onClick={() => { setStep('input'); setDecision(''); setAnswers({}); setResult(null); setCommitted(false); setClarityAfter(null); }}
                className="w-full py-8 bg-soft border border-border rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:border-primary transition-all text-foreground/60 hover:text-primary flex items-center justify-center gap-4"
              >
                <RefreshCcw className="w-5 h-5" /> Start New Reflection
              </button>
            </div>
          </motion.div>
        )}

        {showSimulator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] bg-black p-4 md:p-8"
          >
            <DecisionSimulator 
              decision={decision} 
              onBack={() => setShowSimulator(false)} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
