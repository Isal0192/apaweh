import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShareLink } from '../../types';
import { Trash2, Link2, Play, Copy, Check } from 'lucide-react';
import { getGDriveEmbedUrl, getYouTubeEmbedUrl } from '../../utils/media';

interface SharingCardProps {
  link: ShareLink;
  isAdmin: boolean;
  onDelete?: (id: string, e: React.MouseEvent) => void;
  onOpenPlayer?: (link: ShareLink, e: React.MouseEvent) => void;
}

export const SharingCard: React.FC<SharingCardProps> = ({ link, isAdmin, onDelete, onOpenPlayer }) => {
  const isGDrive = getGDriveEmbedUrl(link.url) !== null;
  const isYouTube = getYouTubeEmbedUrl(link.url) !== null;
  const canEmbed = isGDrive || isYouTube || link.category === 'Video / Movie';
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/sharing/${link.slug ?? link.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/sharing/${link.slug ?? link.id}`} className="block h-full">
        <motion.div 
          whileHover={{ y: -8 }}
          className="flex flex-col h-full glass-panel overflow-hidden group border border-border/40 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
        >
          <div className="p-6 relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -z-10 group-hover:bg-primary/20 transition-colors" />
            
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 border border-primary/20 text-primary">
                {link.category}
              </span>
              {isAdmin && onDelete && (
                <button
                  onClick={(e) => onDelete(link.id, e)}
                  className="text-muted-foreground hover:text-red-500 p-1.5 rounded-full hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer z-10"
                  title="Hapus Link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              {link.title}
            </h3>
          </div>
          
          <div className="px-6 flex-1 space-y-4">
            <p className="text-sm text-foreground/70 leading-relaxed line-clamp-3 font-medium">
              {link.description}
            </p>
            <div className="text-[11px] font-semibold text-foreground/80 flex items-center gap-2 bg-black/5 dark:bg-white/5 px-3 py-2 rounded-lg truncate border border-border/30">
              <Link2 className="w-3.5 h-3.5 flex-shrink-0 text-primary" />
              <span className="truncate">{link.url}</span>
            </div>
          </div>
          
          <div className="px-6 py-4 mt-6 border-t border-foreground/10 bg-black/5 dark:bg-white/5 flex gap-3 justify-between items-center backdrop-blur-sm">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Dibuat: {link.createdAt}
            </span>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="h-8 px-3 text-xs font-bold flex items-center gap-1.5 rounded-full text-foreground/70 border border-border/50 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground transition-colors cursor-pointer"
                title="Salin Link Sharing"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Tersalin!' : 'Salin'}</span>
              </motion.button>
              {canEmbed && onOpenPlayer && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => onOpenPlayer(link, e)}
                  className="h-8 px-3 text-xs font-bold flex items-center gap-1.5 rounded-full text-primary border border-primary/20 bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  Putar
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};
