'use client';

import React, { useState } from 'react';
import { PlaygroundApp } from '../../types';
import { createPlaygroundApp, updatePlaygroundApp, deletePlaygroundApp } from '../../app/actions';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Plus, Trash2, Edit2, Loader2, Bot, Map, Gamepad2, Package, Globe } from 'lucide-react';

interface AdminPlaygroundTabProps {
  apps: PlaygroundApp[];
  setApps: (apps: PlaygroundApp[]) => void;
}

export const AdminPlaygroundTab: React.FC<AdminPlaygroundTabProps> = ({ apps, setApps }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    iconName: 'Bot',
    url: '',
    color: 'bg-indigo-500/10',
    status: 'Beta'
  });

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      iconName: 'Bot',
      url: '',
      color: 'bg-indigo-500/10',
      status: 'Beta'
    });
  };

  const handleEdit = (app: PlaygroundApp) => {
    setEditingId(app.id);
    setFormData({
      name: app.name,
      description: app.description,
      iconName: app.iconName,
      url: app.url,
      color: app.color,
      status: app.status
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus aplikasi ini?')) return;
    const res = await deletePlaygroundApp(id);
    if (res.success) {
      setApps(apps.filter(a => a.id !== id));
    } else {
      alert('Gagal menghapus aplikasi.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (editingId) {
      const res = await updatePlaygroundApp(editingId, formData);
      if (res.success && res.app) {
        setApps(apps.map(a => a.id === editingId ? res.app! : a));
        resetForm();
      } else {
        alert(res.error || 'Gagal menyimpan perubahan.');
      }
    } else {
      const res = await createPlaygroundApp(formData);
      if (res.success && res.app) {
        setApps([res.app, ...apps]);
        resetForm();
      } else {
        alert(res.error || 'Gagal menambahkan aplikasi.');
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      {/* FORM COLUMN */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="p-6 border-border/50 shadow-sm glass-panel">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            {editingId ? <Edit2 className="w-5 h-5 text-amber-500" /> : <Plus className="w-5 h-5 text-primary" />}
            {editingId ? 'Edit Aplikasi' : 'Tambah Aplikasi Baru'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Nama Aplikasi</label>
              <Input
                placeholder="misal: AI Tools Hub"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">URL Tujuan</label>
              <Input
                placeholder="https://example.com/ai"
                type="url"
                value={formData.url}
                onChange={e => setFormData({ ...formData, url: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Deskripsi Singkat</label>
              <textarea
                className="flex min-h-[80px] w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Deskripsi singkat..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Ikon</label>
                <select
                  className="flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  value={formData.iconName}
                  onChange={e => setFormData({ ...formData, iconName: e.target.value })}
                >
                  <option value="Bot">Bot</option>
                  <option value="Map">Map</option>
                  <option value="Gamepad2">Gamepad</option>
                  <option value="Package">Package</option>
                  <option value="Globe">Globe</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Warna</label>
                <select
                  className="flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  value={formData.color}
                  onChange={e => setFormData({ ...formData, color: e.target.value })}
                >
                  <option value="bg-indigo-500/10">Indigo</option>
                  <option value="bg-emerald-500/10">Emerald</option>
                  <option value="bg-amber-500/10">Amber</option>
                  <option value="bg-rose-500/10">Rose</option>
                  <option value="bg-sky-500/10">Sky</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Status</label>
              <Input
                placeholder="misal: Beta, In Development"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={isSubmitting} className="flex-1 rounded-xl">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm} className="rounded-xl border-border/50">
                  Batal
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>

      {/* LIST COLUMN */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-lg font-bold text-foreground">Daftar Aplikasi ({apps.length})</h3>
        
        {apps.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border/50 rounded-2xl bg-black/5 dark:bg-white/5">
            <p className="text-muted-foreground">Belum ada aplikasi. Tambahkan dari panel sebelah kiri.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {apps.map(app => (
              <Card key={app.id} className="p-4 border-border/50 glass-panel flex flex-col justify-between hover:border-primary/50 transition-colors">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-foreground line-clamp-1">{app.name}</h4>
                    <span className="text-[10px] uppercase font-bold bg-muted px-2 py-0.5 rounded-full">{app.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{app.description}</p>
                  <p className="text-[10px] text-primary/70 font-mono truncate bg-primary/5 px-2 py-1 rounded">{app.url}</p>
                </div>
                
                <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-border/50">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(app)} className="h-7 text-xs rounded-lg border-border/50">
                    <Edit2 className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(app.id)} className="h-7 text-xs text-red-500 hover:bg-red-500/10 border-red-500/20 rounded-lg">
                    <Trash2 className="w-3 h-3 mr-1" /> Hapus
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
