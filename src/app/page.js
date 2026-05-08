'use client';

import { useMindStore } from '@/lib/store';
import Dashboard from '@/components/Dashboard';
import { SignInButton, useAuth, useUser } from '@clerk/nextjs';
import { ArrowRight, Menu, X, User, Brain, Shield, Zap, TrendingUp } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import DecisionCoach from '@/components/DecisionCoach';
import Link from 'next/link';
import { TextScramble } from '@/components/ui/TextScramble';
import { SectionReveal } from '@/components/ui/SectionReveal';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { AnimatedGrid } from '@/components/ui/AnimatedGrid';
import { SpotlightCard } from '@/components/ui/SpotlightCard';


export default function Home() {
  const { setUserProfile } = useMindStore();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    const syncUser = async () => {
      if (isSignedIn && user) {
        setIsSyncing(true);
        const clerkName = user.fullName || user.firstName || user.username || 'USER';
        try {
          const res = await fetch('/api/user/profile');
          if (res.ok) {
            const dbProfile = await res.json();
            if (dbProfile && !dbProfile.error) {
              setUserProfile({
                name: clerkName,
                plan: dbProfile.plan || 'Free',
                mindProfile: dbProfile.mindProfile,
                streak: dbProfile.streak || 0,
                level: dbProfile.level || 1,
                nextBillingDate: dbProfile.nextBillingDate,
                subscriptionStartedAt: dbProfile.subscriptionStartedAt,
              });

            }
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
      <div className="fixed inset-0 bg-background flex items-center justify-center z-[200]">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (isSignedIn) {
    return <Dashboard />;
  }

  return <LandingPage />;
}

function LandingPage() {
  const [showCoach, setShowCoach] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();

  const textY = useTransform(scrollYProgress, [0, 0.2], [0, 200]);
  const textScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  if (!mounted) return null;

  const FEATURES = [
    {
      title: 'Career Shift',
      icon: <TrendingUp className="w-5 h-5" />,
      desc: 'Stop guessing your next move. Map your hidden potential to real-world opportunities.',
      longDesc: 'A comprehensive deep dive into career transitions. It identifies your unique strengths, market alignment, and the path to your highest leverage.',
      howItWorks: 'We analyze your experience against evolving industry landscapes to identify where you can provide the most value with the least friction.'
    },
    {
      title: 'Clarity Scan',
      icon: <Shield className="w-5 h-5" />,
      desc: "Separate your true desires from external expectations.",
      longDesc: 'A rigorous reflection process designed to strip away social pressure. It identifies where you might be following a script rather than your own intent.',
      howItWorks: 'A series of reflective prompts that help you peel back layers of expectation until only your core conviction remains.'
    },
    {
      title: 'Path Finder',
      icon: <Zap className="w-5 h-5" />,
      desc: 'See the probability of your best outcomes before taking action.',
      longDesc: 'Strategic modeling for your most significant life choices. Based on the mental frameworks of the world\'s most effective thinkers.',
      howItWorks: 'Thought experiments combined with risk assessment to provide a clear sense of direction for any major step.'
    },
    {
      title: 'Inner Circle',
      icon: <Brain className="w-5 h-5" />,
      desc: 'Align your collective. Turn family discussions into shared understanding.',
      longDesc: 'A space for collaborative reflection. Invite those who matter into your decision-making process with transparency and empathy.',
      howItWorks: 'A shared interface that highlights common ground and helps bridge gaps in perspective within your closest circle.'
    }
  ];

  return (
    <main className="bg-background text-foreground selection:bg-primary selection:text-white min-h-screen font-body relative overflow-x-hidden">
      <ScrollProgress />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-[90] px-6 md:px-12 py-6 flex items-center justify-between bg-background/50 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:rotate-12 transition-transform">
              <span className="font-cursive text-xl text-white mt-1">m</span>
            </div>
            <span className="font-heading font-black uppercase tracking-tighter text-xl text-primary">MindOS</span>
          </Link>
          
          <div className="hidden md:flex gap-8 items-center">
            <Link href="#features" className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 hover:opacity-100 transition-all">Pathways</Link>
            <Link href="#process" className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 hover:opacity-100 transition-all">How it works</Link>
            <Link href="#pricing" className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 hover:opacity-100 transition-all">Membership</Link>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <SignInButton mode="modal">
            <button className="hidden md:block px-6 py-2 rounded-full border border-primary/20 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all">
              Join MindOS
            </button>
          </SignInButton>
          
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-foreground/60 hover:text-primary transition-colors">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[80] bg-background pt-32 px-10 md:hidden"
          >
            <div className="flex flex-col gap-8 text-center">
              <Link href="#features" onClick={() => setIsMenuOpen(false)} className="text-4xl font-heading font-black uppercase tracking-tighter text-primary">Pathways</Link>
              <Link href="#process" onClick={() => setIsMenuOpen(false)} className="text-4xl font-heading font-black uppercase tracking-tighter">Experience</Link>
              <Link href="#pricing" onClick={() => setIsMenuOpen(false)} className="text-4xl font-heading font-black uppercase tracking-tighter">Membership</Link>
              <SignInButton mode="modal">
                <button className="text-4xl font-heading font-black uppercase tracking-tighter">Sign In</button>
              </SignInButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
        <AnimatedGrid />
        {/* Background Gradients */}

        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-700" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-primary/20">
              <TextScramble text="COGNITIVE CLARITY ENGINE ACTIVE" />
            </span>
          </motion.div>

          <motion.h1 
            style={{ scale: textScale, y: textY, opacity }}
            className="text-6xl md:text-[10rem] font-heading font-black leading-[0.85] tracking-tighter mb-8 uppercase"
          >
            Refine Your <br />
            <span className="text-primary italic font-light lowercase font-cursive tracking-normal pr-4">decisions.</span> <br />
            Think Clearly.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-foreground/60 mb-12"
          >
            MindOS is an elite reflection space that helps you see past the noise, align with your true intent, and choose with total conviction.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col md:flex-row gap-4 justify-center items-center"
          >
            <SignInButton mode="modal">
              <button 
                className="group relative px-12 py-5 bg-primary text-white overflow-hidden rounded-full shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 font-bold uppercase tracking-widest text-xs flex items-center gap-3">
                  Begin Reflection <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </span>
              </button>
            </SignInButton>
            <SignInButton mode="modal">
              <button className="px-12 py-5 border border-border rounded-full font-bold uppercase tracking-widest text-xs hover:bg-soft transition-all">
                Enter MindOS
              </button>
            </SignInButton>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
        >
          <span className="text-[8px] font-black uppercase tracking-widest">Discover More</span>
          <div className="w-[1px] h-12 bg-foreground" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 md:py-48 px-6 bg-soft relative">
        <div className="max-w-7xl mx-auto">
          <SectionReveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
              <div className="max-w-2xl">
                <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">Core Pathways</p>
                <h2 className="text-5xl md:text-7xl font-heading font-black tracking-tighter uppercase leading-[0.9]">
                  Designed for <br /><span className="italic font-light text-primary/60">High Performance.</span>
                </h2>
              </div>
              <p className="text-foreground/40 text-sm md:text-lg max-w-sm font-medium">
                Each pathway is curated to help you navigate specific life transitions with depth and purpose.
              </p>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES.map((feature, i) => (
              <SectionReveal key={feature.title} delay={i * 0.1}>
                <SpotlightCard 
                  className="bg-background border border-border/50 hover:border-primary/50 transition-all relative overflow-hidden h-full"
                >
                  <div 
                    onClick={() => setSelectedFeature(feature)}
                    className="p-12 cursor-pointer h-full"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                      <span className="text-8xl font-heading font-black">{i + 1}</span>
                    </div>
                    
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                      {feature.icon}
                    </div>
                    
                    <h3 className="text-3xl font-heading font-black mb-4 uppercase tracking-tighter">{feature.title}</h3>
                    <p className="text-foreground/60 text-lg leading-relaxed mb-8">{feature.desc}</p>
                    
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Open Pathway</span>
                      <div className="h-[1px] flex-grow bg-border group-hover:bg-primary/30 transition-colors" />
                      <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </SpotlightCard>
              </SectionReveal>
            ))}

          </div>
        </div>
      </section>

      {/* Audit Process - Scenario */}
      <section id="process" className="py-32 md:py-64 bg-background">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <SectionReveal direction="right">
            <div className="relative aspect-square">
              <div className="absolute inset-0 bg-primary/5 rounded-[3rem] -rotate-3 scale-105" />
              <div className="relative bg-soft rounded-[3rem] overflow-hidden shadow-2xl border border-border">
                <img src="/scenario.png" alt="Experience Interface" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex flex-col justify-end p-12">
                  <div className="p-6 bg-background/50 backdrop-blur-md border border-white/10 rounded-2xl">
                    <p className="text-xs font-mono text-primary mb-2">/ REFLECTION_ACTIVE</p>
                    <p className="text-lg font-bold">"External bias identified. Refining perspective for deeper clarity..."</p>
                  </div>
                </div>
              </div>
            </div>
          </SectionReveal>

          <div>
            <SectionReveal>
              <h2 className="text-5xl md:text-7xl font-heading font-black tracking-tighter uppercase mb-12">
                Pure <br /><span className="italic font-light">Focus.</span>
              </h2>
              
              <div className="space-y-12">
                {[
                  { t: 'Your Perspective', d: 'Share your raw thoughts and options. We provide the space to be honest.' },
                  { t: 'Guided Reflection', d: 'Navigate through your own intent by answering focused, perspective-shifting questions.' },
                  { t: 'Found Clarity', d: 'Emerge with a deep sense of understanding and a confident path forward.' }
                ].map((step, i) => (
                  <div key={step.t} className="flex gap-8 group">
                    <div className="text-4xl font-heading font-black text-primary/20 group-hover:text-primary transition-colors">0{i+1}</div>
                    <div>
                      <h4 className="text-xl font-black uppercase tracking-tight mb-2">{step.t}</h4>
                      <p className="text-foreground/60 leading-relaxed">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 md:py-48 px-6 bg-soft relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <SectionReveal>
              <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">Membership Tiers</p>
              <h2 className="text-5xl md:text-8xl font-heading font-black tracking-tighter uppercase">Invest in <span className="italic font-light">Clarity.</span></h2>
            </SectionReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard plan="Essential" price="0" features={['3 reflections/month', 'Basic insight analysis', 'Decision journal']} />
            <PricingCard plan="Elite" price="49" popular anchor="less than one wrong choice costs you" features={['Unlimited reflections', 'Deep perspective breakdown', 'Weekly Review', 'Full history archival']} />
            <PricingCard plan="Growth" price="99" features={['3 Unique AI Perspectives', 'Complex ripple-effect analysis', 'Success Indicators', 'Priority Support']} />
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 px-12 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <span className="font-cursive text-2xl text-white mt-1">m</span>
                </div>
                <span className="font-heading font-black uppercase tracking-tighter text-2xl text-primary">MindOS</span>
              </Link>
              <p className="text-xl text-foreground/40 max-w-sm leading-relaxed">
                The operating system for high-performance living. Built for those who choose depth over noise.
              </p>
            </div>
            
            <div>
              <h5 className="font-black uppercase tracking-widest text-[10px] mb-8 text-primary">Explore</h5>
              <ul className="space-y-4 text-sm font-bold uppercase tracking-widest opacity-60">
                <li><Link href="#features" className="hover:text-primary transition-colors">Pathways</Link></li>
                <li><Link href="#process" className="hover:text-primary transition-colors">Experience</Link></li>
                <li><Link href="#pricing" className="hover:text-primary transition-colors">Membership</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-black uppercase tracking-widest text-[10px] mb-8 text-primary">Legal</h5>
              <ul className="space-y-4 text-sm font-bold uppercase tracking-widest opacity-60">
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-20">© 2026 MindOS Laboratory. All Rights Reserved.</p>
            <div className="flex gap-8">
              {['X', 'LinkedIn', 'Github'].map(social => (
                <Link key={social} href="#" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">{social}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

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
              className="bg-background border border-border p-12 max-w-2xl w-full relative shadow-2xl rounded-3xl"
            >
              <button onClick={() => setSelectedFeature(null)} className="absolute top-8 right-8 opacity-40 hover:opacity-100 text-foreground"><X /></button>
              <div className="flex items-center gap-3 text-primary mb-6">
                {selectedFeature.icon}
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Pathway Details</span>
              </div>
              <h2 className="text-5xl font-heading font-black mb-8 uppercase tracking-tighter">{selectedFeature.title}</h2>
              <div className="space-y-8 mb-12">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">Summary</p>
                  <p className="text-xl text-foreground/80 leading-relaxed font-medium">{selectedFeature.longDesc}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">Focus</p>
                  <p className="text-sm text-foreground/60 leading-relaxed font-bold uppercase tracking-widest">{selectedFeature.howItWorks}</p>
                </div>
              </div>
              <SignInButton mode="modal">
                <button className="w-full py-5 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl">Start Pathway</button>
              </SignInButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decision Coach Modal Overlay */}
      <AnimatePresence>
        {showCoach && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[200] bg-background flex flex-col"
          >
            <nav className="p-8 flex justify-between items-center border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary flex items-center justify-center"><span className="text-white text-xs font-cursive">m</span></div>
                <span className="font-black uppercase tracking-tighter text-sm">MindOS Explorer</span>
              </div>
              <button onClick={() => setShowCoach(false)} className="w-10 h-10 flex items-center justify-center bg-soft rounded-full hover:rotate-90 transition-transform text-foreground"><X /></button>
            </nav>
            <div className="flex-grow overflow-auto">
              <DecisionCoach />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

const PricingCard = ({ plan, price, features, popular, anchor }) => (
  <SectionReveal>
    <div className={`h-full p-12 border border-border flex flex-col justify-between transition-all rounded-[2.5rem] ${popular ? 'bg-primary text-white border-primary shadow-2xl scale-105 relative z-10' : 'bg-background hover:border-primary/30'}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-white text-primary text-[8px] font-black uppercase tracking-widest rounded-full shadow-xl">Most Optimized</div>
      )}
      <div>
        <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-8 ${popular ? 'text-white/70' : 'text-primary'}`}>{plan}</p>
        <h3 className="text-7xl font-heading font-black mb-2 tracking-tighter uppercase">₹{price}<span className="text-xl font-light opacity-50">{price !== '0' ? '/mo' : ''}</span></h3>
        {anchor && <p className={`text-[10px] font-bold uppercase tracking-wider mb-10 leading-relaxed ${popular ? 'text-white/60' : 'text-foreground/40'}`}>{anchor}</p>}
        <div className="h-[1px] w-full bg-current opacity-10 mb-10" />
        <ul className="space-y-6 mb-16">
          {features.map(item => (
            <li key={item} className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest opacity-80">
              <div className={`w-1.5 h-1.5 rounded-full ${popular ? 'bg-white' : 'bg-primary'}`} /> {item}
            </li>
          ))}
        </ul>
      </div>
      <SignInButton mode="modal">
        <button className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-500 ${popular ? 'bg-white text-primary hover:shadow-2xl' : 'bg-foreground text-background hover:bg-primary hover:text-white'}`}>
          Join MindOS
        </button>
      </SignInButton>

    </div>
  </SectionReveal>
);


