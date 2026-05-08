'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Send, Clock, CheckCircle2, AlertCircle, Copy, ArrowRight, ShieldCheck } from 'lucide-react';
import { useMindStore } from '@/lib/store';
import { toast } from 'sonner';

const CountdownTimer = ({ expiresAt }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(expiresAt).getTime() - now;

      if (distance < 0) {
        setTimeLeft('EXPIRED');
        clearInterval(timer);
        return;
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft(`${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  return (
    <div className="flex items-center gap-2 text-orange-600 font-mono text-[10px] font-black">
      <Clock className="w-3 h-3" /> {timeLeft}
    </div>
  );
};

export default function FamilyCouncil() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newAudit, setNewAudit] = useState({ title: '', context: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    try {
      const res = await fetch('/api/family-council/list');
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setAudits(data);
      } else {
        console.error('API Error:', data.error);
        setAudits([]);
      }
    } catch (err) {
      console.error('Error fetching audits:', err);
      setAudits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/family-council/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          decisionTitle: newAudit.title, 
          context: newAudit.context 
        }),
      });
      if (res.ok) {
        setShowCreate(false);
        setNewAudit({ title: '', context: '' });
        fetchAudits();
      }
    } catch (err) {
      console.error('Error creating audit:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleGenerate = async (id) => {
    const confirmToast = toast.info('Force generate analysis?', {
      action: {
        label: 'Generate',
        onClick: async () => {
          try {
            const res = await fetch(`/api/family-council/${id}`, { method: 'POST' });
            if (res.ok) {
              toast.success('Analysis generated successfully');
              fetchAudits();
            } else {
              const data = await res.json();
              toast.error(data.error || 'Failed to generate analysis');
            }
          } catch (err) {
            toast.error('Error connecting to server');
          }
        },
      },
    });
  };

  const copyCode = (code) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    const url = `${baseUrl}/family-council/${code}`;
    navigator.clipboard.writeText(url);
    toast.success('Invite link copied to clipboard!');
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-5xl font-heading font-black tracking-tighter uppercase mb-2">Family Council</h2>
          <p className="text-foreground/40 text-sm font-bold uppercase tracking-widest">Collective De-biasing Module</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-10 py-5 bg-primary text-white rounded-full font-heading font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-4"
        >
          <Users className="w-5 h-5" /> Start New Audit
        </button>
      </header>

      {/* Stats/Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-white border border-border rounded-[2.5rem]">
           <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
              <ShieldCheck className="w-6 h-6" />
           </div>
           <h4 className="text-xl font-bold mb-2">100% Anonymous</h4>
           <p className="text-sm text-foreground/40 leading-relaxed uppercase tracking-wider font-bold">Family members can speak the truth without fear of seniority bias or emotional pressure.</p>
        </div>
        <div className="p-8 bg-white border border-border rounded-[2.5rem]">
           <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 mb-6">
              <Clock className="w-6 h-6" />
           </div>
           <h4 className="text-xl font-bold mb-2">10m Test Window</h4>
           <p className="text-sm text-foreground/40 leading-relaxed uppercase tracking-wider font-bold">Data collection stops after 10 minutes for testing. MindOS then synthesizes a neutral logical report.</p>
        </div>
        <div className="p-8 bg-white border border-border rounded-[2.5rem]">
           <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-6">
              <CheckCircle2 className="w-6 h-6" />
           </div>
           <h4 className="text-xl font-bold mb-2">India-First Logic</h4>
           <p className="text-sm text-foreground/40 leading-relaxed uppercase tracking-wider font-bold">Designed specifically for Indian families where collective decisions often hide individual logic.</p>
        </div>
      </div>

      {/* Active Audits */}
      <div className="space-y-6">
        <h3 className="text-2xl font-heading font-black tracking-tight uppercase">Your Councils</h3>
        
        {loading ? (
          <div className="h-64 bg-soft/50 rounded-[3rem] animate-pulse" />
        ) : audits.length === 0 ? (
          <div className="p-20 text-center border-2 border-dashed border-border rounded-[3rem] bg-soft/20">
            <Users className="w-12 h-12 mx-auto mb-6 text-foreground/20" />
            <p className="text-foreground/40 font-bold uppercase tracking-widest">No active councils found.</p>
          </div>
        ) : (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {audits.map((audit, i) => (
              <motion.div
                key={audit._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <AuditCard 
                  audit={audit} 
                  onCopy={() => copyCode(audit.inviteCode)} 
                  onGenerate={() => handleGenerate(audit._id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setShowCreate(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] p-12 overflow-hidden"
            >
              <h3 className="text-4xl font-heading font-black tracking-tight uppercase mb-8">Start Family Audit</h3>
              <form onSubmit={handleCreate} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-3">Decision Topic</label>
                  <input
                    type="text"
                    required
                    value={newAudit.title}
                    onChange={(e) => setNewAudit({ ...newAudit, title: e.target.value })}
                    className="w-full bg-soft/50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="e.g. Marriage with XYZ, Moving to Bangalore, Starting a business"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-3">Context for the Family</label>
                  <textarea
                    required
                    value={newAudit.context}
                    onChange={(e) => setNewAudit({ ...newAudit, context: e.target.value })}
                    className="w-full bg-soft/50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none h-40 resize-none"
                    placeholder="Provide enough background so everyone knows what they are advising on..."
                  />
                </div>
                <button
                  disabled={creating}
                  className="w-full py-6 bg-primary text-white rounded-full font-heading font-black uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                >
                  {creating ? 'Initializing Council...' : 'Launch Family Council'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AuditCard({ audit, onCopy, onGenerate }) {
  const isClosed = audit.status === 'closed' || new Date() > new Date(audit.expiresAt);
  const responses = audit.opinions?.length || 0;

  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -5 }}
      className={`p-10 rounded-[3rem] border transition-all ${isClosed ? 'bg-white border-border shadow-sm' : 'bg-primary/5 border-primary/20 shadow-xl shadow-primary/5'}`}
    >
      <div className="flex items-center justify-between mb-8">
        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${isClosed ? 'bg-soft text-foreground/40' : 'bg-primary text-white animate-pulse'}`}>
          {isClosed ? 'Audit Closed' : 'Live Audit'}
        </span>
        <div className="flex items-center gap-4">
          {!isClosed && <CountdownTimer expiresAt={audit.expiresAt} />}
          <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest flex items-center gap-2">
            <Users className="w-3 h-3" /> {responses} Responses
          </span>
        </div>
      </div>

      <h4 className="text-3xl font-heading font-black tracking-tight uppercase mb-4 leading-tight">{audit.decisionTitle}</h4>
      <p className="text-sm text-foreground/60 mb-10 line-clamp-2">{audit.context}</p>

      {isClosed ? (
        <button 
           onClick={() => window.location.href = `/family-council/report/${audit._id}`}
           className="w-full py-4 border border-border hover:border-primary rounded-full flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:text-primary transition-all"
        >
          View Logical Report <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-4">
            <button 
              onClick={onCopy}
              className="flex-1 py-4 bg-primary text-white rounded-full flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/10"
            >
              <Copy className="w-4 h-4" /> Copy Invite Link
            </button>
            <div className="w-24 bg-white border border-border rounded-full flex items-center justify-center text-xs font-black tracking-tighter text-primary">
              {audit.inviteCode}
            </div>
          </div>
          <button
            onClick={onGenerate}
            disabled={responses === 0}
            className="w-full py-4 bg-white text-orange-600 rounded-full border border-orange-200 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-orange-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShieldCheck className="w-4 h-4" /> Force Generate Analysis (Testing)
          </button>
        </div>
      )}
    </motion.div>
  );
}
