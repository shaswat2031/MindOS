'use client';

import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { SignInButton } from '@clerk/nextjs';
import { ArrowLeft, Calendar, Clock, Share2, Send, Globe, Menu, X, User } from 'lucide-react';
import { useState } from 'react';

// Reuse the same posts data
const BLOG_POSTS = [
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

      <blockquote>"In the age of AI, intuition is merely a hypothesis that must be audited before it is executed." — MindOS Logic Protocol</blockquote>

      <h2>Logic as a Competitive Edge</h2>
      <p>In a world of high-velocity data, those who rely on "feel" are already behind. The future belongs to the <strong>Neural Architect</strong>—the individual who uses AI as a cognitive layer to filter reality. At MindOS, we don't just provide an app; we provide a firewall against irrationality.</p>
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

      <blockquote>"The greatest obstacle to discovery is not ignorance—it is the illusion of knowledge." — Daniel J. Boorstin</blockquote>

      <h2>The Geometry of Truth</h2>
      <p>Visualizing a decision is the fastest way to de-bias it. When you see your logic laid out on a MindOS grid, the gaps become obvious. You can no longer hide behind "maybe" or "I think." The data demands an answer.</p>
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

      <h2>The Opportunity Cost of Hesitation</h2>
      <p>Every day spent in a state of "Analysis Paralysis" is a day of lost ROI. MindOS provides the <strong>mathematical conviction</strong> needed to move fast. When the data says 'GO', you go with 100% confidence.</p>
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

      <h2>The Next Evolution of Mindset</h2>
      <p>Mindset used to be about "Motivation." In 2026, mindset is about "Model Selection." Which mental model are you running? MindOS helps you select the right framework for the right problem.</p>
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

      <h2>Audit Your Commitments</h2>
      <p>Look at your current projects. If you were starting them today from zero, would you still begin? If the answer is no, you are in a Sunk Cost Trap. MindOS is your exit ramp.</p>
    `
  }
];

export default function BlogPost() {
  const { slug } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const post = BLOG_POSTS.find(p => p.id === slug);

  if (!post) return <div className="min-h-screen flex items-center justify-center font-heading font-black uppercase tracking-widest">Protocol Not Found.</div>;

  return (
    <main className="bg-background text-foreground min-h-screen font-body relative overflow-x-hidden">
      {/* SEO */}
      <title>{post.title} — MindOS Intelligence Journal</title>
      <meta name="description" content={post.excerpt} />
      <meta name="keywords" content={post.keywords.join(', ')} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-6 md:py-10 flex items-center justify-between bg-background/80 backdrop-blur-md md:bg-transparent">
        <div className="hidden md:flex gap-10 items-center">
          <Link href="/" className="text-[12px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-all">Home</Link>
          <Link href="/blog" className="text-[12px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-all border-b border-primary">Blog</Link>
          <Link href="/about" className="text-[12px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-all">About</Link>
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
      </nav>

      {/* Blog Detail */}
      <article className="pt-32 md:pt-60 pb-40">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/blog">
            <motion.div whileHover={{ x: -10 }} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-12">
              <ArrowLeft className="w-4 h-4" /> Back to Journal
            </motion.div>
          </Link>

          <header className="mb-20">
            <div className="flex items-center gap-6 mb-8">
              <span className="px-4 py-1 bg-soft border border-border rounded-full text-[9px] font-black uppercase tracking-widest text-primary">{post.category}</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2"><Calendar className="w-3 h-3" /> {post.date}</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2"><Clock className="w-3 h-3" /> {post.readTime}</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-heading font-black tracking-tighter leading-[0.9] uppercase mb-12">
              {post.title}
            </h1>
            <p className="text-xl md:text-2xl font-medium leading-relaxed text-foreground/60 italic border-l-4 border-primary pl-8">
              {post.excerpt}
            </p>
          </header>

          {/* Hero Image */}
          <div className="aspect-[16/9] bg-soft rounded-[3rem] overflow-hidden mb-20 shadow-2xl">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>

          {/* Content */}
          <div className="prose prose-2xl prose-stone max-w-none 
            prose-headings:font-heading prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter 
            prose-h2:text-4xl md:prose-h2:text-5xl prose-h2:mt-24 prose-h2:mb-10
            prose-h3:text-2xl md:prose-h3:text-3xl prose-h3:mt-16 prose-h3:mb-8
            prose-p:text-lg md:prose-p:text-xl prose-p:leading-relaxed prose-p:mb-8 prose-p:text-foreground/80
            prose-blockquote:border-l-primary prose-blockquote:bg-soft prose-blockquote:p-12 prose-blockquote:rounded-[2rem] prose-blockquote:italic prose-blockquote:font-heading prose-blockquote:text-3xl
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Keywords / Tags */}
          <div className="mt-24 pt-12 border-t border-border flex flex-wrap gap-4">
            {post.keywords.map(tag => (
              <span key={tag} className="px-5 py-2 bg-white border border-border rounded-full text-[9px] font-black uppercase tracking-widest text-foreground/40">#{tag}</span>
            ))}
          </div>

          {/* Share */}
          <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-10 p-12 bg-soft rounded-[3rem] border border-border">
            <div className="text-center md:text-left">
              <h4 className="text-xl font-heading font-black uppercase tracking-tighter mb-2">Audit your network.</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Share this protocol with someone who needs clarity.</p>
            </div>
            <div className="flex gap-6">
              <button className="w-12 h-12 rounded-full border border-border bg-white flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all"><X className="w-5 h-5" /></button>
              <button className="w-12 h-12 rounded-full border border-border bg-white flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all"><Send className="w-5 h-5" /></button>
              <button className="w-12 h-12 rounded-full border border-border bg-white flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all"><Globe className="w-5 h-5" /></button>
              <button className="w-12 h-12 rounded-full border border-border bg-white flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all"><Share2 className="w-5 h-5" /></button>
            </div>

          </div>
        </div>
      </article>

      {/* Footer (Simplified) */}
      <footer className="py-20 px-12 bg-background border-t border-border text-center">
        <Link href="/blog" className="text-[10px] font-black uppercase tracking-[0.4em] text-primary hover:tracking-[0.6em] transition-all">Back to Full Journal</Link>
        <p className="mt-10 text-[10px] font-black uppercase tracking-widest text-foreground/20">© 2026 MindOS Decision Lab</p>
      </footer>
    </main>
  );
}
