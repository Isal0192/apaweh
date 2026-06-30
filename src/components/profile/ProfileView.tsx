'use client';

import React, { useState } from 'react';
import { Project } from '../../types';
import { ProjectCard } from './ProjectCard';
import { createContactMessage } from '../../app/actions';

import { Github, Mail, Layers, Globe, Terminal, Server, ShieldCheck, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface ProfileViewProps {
  projects: Project[];
  isAdmin: boolean;
}

type CategoryType = 'All' | 'Web App' | 'Homelab' | 'DevOps';

const CATEGORIES: CategoryType[] = ['All', 'Web App', 'Homelab', 'DevOps'];

const CATEGORY_ICONS: Record<CategoryType, React.ReactNode> = {
  'All': <Layers className="w-4 h-4 mr-1.5" />,
  'Web App': <Globe className="w-4 h-4 mr-1.5" />,
  'Homelab': <Server className="w-4 h-4 mr-1.5" />,
  'DevOps': <Terminal className="w-4 h-4 mr-1.5" />,
};

const SKILLS = [
  'React', 'Next.js', 'TypeScript', 'Tailwind CSS',
  'Node.js', 'Docker', 'Kubernetes', 'Autocad', 'Linux/Ubuntu'
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export const ProfileView: React.FC<ProfileViewProps> = ({ projects, isAdmin }) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('All');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(project => project.category === activeCategory);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMsg.trim()) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    const res = await createContactMessage(contactName, contactEmail, contactMsg);
    
    setIsSubmitting(false);
    if (res.success) {
      setSubmitStatus('success');
      setContactName('');
      setContactEmail('');
      setContactMsg('');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } else {
      setSubmitStatus('error');
    }
  };

  return (
    <motion.div 
      className="space-y-12"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {/* Bio / Profil Singkat - Glassmorphic Aesthetic */}
      <motion.section variants={itemVariants} className="glass-panel p-5 md:p-12 relative overflow-hidden" aria-label="Profil Singkat">
        {/* Decorative background glows */}
        <div className="absolute top-[-50px] left-[-50px] w-48 h-48 bg-primary/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 bg-pink-500/10 rounded-full blur-[100px]" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">

          {/* Kiri - Bio & Informasi Teknis (7 Kolom) */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            {/* Tagline / Subtitle */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-3">
              <div className="w-8 h-[1px] bg-primary/50"></div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-semibold">
                Hello, I'm
              </span>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <motion.h1 
                className="font-sans text-4xl md:text-8xl font-black tracking-tight text-foreground leading-none"
                whileHover={{ scale: 1.02, x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Fajar
              </motion.h1>
              <motion.h1 
                className="font-sans text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500 text-3xl sm:text-5xl md:text-7xl font-black tracking-tight leading-none pb-2"
                whileHover={{ scale: 1.02, x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className='font-sans text-4xl md:text-8xl font-black tracking-tight text-foreground leading-none'>M.</span> S.Gemini, M.GPT, Cld., DpS.
              </motion.h1>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4">
        
              <div className="glass-panel p-4 bg-black/5 dark:bg-white/5 border-none">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Spesialisasi</p>
                <p className="text-sm font-bold text-foreground">Web App • Homelab Server • 3D Desain</p>
              </div>
            </motion.div>

            {/* Paragraf Deskripsi */}
            <motion.p variants={itemVariants} className="text-foreground/80 leading-relaxed text-sm md:text-base max-w-xl font-medium">
              Seorang siswa yang suka pada otomatisasi, jaringan, perangkat keras dan hal terkait teknologi.
            </motion.p>

            {/* Skill Set */}
            <motion.div variants={itemVariants} className="space-y-3 pt-2">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Bisa:</p>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill, index) => (
                  <motion.span
                    key={index}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 rounded-full text-[11px] font-medium bg-primary/10 text-primary border border-primary/20 cursor-pointer shadow-sm"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Kontak & Social & Badge Admin */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-4">
              <motion.a
                whileHover={{ scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="mailto:faisalfajar1305@gmail.com"
                className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-foreground hover:text-primary hover:border-primary/50 transition-colors"
                title="Kirim Email"
              >
                <Mail className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.15, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                href="https://github.com/Isal0192"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-foreground hover:text-primary hover:border-primary/50 transition-colors"
                title="GitHub"
              >
                <Github className="w-5 h-5" />
              </motion.a>
              {isAdmin && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-amber-500/20 border border-amber-500/50 text-amber-500 uppercase tracking-wider backdrop-blur-md"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Mode Admin Aktif
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Kanan - Foto Profil Besar (5 Kolom) */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-5 relative w-full hidden md:flex items-center justify-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-pink-500/30 rounded-[3rem] blur-2xl transform rotate-6 scale-105" />
              <img
                src="/profile_avatar_tall.png"
                alt="Fajar S."
                className="w-full max-w-xs md:max-w-md lg:max-w-lg h-auto md:h-[600px] object-contain relative z-10 drop-shadow-2xl"
                loading="eager"
                style={{ maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }}
              />
            </motion.div>
          </motion.div>

        </div>
      </motion.section>

      {/* Grid Project & Filter */}
      <motion.section variants={itemVariants} className="space-y-8" aria-label="Daftar Projek">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass-panel p-6">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
              Projek Pilihan
            </h2>
            <p className="text-sm text-foreground/70 mt-1 font-medium">
              Daftar pekerjaan, lab eksperimen, dan perkakas devops yang saya kelola secara aktif.
            </p>
          </div>

          {/* Filter Kategori */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === category 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
                    : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-foreground border border-border/50 backdrop-blur-md'
                }`}
              >
                {CATEGORY_ICONS[category]}
                {category}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={project.id} 
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center py-16 text-foreground/60 glass-panel font-medium"
          >
            Belum ada projek dalam kategori ini. {isAdmin && 'Tambahkan projek di Admin Panel!'}
          </motion.div>
        )}
      </motion.section>

      {/* Hubungi Saya (Contact Section) */}
      <motion.section variants={itemVariants} className="pt-8 pb-12" aria-label="Hubungi Saya">
        <div className="glass-panel p-6 md:p-12 relative overflow-hidden flex flex-col md:flex-row gap-12">
          {/* Ornamen Latar */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-br from-primary to-pink-500">
              Mari Berkolaborasi!
            </h2>
            <p className="text-foreground/80 leading-relaxed font-medium text-sm md:text-base max-w-sm">
              Tertarik dengan profil saya? Punya ide proyek seru atau sekadar ingin bertegur sapa? Jangan ragu untuk meninggalkan pesan di sini.
            </p>
            <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground pt-4">
              <Mail className="w-5 h-5 text-primary" /> faisalfajar1305@gmail.com
            </div>
          </div>

          <div className="md:w-1/2 relative z-10">
            <form onSubmit={handleContactSubmit} className="space-y-4 bg-background/50 backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-border/50 shadow-xl">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-1">Nama Anda</label>
                <input 
                  required
                  type="text" 
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="John Doe" 
                  className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-background/80 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-1">Email Anda</label>
                <input 
                  required
                  type="email" 
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="john@example.com" 
                  className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-background/80 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-1">Pesan</label>
                <textarea 
                  required
                  rows={4}
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  placeholder="Halo Fajar, saya tertarik dengan..." 
                  className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-background/80 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 font-bold rounded-2xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 bg-primary text-primary-foreground disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Mengirim...</>
                ) : submitStatus === 'success' ? (
                  <><CheckCircle2 className="w-5 h-5" /> Pesan Terkirim!</>
                ) : (
                  <><Send className="w-5 h-5" /> Kirim Pesan Sekarang</>
                )}
              </button>
              
              {submitStatus === 'error' && (
                <p className="text-xs text-red-500 font-semibold text-center mt-2">Gagal mengirim pesan, silakan coba lagi.</p>
              )}
            </form>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};