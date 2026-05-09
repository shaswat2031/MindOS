'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMindStore } from '@/lib/store';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Trash2, 
  Check, 
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Globe,
  Loader2,
  AlertCircle,
  LogOut
} from 'lucide-react';
import { SignOutButton } from '@clerk/nextjs';
import { toast } from 'sonner';


const SettingToggle = ({ label, description, enabled, onToggle }) => (
  <div className="flex items-center justify-between py-6 border-b border-border last:border-0">
    <div className="flex-1">
      <h4 className="text-sm font-heading font-black text-foreground uppercase tracking-wider mb-1">{label}</h4>
      <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest leading-relaxed max-w-sm">{description}</p>
    </div>
    <button 
      onClick={onToggle}
      className={`w-12 h-6 rounded-full transition-all relative ${enabled ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-soft border border-border'}`}
    >
      <motion.div 
        animate={{ x: enabled ? 26 : 4 }}
        className={`w-4 h-4 rounded-full mt-1 ${enabled ? 'bg-white' : 'bg-foreground/20'}`}
      />
    </button>
  </div>
);

export default function Settings() {
  const { userProfile, setActiveTab } = useMindStore();

  const [stats, setStats] = useState({ totalAudited: 0, averageLogicScore: 0, memberSince: '2026' });
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  
  // Toggles state
  const [notifications, setNotifications] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [biometric, setBiometric] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/user/stats');
      const data = await res.json();
      if (res.ok) {
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch settings stats", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistory = async () => {
    toast.error('Are you sure?', {
      description: 'This will permanently wipe all your decision logs.',
      action: {
        label: 'Wipe All',
        onClick: async () => {
          setDeleting(true);
          try {
            const res = await fetch('/api/user/delete-history', { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
              toast.success(data.message);
              setStats({ ...stats, totalAudited: 0, averageLogicScore: 0 });
            }
          } catch (err) {
            toast.error("Failed to wipe history.");
          } finally {
            setDeleting(false);
          }
        },
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto pb-10 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
           <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
           <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em]">System Preferences</p>
        </div>
        <h2 className="text-5xl md:text-6xl font-heading font-black uppercase tracking-tighter text-foreground leading-[0.85]">
          Neural Lab <br/><span className="text-primary italic font-cursive normal-case px-2">Settings</span>
        </h2>
      </div>

      <div className="space-y-8 md:y-12">
        {/* Profile Card */}
        <section className="bg-white border border-border p-6 md:p-12 rounded-[2.5rem] md:rounded-[4rem] shadow-sm">

          <div className="flex flex-col md:flex-row md:items-center gap-8 mb-12">
            <div className="w-20 h-20 rounded-[2rem] md:rounded-[2.5rem] bg-soft border border-border flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-heading font-black text-foreground uppercase tracking-tight">{userProfile?.name || 'User'}</h3>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{userProfile?.plan || 'Elite'} Member Since {stats.memberSince}</p>
            </div>
            <button className="md:ml-auto px-6 py-3 bg-soft border border-border rounded-full text-[9px] font-black uppercase tracking-widest hover:border-primary transition-all">
              Edit Identity
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-8 bg-soft rounded-[2.5rem] border border-border">
              <p className="text-[8px] font-black text-foreground/40 uppercase tracking-widest mb-2">Decisions Audited</p>
              <p className="text-3xl font-heading font-black text-foreground">{loading ? '...' : stats.totalAudited}</p>
            </div>
            <div className="p-8 bg-soft rounded-[2.5rem] border border-border">
              <p className="text-[8px] font-black text-foreground/40 uppercase tracking-widest mb-2">Logic Score</p>
              <p className="text-3xl font-heading font-black text-primary">{loading ? '...' : stats.averageLogicScore}%</p>
            </div>
            <div className="p-8 bg-soft rounded-[2.5rem] border border-border">
              <p className="text-[8px] font-black text-foreground/40 uppercase tracking-widest mb-2">Persona Active</p>
              <p className="text-3xl font-heading font-black text-foreground">Pragmatist</p>
            </div>
          </div>
        </section>

        {/* Global Configuration */}
        <section className="bg-white border border-border p-6 md:p-12 rounded-[2.5rem] md:rounded-[4rem] shadow-sm">

           <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
             <Globe className="w-4 h-4 text-primary" /> Cognitive Interface
           </h3>
           <div className="space-y-2">
             <SettingToggle 
                label="Neural Notifications" 
                description="Receive weekly clarity audits and logic reminders via email."
                enabled={notifications}
                onToggle={() => setNotifications(!notifications)}
             />
             <SettingToggle 
                label="Deep Focus Mode" 
                description="Hide analytics and metrics when running diagnostic scans for objective focus."
                enabled={focusMode}
                onToggle={() => setFocusMode(!focusMode)}
             />
             <SettingToggle 
                label="Advanced Privacy" 
                description="Require biometric authentication to view sensitive second-order effects."
                enabled={biometric}
                onToggle={() => setBiometric(!biometric)}
             />
           </div>
        </section>

        {/* Action Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button 
            onClick={() => setActiveTab('billing')}
            className="group bg-white border border-border p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] text-left hover:border-primary transition-all shadow-sm"
          >

            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 bg-soft border border-border rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <CreditCard className="w-5 h-5" />
              </div>
              <ChevronRight className="w-5 h-5 text-foreground/10 group-hover:text-primary transition-all" />
            </div>
            <h4 className="text-xl font-heading font-black text-foreground uppercase tracking-tight mb-2">Billing Ledger</h4>
            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Manage your {userProfile?.plan || 'Free'} subscription.</p>
          </button>


          <button 
            onClick={handleDeleteHistory}
            disabled={deleting}
            className="group bg-white border border-border p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] text-left hover:border-red-200 transition-all shadow-sm disabled:opacity-50"
          >

            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
              </div>
              <ChevronRight className="w-5 h-5 text-foreground/10 group-hover:text-red-500 transition-all" />
            </div>
            <h4 className="text-xl font-heading font-black text-foreground uppercase tracking-tight mb-2">Delete History</h4>
            <p className="text-[10px] font-bold text-red-400/60 uppercase tracking-widest">Permanently wipe the decision vault.</p>
          </button>
        </div>

        <div className="pt-4 border-t border-border mt-4">
          <SignOutButton redirectUrl="/">
            <button className="w-full flex items-center justify-center gap-4 py-4 bg-foreground text-white rounded-[2rem] hover:bg-primary transition-all group">
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-heading font-black uppercase tracking-[0.3em]">Terminate Session / Logout</span>
            </button>
          </SignOutButton>
        </div>

        <div className="text-center pt-4">
          <p className="text-[9px] font-black text-foreground/20 uppercase tracking-[1em]">MindOS Neural Specification v2.4.0</p>
        </div>
      </div>
    </div>
  );
}
