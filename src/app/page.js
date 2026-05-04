'use client';

import { useMindStore } from '@/lib/store';
import Dashboard from '@/components/Dashboard';
import { UserButton, SignInButton, useAuth, useUser } from '@clerk/nextjs';
import { Brain, ArrowRight, Menu, X, ShoppingCart, User } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import DecisionCoach from '@/components/DecisionCoach';
import Link from 'next/link';

export default function Home() {
  const { setUserProfile } = useMindStore();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [isSyncing, setIsSyncing] = useState(true);
  const [showCoach, setShowCoach] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const { scrollYProgress } = useScroll();

  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);

  const FEATURES = [
    {
      title: 'The Career Pivot',
      desc: 'Surgical diagnostic scan for your professional growth.',
      longDesc: 'A comprehensive deep dive into career transitions using AI-driven logic. It analyzes your skill overlap, market demand, and psychological readiness to find your next move.',
      howItWorks: 'We map 40+ variables against global industry trends and historical success data to identify your highest-leverage career path.'
    },
    {
      title: 'The Ego Check',
      desc: 'Eliminate bias and social pressure from your logic.',
      longDesc: 'A rigorous logic auditing process designed to strip away emotional bias. It identifies sunk-cost fallacies, social pressure triggers, and confirmation bias in real-time.',
      howItWorks: 'A neutral Socratic interface that challenges your premises through iterative questioning until only objective truth remains.'
    },
    {
      title: 'The Success Meter',
      desc: 'Predictive ROI based on 150+ world-class authors.',
      longDesc: 'Advanced probability modeling for your most significant life decisions. Based on mental models from thinkers like Munger, Taleb, and Kahneman.',
      howItWorks: 'Monte Carlo simulations combined with heuristic filtering to provide a quantitative Conviction Score for any proposed action.'
    }
  ];

  useEffect(() => {
    const syncUser = async () => {
      if (isSignedIn && user) {
        setIsSyncing(true);
        const clerkName = user.fullName || user.firstName || user.username || 'USER';
        try {
          const res = await fetch('/api/user/profile');
          const dbProfile = await res.json();
          if (dbProfile && !dbProfile.error && !dbProfile.message) {
            setUserProfile({
              name: clerkName,
              plan: dbProfile.plan || 'Free',
              mindProfile: dbProfile.mindProfile,
              streak: dbProfile.streak || 0
            });
          } else if (dbProfile && dbProfile.message === 'New user') {
            setUserProfile({ name: clerkName });
          }
        } catch (err) {
          console.error("Profile sync failed", err);
        } finally {
          setIsSyncing(false);
        }
      } else if (isLoaded) {
        setIsSyncing(false);
      }
    };
    syncUser();
  }, [isSignedIn, user, isLoaded, setUserProfile]);

  if (!isLoaded || isSyncing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (isSignedIn) {
    return <Dashboard />;
  }

  return (
    <main className="bg-background text-foreground selection:bg-primary selection:text-white min-h-screen font-body relative overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-6 md:py-10 flex items-center justify-between bg-background/80 backdrop-blur-md md:bg-transparent">
        {/* Left Links - Desktop */}
        <div className="hidden md:flex gap-10 items-center">
          <Link href="/" className="text-[12px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-all border-b border-primary">Home</Link>
          <Link href="/blog" className="text-[12px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-all">Blog</Link>
          <Link href="/about" className="text-[12px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-all">About</Link>

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

        {/* Mobile Action - Only Login icon or similar if needed, or just keep it simple */}
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
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-4xl font-heading font-black uppercase tracking-tighter text-primary">Home</Link>
              <Link href="/blog" onClick={() => setIsMenuOpen(false)} className="text-4xl font-heading font-black uppercase tracking-tighter">Blog</Link>
              <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-4xl font-heading font-black uppercase tracking-tighter">About</Link>
              <Link href="/shop" onClick={() => setIsMenuOpen(false)} className="text-4xl font-heading font-black uppercase tracking-tighter">Shop</Link>
              <SignInButton mode="modal">
                <button className="text-4xl font-heading font-black uppercase tracking-tighter">Login</button>
              </SignInButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Hero Section */}
      <section className="min-h-screen px-6 md:px-12 max-w-[1600px] mx-auto relative flex flex-col justify-center overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center md:items-end relative h-full pt-32 md:pt-40 pb-20">
          {/* Left Image - Hidden on mobile, shown on md+ */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden md:block md:col-span-3 self-start"
          >
            <div className="aspect-[4/5] w-[220px] bg-soft overflow-hidden shadow-xl mb-6">
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
                src="/hero-left.png"
                alt="Strategic Logic"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[11px] font-medium text-foreground/40 leading-relaxed max-w-[180px]">
              A wide variety of quality<br />logic protocols.
            </p>
          </motion.div>

          {/* Center Image - Main Focus */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
            className="col-span-1 md:col-span-6 flex justify-center z-10"
          >
            <div className="aspect-[3/4.5] w-full max-w-[300px] md:max-w-[500px] bg-soft overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.1)] md:shadow-[0_60px_120px_rgba(0,0,0,0.15)] relative group">
              <motion.img
                style={{ scale: imageScale }}
                src="/hero-center.png"
                alt="Mental Clarity"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Right Image - Hidden on mobile, shown on md+ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="hidden md:flex md:col-span-3 justify-end pb-20 md:pb-40"
          >
            <div className="aspect-square w-[180px] bg-soft overflow-hidden shadow-xl">
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
                src="/hero-right.png"
                alt="Balanced Decisions"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Mobile Text Support (only on small screens) */}
          <div className="md:hidden text-center mt-12">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Strategic Decision Engine</p>
          </div>
        </div>

        {/* Large Foreground Text */}
        <div className="absolute bottom-0 left-0 w-full pointer-events-none z-20 overflow-hidden py-10 md:py-20">
          <motion.h1
            style={{ y: textY, scale: textScale }}
            className="text-[25vw] md:text-[18vw] font-cursive text-primary leading-[0.6] tracking-normal text-center opacity-90 mix-blend-multiply"
          >
            Mindos
          </motion.h1>
        </div>
      </section>


      {/* Content Section */}
      <section className="py-24 md:py-40 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-heading font-bold tracking-tight mb-8 md:mb-12 text-foreground"
          >
            Evolve Your <span className="italic font-light">Logic.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="text-lg md:text-2xl text-foreground/70 font-medium leading-relaxed mb-12 md:mb-16"
          >
            The world's first AI Decision Coach that de-biases your thinking using world-class frameworks. Stop guessing. Start deciding.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => setShowCoach(true)}
              className="px-12 py-5 bg-primary text-white font-heading font-bold uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center gap-4 mx-auto group"
            >
              Start Free Audit <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid - Editorial Style */}
      <section className="py-20 px-6 bg-soft">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setSelectedFeature(feature)}
              className="group cursor-pointer p-8 border border-transparent hover:border-primary/20 hover:bg-white transition-all"
            >
              <div className="w-8 h-8 rounded-full border border-primary flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                <span className="text-[10px] font-bold">{i + 1}</span>
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4">{feature.title}</h3>
              <p className="text-sm font-medium text-foreground/60 leading-relaxed uppercase tracking-wider mb-8">{feature.desc}</p>
              <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                Learn More <ArrowRight className="w-3 h-3 group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Detail Modal */}
      <AnimatePresence>
        {selectedFeature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl"
          >
            <motion.div
              layoutId={`feature-${selectedFeature.title}`}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white border border-border p-12 max-w-2xl w-full relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedFeature(null)}
                className="absolute top-8 right-8 text-foreground/40 hover:text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <p className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-4">Laboratory Module</p>
              <h2 className="text-5xl font-heading font-bold mb-8 tracking-tighter">{selectedFeature.title}</h2>

              <div className="space-y-8">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-3">Executive Summary</h4>
                  <p className="text-lg text-foreground/80 leading-relaxed font-medium">
                    {selectedFeature.longDesc}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-3">Technical Architecture</h4>
                  <p className="text-sm text-foreground/60 leading-relaxed uppercase tracking-widest font-bold">
                    {selectedFeature.howItWorks}
                  </p>
                </div>
              </div>

              <div className="mt-12 flex gap-6">
                <SignInButton mode="modal">
                  <button className="px-10 py-4 bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-all">
                    Initialize Audit
                  </button>
                </SignInButton>
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="px-10 py-4 border border-border text-[10px] font-bold uppercase tracking-widest hover:border-primary transition-all"
                >
                  Close Specification
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pricing Section */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-heading font-bold tracking-tight uppercase mb-4">Invest in your <span className="italic">Clarity</span></h2>
            <div className="w-20 h-1 bg-primary mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard plan="Free" price="0" features={['3 audits/month', 'Basic risk analysis', 'Decision vault']} />
            <PricingCard plan="Core" price="99" popular features={['Unlimited audits', 'Expert logic breakdown', 'Weekly Review', 'Full history backup']} />
            <PricingCard plan="Elite" price="249" features={['AI mentor (3 personas)', 'Deep ripple-effect analysis', 'Success Meter', 'Priority Support']} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-12 border-t border-border bg-soft">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex gap-12 items-center text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Logic</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Neural Privacy</Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center">
              <span className="font-cursive text-primary">m</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">© 2026 MindOS Decision Lab</p>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showCoach && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background flex flex-col"
          >
            <button
              onClick={() => setShowCoach(false)}
              className="absolute top-8 right-8 z-10 w-12 h-12 flex items-center justify-center hover:rotate-90 transition-transform"
            >
              <X className="w-8 h-8" />
            </button>
            <DecisionCoach />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

