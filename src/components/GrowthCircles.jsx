'use client';

import { motion } from 'framer-motion';
import { Users, MessageSquare, Trophy, Shield, ArrowRight, Lock } from 'lucide-react';
import { useMindStore } from '@/lib/store';

const MemberCard = ({ name, focusScore, streak, isMe }) => (
  <div className={`p-4 rounded-xl border flex items-center justify-between ${isMe ? 'bg-accent/5 border-accent/20' : 'bg-card border-border'}`}>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-soft flex items-center justify-center font-bold text-text-secondary">
        {name[0]}
      </div>
      <div>
        <p className="font-bold text-sm">{name} {isMe && '(You)'}</p>
        <p className="text-xs text-text-secondary">Focus Score: {focusScore}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-xs font-bold text-growth">🔥 {streak} Days</p>
    </div>
  </div>
);

export default function GrowthCircles() {
  const { userProfile } = useMindStore();
  const isGrowth = userProfile?.plan === 'Growth';

  if (!isGrowth) {
    return (
      <div className="bg-card p-12 rounded-3xl border border-border shadow-sm text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Growth Circles are for Legends.</h2>
        <p className="text-text-secondary mb-8">
          Join small accountability groups of 8-10 people matched by AI to accelerate your growth. 
          Available exclusively on the **Growth Plan**.
        </p>
        <button className="px-8 py-4 bg-accent text-white rounded-xl font-bold hover:shadow-lg transition-all">
          Upgrade to Growth — ₹299/mo
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="w-8 h-8 text-accent" />
            Growth Circle #402
          </h1>
          <p className="text-text-secondary">Focus Area: Career Acceleration & Mindset</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Next Group Call</p>
            <p className="font-bold text-sm">Sunday, 8:00 PM</p>
          </div>
          <button className="p-3 bg-soft hover:bg-border rounded-xl transition-colors">
            <MessageSquare className="w-5 h-5 text-accent" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-card p-8 rounded-2xl border border-border shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              Weekly Accountability
            </h3>
            <div className="p-6 bg-soft rounded-xl border border-border mb-6">
              <p className="text-sm font-medium italic mb-4">"What was your biggest win this week, and what's one pattern that stopped you?"</p>
              <textarea 
                placeholder="Share with your circle..."
                className="w-full p-4 bg-white border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none h-32"
              />
              <button className="mt-4 px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold">
                Submit Check-in
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Recent Activity</p>
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 p-4 border-b border-border last:border-0">
                  <div className="w-8 h-8 rounded-full bg-border flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold">Arjun S. <span className="text-xs font-normal text-text-secondary ml-2">2h ago</span></p>
                    <p className="text-sm text-text-secondary mt-1">Finally quit the job! Thanks for the push last Sunday. Decision Coach helped me see the 'fear vs regret' gap.</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-warning" />
              Leaderboard
            </h3>
            <div className="space-y-3">
              <MemberCard name="Sanya K." focusScore={92} streak={45} />
              <MemberCard name="Ravi" focusScore={78} streak={12} isMe />
              <MemberCard name="Deepak M." focusScore={74} streak={31} />
              <MemberCard name="Priya V." focusScore={68} streak={8} />
            </div>
            <button className="w-full mt-6 text-sm font-bold text-accent hover:underline flex items-center justify-center gap-1">
              Full Standings <ArrowRight className="w-4 h-4" />
            </button>
          </section>

          <div className="bg-growth p-6 rounded-2xl text-white shadow-lg">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Weekly Goal</p>
            <p className="font-bold mb-4">The circle is currently at 84% completion. Complete your 3 habits to hit the 90% reward!</p>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white w-[84%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
