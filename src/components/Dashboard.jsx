'use client';

import { useState, useEffect } from 'react';
import { useMindStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  BarChart2, 
  Zap, 
  Settings as SettingsIcon,
  Menu,
  X,
  Trophy,
  Calendar,
  Lock,
  LogOut,
  HelpCircle,
  User,
  Fingerprint,
  Box,
  Users,
  CreditCard
} from 'lucide-react';
import { UserButton, SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { AnimatedGrid } from '@/components/ui/AnimatedGrid';
import { SpotlightCard } from '@/components/ui/SpotlightCard';


// Static Imports
import DecisionCoach from './DecisionCoach';
import DecisionHistory from './DecisionHistory';
import WeeklyReport from './WeeklyReport';
import Settings from './Settings';
import DailyCheckIn from './DailyCheckIn';
import FamilyCouncil from './FamilyCouncil';
import Billing from './Billing';

// Dynamic Imports for 3D/Heavy Components
const DecisionSimulator = dynamic(() => import('./DecisionSimulator'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-black flex items-center justify-center text-white/20 uppercase tracking-widest text-[10px]">Loading Quantum View...</div>
});
const UserProfile = dynamic(() => import('./UserProfile'), { 
  ssr: false,
  loading: () => (
    <div className="max-w-5xl mx-auto py-12 px-6 space-y-12 animate-pulse">
       <div className="h-20 w-2/3 bg-foreground/5 rounded-[2rem]" />
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-40 bg-foreground/5 rounded-[2.5rem]" />
          ))}
       </div>
    </div>
  )
});

const SidebarItem = ({ icon: Icon, label, active, onClick, plan, requiredPlan }) => {
  const isLocked = requiredPlan === 'Growth' && plan !== 'Growth';
  
  return (
    <button
      onClick={isLocked ? null : onClick}
      className={`w-full flex items-center justify-between px-8 py-5 rounded-[2rem] transition-all group ${
        active 
          ? 'bg-primary text-white shadow-xl shadow-primary/20' 
          : 'text-foreground/40 hover:bg-soft hover:text-foreground'
      } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="flex items-center gap-6">
        <Icon className={`w-6 h-6 transition-transform ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">{label}</span>
      </div>
      {isLocked && <Lock className="w-4 h-4" />}
    </button>
  );
};

export default function Dashboard() {
  const { userProfile, setUserProfile, activeTab, setActiveTab } = useMindStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDailyCheckIn, setShowDailyCheckIn] = useState(false);


  useEffect(() => {
    if (userProfile) {
      const last = userProfile.lastCheckIn ? new Date(userProfile.lastCheckIn) : null;
      const today = new Date();
      if (!last || last.toDateString() !== today.toDateString()) {
        setShowDailyCheckIn(true);
      }
    }
  }, [userProfile]);

  const tabs = [
    { id: 'coach', label: 'Smart Coach', icon: MessageSquare },
    { id: 'family', label: 'Family Council', icon: Users },
    { id: 'history', label: 'Choice History', icon: Calendar },
    { id: 'identity', label: 'Identity Matrix', icon: Fingerprint },
    { id: 'billing', label: 'Billing Ledger', icon: CreditCard },
    { id: 'report', label: 'Weekly Review', icon: BarChart2, requiredPlan: 'Growth' },
    { id: 'settings', label: 'System Prefs', icon: SettingsIcon },
  ];

  return (
    <div className="flex min-h-screen bg-[#FDFCFB]">
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-8 right-8 z-[60] w-14 h-14 bg-white border border-border rounded-full flex items-center justify-center shadow-lg"
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-border p-10 transform transition-transform duration-500 ease-spring
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="mb-16 px-4">
            <h1 className="text-3xl font-heading font-black tracking-tighter text-foreground uppercase flex items-center gap-3">
              Mind<span className="text-primary italic font-cursive normal-case">OS</span>
            </h1>
            <SpotlightCard className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[9px] font-black text-primary uppercase tracking-widest">Level {userProfile?.level || 1}</span>
                <span className="text-[9px] font-black text-foreground/40 uppercase tracking-widest">{userProfile?.xp || 0}/1000 XP</span>
              </div>
              <div className="h-1 bg-soft rounded-full overflow-hidden mx-1">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(userProfile?.xp || 0) % 1000 / 10}%` }}
                  className="h-full bg-primary"
                />
              </div>
            </SpotlightCard>

          </div>

          <nav className="flex-1 space-y-4">
            {tabs.map((tab) => (
              <SidebarItem
                key={tab.id}
                icon={tab.icon}
                label={tab.label}
                active={activeTab === tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsSidebarOpen(false);
                }}
                plan={userProfile?.plan}
                requiredPlan={tab.requiredPlan}
              />
            ))}
          </nav>

          <div className="mt-auto space-y-6">
             <SpotlightCard className="p-6 bg-soft rounded-[2.5rem] border border-border">
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center">
                      <UserButton afterSignOutUrl="/" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-foreground uppercase tracking-widest leading-none">{userProfile?.name || 'User'}</p>
                      <p className="text-[8px] font-bold text-foreground/40 uppercase tracking-widest mt-1">{userProfile?.plan} Access</p>
                   </div>
                </div>
                <div className="h-px bg-border my-4" />
                <div className="flex items-center gap-3 animate-pulse">
                   <div className="w-2 h-2 rounded-full bg-green-500" />
                   <p className="text-[8px] font-black uppercase tracking-widest text-foreground/40">Ledger Synced</p>
                </div>
                <p className="text-[7px] font-bold text-primary uppercase tracking-widest mt-2">v2.5 Connected</p>
             </SpotlightCard>

             
             <SignOutButton>
               <button className="w-full flex items-center gap-6 px-8 py-5 text-foreground/40 hover:text-red-500 transition-colors">
                  <LogOut className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Disconnect</span>
               </button>
             </SignOutButton>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto relative">
        <div className="min-h-full bg-soft/30 px-6 py-8 lg:px-20 lg:py-12 relative">
          <AnimatedGrid />
          <div className="max-w-6xl mx-auto relative z-10">


          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeTab === 'coach' && <DecisionCoach />}
              {activeTab === 'family' && <FamilyCouncil />}
              {activeTab === 'history' && <DecisionHistory />}
              { activeTab === 'identity' && <UserProfile /> }
              { activeTab === 'billing' && <Billing /> }
              { activeTab === 'simulator' && (
                <div className="bg-black rounded-[4rem] overflow-hidden shadow-2xl h-[80vh]">
                  <DecisionSimulator 
                    decision={userProfile?.lastDecision || 'Should I follow my neural profile?'} 
                    onBack={() => setActiveTab('coach')} 
                  />
                </div>
              )}
              { activeTab === 'report' && <WeeklyReport /> }
              {activeTab === 'settings' && <Settings />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>



      {/* Daily Check-in Modal */}
      <AnimatePresence>
        {showDailyCheckIn && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setShowDailyCheckIn(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              className="relative w-full max-w-2xl"
            >
              <DailyCheckIn onClose={() => setShowDailyCheckIn(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
