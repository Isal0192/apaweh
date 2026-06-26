import React, { useState, useEffect } from 'react';
import { ShareLink } from '../../types';
import { SharingCard } from './SharingCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Layers, File, Film, Link as LinkIcon, Server } from 'lucide-react';
import { Input } from '../ui/Input';

import { User } from '../../types';

interface SharingListProps {
  links: ShareLink[];
  isAdmin: boolean;
  currentUser?: User | null;
  onDeleteLink: (id: string, e: React.MouseEvent) => void;
  onOpenPlayer: (link: ShareLink, e: React.MouseEvent) => void;
  onAddClick?: () => void;
}

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

export const SharingList: React.FC<SharingListProps> = ({ links, isAdmin, currentUser, onDeleteLink, onOpenPlayer, onAddClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [allCategories, setAllCategories] = useState<string[]>(['Semua']);

  useEffect(() => {
    const cats = new Set<string>();
    links.forEach(link => {
      if (link.category.trim()) cats.add(link.category.trim());
    });
    setAllCategories(['Semua', ...Array.from(cats)]);
  }, [links]);

  const filteredLinks = links.filter(link => {
    const matchesSearch = 
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || link.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (cat: string) => {
    const catLower = cat.toLowerCase();
    if (catLower.includes('video') || catLower.includes('movie')) return <Film className="w-4 h-4 mr-1.5" />;
    if (catLower.includes('server') || catLower.includes('tool')) return <Server className="w-4 h-4 mr-1.5" />;
    if (catLower.includes('reference') || catLower.includes('link')) return <LinkIcon className="w-4 h-4 mr-1.5" />;
    if (catLower.includes('file') || catLower.includes('share')) return <File className="w-4 h-4 mr-1.5" />;
    return <Layers className="w-4 h-4 mr-1.5" />;
  };

  return (
    <div className="space-y-8">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-4 max-w-2xl">
          <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Sharing <span className="text-primary">Hub</span>
          </h2>
          <p className="text-lg text-foreground/60 leading-relaxed font-medium">
            Kumpulan tautan penting, dokumen, dan resource yang bisa diakses secara internal.
          </p>
        </div>

        {(isAdmin || currentUser?.role === 'author_sharing') && onAddClick && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddClick}
            className="inline-flex items-center justify-center px-6 py-3 font-bold rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 bg-primary text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 w-full lg:w-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tambah Link
          </motion.button>
        )}
      </div>

      <div className="glass-panel p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-foreground/40" />
          </div>
          <Input
            type="text"
            placeholder="Cari link berdasarkan nama atau deskripsi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 bg-white/5 border-white/10 hover:border-primary/30 focus:border-primary"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar scroll-smooth">
          {allCategories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center border cursor-pointer ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                  : 'bg-black/5 dark:bg-white/5 text-foreground/70 hover:text-foreground border-transparent hover:border-foreground/20 hover:bg-black/10 dark:hover:bg-white/10'
              }`}
            >
              {category !== 'Semua' && getCategoryIcon(category)}
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* GRID LIST */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredLinks.map((link) => (
            <SharingCard 
              key={link.id} 
              link={link} 
              isAdmin={isAdmin} 
              onDelete={onDeleteLink} 
              onOpenPlayer={onOpenPlayer} 
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredLinks.length === 0 && (
        <motion.div 
          variants={itemVariants}
          className="text-center py-16 text-foreground/60 glass-panel font-medium"
        >
          Tidak ada tautan sharing yang cocok. {(isAdmin || currentUser?.role === 'author_sharing') && 'Klik "Tambah Link" untuk membuat baru!'}
        </motion.div>
      )}
    </div>
  );
};
