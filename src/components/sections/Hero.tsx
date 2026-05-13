'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const stats = [
  '47 Tools',
  '0 Uploads',
  '100% Private',
  'Free Forever',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Hero() {
  const scrollToGrid = () => {
    document.getElementById('tool-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHow = () => {
    document.getElementById('why-unitoolkit')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative flex min-h-[85vh] w-full flex-col items-center justify-center overflow-hidden bg-background px-4 py-20 text-center sm:px-6 lg:px-8">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 bg-dot-pattern opacity-50"></div>
      
      {/* Aurora blob */}
      <div className="absolute left-1/2 top-1/2 z-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.15)_0%,rgba(0,0,0,0)_70%)] blur-[80px]"></div>

      <div className="relative z-10 flex max-w-4xl flex-col items-center gap-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent"
        >
          <Sparkles className="h-4 w-4" />
          <span>47 Free Tools — No Signup Required</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-[80px] lg:leading-[1.1]"
        >
          Every tool a student <br className="hidden sm:block" />
          <span className="text-gradient">actually needs.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl text-lg text-text-muted sm:text-xl"
        >
          PDF, image, developer, and university utilities. All run in your browser. 
          Your files never leave your device.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center gap-4 w-full sm:w-auto sm:flex-row"
        >
          <button
            onClick={scrollToGrid}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-semibold text-white transition-all hover:bg-accent-soft hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] sm:w-auto"
          >
            Browse Tools
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={scrollToHow}
            className="flex w-full items-center justify-center rounded-xl border border-border bg-surface/50 px-8 py-4 text-base font-medium text-text transition-colors hover:bg-surface-2 sm:w-auto"
          >
            How it works ↓
          </button>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-text-muted sm:mt-16 sm:gap-x-12"
        >
          {stats.map((stat, i) => (
            <motion.div key={stat} variants={itemVariants} className="flex items-center gap-2">
              {i > 0 && <span className="hidden h-1 w-1 rounded-full bg-border sm:block"></span>}
              <span>{stat}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
