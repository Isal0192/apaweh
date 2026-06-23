'use client';

import React, { useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLink: (title: string, description: string, category: string, url: string) => void;
}

export const AddLinkModal: React.FC<AddLinkModalProps> = ({ isOpen, onClose, onAddLink }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('File Share');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !url.trim() || !description.trim()) {
      setError('Semua input harus diisi.');
      return;
    }

    const trimmedUrl = url.trim();
    if (/^javascript:/i.test(trimmedUrl)) {
      setError('Protokol URL tidak valid (keamanan). Gunakan http:// atau https://');
      return;
    }

    let finalUrl = trimmedUrl;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    onAddLink(title.trim(), description.trim(), category, finalUrl);
    
    setTitle('');
    setDescription('');
    setCategory('File Share');
    setUrl('');
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Bagikan Tautan / File Baru">
      <form onSubmit={handleSubmit} className="space-y-5">
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-3 text-xs font-bold bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Judul Link / File
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Modul Belajar Kubernetes PDF"
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-border/50 bg-black/5 dark:bg-white/5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Kategori
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-border/50 bg-black/5 dark:bg-white/5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium appearance-none"
          >
            <option value="File Share">File Share (PDF/Zip)</option>
            <option value="Video / Movie">Video / Movie Player</option>
            <option value="Reference Link">Link Referensi</option>
            <option value="Server Tools">Server / Tool Config</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            URL / Tautan (e.g. GDrive Link, YouTube Link)
          </label>
          <input
            type="text"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://drive.google.com/file/d/..."
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-border/50 bg-black/5 dark:bg-white/5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Deskripsi Singkat
          </label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tuliskan keterangan isi file atau tautan..."
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-border/50 bg-black/5 dark:bg-white/5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none font-medium"
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="outline" type="button" onClick={onClose} className="rounded-xl px-5 border-border/50 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-foreground transition-all">
              Batal
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="primary" type="submit" className="rounded-xl px-5 shadow-lg shadow-primary/20">
              Tambah Link
            </Button>
          </motion.div>
        </div>
      </form>
    </Dialog>
  );
};
