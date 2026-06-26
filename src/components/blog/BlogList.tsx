'use client';

import React from 'react';
import { BlogPost } from '../../types';
import { BlogCard } from './BlogCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldCheck, Calendar, BookOpen, BookOpenCheck, ArrowRight } from 'lucide-react';

import { User } from '../../types';

interface BlogListProps {
  filteredPosts: BlogPost[];
  headlinePost: BlogPost | null;
  gridPosts: BlogPost[];
  allTags: string[];
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAdmin: boolean;
  currentUser?: User | null;
  handleOpenPost: (post: BlogPost) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export const BlogList: React.FC<BlogListProps> = ({
  filteredPosts,
  headlinePost,
  gridPosts,
  allTags,
  selectedTag,
  setSelectedTag,
  searchQuery,
  setSearchQuery,
  isAdmin,
  currentUser,
  handleOpenPost,
}) => {
  const canAdminister = isAdmin || currentUser?.role === 'author_blog';

  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {/* Header and Search */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-4">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h2 className="text-3xl font-black tracking-tight text-foreground bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                  Catatan Tulisan & Opini
                </h2>
            {canAdminister && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-500 self-center">
                <ShieldCheck className="w-3.5 h-3.5" />
                {isAdmin ? 'Admin Mode' : 'Author Mode'}
              </span>
            )}
          </div>
          <p className="text-sm text-foreground/70 font-medium mt-1">
            Dokumentasi proyek homelab, konfigurasi server mandiri, dan catatan pemrograman frontend.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari berita, topik, atau tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-border/50 bg-black/5 dark:bg-white/5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all backdrop-blur-sm"
          />
        </div>
      </motion.div>

      {/* Dynamic Tag/Category Navigation Filter */}
      {allTags.length > 1 && (
        <motion.div variants={itemVariants} className="flex flex-nowrap gap-2 border-b border-border/40 pb-4 overflow-x-auto hide-scrollbar">
          {allTags.map((tag) => (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer whitespace-nowrap backdrop-blur-sm ${
                selectedTag === tag
                  ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/30'
                  : 'bg-black/5 dark:bg-white/5 border-border/50 text-foreground/80 hover:text-foreground hover:bg-black/10 dark:hover:bg-white/10'
              }`}
            >
              {tag === 'Semua' ? '📂 Semua Kategori' : `#${tag}`}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* FEATURED NEWS HEADLINE SECTION */}
      {headlinePost && (
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5 }}
          onClick={() => handleOpenPost(headlinePost)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 glass-panel p-5 md:p-8 group cursor-pointer border border-border/40 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 relative overflow-hidden"
        >
          {/* Decorative Background */}
          <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

          {/* Animated Tech Gradient Cover Placeholder */}
          <div className="lg:col-span-7 w-full min-h-[200px] md:min-h-[280px] rounded-2xl bg-gradient-to-br from-primary/20 via-pink-500/10 to-indigo-500/20 flex flex-col justify-between p-6 relative overflow-hidden border border-border/45 select-none glass-panel">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent -z-10" />
            <span className="px-3 py-1 self-start rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-primary/25 border border-primary/30 text-primary backdrop-blur-md">
              Headline Utama
            </span>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground backdrop-blur-sm px-2 py-0.5 rounded-md bg-black/20 dark:bg-white/10">Catatan Teknis</span>
              <div className="flex items-center gap-1 text-primary text-xs font-black drop-shadow-sm">
                <BookOpenCheck className="w-4 h-4 animate-bounce" />
                Faisal&apos;s Notebook
              </div>
            </div>
          </div>

          {/* Headline Metadata */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4 relative z-10">
            <div className="space-y-3">
              <div className="flex items-center gap-4 text-[11px] text-foreground/70 font-semibold">
                <span className="flex items-center gap-1 bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md border border-border/40 backdrop-blur-sm">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  {headlinePost.date}
                </span>
                <span className="flex items-center gap-1 bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md border border-border/40 backdrop-blur-sm">
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                  {headlinePost.readTime}
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-black font-sans tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight">
                {headlinePost.title}
              </h3>

              <p className="text-sm text-foreground/80 leading-relaxed line-clamp-4 pt-1 font-medium">
                {headlinePost.summary}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/40">
              <div className="flex flex-wrap gap-2">
                {headlinePost.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/5 dark:bg-white/5 border border-border/50 text-foreground/80 backdrop-blur-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-primary group-hover:underline">
                Baca Selengkapnya
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Divider line between Headline and Regular Grid */}
      {headlinePost && gridPosts.length > 0 && (
        <hr className="border-t border-border/40 my-10" />
      )}

      {/* REGULAR NEWS PORTAL GRID */}
      {gridPosts.length > 0 && (
        <motion.div variants={itemVariants} className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
            Kabar Berita Terkini
          </h4>
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {gridPosts.map((post, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={post.id || index}
                >
                  <BlogCard
                    post={post}
                    onClick={() => handleOpenPost(post)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}

      {filteredPosts.length === 0 && (
        <motion.div 
          variants={itemVariants}
          className="text-center py-16 text-foreground/70 font-medium glass-panel border border-border/40 bg-black/5 dark:bg-white/5 backdrop-blur-sm"
        >
              Tidak ada tulisan yang cocok dengan filter atau pencarian Anda. {canAdminister && 'Buat tulisan baru di Admin Panel!'}
        </motion.div>
      )}
    </motion.div>
  );
};
