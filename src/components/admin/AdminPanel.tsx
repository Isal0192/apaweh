'use client';

import React, { useState } from 'react';
import { Project, BlogPost, ShareLink, User, PlaygroundApp } from '../../types';
import { FileText, Briefcase, Link2, LayoutDashboard, Inbox, Gamepad2 } from 'lucide-react';

import { AdminBlogTab } from './AdminBlogTab';
import { AdminProjectsTab } from './AdminProjectsTab';
import { AdminSharingTab } from './AdminSharingTab';
import { AdminOverviewTab } from './AdminOverviewTab';
import { AdminInboxTab } from './AdminInboxTab';
import { AdminPlaygroundTab } from './AdminPlaygroundTab';

type AdminTab = 'overview' | 'projects' | 'blog' | 'sharing' | 'inbox' | 'playground';

interface AdminPanelProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  blogs: BlogPost[];
  setBlogs: (blogs: BlogPost[]) => void;
  links: ShareLink[];
  setLinks: (links: ShareLink[]) => void;
  apps: PlaygroundApp[];
  setApps: (apps: PlaygroundApp[]) => void;
  currentUser: User | null;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  projects,
  setProjects,
  blogs,
  setBlogs,
  links,
  setLinks,
  apps,
  setApps,
  currentUser
}) => {
  const isAdmin = currentUser?.role === 'admin';
  const isAuthorBlog = currentUser?.role === 'author_blog';
  const isAuthorSharing = currentUser?.role === 'author_sharing';

  const defaultTab = isAdmin ? 'overview' : isAuthorBlog ? 'blog' : 'sharing';
  const [activeTab, setActiveTab] = useState<AdminTab>(defaultTab as AdminTab);

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
        <div className="flex flex-wrap gap-2 bg-muted p-1 rounded-xl border border-border overflow-x-auto max-w-full">
          {isAdmin && (
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </button>
          )}
          {(isAdmin || isAuthorBlog) && (
            <button
              onClick={() => setActiveTab('blog')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'blog'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText className="w-4 h-4" />
              Kelola Tulisan
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'projects'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Kelola Portfolio
            </button>
          )}
          {(isAdmin || isAuthorSharing) && (
            <button
              onClick={() => setActiveTab('sharing')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'sharing'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Link2 className="w-4 h-4" />
              Kelola Sharing Link
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => setActiveTab('inbox')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'inbox'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Inbox className="w-4 h-4" />
              Kotak Masuk
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => setActiveTab('playground')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'playground'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              Playground
            </button>
          )}
        </div>
      </div>

      {/* SUB TABS CONTENT */}
      {activeTab === 'overview' && isAdmin && (
        <AdminOverviewTab />
      )}

      {activeTab === 'blog' && (isAdmin || isAuthorBlog) && (
        <AdminBlogTab blogs={blogs} setBlogs={setBlogs} currentUser={currentUser} />
      )}
      
      {activeTab === 'projects' && isAdmin && (
        <AdminProjectsTab projects={projects} setProjects={setProjects} currentUser={currentUser} />
      )}
      
      {activeTab === 'sharing' && (isAdmin || isAuthorSharing) && (
        <AdminSharingTab links={links} setLinks={setLinks} currentUser={currentUser} />
      )}

      {activeTab === 'inbox' && isAdmin && (
        <AdminInboxTab />
      )}

      {activeTab === 'playground' && isAdmin && (
        <AdminPlaygroundTab apps={apps} setApps={setApps} />
      )}
    </div>
  );
};
