import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, RefreshCw, Loader2 } from 'lucide-react';

interface AppDisplayFrameProps {
  appName: string;
  url: string;
  onClose: () => void;
}

export const AppDisplayFrame: React.FC<AppDisplayFrameProps> = ({ appName, url, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0); // Used to force refresh iframe

  const handleRefresh = () => {
    setIsLoading(true);
    setKey(prev => prev + 1);
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-background/80 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full h-full max-w-7xl bg-card border border-border/50 shadow-2xl rounded-2xl flex flex-col overflow-hidden glass-panel"
        >
          {/* Top Window Bar */}
          <div className="h-14 border-b border-border/50 bg-black/5 dark:bg-white/5 flex items-center justify-between px-4 select-none shrink-0">
            <div className="flex items-center gap-3">
              {/* Mac-style traffic lights (visual only) */}
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer hover:bg-red-500" onClick={onClose} />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="font-semibold text-sm text-foreground ml-2 hidden sm:block">
                {appName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handleRefresh}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-primary' : ''}`} />
              </button>
              <a 
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button 
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors ml-1"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* iFrame Content Area */}
          <div className="relative flex-1 w-full bg-white dark:bg-neutral-950">
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/50 backdrop-blur-sm z-10 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm font-medium text-muted-foreground">Memuat {appName}...</p>
              </div>
            )}
            
            <iframe
              key={key}
              src={url}
              className="w-full h-full border-0"
              onLoad={() => setIsLoading(false)}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              title={appName}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
