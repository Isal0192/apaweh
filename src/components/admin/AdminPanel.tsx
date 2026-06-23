'use client';

import React, { useState } from 'react';
import { Project, BlogPost, ShareLink } from '../../types';
import { FileText, Briefcase, Link2 } from 'lucide-react';

import { AdminBlogTab } from './AdminBlogTab';
import { AdminProjectsTab } from './AdminProjectsTab';
import { AdminSharingTab } from './AdminSharingTab';

interface AdminPanelProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  blogs: BlogPost[];
  setBlogs: (blogs: BlogPost[]) => void;
  links: ShareLink[];
  setLinks: (links: ShareLink[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  projects,
  setProjects,
  blogs,
  setBlogs,
  links,
  setLinks
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'blogs' | 'projects' | 'shares'>('blogs');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Admin Workspace Controller
          </h2>
          <p className="text-sm text-muted-foreground">
            Mengelola seluruh konten Portofolio, Tulisan, dan Tautan Media secara dinamis.
          </p>
        </div>

        {/* Sub-Tabs Switch */}
        <div className="flex bg-muted p-1 rounded-xl border border-border overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveSubTab('blogs')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeSubTab === 'blogs'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className="w-4 h-4" />
            Kelola Tulisan
          </button>
          <button
            onClick={() => setActiveSubTab('projects')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeSubTab === 'projects'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Kelola Portfolio
          </button>
          <button
            onClick={() => setActiveSubTab('shares')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeSubTab === 'shares'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Link2 className="w-4 h-4" />
            Kelola Sharing Link
          </button>
        </div>
      </div>

      {/* SUB TABS CONTENT */}
      {activeSubTab === 'blogs' && (
        <AdminBlogTab blogs={blogs} setBlogs={setBlogs} />
      )}
      
      {activeSubTab === 'projects' && (
        <AdminProjectsTab projects={projects} setProjects={setProjects} />
      )}
      
      {activeSubTab === 'shares' && (
        <AdminSharingTab links={links} setLinks={setLinks} />
      )}
    </div>
  );
};
