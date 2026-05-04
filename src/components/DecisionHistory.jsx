'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Shield, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  X, 
  Brain, 
  Loader2, 
  AlertCircle,
  MessageSquare,
  Zap
} from 'lucide-react';

export default function DecisionHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/decisions/history');
      const data = await res.json();
      if (res.ok) {
        setHistory(data);
      }
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setLoading(false);
    }
  };

  const updateOutcome = async (id, status) => {
    setUpdating(id);
    try {
      const res = await fetch('/api/decisions/outcome', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ decisionId: id, status })
      });
      if (res.ok) fetchHistory();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const getStats = () => {
    const completed = history.filter(h => h.outcomeStatus !== 'awaiting');
    const good = completed.filter(h => h.outcomeStatus === 'executed').length;
    const rate = completed.length > 0 ? Math.round((good / completed.length) * 100) : 0;
    const pendingAction = history.filter(h => {
      if (h.outcomeStatus !== 'awaiting') return false;
      const created = new Date(h.createdAt);
      const diff = (new Date() - created) / (1000 * 60 * 60 * 24);
      return diff >= 7;
    });
    return { rate, pendingAction: pendingAction.length };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
        <p className="text-foreground/60 font-black uppercase tracking-[0.2em] text-[10px]">Accessing Decision Vault...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-20 md:py-40 bg-white rounded-[2.5rem] md:rounded-[4rem] border border-border shadow-sm px-6">
        <Target className="w-12 h-12 md:w-16 md:h-16 text-foreground/20 mx-auto mb-10" />
        <h2 className="text-3xl md:text-4xl font-heading font-black uppercase tracking-tighter text-foreground mb-6">Zero Neural Logs</h2>
        <p className="text-foreground/60 max-w-xs mx-auto font-bold uppercase tracking-[0.2em] text-[10px] leading-relaxed">
          Your decision matrix is currently empty. Run a diagnostic scan to populate your memory.
        </p>
      </div>
    );
  }


  return (
    <div className="space-y-12">
      {/* Neural Log Modal */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedLog(null)}
              className="absolute inset-0 bg-[#f5f0e8]/95 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.98, y: 20 }}
              className="relative w-full max-w-5xl bg-white border border-border rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-20 overflow-y-auto max-h-[95vh] md:max-h-[90vh] shadow-2xl"
            >
              <button onClick={() => setSelectedLog(null)} className="absolute top-8 right-8 md:top-16 md:right-16 text-foreground/40 hover:text-primary transition-colors">
                <X className="w-8 h-8 md:w-10 md:h-10" />
              </button>

              <div className="mb-12 md:mb-20">
                <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-8">
                  <div className="px-5 py-2 bg-primary/5 border border-primary/10 rounded-full text-[9px] md:text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                    Deep Dive Log #{selectedLog._id.slice(-6)}
                  </div>
                  <span className="text-[9px] md:text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">{selectedLog.persona || 'Realist'} Perspective Active</span>
                </div>
                <h2 className="text-4xl md:text-7xl font-heading font-black text-foreground tracking-tighter uppercase leading-[0.8] mb-12">{selectedLog.question}</h2>
              </div>


              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
                <section className="space-y-12 md:space-y-16">
                  {selectedLog.analysis.successProbability !== undefined && (
                    <div>
                       <div className="flex justify-between items-center mb-6">
                          <h4 className="text-[9px] md:text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em]">Chance of Success</h4>
                          <span className="text-2xl md:text-3xl font-heading font-black text-foreground">{selectedLog.analysis.successProbability}%</span>
                       </div>
                       <div className="h-2 bg-soft rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${selectedLog.analysis.successProbability}%` }}
                            className={`h-full ${selectedLog.analysis.successProbability > 70 ? 'bg-green-500' : 'bg-primary'}`}
                          />
                       </div>
                    </div>
                  )}

                  {selectedLog.analysis.expertPerspective && (
                    <div className="p-8 md:p-10 bg-soft rounded-[2rem] md:rounded-[2.5rem] border border-border">
                      <h4 className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6">Expert Logic</h4>
                      <p className="text-xl md:text-2xl font-heading font-bold text-foreground/80 leading-snug italic">"{selectedLog.analysis.expertPerspective}"</p>
                    </div>
                  )}

                  <div>
                    <h4 className="text-[9px] md:text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em] mb-6 italic">Hidden Fears</h4>
                    <p className="text-xl md:text-2xl font-heading font-bold text-foreground leading-relaxed">"{selectedLog.analysis.fearAnalysis}"</p>
                  </div>
                </section>


                <section className="bg-primary p-12 md:p-16 rounded-[4rem] text-white shadow-xl shadow-primary/20 h-fit">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-10 opacity-60">Next Action Steps</h4>
                    <ul className="space-y-8">
                      {selectedLog.analysis.nextSteps?.map((step, i) => (
                        <li key={i} className="text-xl font-heading font-bold flex items-start gap-6 leading-tight">
                          <span className="opacity-30 text-sm mt-1">0{i+1}</span> {step}
                        </li>
                      ))}
                    </ul>
                </section>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
           <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em] mb-4">Good Decisions</p>
           <div className="flex items-center gap-4">
              <h3 className="text-5xl font-heading font-black text-primary leading-none">{stats.rate}%</h3>
              <TrendingUp className="w-8 h-8 text-green-500" />
           </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
           <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em] mb-4">Neural Debt</p>
           <div className="flex items-center gap-4">
              <h3 className="text-5xl font-heading font-black text-foreground leading-none">{stats.pendingAction}</h3>
              <Clock className="w-8 h-8 text-orange-500" />
           </div>
           <p className="text-[9px] font-bold text-foreground/40 mt-4 uppercase tracking-widest">Decisions needing outcome audits</p>
        </div>
        <div className="bg-primary p-8 rounded-[2.5rem] shadow-xl shadow-primary/20 text-white">
           <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-60">Regret Moat</p>
           <h3 className="text-5xl font-heading font-black leading-none">Safe</h3>
           <p className="text-[9px] font-bold mt-4 uppercase tracking-widest opacity-60">No major regret patterns detected</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 md:mb-16 gap-6 px-4">
        <h2 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-tighter text-foreground">Choice <span className="text-primary italic font-cursive normal-case px-2">History</span></h2>
        <div className="bg-white px-6 py-3 md:px-8 md:py-4 rounded-full border border-border flex items-center gap-4 shadow-sm w-fit">
          <span className="text-[9px] md:text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">Total Checks</span>
          <span className="text-xl md:text-2xl font-heading font-black text-foreground">{history.length}</span>
        </div>
      </div>


      <div className="grid grid-cols-1 gap-8">
        {history.map((item, idx) => {
          const isDelayed = item.outcomeStatus === 'awaiting' && (new Date() - new Date(item.createdAt)) / (1000 * 60 * 60 * 24) >= 7;
          
          return (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`group relative bg-white border p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] hover:shadow-xl transition-all overflow-hidden cursor-pointer ${isDelayed ? 'border-orange-200 bg-orange-50/10' : 'border-border'}`}
              onClick={() => setSelectedLog(item)}
            >
              {isDelayed && (
                <div className="absolute top-0 right-0 px-6 py-2 bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest rounded-bl-3xl flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Outcome Audit Required
                </div>
              )}

              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 md:gap-12">

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-6 mb-8">
                    <div className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${
                      item.analysis?.verdict?.includes('NO-GO') ? 'bg-red-50 text-red-600 border border-red-100' : item.analysis?.verdict?.includes('PIVOT') ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-green-50 text-green-600 border border-green-100'
                    }`}>
                      {item.analysis?.verdict || 'ANALYZING'}
                    </div>
                    
                    {item.outcomeStatus === 'awaiting' ? (
                      <div className="flex flex-wrap gap-3">
                         <button 
                          disabled={updating === item._id}
                          onClick={(e) => { e.stopPropagation(); updateOutcome(item._id, 'executed'); }}
                          className="px-5 py-2 bg-soft border border-border text-foreground/60 text-[9px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-green-500 hover:text-white transition-all flex items-center gap-2"
                         >
                           Executed
                         </button>
                         <button 
                          disabled={updating === item._id}
                          onClick={(e) => { e.stopPropagation(); updateOutcome(item._id, 'pivoted'); }}
                          className="px-5 py-2 bg-soft border border-border text-foreground/60 text-[9px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                         >
                           Pivoted
                         </button>
                         <button 
                          disabled={updating === item._id}
                          onClick={(e) => { e.stopPropagation(); updateOutcome(item._id, 'regretted'); }}
                          className="px-5 py-2 bg-soft border border-border text-foreground/60 text-[9px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                         >
                           Regretted
                         </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 px-5 py-2 bg-soft rounded-full border border-border">
                        <div className={`w-1.5 h-1.5 rounded-full ${item.outcomeStatus === 'executed' ? 'bg-green-500' : item.outcomeStatus === 'regretted' ? 'bg-red-500' : 'bg-orange-500'}`} />
                        <span className="text-[9px] font-black text-foreground/60 uppercase tracking-[0.2em]">{item.outcomeStatus}</span>
                      </div>
                    )}

                  <span className="text-[9px] font-black text-foreground/40 uppercase tracking-[0.3em] flex items-center gap-2 ml-auto">
                    {new Date(item.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                
                <h3 className="text-4xl md:text-5xl font-heading font-black text-foreground tracking-tighter group-hover:text-primary transition-colors leading-[0.85] uppercase">
                  {item.question}
                </h3>
              </div>

              <div className="flex items-center gap-12">
                 <div className="flex items-center gap-8">
                    <div className="text-center">
                       <p className="text-[9px] font-black text-foreground/40 uppercase tracking-[0.2em] mb-4">Choice Impact</p>
                       <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all mx-auto ${
                         item.analysis?.verdict?.includes('NO-GO') ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
                       }`}>
                         {item.analysis?.verdict?.includes('NO-GO') ? <TrendingDown className="w-8 h-8" /> : <TrendingUp className="w-8 h-8" />}
                       </div>
                    </div>
                 </div>
                 
                 <div className="w-16 h-16 bg-soft rounded-[2rem] flex items-center justify-center text-foreground/40 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                   <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                 </div>
              </div>
            </div>

            {item.analysis?.qualityScore && (
              <div className="mt-12 pt-10 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-8 flex-1">
                  <div className="text-[9px] font-black text-foreground/40 uppercase tracking-[0.3em]">Thinking Clarity</div>
                  <div className="flex-1 max-w-sm h-1.5 bg-soft rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.analysis.qualityScore}%` }}
                      className="h-full bg-primary" 
                    />
                  </div>
                  <div className="text-xl font-heading font-black text-foreground leading-none">{item.analysis.qualityScore}%</div>
                </div>
                <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-foreground/40 italic">
                  {item.persona || 'Realist'} Perspective
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
