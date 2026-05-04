'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
  return (
    <main className="bg-background text-foreground min-h-screen font-body py-20 md:py-40 px-6 md:px-12 relative overflow-x-hidden">

      <div className="max-w-3xl mx-auto">
        <Link href="/">
          <motion.button 
            whileHover={{ x: -10 }}
            className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-12 md:mb-20"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Reality
          </motion.button>

        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-8xl font-heading font-black mb-12 md:mb-20 tracking-tighter leading-[0.8]">
            Terms of <br/>Logic.
          </h1>

          <div className="space-y-16 md:space-y-24">

            <section>
              <div className="flex items-baseline gap-6 mb-6">
                <span className="text-[10px] font-black text-primary">01.</span>
                <h3 className="text-2xl font-heading font-bold uppercase tracking-tight">The Agreement</h3>
              </div>
              <p className="text-lg text-foreground/80 leading-relaxed font-medium">
                By using MindOS, you agree to let our AI Coach help you think. We provide the tools, but the final choice is always yours. Think of us as your smart friend, not your lawyer or doctor.
              </p>
            </section>

            <section>
              <div className="flex items-baseline gap-6 mb-6">
                <span className="text-[10px] font-black text-primary">02.</span>
                <h3 className="text-2xl font-heading font-bold uppercase tracking-tight">Responsibility</h3>
              </div>
              <p className="text-lg text-foreground/80 leading-relaxed font-medium">
                We analyze your logic using world-class frameworks, but we cannot guarantee "Success" in the real world. Real life is messy. If you decide to quit your job or buy that pizza, that's on you, boss!
              </p>
            </section>

            <section>
              <div className="flex items-baseline gap-6 mb-6">
                <span className="text-[10px] font-black text-primary">03.</span>
                <h3 className="text-2xl font-heading font-bold uppercase tracking-tight">Usage Limits</h3>
              </div>
              <p className="text-lg text-foreground/80 leading-relaxed font-medium">
                Don't try to break the AI or use it for anything illegal. We have usage limits based on your plan to keep the "Neural Engine" running smoothly for everyone.
              </p>
            </section>

            <section>
              <div className="flex items-baseline gap-6 mb-6">
                <span className="text-[10px] font-black text-primary">04.</span>
                <h3 className="text-2xl font-heading font-bold uppercase tracking-tight">Payments</h3>
              </div>
              <p className="text-lg text-foreground/80 leading-relaxed font-medium">
                Subscriptions are billed monthly. You can cancel anytime if you feel you've reached "Ultimate Clarity." No hard feelings.
              </p>
            </section>
          </div>

          <footer className="mt-40 pt-12 border-t border-border flex justify-between items-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">
              Last Updated: May 2026 • MindOS Decision Lab
            </p>
          </footer>
        </motion.div>
      </div>
    </main>
  );
}
