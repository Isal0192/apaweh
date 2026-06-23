import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface SharingPlayerProps {
  url: string;
  title: string;
  description: string;
  category: string;
  slug?: string;
  onClose: () => void;
  isSingleLinkMode?: boolean; // If true, back button goes to Hub
}

export const SharingPlayer: React.FC<SharingPlayerProps> = ({
  url,
  title,
  description,
  category,
  slug,
  onClose,
  isSingleLinkMode = false,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (!slug) return;
    const shareUrl = `${window.location.origin}/sharing/${slug}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background flex flex-col"
    >
      <header className="flex items-center justify-between px-6 py-4 glass-panel border-b-0 rounded-none z-10 bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (isSingleLinkMode) {
                window.location.href = '/?tab=sharing';
              } else {
                onClose();
              }
            }}
            className="p-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-foreground transition-colors cursor-pointer focus:outline-none flex-shrink-0"
            title="Kembali ke Hub Sharing"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-primary/10 border border-primary/20 text-primary inline-block">
                {category}
              </span>
            </div>
            <h1 className="text-base md:text-lg font-black tracking-tight text-foreground leading-tight truncate" title={title}>
              {title}
            </h1>
          </div>
        </div>
        {description && (
          <div className="hidden md:block text-xs text-muted-foreground max-w-md truncate ml-4 font-medium" title={description}>
            {description}
          </div>
        )}
        {slug && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="ml-auto hidden sm:flex h-8 px-3 text-xs font-bold items-center gap-1.5 rounded-full text-primary border border-primary/20 bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer"
            title="Salin Link Sharing"
          >
            {copied ? <span className="text-green-500">Tersalin!</span> : <span>Salin Link</span>}
          </motion.button>
        )}
      </header>

      <main className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
        {url.includes('youtube.com') || url.includes('drive.google.com') ? (
          <iframe
            src={url}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="text-center p-8 max-w-lg glass-panel bg-white/5 border-white/10 rounded-3xl mx-4">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Tautan Eksternal</h3>
            <p className="text-white/60 mb-8 leading-relaxed">
              Tautan ini tidak dapat dimainkan secara langsung di dalam aplikasi. Silakan buka di tab baru untuk melihat konten.
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20 hover:shadow-primary/40"
            >
              Buka di Tab Baru
            </a>
          </div>
        )}
      </main>
    </motion.div>
  );
};
