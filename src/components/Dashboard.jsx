'use client';

import { useState } from 'react';
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
  HelpCircle
} from 'lucide-react';
import { UserButton, SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';


import DecisionCoach from './DecisionCoach';
import Pricing from './Pricing';
import DecisionHistory from './DecisionHistory';
import WeeklyReport from './WeeklyReport';
import Settings from './Settings';
import DailyCheckIn from './DailyCheckIn';

const SidebarItem = ({ icon: Icon, label, active, onClick, plan, requiredPlan }) => {
  const isLocked = requiredPlan === 'Growth' && plan !== 'Growth';
  const isCoreLocked = requiredPlan === 'Core' && plan === 'Free';
  const locked = isLocked || isCoreLocked;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-6 py-4 rounded-xl transition-all relative group ${
        active 
          ? 'bg-primary/5 text-primary border border-primary/10 shadow-sm' 
          : 'text-foreground/60 hover:text-foreground hover:bg-soft'
      }`}
    >
      <div className="flex items-center gap-4">
        <Icon className={`w-5 h-5 ${active ? 'text-primary' : 'group-hover:text-primary'}`} />
        <span className="font-heading font-bold text-[10px] uppercase tracking-[0.2em]">{label}</span>
      </div>
      {locked && <Lock className="w-3 h-3 text-foreground/40" />}
      {active && <motion.div layoutId="sidebar-active-dot" className="w-1.5 h-1.5 bg-primary rounded-full" />}
    </button>
  );
};

export default function Dashboard() {
  const { userProfile, xp, level } = useMindStore();
  const [activeView, setActiveView] = useState('coach');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showPricing, setShowPricing] = useState(false);
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

  const menuItems = [
    { id: 'coach', label: 'Smart Coach', icon: MessageSquare },
    { id: 'history', label: 'Choice History', icon: Calendar, requiredPlan: 'Core' },
    { id: 'reports', label: 'Weekly Review', icon: BarChart2, requiredPlan: 'Core' },
    { id: 'checkin', label: 'Daily Truth', icon: HelpCircle, onClick: () => setShowDailyCheckIn(true) },
    { id: 'pricing', label: userProfile?.plan === 'Free' ? 'Upgrade Plan' : 'Manage Plan', icon: Zap, onClick: () => setShowPricing(true) },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'coach': return <DecisionCoach />;
      case 'history': return <DecisionHistory />;
      case 'reports': return <WeeklyReport userPlan={userProfile?.plan || 'Free'} />;
      case 'settings': return <Settings />;
      default: return <DecisionCoach />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] text-foreground selection:bg-primary selection:text-white font-body">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-border transition-all duration-500 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 shadow-2xl lg:shadow-none`}>

        <div className="h-full flex flex-col p-8">
          <div className="flex items-center justify-between mb-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center">
                <span className="font-cursive text-primary">m</span>
              </div>
              <span className="font-heading font-black text-xl tracking-tighter uppercase text-primary">MindOS</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-foreground/40">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-3">
            {menuItems.map((item) => (
              <SidebarItem 
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={activeView === item.id}
                onClick={item.onClick || (() => setActiveView(item.id))}
                plan={userProfile?.plan}
                requiredPlan={item.requiredPlan}
              />
            ))}
          </nav>

          <div className="mt-auto space-y-8">
            <div className="p-6 bg-soft rounded-2xl border border-border shadow-sm">
              <div className="flex justify-between items-center text-[9px] font-black text-foreground/80 uppercase tracking-[0.2em] mb-3">
                <span>Rank: {level === 1 ? 'Seeker' : 'Expert'}</span>
                <span className="text-primary font-black">{xp}/1000 XP</span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(xp % 1000) / 10}%` }}
                  className="h-full bg-primary" 
                />
              </div>
            </div>

            <div className="flex items-center gap-4 px-2 py-2">
              <div className="relative">
                <UserButton afterSignOutUrl="/" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-sm tracking-tight truncate text-foreground">{userProfile?.name || 'User'}</p>
                <p className="text-[9px] font-bold text-primary uppercase tracking-widest">{userProfile?.plan || 'Core'} Member</p>
              </div>
              <SettingsIcon 
                onClick={() => setActiveView('settings')}
                className={`w-5 h-5 cursor-pointer transition-all hover:rotate-90 duration-500 ${activeView === 'settings' ? 'text-primary' : 'text-foreground/60 hover:text-primary'}`} 
              />
              <SignOutButton redirectUrl="/">
                <button className="text-foreground/40 hover:text-red-500 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-20 bg-transparent flex items-center justify-between px-6 md:px-10 sticky top-0 z-40">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-foreground/40 hover:text-primary transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4 md:gap-8 ml-auto">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-soft border border-border rounded-full shadow-sm">
              <Trophy className="w-3 h-3 text-primary" />
              <span className="text-[9px] font-black text-foreground/80 uppercase tracking-widest">{userProfile?.streak || 0} DAY STREAK</span>
            </div>
            <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary transition-colors text-foreground/40 hover:text-primary">
              <Zap className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 lg:p-16 overflow-y-auto">

          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Pricing 
        isOpen={showPricing} 
        onClose={() => setShowPricing(false)} 
        currentPlan={userProfile?.plan || 'Free'} 
      />
      {showDailyCheckIn && <DailyCheckIn onClose={() => setShowDailyCheckIn(false)} />}
    </div>
  );
}


