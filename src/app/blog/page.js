'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { SignInButton } from '@clerk/nextjs';
import { Menu, X, User, ArrowRight, Calendar, Clock, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export const BLOG_POSTS = [
  {
    id: 'death-of-gut-feeling',
    title: "The Death of Gut Feeling: Why AI is Replacing Intuition",
    excerpt: "In high-stakes environments, relying on intuition is a liability. Discover how Decision Intelligence engines are auditing human bias to deliver objective truth.",
    date: "May 12, 2026",
    readTime: "8 min read",
    category: "AI & Logic",
    image: "/blog_logic_grid_1777816531142.png",
    keywords: ["AI Decision Making", "Cognitive Bias", "Intuition vs Logic", "MindOS Audit"],
    content: `
      <h2>The Fallibility of the Human Gut</h2>
      <p>For decades, the "Gut Feeling" was the gold standard for leadership. CEOs, investors, and high-performers prided themselves on an invisible radar that guided them through complexity. But modern neuroscience tells a different story. Intuition is not a superpower; it is a pattern-recognition engine heavily corrupted by recent emotional data, survival instincts, and cognitive shortcuts.</p>
      
      <p>Enter <strong>Decision Intelligence</strong>. By treating thoughts as data points rather than truths, we can audit the logic behind a choice before it's made. MindOS uses a neural framework to strip away the "noise" of ego and social pressure, revealing the raw mathematical ROI of any given path.</p>
      
      <h3>The Cost of Intuitive Errors</h3>
      <p>A recent Stanford study revealed that intuition-led decisions in venture capital have a 40% higher failure rate than those guided by structured logic models. The reason? Intuition cannot calculate second-order effects. It sees the immediate gain but ignores the systemic ripple.</p>
    `
  },
  {
    id: 'decoding-cognitive-bias',
    title: "Decoding Cognitive Bias: A Neural Firewall for Your Life",
    excerpt: "Your brain is hardwired to lie to you. Learn how to install a mental firewall that filters out emotional noise and social pressure.",
    date: "May 10, 2026",
    readTime: "12 min read",
    category: "Psychology",
    image: "/blog_bias_screens_1777816548761.png",
    keywords: ["Cognitive Bias", "Neural Firewall", "Mental Models", "Rationality"],
    content: `
      <h2>The Brain's Silent Sabotage</h2>
      <p>We believe we are rational actors. In reality, we are biological machines running outdated software. From the <em>Sunk Cost Fallacy</em> to <em>Confirmation Bias</em>, our brains are constantly filtering reality to fit our existing narratives. This is the "Ego Trap."</p>
      
      <p>To combat this, you need a Neural Firewall. At MindOS, we implement Socratic Questioning protocols that force your brain to confront its own inconsistencies. By mapping your reasoning onto a geometric logic tree, we can identify exactly where your logic deviates from objective data.</p>
      
      <h3>Installing the Firewall</h3>
      <p>The first step to radical clarity is admitting you are biased. The second step is using AI to audit your decisions. When you run a diagnostic on MindOS, our mentor personas act as a third-party auditor, providing the cold logic your friends (and your ego) are too polite to give you.</p>
    `
  },
  {
    id: 'roi-of-radical-clarity',
    title: "The ROI of Radical Clarity: Saving 5 Years of Regret",
    excerpt: "Most people spend years fixing mistakes that took 5 minutes to make. We calculate the long-term impact of your choices before you pull the trigger.",
    date: "May 08, 2026",
    readTime: "6 min read",
    category: "Business",
    image: "/blog_time_regret_1777816570059.png",
    keywords: ["Decision ROI", "Regret Analysis", "Strategic Planning", "MindOS Growth"],
    content: `
      <h2>The Compound Interest of Good Choices</h2>
      <p>We often think of ROI in financial terms. But the highest ROI you can achieve is in <strong>Time</strong>. A 5-minute logic audit on MindOS can prevent a career pivot that would have wasted five years of your professional life. We call this the <em>Regret Minimization Framework</em>.</p>
      
      <p>By simulating second and third-order effects, MindOS helps you see around corners. If you quit your job today, what is the ripple effect in 24 months? Most people can't see past 30 days. Our AI models simulate the future based on thousands of similar data points.</p>
      
      <h3>The 5-Minute Audit</h3>
      <p>Clarity is not a luxury; it is a competitive edge. In the age of high-velocity AI, those who can make accurate decisions the fastest will dominate their fields. Radical clarity is the lubricant that allows for high-velocity growth.</p>
    `
  },
  {
    id: 'neural-architects-future',
    title: "Neural Architects: The New Human-AI Partnership",
    excerpt: "We are entering the era of the 'Augmented Mind.' Discover how collaborating with AI mentors is changing personal development forever.",
    date: "May 05, 2026",
    readTime: "10 min read",
    category: "Future Tech",
    image: "/blog_neural_interface_1777816588625.png",
    keywords: ["AI Mentors", "Neural Architecture", "Augmented Mind", "Human-AI Synergy"],
    content: `
      <h2>Beyond the Chatbot</h2>
      <p>Most AI today is used for simple tasks: writing emails, generating images, or summarizing text. But the real frontier is <strong>Cognitive Augmentation</strong>. A Neural Architect doesn't just use AI to work; they use AI to think. They use algorithms to verify their logic and expand their mental capacity.</p>
      
      <p>MindOS is the first platform designed for the Augmented Mind. We don't just provide answers; we provide an architectural logic layer that sits between your intuition and your actions. This is the future of personal growth.</p>
      
      <h3>The Synergy of Personas</h3>
      <p>By switching between different AI personas—like the Stoic, the Pragmatist, or the VC—users can look at a single problem through multiple lenses of logic. This triangulation of truth is something the human brain cannot do alone.</p>
    `
  },
  {
    id: 'sunk-cost-fallacy-ai',
    title: "The Sunk Cost Fallacy in the Age of Algorithms",
    excerpt: "Humans are biologically wired to keep pouring energy into failing projects. AI is the only tool cold enough to tell you when to quit.",
    date: "May 03, 2026",
    readTime: "7 min read",
    category: "Logic Lab",
    image: "/blog_logic_crossroads_1777816603571.png",
    keywords: ["Sunk Cost Fallacy", "AI quitting", "Logic vs Emotion", "Decision Lab"],
    content: `
      <h2>The Trap of Consistency</h2>
      <p>The human brain loves consistency. We would rather stay in a failing relationship or a dead-end job than admit we were wrong. This is the <em>Sunk Cost Fallacy</em>. We value the "Investment" we've already made more than the "Future" we could have.</p>
      
      <p>AI doesn't care about your past investments. It only cares about future ROI. When you input a decision into MindOS, the engine calculates the probability of future success without being clouded by the time you've already "wasted." It gives you the permission to quit that your ego won't.</p>
      
      <h3>The Freedom of Pivot</h3>
      <p>Quitting is not failure; it is strategic reallocation of resources. In the high-velocity world of 2026, the ability to pivot based on cold data is the ultimate survival skill. MindOS provides the data-backed conviction needed to walk away from a losing path.</p>
    `
  }
];

export default function Blog() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="bg-background text-foreground min-h-screen font-body relative overflow-x-hidden">
      {/* SEO Tags */}
      <title>MindOS Blog — Insights on Decision Intelligence & AI Mindset</title>
      <meta name="description" content="Explore the latest insights on AI coaching, cognitive bias, decision intelligence, and the future of human-AI collaboration at MindOS." />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-6 md:py-10 flex items-center justify-between bg-background/80 backdrop-blur-md md:bg-transparent">
        <div className="hidden md:flex gap-10 items-center">
          <Link href="/" className="text-[12px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-all">Home</Link>
          <Link href="/blog" className="text-[12px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-all border-b border-primary">Blog</Link>
          <Link href="/about" className="text-[12px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-all">About</Link>
          <Link href="/shop" className="text-[12px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-all">Shop</Link>
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-foreground/60 hover:text-primary transition-colors">
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/">
            <motion.div whileHover={{ scale: 1.1 }} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-primary flex items-center justify-center bg-background shadow-sm">
              <span className="font-cursive text-2xl md:text-3xl text-primary mt-1">m</span>
            </motion.div>
          </Link>
        </div>

        <div className="hidden md:flex gap-10 items-center">
          <SignInButton mode="modal">
            <button className="text-[12px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-all">Login</button>
          </SignInButton>
        </div>

        <div className="md:hidden">
          <SignInButton mode="modal">
            <button className="p-2 text-foreground/60 hover:text-primary transition-colors"><User className="w-6 h-6" /></button>
          </SignInButton>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 z-40 bg-background pt-32 px-10 md:hidden">
            <div className="flex flex-col gap-8 text-center">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-4xl font-heading font-black uppercase tracking-tighter">Home</Link>
              <Link href="/blog" onClick={() => setIsMenuOpen(false)} className="text-4xl font-heading font-black uppercase tracking-tighter text-primary">Blog</Link>
              <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-4xl font-heading font-black uppercase tracking-tighter">About</Link>
              <Link href="/shop" onClick={() => setIsMenuOpen(false)} className="text-4xl font-heading font-black uppercase tracking-tighter">Shop</Link>
              <SignInButton mode="modal">
                <button className="text-4xl font-heading font-black uppercase tracking-tighter">Login</button>
              </SignInButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blog Hero */}
      <section className="pt-32 md:pt-60 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-4">The Logic Journal</p>
          <h1 className="text-6xl md:text-9xl font-heading font-black mb-16 md:mb-24 tracking-tighter leading-[0.8] uppercase">
            Intelligence <br/><span className="text-primary italic font-cursive normal-case px-4 md:px-8">Manifesto.</span>
          </h1>

          {/* Featured Post */}
          <Link href={`/blog/${BLOG_POSTS[0].id}`}>
            <div className="group relative bg-white border border-border p-6 md:p-12 rounded-[2.5rem] md:rounded-[4rem] hover:shadow-2xl transition-all mb-20 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="aspect-[16/10] bg-soft overflow-hidden rounded-[2rem] md:rounded-[3rem] grayscale group-hover:grayscale-0 transition-all duration-700">
                  <img src={BLOG_POSTS[0].image} alt={BLOG_POSTS[0].title} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" />
                </div>
                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <span className="px-4 py-1 bg-soft border border-border rounded-full text-[9px] font-black uppercase tracking-widest text-primary">{BLOG_POSTS[0].category}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40">{BLOG_POSTS[0].date}</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-heading font-black leading-[0.9] group-hover:text-primary transition-colors uppercase tracking-tighter">
                    {BLOG_POSTS[0].title}
                  </h2>
                  <p className="text-lg md:text-xl font-medium leading-relaxed text-foreground/60 line-clamp-3">
                    {BLOG_POSTS[0].excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest group-hover:gap-6 transition-all">
                    Read Manifesto <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {BLOG_POSTS.slice(1).map((post, idx) => (
              <Link href={`/blog/${post.id}`} key={post.id}>
                <motion.article 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group flex flex-col h-full bg-white border border-border p-8 rounded-[2.5rem] md:rounded-[3.5rem] hover:border-primary transition-all shadow-sm hover:shadow-xl"
                >
                  <div className="aspect-[4/3] bg-soft overflow-hidden rounded-[2rem] mb-8 grayscale group-hover:grayscale-0 transition-all duration-700">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" />
                  </div>
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-black uppercase tracking-widest text-primary">{post.category}</span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-foreground/40">{post.readTime}</span>
                    </div>
                    <h3 className="text-2xl font-heading font-black leading-[1.1] uppercase tracking-tighter group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm font-medium leading-relaxed text-foreground/60 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40 group-hover:text-primary transition-colors flex items-center gap-2">
                      Full Protocol <ChevronRight className="w-3 h-3" />
                    </span>
                    <Calendar className="w-3 h-3 text-foreground/20" />
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Newsletter */}
      <section className="py-40 bg-soft border-y border-border">
        <div className="max-w-4xl mx-auto px-12 text-center">
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6">Neural Dispatch</p>
          <h2 className="text-4xl md:text-6xl font-heading font-black mb-12 uppercase tracking-tighter">Audit your inbox.</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="email" 
              placeholder="ENTER YOUR NEURAL LINK (EMAIL)" 
              className="flex-1 bg-white border border-border px-10 py-6 rounded-full text-[10px] font-black uppercase tracking-widest focus:border-primary outline-none transition-all"
            />
            <button className="px-12 py-6 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
              Subscribe
            </button>
          </div>
          <p className="mt-8 text-[8px] font-bold text-foreground/30 uppercase tracking-widest">
            100% Signal. 0% Noise. Unsubscribe from the herd at any time.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-12 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex gap-10">
            <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-primary transition-all">Privacy</Link>
            <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-primary transition-all">Terms</Link>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-foreground/20">© 2026 MindOS Decision Lab • India</p>
          <div className="flex gap-10">
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-primary transition-all">X / Twitter</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-primary transition-all">Instagram</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
