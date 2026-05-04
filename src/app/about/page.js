'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { SignInButton } from '@clerk/nextjs';
import { X, Menu, User, Brain, Shield, TrendingUp, ChevronRight } from 'lucide-react';
import { useState } from 'react';


export default function About() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="bg-background text-foreground min-h-screen font-body relative overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-6 md:py-10 flex items-center justify-between bg-background/80 backdrop-blur-md md:bg-transparent">
        {/* Left Links - Desktop */}
        <div className="hidden md:flex gap-10 items-center">
          <Link href="/" className="text-[12px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-all">Home</Link>
          <Link href="/blog" className="text-[12px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-all">Blog</Link>
          <Link href="/about" className="text-[12px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-all border-b border-primary">About</Link>
        </div>


        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-foreground/60 hover:text-primary transition-colors"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Center Logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-primary flex items-center justify-center bg-background shadow-sm cursor-pointer"
            >
              <span className="font-cursive text-2xl md:text-3xl text-primary mt-1">m</span>
            </motion.div>
          </Link>
        </div>

        {/* Right Links - Desktop */}
        <div className="hidden md:flex gap-10 items-center">
          <SignInButton mode="modal">
            <button className="text-[12px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-all">
              Login
            </button>
          </SignInButton>
        </div>

        {/* Mobile Action */}
        <div className="md:hidden">
          <SignInButton mode="modal">
            <button className="p-2 text-foreground/60 hover:text-primary transition-colors">
              <User className="w-6 h-6" />
            </button>
          </SignInButton>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background pt-32 px-10 md:hidden"
          >
            <div className="flex flex-col gap-8 text-center">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-4xl font-heading font-black uppercase tracking-tighter">Home</Link>
              <Link href="/blog" onClick={() => setIsMenuOpen(false)} className="text-4xl font-heading font-black uppercase tracking-tighter">Blog</Link>
              <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-4xl font-heading font-black uppercase tracking-tighter text-primary">About</Link>
              <SignInButton mode="modal">
                <button className="text-4xl font-heading font-black uppercase tracking-tighter">Login</button>
              </SignInButton>
            </div>

          </motion.div>
        )}
      </AnimatePresence>


      {/* About Content */}
      <section className="pt-32 md:pt-60 pb-20 px-6 md:px-12 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-4">The Specification</p>
          <h1 className="text-5xl md:text-7xl font-heading font-black mb-12 md:mb-16 tracking-tighter leading-[0.9]">
            A Neural Lab for<br />Objective Truth.
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start">

            <div className="space-y-16">
              <section>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">01. What is MindOS?</h4>
                <p className="text-xl font-medium leading-relaxed text-foreground/80">
                  MindOS is a Decision Intelligence Engine. It is a specialized laboratory where your thoughts are treated as data points, audited for bias, and refined through world-class mental models. We don't just give you answers; we provide the architectural logic needed to find them yourself.
                </p>
              </section>

              <section className="p-8 md:p-12 bg-soft border-l-4 border-primary">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-8">The Decision Crisis</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
                  <div>
                    <h2 className="text-4xl md:text-5xl font-heading font-black mb-2">35k</h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 leading-relaxed">
                      Decisions made by the human brain every single day.
                    </p>
                  </div>
                  <div>
                    <h2 className="text-4xl md:text-5xl font-heading font-black mb-2">70%</h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 leading-relaxed">
                      Of choices are corrupted by subconscious cognitive bias.
                    </p>
                  </div>
                  <div>
                    <h2 className="text-4xl md:text-5xl font-heading font-black mb-2">$3.1T</h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 leading-relaxed">
                      Annual cost of poor decision-making to global economy.
                    </p>
                  </div>
                  <div>
                    <h2 className="text-4xl md:text-5xl font-heading font-black mb-2">50%</h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 leading-relaxed">
                      Of Fortune 500 CEOs admit to relying on "Gut Feeling" over logic.
                    </p>
                  </div>
                </div>

                <p className="mt-8 text-[9px] font-bold text-foreground/20 uppercase tracking-[0.2em]">
                  Sources: HBR Audit / McKinsey / Fortune 500 Sentiment Study / Stanford Economic Review
                </p>
              </section>

              <section>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-12">The Solution: Bridging the Logic Gap</h4>
                <div className="space-y-12 mb-16">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Typical Decision Accuracy</span>
                      <span className="text-xl font-heading font-bold">24%</span>
                    </div>
                    <div className="w-full h-1 bg-border relative">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '24%' }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="absolute h-full bg-foreground/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">MindOS Augmented Accuracy</span>
                      <span className="text-xl font-heading font-bold text-primary">92%</span>
                    </div>
                    <div className="w-full h-1 bg-border relative">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '92%' }}
                        transition={{ duration: 1.5, delay: 0.8 }}
                        className="absolute h-full bg-primary"
                      />
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-heading font-bold mb-6">What we solve.</h3>
                <p className="text-lg font-medium leading-relaxed text-foreground/80 mb-12">
                  We solve the Implementation Gap. Most people know they should be rational, but they lack the tools to apply logic in real-time. MindOS provides the interface between your messy intuition and objective reality.
                </p>

                <h3 className="text-2xl font-heading font-bold mb-6">How we are different.</h3>
                <p className="text-lg font-medium leading-relaxed text-foreground/80">
                  Unlike traditional AI Assistants that just fetch data, MindOS is an AI Architect. We don't give you a fish; we audit your entire fishing strategy, identify where you're being biased, and provide a mathematical conviction score for your path forward.
                </p>
              </section>

              <section>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">02. Why do you need it?</h4>
                <p className="text-xl font-medium leading-relaxed text-foreground/80">
                  In a world of infinite noise, clarity is the only sustainable edge. Human logic is naturally flawed—corrupted by ego, social pressure, and biological impulses. MindOS acts as a Neural Firewall, filtering out the emotional interference so you can make high-velocity choices with 100% conviction.
                </p>
              </section>

              <section>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">03. The ROI of Logic</h4>
                <p className="text-sm uppercase tracking-widest leading-loose text-foreground/60 font-bold">
                  WHETHER IT'S A CAREER PIVOT, A FINANCIAL RISK, OR A PERSONAL TRANSITION, THE COST OF A POOR DECISION IS ALWAYS HIGHER THAN THE COST OF AN AUDIT. WE ENSURE YOUR SECOND-ORDER EFFECTS ARE CALCULATED BEFORE YOU PULL THE TRIGGER.
                </p>
              </section>
            </div>

            <div className="sticky top-40 flex flex-col gap-12">
              <div className="aspect-[3/4] bg-soft overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 shadow-[0_40px_100px_rgba(0,0,0,0.1)] relative group">
                <img src="/hero-center.png" alt="Mental Clarity" className="w-full h-full object-cover" />
                <div className="absolute inset-0 border-[20px] border-white/10 group-hover:border-white/0 transition-all duration-500" />
              </div>
              <div className="p-8 border border-border bg-white shadow-sm">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4">Core Protocols</h4>
                <ul className="space-y-3">
                  {['Bias Detection', 'Monte Carlo Success Simulations', 'Socratic Questioning', 'ROI Probability Mapping'].map(t => (
                    <li key={t} className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer/CTA */}
      <section className="py-40 border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-12 flex flex-col items-center text-center">
          <h2 className="text-4xl font-heading font-black mb-8">Ready to audit your logic?</h2>
          <SignInButton mode="modal">
            <button className="px-16 py-6 bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-all">
              Initialize Account
            </button>
          </SignInButton>
        </div>
      </section>
    </main>
  );
}
