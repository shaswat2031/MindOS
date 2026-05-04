'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowLeft, Sparkles, Target, Zap, Shield, AlertTriangle, ArrowRight, Info, Brain, Activity } from 'lucide-react';

export default function DecisionSimulator({ decision, onBack }) {
  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  useEffect(() => {
    fetchSimulation();
  }, [decision]);

  const fetchSimulation = async () => {
    try {
      const res = await fetch('/api/decisions/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision })
      });
      const data = await res.json();
      setSimulation(data);
    } catch (err) {
      console.error("Simulation Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-black rounded-[3rem]">
        <Loader2 className="w-16 h-16 text-primary animate-spin mb-8" />
        <h2 className="text-3xl font-heading font-black uppercase tracking-tighter text-white/40 animate-pulse text-center px-6">
          Calculating Quantum Probabilities...
        </h2>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[85vh] bg-black rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl flex font-sans">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Header Info */}
      <div className="absolute top-10 left-10 z-20 flex items-center gap-8">
        <button 
          onClick={onBack}
          className="w-14 h-14 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all group"
        >
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <div className="flex items-center gap-3 mb-1">
             <Brain className="w-4 h-4 text-primary" />
             <h2 className="text-3xl font-heading font-black text-white uppercase tracking-tighter leading-none">Scenario Matrix</h2>
          </div>
          <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] max-w-md truncate">Analysis: {decision}</p>
        </div>
        <div className="ml-auto flex items-center gap-4 bg-primary/10 border border-primary/20 px-6 py-3 rounded-2xl max-w-sm">
          <Shield className="w-5 h-5 text-primary shrink-0" />
          <div>
            <p className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">Neural Verdict</p>
            <p className="text-[10px] font-black text-white uppercase tracking-widest truncate">
              {simulation?.recommendation?.path || 'Alpha'} Recommended
            </p>
            <p className="text-[7px] font-bold text-white/40 uppercase tracking-widest mt-1 leading-tight">
              {simulation?.recommendation?.reason || 'Mathematical ROI is highest on this trajectory.'}
            </p>
          </div>
        </div>
      </div>

      {/* 2D Projection Canvas */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide flex items-center pl-40 pr-96">
        <div className="relative flex items-center min-w-max h-full">
          
          {/* Timeline Labels */}
          <div className="absolute top-1/4 left-0 w-full flex justify-between pointer-events-none opacity-20 border-b border-white/10 pb-4">
             <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white">Origin</span>
             <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white">Near Horizon</span>
             <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white">Deep Horizon</span>
          </div>

          {/* Today Anchor */}
          <div className="relative flex flex-col items-center mr-60">
             <motion.div 
               whileHover={{ scale: 1.1 }}
               onClick={() => setSelectedMilestone({ 
                 label: 'POINT ZERO', 
                 description: 'This is your current state of logic. All parallel versions of your future start here. Your current profile context (Work, Energy, Focus) is being used as the baseline for this simulation.', 
                 probability: 100 
               })}
               className="w-24 h-24 rounded-[2.5rem] bg-white flex items-center justify-center text-black shadow-[0_0_50px_rgba(255,255,255,0.2)] cursor-pointer z-10 border-4 border-white/20"
             >
                <Target className="w-10 h-10" />
             </motion.div>
             <div className="absolute -bottom-16 text-center">
                <p className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Point Zero</p>
                <p className="text-[8px] font-bold text-primary uppercase tracking-widest mt-1">Status: Stable</p>
             </div>
          </div>

          {/* Parallel Paths */}
          <div className="flex flex-col gap-32 relative">
            {simulation?.paths?.map((path, pIdx) => (
              <div key={pIdx} className="relative flex items-center">
                
                {/* SVG Connectors */}
                <svg className="absolute -left-60 top-1/2 -translate-y-1/2 w-60 h-20 pointer-events-none opacity-30">
                   <path 
                    d={`M 0 40 Q 30 ${pIdx === 0 ? -40 : pIdx === 2 ? 120 : 40} 240 40`} 
                    stroke={path.color} 
                    strokeWidth="3" 
                    fill="transparent" 
                    strokeDasharray="8 8"
                   />
                </svg>

                <div className="flex items-center gap-24">
                  {path.milestones.map((m, mIdx) => (
                    <div key={mIdx} className="relative flex flex-col items-center">
                      
                      {/* Internal Path Connector */}
                      {mIdx > 0 && (
                        <div 
                          className="absolute right-full top-1/2 -translate-y-1/2 w-24 h-[1px] opacity-20"
                          style={{ backgroundColor: path.color }}
                        />
                      )}
                      
                      <motion.div 
                        whileHover={{ scale: 1.2, rotate: 45 }}
                        onMouseEnter={() => setSelectedMilestone(m)}
                        onClick={() => setSelectedMilestone(m)}
                        className="w-16 h-16 rounded-2xl flex items-center justify-center cursor-pointer transition-all border-2 border-white/5 relative z-10"
                        style={{ backgroundColor: `${path.color}15`, borderColor: `${path.color}30`, color: path.color }}
                      >
                         <div className="absolute inset-0 blur-xl opacity-20" style={{ backgroundColor: path.color }} />
                         <Sparkles className="w-6 h-6 relative z-10" />
                      </motion.div>
                      
                      <div className="absolute -bottom-20 w-48 text-center group">
                        <p className="text-[11px] font-black text-white/80 uppercase tracking-tighter mb-1 transition-all group-hover:text-white">{m.label}</p>
                        <div className="flex items-center justify-center gap-2">
                           <span className="px-2 py-0.5 rounded-full bg-white/5 text-[8px] font-bold text-white/40 uppercase tracking-widest">{m.months} Months</span>
                           <span className="text-[8px] font-black text-white/20" style={{ color: `${path.color}80` }}>{m.probability}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Intelligence Panel */}
      <AnimatePresence>
        {selectedMilestone && (
          <motion.div 
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 200 }}
            className="absolute top-0 right-0 h-full w-[450px] bg-black/40 backdrop-blur-[80px] border-l border-white/10 p-16 flex flex-col z-30 shadow-[-50px_0_100px_rgba(0,0,0,0.5)]"
          >
            <button 
              onClick={() => setSelectedMilestone(null)}
              className="mb-16 text-white/30 hover:text-white flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] transition-all"
            >
              <ArrowRight className="w-4 h-4" /> Close Intelligence
            </button>

            <div className="flex-1">
               <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-primary/20 rounded-[1.2rem] flex items-center justify-center text-primary border border-primary/20">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-1">Reality Descriptor</p>
                    <p className="text-xs font-bold text-primary uppercase tracking-widest">Existence Node</p>
                  </div>
               </div>

               <h3 className="text-5xl font-heading font-black text-white uppercase tracking-tighter leading-[0.9] mb-10">
                {selectedMilestone.label}
               </h3>

               <p className="text-white/50 text-lg font-medium leading-relaxed mb-16 italic">
                "{selectedMilestone.description}"
               </p>

               <div className="space-y-10">
                  <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                       <Info className="w-5 h-5 text-white" />
                    </div>
                    
                    <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-6">Existence Probability</h4>
                    
                    <div className="flex items-end justify-between mb-4">
                       <span className="text-5xl font-heading font-black text-white tracking-tighter">{selectedMilestone.probability}%</span>
                       <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] pb-2">Likelihood</span>
                    </div>

                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedMilestone.probability}%` }}
                        className="h-full bg-gradient-to-r from-primary to-blue-400 shadow-[0_0_20px_#6366f1]" 
                      />
                    </div>
                    
                    <p className="mt-8 text-[9px] font-bold text-white/30 uppercase tracking-widest leading-relaxed">
                      * This percentage represents the mathematical stability of this event given your current life context and chosen path.
                    </p>
                  </div>
               </div>
            </div>

            <div className="mt-auto space-y-4">
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] text-center mb-6">Neural Calibration Recommended</p>
              <button className="w-full py-8 bg-white text-black rounded-3xl font-heading font-black uppercase tracking-widest text-[11px] hover:bg-primary hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4">
                 <Zap className="w-5 h-5" />
                 Commit to this future
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Legend */}
      <div className="absolute bottom-10 left-10 flex gap-8 px-8 py-5 bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10">
         <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-md bg-[#6366f1] shadow-[0_0_10px_#6366f1]" />
            <div>
               <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Alpha</p>
               <p className="text-[7px] font-bold text-white/30 uppercase tracking-widest mt-1">Full Commitment</p>
            </div>
         </div>
         <div className="w-px h-6 bg-white/10" />
         <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-md bg-[#94a3b8] shadow-[0_0_10px_#94a3b8]" />
            <div>
               <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Beta</p>
               <p className="text-[7px] font-bold text-white/30 uppercase tracking-widest mt-1">Stagnation / Delay</p>
            </div>
         </div>
         <div className="w-px h-6 bg-white/10" />
         <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-md bg-[#ef4444] shadow-[0_0_10px_#ef4444]" />
            <div>
               <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Gamma</p>
               <p className="text-[7px] font-bold text-white/30 uppercase tracking-widest mt-1">Ignore / Rejection</p>
            </div>
         </div>
      </div>
    </div>
  );
}
