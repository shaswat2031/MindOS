'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { SignInButton } from '@clerk/nextjs';
import { Menu, X, User, ShoppingCart } from 'lucide-react';
import { useState } from 'react';


export default function Shop() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="bg-background text-foreground min-h-screen font-body relative overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-6 md:py-10 flex items-center justify-between bg-background/80 backdrop-blur-md md:bg-transparent">
        {/* Left Links - Desktop */}
        <div className="hidden md:flex gap-10 items-center">
          <Link href="/" className="text-[12px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-all">Home</Link>
          <Link href="/blog" className="text-[12px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-all">Blog</Link>
          <Link href="/shop" className="text-[12px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-all border-b border-primary">Shop</Link>
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
          <button className="text-[12px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-all">
            Cart (0)
          </button>
        </div>

        {/* Mobile Action */}
        <div className="md:hidden flex items-center gap-2">
          <button className="p-2 text-foreground/60 hover:text-primary transition-colors">
            <ShoppingCart className="w-6 h-6" />
          </button>
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
              <Link href="/shop" onClick={() => setIsMenuOpen(false)} className="text-4xl font-heading font-black uppercase tracking-tighter text-primary">Shop</Link>
              <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-4xl font-heading font-black uppercase tracking-tighter">About</Link>
              <SignInButton mode="modal">
                <button className="text-4xl font-heading font-black uppercase tracking-tighter">Login</button>
              </SignInButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Shop Content */}
      <section className="pt-32 md:pt-60 pb-20 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-4">Laboratory Inventory</p>
          <h1 className="text-5xl md:text-8xl font-heading font-black mb-8 md:mb-12 tracking-tighter leading-tight">Tools for the <br/>Rational Mind.</h1>
          <p className="text-sm font-bold text-foreground/40 uppercase tracking-[0.5em] mb-12 md:mb-20">Coming Soon</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-left">
            {[
              { name: "Logic Ledger", price: "$49", desc: "Premium physical journal for decision auditing." },
              { name: "Heuristic Deck", price: "$29", desc: "52 mental models in a high-fashion card format." },
              { name: "Rationality Ring", price: "$199", desc: "Minimalist biometric tracker for cognitive stress." }
            ].map((item, i) => (
              <div key={item.name} className="group cursor-default border border-border p-8 md:p-12 hover:border-primary transition-all bg-white">
                <div className="aspect-square bg-soft mb-8" />
                <h3 className="text-2xl font-heading font-bold mb-2">{item.name}</h3>
                <p className="text-xs font-bold text-primary mb-4">{item.price}</p>
                <p className="text-sm text-foreground/60 leading-relaxed font-medium mb-8">{item.desc}</p>
                <button className="text-[10px] font-black uppercase tracking-widest text-foreground/40 group-hover:text-primary transition-colors">Waitlist Active</button>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

    </main>
  );
}
