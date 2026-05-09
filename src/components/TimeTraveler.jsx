'use client';

import { motion } from 'framer-motion';
import { Clock, TrendingUp, Anchor, Milestone, Sparkles } from 'lucide-react';

export default function TimeTraveler({ data }) {
  if (!data) return null;

  const steps = [
    { year: '1 Year', key: 'year1', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { year: '5 Years', key: 'year5', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/5' },
    { year: '10 Years', key: 'year10', icon: Anchor, color: 'text-orange-500', bg: 'bg-orange-50' }
  ];

  return (
    <div className="mt-16 border-t border-border pt-16">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center">
          <Milestone className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-3xl font-heading font-black uppercase tracking-tighter">Time-Traveler <span className="text-primary italic">Projection</span></h3>
          <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em]">Decade-long ripple effect simulation</p>
        </div>
      </div>

      <div className="relative space-y-12 pl-12 md:pl-0">
        {/* Vertical Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-border to-transparent -translate-x-1/2 hidden md:block" />

        {steps.map((step, index) => {
          const projection = data[step.key];
          const isEven = index % 2 === 0;

          return (
            <motion.div 
              key={step.key}
              initial={{ opacity: 0, x: isEven ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col md:flex-row items-center gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Content Card */}
              <div className="w-full md:w-5/12 bg-white p-8 md:p-10 rounded-[3rem] border border-border shadow-sm hover:shadow-xl transition-all group">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-10 h-10 rounded-xl ${step.bg} ${step.color} flex items-center justify-center`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">{step.year} Horizon</span>
                </div>
                <h4 className="text-2xl font-heading font-black uppercase mb-4 group-hover:text-primary transition-colors">{projection.title}</h4>
                <p className="text-lg font-bold text-foreground/60 leading-relaxed mb-6 italic">"{projection.impact}"</p>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/50">
                   <span className="text-[8px] font-black uppercase tracking-widest opacity-30">Risk Factor</span>
                   <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                     projection.risk === 'low' ? 'bg-green-100 text-green-600' : 
                     projection.risk === 'med' ? 'bg-orange-100 text-orange-600' : 
                     'bg-red-100 text-red-600'
                   }`}>
                     {projection.risk}
                   </span>
                </div>
              </div>

              {/* Center Node */}
              <div className="absolute left-4 md:left-1/2 w-10 h-10 bg-white border-2 border-primary rounded-full z-10 flex items-center justify-center -translate-x-1/2">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
              </div>

              {/* Spacer for MD */}
              <div className="hidden md:block md:w-5/12" />
            </motion.div>
          );
        })}
      </div>

      <div className="mt-16 p-10 bg-black rounded-[3.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Primary Compounding Asset</p>
            <h5 className="text-2xl font-heading font-black uppercase">{data.compoundingFactor}</h5>
          </div>
        </div>
        <p className="text-xs font-bold text-white/40 max-w-xs text-center md:text-right italic">
          "This decision isn't just an event; it's the root of a decade of consequences."
        </p>
      </div>
    </div>
  );
}
