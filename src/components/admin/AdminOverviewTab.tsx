'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getDashboardStats } from '../../app/actions';
import { BarChart3, Layers, BookOpen, Share2, Mail, Loader2 } from 'lucide-react';

interface Stats {
  totalProjects: number;
  totalBlogs: number;
  totalLinks: number;
  totalViews: number;
  totalMessages: number;
}

export const AdminOverviewTab: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setIsLoading(true);
      const data = await getDashboardStats();
      setStats(data);
      setIsLoading(false);
    }
    loadStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="font-semibold text-sm animate-pulse">Memuat data statistik...</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Proyek', value: stats?.totalProjects, icon: <Layers className="w-6 h-6" />, color: 'from-blue-500/20 to-cyan-500/10', textColor: 'text-cyan-500' },
    { label: 'Total Tulisan', value: stats?.totalBlogs, icon: <BookOpen className="w-6 h-6" />, color: 'from-pink-500/20 to-rose-500/10', textColor: 'text-pink-500' },
    { label: 'Tayangan Blog', value: stats?.totalViews, icon: <BarChart3 className="w-6 h-6" />, color: 'from-amber-500/20 to-orange-500/10', textColor: 'text-amber-500' },
    { label: 'Pesan Masuk', value: stats?.totalMessages, icon: <Mail className="w-6 h-6" />, color: 'from-emerald-500/20 to-green-500/10', textColor: 'text-emerald-500' },
    { label: 'Sharing Links', value: stats?.totalLinks, icon: <Share2 className="w-6 h-6" />, color: 'from-purple-500/20 to-indigo-500/10', textColor: 'text-purple-500' },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
          Dasbor Statistik
        </h2>
        <p className="text-sm text-foreground/70 mt-1 font-medium">
          Pantau keseluruhan performa dan jumlah data pada sistem Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -4 }}
            className={`glass-panel p-6 rounded-3xl relative overflow-hidden flex items-center justify-between`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${card.color} rounded-full blur-[40px] pointer-events-none`} />
            
            <div className="space-y-1 z-10">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {card.label}
              </p>
              <h3 className={`text-4xl font-black ${card.textColor} drop-shadow-sm`}>
                {card.value?.toLocaleString('id-ID') || 0}
              </h3>
            </div>
            
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center ${card.textColor} shadow-inner backdrop-blur-md z-10`}>
              {card.icon}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
