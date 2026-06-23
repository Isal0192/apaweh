'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code, Construction } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export const PlaygroundView: React.FC = () => {
  return (
    <motion.div 
      className="max-w-2xl mx-auto py-12"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.div 
        variants={itemVariants}
        className="glass-panel border border-border/40 p-8 text-center space-y-6 relative overflow-hidden"
      >
        {/* Decorative glows */}
        <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-amber-500/20 rounded-full blur-[60px]" />
        <div className="absolute bottom-[-50px] right-[-50px] w-48 h-48 bg-primary/10 rounded-full blur-[80px]" />

        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-sm relative z-10"
        >
          <Construction className="w-8 h-8 animate-bounce" />
        </motion.div>
        
        <div className="space-y-2 relative z-10">
          <motion.h2 
            variants={itemVariants}
            className="text-2xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground"
          >
            Playground Under Construction
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-sm text-foreground/70 leading-relaxed font-medium max-w-md mx-auto"
          >
            Halaman Web App Generator sedang dinonaktifkan sementara oleh Admin untuk pembaruan fitur. Silakan kembali lagi nanti untuk mencoba compiler web instan yang baru!
          </motion.p>
        </div>

        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          className="text-[11px] font-mono text-foreground/80 bg-black/5 dark:bg-white/5 p-3 rounded-lg flex items-center justify-center gap-1.5 border border-border/40 backdrop-blur-sm relative z-10 w-fit mx-auto"
        >
          <Code className="w-4 h-4 text-primary" />
          <span>Status: DEPRECATED_FOR_UPGRADE</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
