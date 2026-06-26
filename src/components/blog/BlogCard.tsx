import React from 'react';
import { BlogPost } from '../../types';
import { Calendar, BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface BlogCardProps {
  post: BlogPost;
  onClick: () => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, onClick }) => {
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex flex-col h-full cursor-pointer glass-panel group border border-border/40 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
      onClick={onClick}
    >
      <div className="flex-1 space-y-4 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -z-10 group-hover:bg-primary/20 transition-colors" />
        
        {/* Date and Read Time */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md border border-border/40 font-semibold backdrop-blur-sm">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            {post.date}
          </span>
          <span className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md border border-border/40 font-semibold backdrop-blur-sm">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            {post.readTime}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold tracking-tight font-serif text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
          {post.title}
        </h3>

        {/* Summary */}
        <p className="text-sm text-foreground/70 leading-relaxed line-clamp-3 font-medium">
          {post.summary}
        </p>

        {/* Tags */}
        <div className="flex flex-nowrap gap-2 pt-2 overflow-x-auto hide-scrollbar">
          {post.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded text-[11px] font-bold bg-black/5 dark:bg-white/5 border border-border/50 text-foreground/80 backdrop-blur-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center text-xs font-bold text-primary px-6 py-4 bg-black/5 dark:bg-white/5 border-t border-border/40 rounded-b-[22px] backdrop-blur-sm">
        <span>Baca Selengkapnya</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
};
