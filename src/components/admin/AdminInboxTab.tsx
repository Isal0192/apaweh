'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getContactMessages, deleteContactMessage } from '../../app/actions';
import { Mail, Trash2, Calendar, User, CheckCircle, Loader2 } from 'lucide-react';

export const AdminInboxTab: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    const data = await getContactMessages();
    setMessages(data);
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus pesan ini?')) return;
    const res = await deleteContactMessage(id);
    if (res.success) {
      setMessages(messages.filter(m => m.id !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="font-semibold text-sm animate-pulse">Mengambil pesan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
          Kotak Masuk (Inbox)
        </h2>
        <p className="text-sm text-foreground/70 mt-1 font-medium">
          Daftar pesan dari pengunjung website melalui halaman Hubungi Saya.
        </p>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-16 text-foreground/60 glass-panel font-medium rounded-3xl"
            >
              <Mail className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
              Kotak masuk masih kosong.
            </motion.div>
          ) : (
            messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel p-6 rounded-3xl relative flex flex-col md:flex-row gap-6 items-start"
              >
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground leading-tight">{msg.name}</h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {msg.email}</span>
                        <span className="inline-flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(msg.createdAt).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border/30">
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>

                <div className="flex-shrink-0 self-end md:self-start">
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-500/30"
                    title="Hapus Pesan"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
