'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, HelpCircle, Shield, Mic, Settings2, Lock } from 'lucide-react';
import { useMindStore } from '@/lib/store';

export default function AIMentor() {
  const { userProfile } = useMindStore();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello Ravi. I've been tracking your patterns. You've had a strong focus streak this week, but your energy levels seem lower today. What's on your mind?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tone, setTone] = useState('supportive'); // 'strict', 'supportive', 'analytical'

  const isFree = userProfile?.plan === 'Free';

  if (isFree) {
    return (
      <div className="bg-card p-12 rounded-3xl border border-border shadow-sm text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Bot className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-4">AI Mentor is sleeping.</h2>
        <p className="text-text-secondary mb-8">
          Unlimited context-aware chat that knows your history, goals, and patterns. 
          Available on **Core** and **Growth** plans.
        </p>
        <button className="px-8 py-4 bg-primary text-white rounded-xl font-bold hover:shadow-lg transition-all">
          Unlock AI Mentor — ₹99/mo
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[80vh] bg-white rounded-3xl border border-border overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-border bg-soft flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">AI Mentor</h2>
            <div className="flex gap-4 text-xs font-bold text-text-secondary uppercase tracking-widest mt-1">
              <button onClick={() => setTone('supportive')} className={tone === 'supportive' ? 'text-accent' : ''}>Supportive</button>
              <button onClick={() => setTone('strict')} className={tone === 'strict' ? 'text-warning' : ''}>Strict</button>
              <button onClick={() => setTone('analytical')} className={tone === 'analytical' ? 'text-primary' : ''}>Analytical</button>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-white rounded-xl transition-colors"><Mic className="w-5 h-5 text-text-secondary" /></button>
          <button className="p-2 hover:bg-white rounded-xl transition-colors"><Settings2 className="w-5 h-5 text-text-secondary" /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[75%] p-5 rounded-2xl ${
              m.role === 'assistant' 
                ? 'bg-white border border-border text-text-primary rounded-tl-none shadow-sm' 
                : 'bg-primary text-white rounded-tr-none shadow-lg'
            }`}>
              <p className="text-sm leading-relaxed">{m.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-soft border-t border-border">
        <div className="flex gap-4 items-center bg-white p-2 rounded-2xl border border-border shadow-sm focus-within:ring-2 focus-within:ring-accent transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your mentor anything..."
            className="flex-1 p-3 bg-transparent outline-none text-sm"
          />
          <button className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all">
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest flex items-center gap-1">
            <Shield className="w-3 h-3" /> Encrypted
          </p>
          <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest flex items-center gap-1">
            <Bot className="w-3 h-3" /> Context-Aware
          </p>
        </div>
      </div>
    </div>
  );
}
