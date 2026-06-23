'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { SearchX, Home, Sparkles } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.1, 
      delayChildren: 0.15 
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: 'spring' as const, 
      stiffness: 100, 
      damping: 15, 
      duration: 0.5 
    } 
  },
};

export default function NotFound() {
  return (
    <div className="relative min-h-[70vh] py-16 flex items-center justify-center px-4 overflow-hidden bg-gradient-to-b from-gray-50/50 via-white to-gray-50/30">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Vibrant Ambient Glowing Blobs */}
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-indigo-200/40 rounded-full blur-3xl opacity-70 pointer-events-none animate-blob" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl opacity-70 pointer-events-none animate-blob-slow" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl opacity-50 pointer-events-none animate-blob animation-delay-2000" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 p-10 sm:p-14 text-center overflow-hidden"
      >
        {/* Floating Orb Icon Assembly */}
        <motion.div variants={item} className="relative w-28 h-28 mx-auto mb-8 flex items-center justify-center">
          {/* Pulsing Backlight */}
          <div className="absolute inset-2 bg-gradient-primary rounded-full blur-xl opacity-30 animate-pulse" />
          
          {/* Main Icon Container */}
          <motion.div
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, -4, 0, 4, 0] 
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
            className="w-20 h-20 rounded-3xl bg-gradient-primary flex items-center justify-center shadow-lg relative z-10 border border-white/20"
          >
            <SearchX className="w-10 h-10 text-white" strokeWidth={1.5} />
            <span className="absolute -inset-2 rounded-3xl border border-indigo-200/30 animate-ping pointer-events-none opacity-40" />
          </motion.div>

          {/* Orbiting Sparkles Orb */}
          <motion.div
            animate={{ 
              y: [0, 6, 0],
              scale: [1, 1.1, 0.9, 1]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: 'easeInOut', 
              delay: 0.5 
            }}
            className="absolute -top-2 -right-2 w-10 h-10 rounded-2xl bg-white border border-gray-100 shadow-md flex items-center justify-center z-20"
          >
            <Sparkles className="w-5 h-5 text-amber-500" />
          </motion.div>

          {/* Orbiting Small Dot */}
          <motion.div
            animate={{ 
              x: [0, -10, 0],
              y: [0, -6, 0]
            }}
            transition={{ 
              duration: 4.5, 
              repeat: Infinity, 
              ease: 'easeInOut', 
              delay: 1 
            }}
            className="absolute -bottom-2 -left-2 w-6 h-6 rounded-lg bg-white border border-gray-100 shadow-sm flex items-center justify-center z-20"
          >
            <div className="w-2 h-2 rounded-full bg-upleex-blue animate-pulse" />
          </motion.div>
        </motion.div>

        {/* 404 Heading */}
        <motion.h1
          variants={item}
          className="text-7xl sm:text-8xl font-black text-gradient-primary tracking-tight mb-2 select-none"
        >
          404
        </motion.h1>

        {/* Message */}
        <motion.h2 
          variants={item} 
          className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3"
        >
          Page Not Found
        </motion.h2>
        
        {/* Description */}
        <motion.p 
          variants={item} 
          className="text-slate-500 text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto"
        >
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back on track.
        </motion.p>

        {/* Action Button */}
        <motion.div
          variants={item}
          className="flex justify-center"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-primary text-white font-extrabold text-base px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/80 hover:opacity-95 active:scale-98 cursor-pointer"
            >
              <Home className="w-5 h-5" />
              Go to Homepage
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Local Page Grid Styles */}
      <style jsx global>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(99, 102, 241, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.04) 1px, transparent 1px);
          background-size: 32px 32px;
        }
      `}</style>
    </div>
  );
}