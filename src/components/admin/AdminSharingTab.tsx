'use client';

import React, { useState } from 'react';
import { ShareLink, User } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Edit3, Trash2, Save } from 'lucide-react';
import { Input } from '../ui/Input';
import { generateSlug } from '../../utils/slug';

const generateId = () => Math.random().toString(36).substring(2, 9);

interface AdminSharingTabProps {
  links: ShareLink[];
  setLinks: (links: ShareLink[]) => void;
  currentUser: User | null;
}

export const AdminSharingTab: React.FC<AdminSharingTabProps> = ({ links, setLinks, currentUser }) => {
  const [linkId, setLinkId] = useState<string | null>(null);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkDesc, setLinkDesc] = useState('');
  const [linkCat, setLinkCat] = useState('File Share');
  const [linkUrl, setLinkUrl] = useState('');

  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkTitle.trim() || !linkUrl.trim()) return;

    if (linkId) {
      const updated = links.map(l => l.id === linkId ? {
        ...l, title: linkTitle, description: linkDesc, category: linkCat, url: linkUrl, slug: generateSlug(linkTitle)
      } : l);
      setLinks(updated);
    } else {
      const newLink: ShareLink = {
        id: generateId(), title: linkTitle, description: linkDesc, category: linkCat, url: linkUrl, createdAt: new Date().toLocaleDateString(), slug: generateSlug(linkTitle)
      };
      setLinks([newLink, ...links]);
    }
    handleResetLinkForm();
  };

  const handleEditLink = (l: ShareLink) => {
    setLinkId(l.id); setLinkTitle(l.title); setLinkDesc(l.description); setLinkCat(l.category); setLinkUrl(l.url);
  };

  const handleDeleteLink = (id: string) => {
    if (confirm('Yakin ingin menghapus link sharing ini?')) {
      setLinks(links.filter(l => l.id !== id));
      if (linkId === id) handleResetLinkForm();
    }
  };

  const handleResetLinkForm = () => {
    setLinkId(null); setLinkTitle(''); setLinkDesc(''); setLinkCat('File Share'); setLinkUrl('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Form Editor */}
      <div className="lg:col-span-5">
        <Card>
          <form onSubmit={handleSaveLink} className="p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="text-lg font-bold text-foreground">
                {linkId ? 'Edit Link Share' : 'Tambah Link Share'}
              </h3>
              <Button type="button" variant="outline" size="sm" onClick={handleResetLinkForm}>Reset</Button>
            </div>

            <div className="space-y-3">
              <Input label="Judul Link" required value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} placeholder="e.g. Movie GDrive Link" />
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Kategori</label>
                <select value={linkCat} onChange={(e) => setLinkCat(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                  <option value="File Share">File Share (PDF/Zip)</option>
                  <option value="Video / Movie">Video / Movie Player</option>
                  <option value="Reference Link">Link Referensi</option>
                  <option value="Server Tools">Server / Tool Config</option>
                </select>
              </div>

              <Input label="URL Tautan" required value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://drive.google.com/..." />
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Deskripsi</label>
                <textarea required rows={3} value={linkDesc} onChange={(e) => setLinkDesc(e.target.value)} placeholder="Keterangan singkat link..." className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none" />
              </div>
            </div>

            <Button type="submit" className="w-full flex items-center justify-center gap-1.5">
              <Save className="w-4 h-4" /> {linkId ? 'Simpan Link' : 'Tambah Link'}
            </Button>
          </form>
        </Card>
      </div>

      {/* List of links */}
      <div className="lg:col-span-7 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Daftar Link Sharing</h3>
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {links.map((l) => (
            <Card key={l.id} className="border border-border/80 hover:border-primary/20">
              <div className="p-4 flex justify-between items-center gap-3">
                <div className="space-y-1 truncate">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-primary/10 text-primary border border-primary/20">
                      {l.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm truncate text-foreground">{l.title}</h4>
                  <p className="text-xs text-muted-foreground truncate">{l.url}</p>
                </div>
                {currentUser?.role === 'admin' && (
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => handleEditLink(l)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-muted rounded transition-colors" title="Edit Link"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteLink(l.id)} className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/5 rounded transition-colors" title="Delete Link"><Trash2 className="w-4 h-4" /></button>
                  </div>
                )}
              </div>
            </Card>
          ))}
          {links.length === 0 && (
            <div className="text-center py-10 text-xs text-muted-foreground bg-card border border-border rounded-xl">
              Belum ada link sharing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
