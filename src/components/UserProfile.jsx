'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon, Briefcase, Heart, Clock, Calendar, Save, Loader2, Sparkles, UserCircle, Users, Zap } from 'lucide-react';
import { useMindStore } from '@/lib/store';
import { toast } from 'sonner';

export default function UserProfile() {
  const { userProfile, setUserProfile } = useMindStore();
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    age: '',
    dob: '',
    occupation: '',
    fitnessLevel: 'Moderate',
    workLoad: 'Medium',
    socialMediaTime: ''
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        gender: userProfile.gender || 'Male',
        age: userProfile.age || '',
        dob: userProfile.dob || '',
        occupation: userProfile.occupation || '',
        fitnessLevel: userProfile.fitnessLevel || 'Moderate',
        workLoad: userProfile.workLoad || 'Medium',
        socialMediaTime: userProfile.socialMediaTime || ''
      });
    }
  }, [userProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setUserProfile(data);
        toast.success('Identity Matrix Synchronized');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const InputWrapper = ({ icon: Icon, label, children, delay = 0 }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-white p-8 rounded-[2.5rem] border border-border hover:shadow-xl transition-all"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">{label}</span>
      </div>
      {children}
    </motion.div>
  );

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <h2 className="text-5xl md:text-7xl font-heading font-black uppercase tracking-tighter text-foreground leading-none mb-4">
            Identity <span className="text-primary italic font-cursive normal-case px-2">Matrix</span>
          </h2>
          <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em]">
            Calibrate your neural profile for precision analysis
          </p>
        </div>
        <AnimatePresence>
          {success && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="px-8 py-4 bg-green-500 text-white rounded-full flex items-center gap-4 shadow-xl shadow-green-500/20"
            >
              <Sparkles className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Matrix Updated</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputWrapper icon={UserCircle} label="Display Name">
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-transparent text-2xl font-heading font-black text-foreground border-none focus:ring-0 p-0"
              placeholder="e.g. Neo"
            />
          </InputWrapper>

          <InputWrapper icon={Users} label="Gender Expression">
            <select 
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              className="w-full bg-transparent text-2xl font-heading font-black text-foreground border-none focus:ring-0 p-0 appearance-none uppercase"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </InputWrapper>

          <InputWrapper icon={Calendar} label="Date of Birth">
            <input 
              type="date" 
              value={formData.dob}
              onChange={(e) => setFormData({...formData, dob: e.target.value})}
              className="w-full bg-transparent text-2xl font-heading font-black text-foreground border-none focus:ring-0 p-0"
            />
          </InputWrapper>

          <InputWrapper icon={Briefcase} label="Current Focus / Work">
            <input 
              type="text" 
              value={formData.occupation}
              onChange={(e) => setFormData({...formData, occupation: e.target.value})}
              className="w-full bg-transparent text-2xl font-heading font-black text-foreground border-none focus:ring-0 p-0"
              placeholder="e.g. Student / Developer"
            />
          </InputWrapper>

          <InputWrapper icon={Heart} label="Neural Fitness">
            <select 
              value={formData.fitnessLevel}
              onChange={(e) => setFormData({...formData, fitnessLevel: e.target.value})}
              className="w-full bg-transparent text-2xl font-heading font-black text-foreground border-none focus:ring-0 p-0 appearance-none uppercase"
            >
              <option value="Sedentary">Sedentary</option>
              <option value="Moderate">Moderate</option>
              <option value="Active">Active</option>
              <option value="Athlete">Athlete</option>
            </select>
          </InputWrapper>

          <InputWrapper icon={Zap} label="Daily Cognitive Load">
            <select 
              value={formData.workLoad}
              onChange={(e) => setFormData({...formData, workLoad: e.target.value})}
              className="w-full bg-transparent text-2xl font-heading font-black text-foreground border-none focus:ring-0 p-0 appearance-none uppercase"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Extreme">Extreme</option>
            </select>
          </InputWrapper>

          <InputWrapper icon={Clock} label="Social Media Drain (Hours/Day)" delay={0.6}>
            <input 
              type="number" 
              value={formData.socialMediaTime}
              onChange={(e) => setFormData({...formData, socialMediaTime: e.target.value})}
              className="w-full bg-transparent text-2xl font-heading font-black text-foreground border-none focus:ring-0 p-0"
              placeholder="0"
            />
          </InputWrapper>

          <div className="md:col-span-2 mt-8">
            <button 
              disabled={saving}
              className="w-full py-10 bg-primary text-white rounded-[3rem] text-[10px] font-black uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-6 shadow-2xl shadow-primary/30"
            >
              {saving ? <Loader2 className="w-8 h-8 animate-spin" /> : <Save className="w-8 h-8" />}
              {saving ? 'Synchronizing...' : 'Save Matrix Configuration'}
            </button>
          </div>
        </div>
      </form>

      <div className="mt-20">
        <h3 className="text-3xl font-heading font-black uppercase tracking-tight mb-12">Neural <span className="text-primary italic">Metrics</span></h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Focus Level Card */}
          <div className="bg-white p-10 rounded-[3.5rem] border border-border relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Zap className="w-32 h-32" />
            </div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Focus Capacity</h4>
                <p className="text-2xl font-heading font-black">{userProfile?.mindProfile?.focusLevel || 50}%</p>
              </div>
            </div>
            <div className="h-4 bg-soft rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${userProfile?.mindProfile?.focusLevel || 50}%` }}
                className="h-full bg-primary"
              />
            </div>
            <p className="mt-6 text-[9px] font-bold text-foreground/40 uppercase tracking-widest leading-relaxed">
              Based on your consistency in executing high-stakes decisions.
            </p>
          </div>

          {/* Scarcity vs Abundance Card */}
          <div className="bg-white p-10 rounded-[3.5rem] border border-border relative overflow-hidden shadow-sm">
             <div className="absolute top-0 right-0 p-8 opacity-5">
              <Sparkles className="w-32 h-32" />
            </div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Mindset Polarity</h4>
                <p className="text-2xl font-heading font-black">{(userProfile?.mindProfile?.scarcityAbundanceScore || 50) > 50 ? 'Abundance' : 'Scarcity'}</p>
              </div>
            </div>
            <div className="h-4 bg-soft rounded-full flex overflow-hidden">
               <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${userProfile?.mindProfile?.scarcityAbundanceScore || 50}%` }}
                className={`h-full ${(userProfile?.mindProfile?.scarcityAbundanceScore || 50) > 50 ? 'bg-green-500' : 'bg-orange-500'}`}
              />
            </div>
            <div className="flex justify-between mt-4 text-[8px] font-black uppercase tracking-widest opacity-40">
              <span>Fear-Driven</span>
              <span>Growth-Driven</span>
            </div>
          </div>
        </div>

        {/* Neural Insights */}
        {userProfile?.mindProfile?.insights?.length > 0 && (
          <div className="mt-12 p-10 bg-soft/50 rounded-[3rem] border border-dashed border-border">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30 mb-8">Latest Neural Observations</h4>
            <div className="space-y-4">
              {userProfile.mindProfile.insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <p className="text-sm font-bold text-foreground/60 leading-relaxed italic">"{insight}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-20 p-12 bg-black rounded-[4rem] text-white">
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-10">Why this matters</h4>
        <p className="text-2xl font-heading font-bold leading-relaxed opacity-80 italic">
          "Your identity is the baseline of all logic. A decision for a student with extreme workload is fundamentally different from a decision for an athlete with high energy. We calibrate your AI to think through YOUR lens."
        </p>
      </div>

    </div>
  );
}
