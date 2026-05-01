'use client';

import { useState } from 'react';
import { useMindStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Target, 
  Brain, 
  BarChart2, 
  Bot, 
  Layers, 
  Map, 
  Users,
  Trophy,
  Settings,
  Menu,
  X,
  Plus,
  Zap,
  Shield,
  ArrowRight,
  TrendingUp,
  Calendar
} from 'lucide-react';

// Feature components
import DecisionCoach from './DecisionCoach';
import DailyCheckIn from './DailyCheckIn';
import HabitSystem from './HabitSystem';
import PatternTracker from './PatternTracker';
import WeeklyReport from './WeeklyReport';
import AIMentor from './AIMentor';
import SkillStackBuilder from './SkillStackBuilder';
import LifeClarityMap from './LifeClarityMap';
import GrowthCircles from './GrowthCircles';

const SidebarItem = ({ icon: Icon, label, active, onClick, plan, requiredPlan }) => {
  const isLocked = requiredPlan === 'Growth' && plan !== 'Growth';
  const isCoreLocked = requiredPlan === 'Core' && plan === 'Free';
  const locked = isLocked || isCoreLocked;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all relative group ${
        active 
          ? 'bg-accent/10 text-accent shadow-[0_0_20px_rgba(34,211,238,0.15)] border border-accent/20' 
          : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${active ? 'text-accent' : 'group-hover:text-accent'}`} />
        <span className="font-bold text-xs uppercase tracking-widest">{label}</span>
      </div>
      {locked && <Lock className="w-3 h-3 text-slate-600" />}
      {active && <motion.div layoutId="sidebar-glow" className="absolute left-0 w-1 h-6 bg-accent rounded-full" />}
    </button>
  );
};

export default function Dashboard() {
  const { userProfile, xp, level } = useMindStore();
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Systems', icon: LayoutDashboard },
    { id: 'coach', label: 'Decision Engine', icon: MessageSquare },
    { id: 'habits', label: 'Focus & Habits', icon: Target },
    { id: 'patterns', label: 'Mind Patterns', icon: Brain },
    { id: 'report', label: 'Growth Data', icon: BarChart2, requiredPlan: 'Core' },
    { id: 'mentor', label: 'AI Mentor', icon: Bot, requiredPlan: 'Core' },
    { id: 'skills', label: 'Skill Stack', icon: Layers, requiredPlan: 'Core' },
    { id: 'ikigai', label: 'Clarity Map', icon: Map, requiredPlan: 'Core' },
    { id: 'community', label: 'Growth Circles', icon: Users, requiredPlan: 'Growth' },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <MainDashboard onViewChange={setActiveView} />;
      case 'coach': return <DecisionCoach />;
      case 'habits': return <HabitSystem />;
      case 'patterns': return <PatternTracker />;
      case 'report': return <WeeklyReport />;
      case 'mentor': return <AIMentor />;
      case 'skills': return <SkillStackBuilder />;
      case 'ikigai': return <LifeClarityMap />;
      case 'community': return <GrowthCircles />;
      case 'checkin': return <DailyCheckIn onComplete={() => setActiveView('dashboard')} />;
      default: return <MainDashboard onViewChange={setActiveView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-white selection:bg-accent selection:text-black">
      {/* Funky Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0F172A]/80 backdrop-blur-xl border-r border-white/5 transition-all duration-500 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                <Brain className="w-6 h-6 text-black" />
              </div>
              <div>
                <span className="font-black text-2xl tracking-tighter uppercase italic">MindOS</span>
                <div className="h-1 w-full bg-accent/20 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-accent w-2/3 animate-pulse" />
                </div>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <SidebarItem 
                key={item.id}
                {...item}
                active={activeView === item.id}
                onClick={() => setActiveView(item.id)}
                plan={userProfile?.plan}
              />
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-white/5">
            <div className="bg-white/5 p-4 rounded-2xl mb-6 border border-white/5">
              <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
                <span>LVL {level} — Builder</span>
                <span className="text-accent">{xp}/1000 XP</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(xp % 1000) / 10}%` }}
                  className="h-full bg-accent shadow-[0_0_10px_rgba(34,211,238,0.5)]" 
                />
              </div>
            </div>
            <div className="flex items-center gap-4 px-2">
              <div className="w-12 h-12 rounded-2xl bg-purple-500 flex items-center justify-center font-black text-xl text-white shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                {userProfile?.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm tracking-tight truncate">{userProfile?.name}</p>
                <p className="text-[10px] font-black text-accent uppercase tracking-widest">{userProfile?.plan} ACCESS</p>
              </div>
              <Settings className="w-5 h-5 text-slate-500 cursor-pointer hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 border-b border-white/5 bg-[#020617]/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-400">
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-6 ml-auto">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-black text-purple-400 uppercase tracking-widest">12 DAY STREAK</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 p-2 group cursor-pointer hover:border-accent transition-colors">
              <Zap className="w-full h-full text-slate-500 group-hover:text-accent" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function MainDashboard({ onViewChange }) {
  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-2 italic uppercase">System Online.</h1>
          <p className="text-slate-400 text-xl font-medium tracking-tight">Ravi, your focus integrity is <span className="text-accent underline underline-offset-4 decoration-2">at 84% today</span>.</p>
        </div>
        <button 
          onClick={() => onViewChange('coach')}
          className="group relative px-8 py-4 bg-accent text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all active:scale-95 shadow-[0_0_30px_rgba(34,211,238,0.2)]"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 stroke-[3px]" />
            Execute Decision
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatsCard title="Focus Score" value="84" change="+12%" trend="up" color="text-accent" />
        <StatsCard title="Mindset" value="WARRIOR" change="LVL 4" trend="up" color="text-purple-400" />
        <StatsCard title="Data Points" value="+140" change="UNITS" trend="up" color="text-growth" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section 
          className="relative group bg-[#0F172A]/50 border border-white/5 rounded-[2rem] p-10 overflow-hidden cursor-pointer hover:border-accent/30 transition-all"
          onClick={() => onViewChange('checkin')}
        >
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
            <Calendar className="w-64 h-64 text-accent" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-accent uppercase tracking-[0.3em] mb-4">Neural Sync</p>
            <h2 className="text-4xl font-black mb-6 tracking-tight uppercase italic">Daily Mindset <br/>Check-in</h2>
            <p className="text-slate-400 mb-8 max-w-sm text-lg leading-relaxed">Sync your daily intentions with MindOS to optimize neural output and decision speed.</p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl group-hover:bg-accent transition-colors">
              Initiate Sync <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </section>

        <section className="relative bg-purple-600/10 border border-purple-500/20 rounded-[2rem] p-10 overflow-hidden">
          <div className="absolute -top-20 -right-20 p-8 opacity-10 blur-2xl">
            <Bot className="w-96 h-96 text-purple-500" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em] mb-4">Live Intelligence</p>
            <h2 className="text-4xl font-black mb-6 tracking-tight uppercase italic">AI Pattern <br/>Detection</h2>
            <p className="text-slate-300/80 mb-8 max-w-sm text-lg leading-relaxed italic">"Logic loop detected: You've mentioned 'lack of time' 4 times. Redirecting focus to productivity modules."</p>
            <button 
              onClick={() => onViewChange('mentor')}
              className="px-6 py-3 border border-purple-500/30 hover:bg-purple-500/10 text-purple-400 font-black uppercase tracking-widest text-xs rounded-xl transition-all"
            >
              Analyze with Mentor
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

const StatsCard = ({ title, value, change, trend, color }) => (
  <div className="bg-[#0F172A]/40 border border-white/5 p-8 rounded-[2rem] hover:bg-[#0F172A]/60 transition-all group">
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">{title}</p>
    <div className="flex items-baseline gap-4">
      <span className={`text-5xl font-black tracking-tighter italic ${color} group-hover:scale-105 transition-transform`}>{value}</span>
      <span className="text-[10px] font-black text-slate-500 uppercase">{change}</span>
    </div>
  </div>
);

function Lock(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  );
}
