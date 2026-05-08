'use client';

import React, { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function FamilySubmissionPage({ params }) {
  const unwrappedParams = React.use(params);
  const { code } = unwrappedParams;
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relation, setRelation] = useState('');
  const [opinion, setOpinion] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAudit();
  }, [code]);

  const fetchAudit = async () => {
    try {
      const res = await fetch(`/api/family-council/public/${code}`);
      const data = await res.json();
      if (res.ok) {
        setAudit(data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to connect to MindOS');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/family-council/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode: code, relation, opinion }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to submit opinion');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 text-center">
      <div className="animate-pulse space-y-4">
        <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Establishing Secure Connection...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 text-center">
      <div className="max-w-md space-y-8">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-4xl font-heading font-black tracking-tight uppercase mb-4">Access Denied</h2>
          <p className="text-foreground/40 font-bold uppercase tracking-widest leading-relaxed">{error}</p>
        </div>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-10 py-5 bg-primary text-white rounded-full font-heading font-black uppercase tracking-widest shadow-xl shadow-primary/20"
        >
          Return to Base
        </button>
      </div>
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 text-center">
      <div className="max-w-md space-y-8">
        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-4xl font-heading font-black tracking-tight uppercase mb-4">Input Synchronized</h2>
          <p className="text-foreground/40 font-bold uppercase tracking-widest leading-relaxed">Your anonymous opinion has been securely added to the Family Council. The final de-biased report will be generated after the 24-hour window closes.</p>
        </div>
        <div className="p-6 bg-soft rounded-3xl border border-border">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">MindOS Ethics Protocol: Your identity is 100% hidden.</p>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-white py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary/20">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">Secure Family Consensus Module</p>
          <h1 className="text-5xl font-heading font-black tracking-tighter uppercase mb-6 leading-tight">{audit.decisionTitle}</h1>
          <div className="bg-soft/50 p-8 rounded-[2.5rem] border border-border text-left">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-3">Decision Context</h4>
            <p className="text-lg font-medium leading-relaxed text-foreground/80">{audit.context}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-4">Your Relation (e.g. Brother, Mother, Consultant)</label>
            <input
              type="text"
              required
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              className="w-full bg-white border border-border rounded-2xl px-8 py-5 font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
              placeholder="Who are you to the decision maker?"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-4">Your Honest Opinion</label>
            <textarea
              required
              value={opinion}
              onChange={(e) => setOpinion(e.target.value)}
              className="w-full bg-white border border-border rounded-2xl px-8 py-5 font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all h-60 resize-none"
              placeholder="Be honest. MindOS will strip out your bias and emotional pressure to provide a logical synthesis."
            />
          </div>

          <div className="p-6 bg-orange-50/50 rounded-3xl border border-orange-200 flex gap-4 items-center">
            <ShieldCheck className="w-6 h-6 text-orange-600 shrink-0" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-orange-800 leading-relaxed">
              Your submission is <span className="font-black underline">completely anonymous</span>. The decision maker will only see the aggregated logical synthesis, not your specific name or words.
            </p>
          </div>

          <button
            disabled={submitting}
            className="w-full py-6 bg-primary text-white rounded-full font-heading font-black uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-primary/30"
          >
            {submitting ? 'Encrypting & Sending...' : 'Submit Anonymous Advice'} <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </main>
  );
}
