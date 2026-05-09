'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMindStore } from '@/lib/store';
import { 
  BarChart2, 
  Zap, 
  Brain, 
  Shield, 
  AlertCircle, 
  ArrowUpRight, 
  TrendingUp, 
  Sparkles, 
  Loader2,
  Trophy,
  MessageSquare,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

function TaskItem({ action, index, reportAccent }) {
  const [isDone, setIsDone] = useState(false);
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => setIsDone(!isDone)}
      className={`group p-8 rounded-[2.5rem] border transition-all cursor-pointer flex items-start gap-6 ${
        isDone 
        ? 'bg-soft border-border opacity-50' 
        : 'bg-white border-border hover:shadow-md'
      }`}
    >
      <div className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all ${
        isDone ? 'bg-primary border-primary' : 'border-border'
      }`}>
        {isDone && <CheckCircle2 className="w-4 h-4 text-white" />}
      </div>
      <div className="flex-1">
        <p className={`text-xl font-heading font-bold text-foreground leading-tight transition-all ${
          isDone ? 'line-through decoration-primary decoration-4 opacity-30' : ''
        }`}>
          {action}
        </p>
      </div>
    </motion.div>
  );
}

export default function WeeklyReport({ userPlan }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userProfile, xp, level } = useMindStore();

  useEffect(() => {
    if (userPlan === 'Free') {
      setLoading(false);
      return;
    }
    fetchReport();
  }, [userPlan]);

  const fetchReport = async () => {
    try {
      const res = await fetch('/api/reports/weekly');
      const data = await res.json();
      if (res.ok) {
        setReport(data);
      } else {
        setError(data.message || data.error);
      }
    } catch (err) {
      console.error("Failed to fetch report", err);
      setError("System Connection Error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    window.print();
  };

  if (userPlan === 'Free') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 md:p-16 bg-white border border-border rounded-[2.5rem] md:rounded-[4rem] shadow-sm relative overflow-hidden">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-soft rounded-2xl md:rounded-3xl flex items-center justify-center mb-8 md:mb-10">
          <Shield className="w-8 h-8 md:w-10 md:h-10 text-primary" />
        </div>
        <h2 className="text-3xl md:text-5xl font-heading font-black uppercase tracking-tighter text-foreground mb-6 leading-[0.9]">
          Neural Meta-Analysis <br/><span className="text-primary italic font-cursive normal-case px-2">Locked</span>
        </h2>
        <p className="max-w-xs md:max-w-md text-foreground/60 font-bold uppercase tracking-[0.3em] text-[10px] leading-relaxed mb-10 md:mb-12 px-4">
          The weekly pattern report aggregates your neural data to find cognitive blind spots. This feature requires Elite or Growth access.
        </p>
        <button className="w-full md:w-fit px-12 py-5 md:px-16 md:py-6 bg-primary text-white font-heading font-black uppercase tracking-[0.3em] rounded-[1.5rem] md:rounded-[2rem] hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-6">
          Unlock Weekly Insights <Zap className="w-5 h-5 fill-white" />
        </button>
      </div>
    );

  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-16 h-16 text-primary animate-spin mb-8" />
        <p className="text-foreground/60 font-black uppercase tracking-[0.3em] text-[10px]">Aggregating Weekly Insights...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="text-center py-40 bg-white rounded-[4rem] border border-border">
        <AlertCircle className="w-16 h-16 text-foreground/20 mx-auto mb-10" />
        <h2 className="text-4xl font-heading font-black uppercase tracking-tighter text-foreground">Insufficient Data</h2>
        <p className="text-foreground/60 mt-6 italic font-bold uppercase tracking-[0.2em] text-[10px] px-12">{error || "Log at least 3 decisions this week to generate a meta-analysis."}</p>
      </div>
    );
  }

  return (
    <div className="report-container relative space-y-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-16 no-print"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-10 px-4">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
               <p className="text-[9px] md:text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em]">Weekly Clarity Review</p>
            </div>
            <h2 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tighter text-foreground leading-[0.85]">
              How's it going, <br/><span className="text-primary italic font-cursive normal-case px-2">{userProfile?.name?.split(' ')[0]}?</span>
            </h2>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
             <div className="bg-white border border-border px-8 py-4 md:px-10 md:py-6 rounded-[2rem] md:rounded-[2.5rem] text-center shadow-sm">
               <p className="text-[8px] md:text-[9px] font-black text-foreground/40 uppercase tracking-[0.3em] mb-2">Weekly Clarity</p>
               <p className="text-3xl md:text-4xl font-heading font-black text-foreground leading-none">{report.logicScore}%</p>
             </div>
             <button 
              onClick={handleDownload}
              className="p-5 md:p-6 bg-primary text-white rounded-[1.2rem] md:rounded-[1.5rem] hover:scale-105 transition-all shadow-xl shadow-primary/20"
             >
               <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />
             </button>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Insights */}
          <section className="lg:col-span-8 space-y-12">
             <div className="bg-white p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border border-border shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                   <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-8 md:mb-12 flex items-center gap-3">
                     <Sparkles className="w-4 h-4" /> Your Dominant Thinking Style
                   </p>
                   <h3 className="text-4xl md:text-7xl font-heading font-black text-foreground uppercase tracking-tighter leading-[0.9] mb-8 md:mb-12">
                     {report.dominantBias}
                   </h3>
                   <div className="p-8 md:p-10 bg-soft rounded-[2rem] md:rounded-[2.5rem] border border-border italic text-xl md:text-2xl font-heading font-bold text-foreground/80 leading-snug mb-12 md:mb-16">
                     "{report.metaInsight}"
                   </div>
                   
                   <div className="space-y-6 md:space-y-8 mt-12 md:mt-16 border-t border-border pt-12 md:pt-16">
                      <h4 className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em] mb-8 md:mb-10">Weekly Deep Analysis</h4>
                      {report.detailedSummary?.split('\n').map((p, i) => (
                        <p key={i} className="text-lg md:text-xl font-heading font-bold text-foreground/60 leading-relaxed">
                          {p}
                        </p>
                      ))}
                   </div>

                   <div className="flex items-center gap-6 text-primary font-heading font-black uppercase tracking-[0.2em] text-[10px] mt-12 md:mt-16 px-4">
                     <Trophy className="w-5 h-5" /> {report.growthMetric}
                   </div>
                </div>
             </div>


             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { label: 'Thinking Clarity', value: report.logicScore + '%', icon: Shield },
                  { label: 'Decision Rank', value: level === 1 ? 'Seeker' : 'Expert', icon: Trophy },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white border border-border p-10 rounded-[3rem] flex items-center gap-8 shadow-sm">
                    <div className="w-16 h-16 bg-soft rounded-[1.5rem] flex items-center justify-center text-primary">
                      <stat.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-foreground/40 uppercase tracking-[0.3em] mb-2">{stat.label}</p>
                      <p className="text-3xl font-heading font-black text-foreground leading-none">{stat.value}</p>
                    </div>
                  </div>
                ))}
             </div>
          </section>

          {/* Action Steps Sidebar */}
          <section className="lg:col-span-4 space-y-12">
             <div className="bg-primary p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl shadow-primary/20 flex flex-col h-full text-white">
                <div className="flex items-center gap-4 mb-10 md:mb-12">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Next Week's Plan</p>
                </div>
                
                <div className="flex-1 space-y-6 md:space-y-8 mb-12 md:mb-16 text-black">
                  {report.actionPlan?.map((action, i) => (
                    <TaskItem key={i} action={action} index={i} />
                  ))}
                </div>

                <div className="p-6 md:p-8 bg-white/5 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 flex items-center gap-4 md:gap-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-full flex-shrink-0 flex items-center justify-center opacity-40">
                    <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <p className="text-[10px] md:text-[11px] font-heading font-bold uppercase leading-tight italic opacity-60">
                    "Success is the sum of small choices."
                  </p>
                </div>
             </div>

          </section>
        </div>
      </motion.div>
    </div>
  );
}
