'use client';

import React, { useState } from 'react';
import { Project, BlogPost, ShareLink, User } from '../../types';
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
  currentUser: User | null;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  projects,
  setProjects,
  blogs,
  setBlogs,
  links,
  setLinks,
  currentUser
}) => {
  const isAdmin = currentUser?.role === 'admin';
  const isAuthorBlog = currentUser?.role === 'author_blog';
  const isAuthorSharing = currentUser?.role === 'author_sharing';

  const [activeSubTab, setActiveSubTab] = useState<'blogs' | 'projects' | 'shares'>(
    isAuthorSharing ? 'shares' : 'blogs'
  );

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
          {(isAdmin || isAuthorBlog) && (
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
          )}
          {isAdmin && (
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
          )}
          {(isAdmin || isAuthorSharing) && (
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
          )}
        </div>
      </div>

      {/* SUB TABS CONTENT */}
      {activeSubTab === 'blogs' && (isAdmin || isAuthorBlog) && (
        <AdminBlogTab blogs={blogs} setBlogs={setBlogs} currentUser={currentUser} />
      )}
      
      {activeSubTab === 'projects' && isAdmin && (
        <AdminProjectsTab projects={projects} setProjects={setProjects} currentUser={currentUser} />
      )}
      
      {activeSubTab === 'shares' && (isAdmin || isAuthorSharing) && (
        <AdminSharingTab links={links} setLinks={setLinks} currentUser={currentUser} />
      )}
    </div>
  );
};