const PricingCard = ({ plan, price, features, popular }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className={`p-12 border border-border flex flex-col justify-between transition-all ${popular ? 'bg-primary text-white border-primary shadow-2xl scale-105' : 'bg-white'}`}
  >
    <div>
      <p className={`text-xs font-bold uppercase tracking-[0.3em] mb-6 ${popular ? 'text-white/70' : 'text-primary'}`}>{plan}</p>
      <h3 className="text-6xl font-heading font-bold mb-10 tracking-tighter">₹{price}<span className="text-lg font-light">{price !== '0' ? '/mo' : ''}</span></h3>
      <ul className="space-y-6 mb-16">
        {features.map(item => (
          <li key={item} className={`flex items-center gap-4 text-xs font-bold uppercase tracking-wider ${popular ? 'text-white/80' : 'text-foreground/60'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${popular ? 'bg-white' : 'bg-primary'}`} /> {item}
          </li>
        ))}
      </ul>
    </div>
    <SignInButton mode="modal">
      <button className={`w-full py-5 font-heading font-bold uppercase tracking-widest transition-all ${popular ? 'bg-white text-primary hover:bg-soft' : 'bg-primary text-white hover:bg-primary/90'}`}>
        Get Started
      </button>
    </SignInButton>
  </motion.div>
);
