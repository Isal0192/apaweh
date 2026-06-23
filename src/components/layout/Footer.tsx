import React from 'react';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
  return (
    <div className="w-full px-4 md:px-8 pb-6 pt-4">
      <motion.footer 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-7xl mx-auto py-6"
      >
        <div className="flex-1 w-full px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-foreground/70">
          <div>
            <span>© {new Date().getFullYear()} </span>
            <span className="font-bold text-foreground">Workspace Hub</span>
            <span>. All-in-One Dashboard Hub.</span>
          </div>
          <div className="flex gap-6 font-semibold">
            <motion.a whileHover={{ y: -2, color: 'var(--primary)' }} href="#" className="hover:text-primary transition-colors">Profile</motion.a>
            <motion.a whileHover={{ y: -2, color: 'var(--primary)' }} href="#" className="hover:text-primary transition-colors">Tulisan</motion.a>
            <motion.a whileHover={{ y: -2, color: 'var(--primary)' }} href="#" className="hover:text-primary transition-colors">Playground</motion.a>
            <motion.a whileHover={{ y: -2, color: 'var(--primary)' }} href="#" className="hover:text-primary transition-colors">Sharing</motion.a>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};
