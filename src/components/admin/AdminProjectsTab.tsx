'use client';

import React, { useState } from 'react';
import { Project } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Edit3, Trash2, Save } from 'lucide-react';
import { Input } from '../ui/Input';

const generateId = () => Math.random().toString(36).substring(2, 9);

interface AdminProjectsTabProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
}

export const AdminProjectsTab: React.FC<AdminProjectsTabProps> = ({ projects, setProjects }) => {
  const [projId, setProjId] = useState<string | null>(null);
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projCat, setProjCat] = useState<'Web App' | 'Homelab' | 'DevOps'>('Web App');
  const [projTags, setProjTags] = useState('');
  const [projDemo, setProjDemo] = useState('');
  const [projGit, setProjGit] = useState('');

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim() || !projDesc.trim()) return;

    const tagsArray = projTags.split(',').map(tag => tag.trim()).filter(Boolean);

    if (projId) {
      const updated = projects.map(p => p.id === projId ? {
        ...p, title: projTitle, description: projDesc, category: projCat, tags: tagsArray, demoUrl: projDemo || undefined, githubUrl: projGit || undefined
      } : p);
      setProjects(updated);
    } else {
      const newProj: Project = {
        id: generateId(), title: projTitle, description: projDesc, category: projCat, tags: tagsArray, demoUrl: projDemo || undefined, githubUrl: projGit || undefined
      };
      setProjects([newProj, ...projects]);
    }
    handleResetProjectForm();
  };

  const handleEditProject = (p: Project) => {
    setProjId(p.id); setProjTitle(p.title); setProjDesc(p.description); setProjCat(p.category); setProjTags(p.tags.join(', ')); setProjDemo(p.demoUrl || ''); setProjGit(p.githubUrl || '');
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Yakin ingin menghapus projek ini?')) {
      setProjects(projects.filter(p => p.id !== id));
      if (projId === id) handleResetProjectForm();
    }
  };

  const handleResetProjectForm = () => {
    setProjId(null); setProjTitle(''); setProjDesc(''); setProjCat('Web App'); setProjTags(''); setProjDemo(''); setProjGit('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Form Editor */}
      <div className="lg:col-span-5">
        <Card>
          <form onSubmit={handleSaveProject} className="p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="text-lg font-bold text-foreground">
                {projId ? 'Edit Projek' : 'Tambah Projek Baru'}
              </h3>
              <Button type="button" variant="outline" size="sm" onClick={handleResetProjectForm}>Reset</Button>
            </div>

            <div className="space-y-3">
              <Input label="Nama Projek" required value={projTitle} onChange={(e) => setProjTitle(e.target.value)} placeholder="e.g. Monitoring Homelab Cluster" />
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Kategori</label>
                <select value={projCat} onChange={(e) => setProjCat(e.target.value as typeof projCat)} className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                  <option value="Web App">Web App</option>
                  <option value="Homelab">Homelab</option>
                  <option value="DevOps">DevOps</option>
                </select>
              </div>

              <Input label="Tags (pisahkan koma)" value={projTags} onChange={(e) => setProjTags(e.target.value)} placeholder="React, Proxmox, Docker" />
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Deskripsi Singkat</label>
                <textarea required rows={4} value={projDesc} onChange={(e) => setProjDesc(e.target.value)} placeholder="Jelaskan fungsionalitas projek secara singkat..." className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input label="URL Demo" value={projDemo} onChange={(e) => setProjDemo(e.target.value)} placeholder="https://demo.com" />
                <Input label="URL Github" value={projGit} onChange={(e) => setProjGit(e.target.value)} placeholder="https://github.com" />
              </div>
            </div>

            <Button type="submit" className="w-full flex items-center justify-center gap-1.5">
              <Save className="w-4 h-4" /> {projId ? 'Simpan Perubahan' : 'Tambah Projek'}
            </Button>
          </form>
        </Card>
      </div>

      {/* List of projects */}
      <div className="lg:col-span-7 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Daftar Projek Portfolio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
          {projects.map((p) => (
            <Card key={p.id} className="border border-border/80 hover:border-primary/20 flex flex-col justify-between">
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-primary/10 text-primary border border-primary/20">
                    {p.category}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => handleEditProject(p)} className="p-1 text-muted-foreground hover:text-primary rounded transition-colors" title="Edit Project"><Edit3 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDeleteProject(p.id)} className="p-1 text-muted-foreground hover:text-red-500 rounded transition-colors" title="Delete Project"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <h4 className="font-extrabold text-sm text-foreground">{p.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-3">{p.description}</p>
              </div>
            </Card>
          ))}
          {projects.length === 0 && (
            <div className="col-span-2 text-center py-10 text-xs text-muted-foreground bg-card border border-border rounded-xl">
              Belum ada projek portofolio.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
