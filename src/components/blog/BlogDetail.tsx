'use client';

import React from 'react';
import { BlogPost } from '../../types';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { sanitizeHtml } from '../../utils/sanitize';

interface BlogDetailProps {
  selectedPost: BlogPost;
  blogs: BlogPost[];
  handleClosePost: () => void;
  handleOpenPost: (post: BlogPost) => void;
}

export const BlogDetail: React.FC<BlogDetailProps> = ({
  selectedPost,
  blogs,
  handleClosePost,
  handleOpenPost,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-8 items-start py-2 w-full"
    >
      {/* Left Column: Editorial Main Article Content */}
      <div className="lg:col-span-8 space-y-6">
        {/* Back Link */}
        <button
          onClick={handleClosePost}
          className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors gap-2 cursor-pointer group focus:outline-none mb-2"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Kembali ke Portal Berita
        </button>

        <motion.article 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-6 text-foreground glass-panel p-4 sm:p-6 md:p-10 border-none bg-transparent dark:bg-transparent"
        >
          <header className="space-y-4 border-b border-border/50 pb-6">
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded-lg border border-border/50 font-semibold backdrop-blur-sm">
                <Calendar className="w-4 h-4 text-primary" />
                {selectedPost.date}
              </span>
              <span className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded-lg border border-border/50 font-semibold backdrop-blur-sm">
                <BookOpen className="w-4 h-4 text-primary" />
                {selectedPost.readTime}
              </span>
              <div className="flex-1" />
            </div>

            <h1 className="text-2xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
              {selectedPost.title}
            </h1>

            <p className="text-foreground/80 text-base leading-relaxed italic border-l-2 border-primary/50 pl-4 py-0.5 font-medium">
              {selectedPost.summary}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedPost.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-black/5 dark:bg-white/5 border border-border/50 text-foreground/80 backdrop-blur-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          {/* Rich Content HTML Body */}
          <div 
            className="prose prose-slate dark:prose-invert max-w-none text-base leading-relaxed space-y-6 text-foreground font-medium"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedPost.content) }}
          />

          {/* Bottom Tags */}
          <div className="flex flex-wrap gap-2 pt-8 border-t border-border/50">
            {selectedPost.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-black/5 dark:bg-white/5 text-foreground/80 border border-border/50 backdrop-blur-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </motion.article>
      </div>

      {/* Right Column: Sidebar (Other Articles & Information) */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-4 space-y-6 lg:border-l lg:border-border/40 lg:pl-8"
      >
        {/* Author Card / Info */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Penulis Tulisan
          </h4>
          <div className="flex items-center gap-3 glass-panel p-4 bg-black/5 dark:bg-white/5 border-border/40 backdrop-blur-sm shadow-sm">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-pink-500 flex items-center justify-center font-bold text-white text-sm select-none shadow-md">
              FS
            </div>
            <div>
              <h5 className="font-bold text-sm text-foreground">Faisal S.</h5>
              <p className="text-xs text-foreground/70 font-medium">DevOps & Frontend Engineer</p>
            </div>
          </div>
        </div>

        {/* List of other news */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Tulisan Lainnya
          </h4>
          <div className="space-y-3">
            {blogs
              .filter(post => post.slug !== selectedPost.slug)
              .slice(0, 5)
              .map((post) => (
                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  key={post.slug}
                  onClick={() => handleOpenPost(post)}
                  className="p-4 glass-panel bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-border/40 hover:border-primary/30 transition-all cursor-pointer group space-y-2 backdrop-blur-sm"
                >
                  <h5 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h5>
                  <div className="flex items-center justify-between text-[10px] text-foreground/60 font-semibold">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </motion.div>
              ))}
            {blogs.filter(post => post.slug !== selectedPost.slug).length === 0 && (
              <p className="text-xs text-muted-foreground italic">Tidak ada tulisan lain.</p>
            )}
          </div>
        </div>

        {/* Sidebar Note */}
        <div className="glass-panel p-4 bg-black/5 dark:bg-white/5 border border-border/40 space-y-2 backdrop-blur-sm">
          <h5 className="font-bold text-xs text-foreground flex items-center gap-1.5">
            💡 Catatan Tulisan
          </h5>
          <p className="text-[11px] text-foreground/70 leading-relaxed font-medium">
            Catatan dan opini teknis ini ditulis secara berkala berdasarkan kendala nyata dan solusi yang saya temukan dalam proyek harian.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
