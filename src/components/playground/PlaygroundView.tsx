'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Map, Sparkles, ExternalLink, Activity, Code, Construction, Gamepad2, Package, Globe } from 'lucide-react';
import { AppDisplayFrame } from './AppDisplayFrame';
import { PlaygroundApp } from '../../types';

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

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Map': return <Map className="w-8 h-8 text-emerald-500" />;
    case 'Gamepad2': return <Gamepad2 className="w-8 h-8 text-amber-500" />;
    case 'Package': return <Package className="w-8 h-8 text-rose-500" />;
    case 'Globe': return <Globe className="w-8 h-8 text-sky-500" />;
    case 'Bot':
    default:
      return <Bot className="w-8 h-8 text-indigo-500" />;
  }
};

interface PlaygroundViewProps {
  apps: PlaygroundApp[];
}

export const PlaygroundView: React.FC<PlaygroundViewProps> = ({ apps }) => {
  const [activeApp, setActiveApp] = useState<PlaygroundApp | null>(null);

  if (!apps || apps.length === 0) {
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
  }

  return (
    <>
      <motion.div 
        className="max-w-6xl mx-auto py-8 space-y-8"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        <div className="flex items-center gap-3 border-b border-border/50 pb-6">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Interactive Showcase</h1>
            <p className="text-muted-foreground text-sm">Jelajahi aplikasi web yang saya kembangkan langsung dari dalam portofolio.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <motion.div
              key={app.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              onClick={() => setActiveApp(app)}
              className="glass-panel group cursor-pointer border border-border/50 p-6 flex flex-col gap-4 relative overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-full text-foreground/70">
                <Activity className="w-3 h-3 text-primary animate-pulse" />
                {app.status}
              </div>

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${app.color} transition-transform group-hover:scale-110`}>
                {getIcon(app.iconName)}
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {app.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {app.description}
                </p>
              </div>

              <div className="mt-auto pt-4 border-t border-border/50 flex items-center gap-2 text-xs font-semibold text-primary">
                Buka Aplikasi <ExternalLink className="w-3 h-3" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Render iFrame Modal if an app is active */}
      {activeApp && (
        <AppDisplayFrame 
          appName={activeApp.name} 
          url={activeApp.url} 
          onClose={() => setActiveApp(null)} 
        />
      )}
    </>
  );
};
