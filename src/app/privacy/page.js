'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
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
            Neural <br/>Privacy.
          </h1>

          <div className="space-y-16 md:space-y-24">

            <section>
              <div className="flex items-baseline gap-6 mb-6">
                <span className="text-[10px] font-black text-primary">01.</span>
                <h3 className="text-2xl font-heading font-bold uppercase tracking-tight">Your Data is Yours</h3>
              </div>
              <p className="text-lg text-foreground/80 leading-relaxed font-medium">
                Your decisions, hidden fears, and second-order effects are your business. We store them so you can look back and learn, but we don't read them for fun or sell them to advertisers.
              </p>
            </section>

            <section>
              <div className="flex items-baseline gap-6 mb-6">
                <span className="text-[10px] font-black text-primary">02.</span>
                <h3 className="text-2xl font-heading font-bold uppercase tracking-tight">Authentication</h3>
              </div>
              <p className="text-lg text-foreground/80 leading-relaxed font-medium">
                We use Clerk for secure logins. We don't store your passwords. Your email is only used to keep your "Neural Link" active across devices.
              </p>
            </section>

            <section>
              <div className="flex items-baseline gap-6 mb-6">
                <span className="text-[10px] font-black text-primary">03.</span>
                <h3 className="text-2xl font-heading font-bold uppercase tracking-tight">AI Processing</h3>
              </div>
              <p className="text-lg text-foreground/80 leading-relaxed font-medium">
                When you ask for an audit, your data is processed by our AI partners (like OpenAI or Google). They don't keep your personal info for training their general models.
              </p>
            </section>

            <section>
              <div className="flex items-baseline gap-6 mb-6">
                <span className="text-[10px] font-black text-primary">04.</span>
                <h3 className="text-2xl font-heading font-bold uppercase tracking-tight">Cookies</h3>
              </div>
              <p className="text-lg text-foreground/80 leading-relaxed font-medium">
                We only use essential cookies to keep you logged in and ensure the app doesn't crash. No creepy tracking pixels here.
              </p>
            </section>
          </div>

          <footer className="mt-40 pt-12 border-t border-border flex justify-between items-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">
              MindOS: Private by Design • 2026
            </p>
          </footer>
        </motion.div>
      </div>
    </main>
  );
}
