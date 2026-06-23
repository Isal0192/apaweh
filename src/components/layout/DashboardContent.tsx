'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ProfileView } from '../profile/ProfileView';
import { BlogView } from '../blog/BlogView';
import { PlaygroundView } from '../playground/PlaygroundView';
import { SharingView } from '../sharing/SharingView';
import { AdminPanel } from '../admin/AdminPanel';
import { LoginModal } from '../auth/LoginModal';
import { Project, BlogPost, ShareLink } from '../../types';
import {
  createProject,
  updateProject,
  deleteProject,
  createBlog,
  updateBlog,
  deleteBlog,
  createLink,
  deleteLink
} from '../../app/actions';

interface DashboardContentProps {
  initialProjects: Project[];
  initialBlogs: BlogPost[];
  initialLinks: ShareLink[];
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  initialProjects,
  initialBlogs,
  initialLinks
}) => {
  const router = useRouter();
  const pathname = usePathname();

  // 1. Maintain local state for instant tab switching responsiveness
  const [activeTab, setActiveTab] = useState('portfolio');

  // Lifted dynamic states for Admin CRUD operations (initialized with Server Rendered data)
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);
  const [links, setLinks] = useState<ShareLink[]>(initialLinks);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Synchronize state with initial props if server refetches
  useEffect(() => {
    const timer = setTimeout(() => {
      setProjects(initialProjects);
    }, 0);
    return () => clearTimeout(timer);
  }, [initialProjects]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBlogs(initialBlogs);
    }, 0);
    return () => clearTimeout(timer);
  }, [initialBlogs]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLinks(initialLinks);
    }, 0);
    return () => clearTimeout(timer);
  }, [initialLinks]);

  // Sync admin state with LocalStorage on client mount
  useEffect(() => {
    const savedAdmin = localStorage.getItem('hub_is_admin');
    const initialAdmin = savedAdmin === 'true';

    const timer = setTimeout(() => {
      setIsAdmin(initialAdmin);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Load initial tab selection from URL on client mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['portfolio', 'blog', 'playground', 'sharing', 'admin'].includes(tabParam)) {
      const timer = setTimeout(() => {
        setActiveTab(tabParam);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  // Syncing client updates to database via Server Actions:
  // We compare the updated list from the AdminPanel with the local state list to identify
  // if an item was added, updated, or deleted, then execute the exact Server Action.

  const saveProjects = async (newProjects: Project[]) => {
    setProjects(newProjects); // Update client UI instantly

    if (newProjects.length < projects.length) {
      // Delete operation
      const deleted = projects.find(p => !newProjects.some(np => np.id === p.id));
      if (deleted) {
        await deleteProject(deleted.id);
      }
    } else if (newProjects.length > projects.length) {
      // Create operation
      const created = newProjects.find(np => !projects.some(p => p.id === np.id));
      if (created) {
        const { id, ...data } = created;
        const res = await createProject(data);
        if (res.success && res.project) {
          // Replace temp random ID with generated UUID from db
          setProjects(prev => prev.map(p => p.id === id ? res.project as Project : p));
        }
      }
    } else {
      // Edit operation
      const modified = newProjects.find(np => {
        const original = projects.find(p => p.id === np.id);
        return original && JSON.stringify(original) !== JSON.stringify(np);
      });
      if (modified) {
        const { id, ...data } = modified;
        await updateProject(id, data);
      }
    }
  };

  const saveBlogs = async (newBlogs: BlogPost[]) => {
    setBlogs(newBlogs); // Update client UI instantly

    if (newBlogs.length < blogs.length) {
      // Delete operation
      const deleted = blogs.find(b => !newBlogs.some(nb => nb.id === b.id));
      if (deleted && deleted.id) {
        await deleteBlog(deleted.id);
      }
    } else if (newBlogs.length > blogs.length) {
      // Create operation
      const created = newBlogs.find(nb => !blogs.some(b => b.id === nb.id));
      if (created) {
        const { id, ...data } = created;
        const res = await createBlog(data);
        if (res.success && res.blog) {
          // Replace temp random ID with generated UUID from db
          setBlogs(prev => prev.map(b => b.id === id ? res.blog as BlogPost : b));
        }
      }
    } else {
      // Edit operation
      const modified = newBlogs.find(nb => {
        const original = blogs.find(b => b.id === nb.id);
        return original && JSON.stringify(original) !== JSON.stringify(nb);
      });
      if (modified && modified.id) {
        const { id, ...data } = modified;
        await updateBlog(id, data);
      }
    }
  };

  const saveLinks = async (newLinks: ShareLink[]) => {
    setLinks(newLinks); // Update client UI instantly

    if (newLinks.length < links.length) {
      // Delete operation
      const deleted = links.find(l => !newLinks.some(nl => nl.id === l.id));
      if (deleted) {
        await deleteLink(deleted.id);
      }
    } else if (newLinks.length > links.length) {
      // Create operation
      const created = newLinks.find(nl => !links.some(l => l.id === nl.id));
      if (created) {
        const { id, ...data } = created;
        const res = await createLink(data);
        if (res.success && res.link) {
          // Replace temp random ID with generated UUID from db
          setLinks(prev => prev.map(l => l.id === id ? res.link as ShareLink : l));
        }
      }
    }
  };

  // Update local state instantly and sync URL in the background
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);

    const params = new URLSearchParams(window.location.search);
    params.set('tab', tabId);
    params.delete('post'); // Clear specific blog detail query when switching root tabs

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    localStorage.setItem('hub_is_admin', 'true');
    handleTabChange('admin');
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('hub_is_admin');
    if (activeTab === 'admin') {
      handleTabChange('portfolio');
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'portfolio':
        return <ProfileView projects={projects} isAdmin={isAdmin} />;
      case 'blog':
        return <BlogView blogs={blogs} isAdmin={isAdmin} />;
      case 'playground':
        return <PlaygroundView />;
      case 'sharing':
        return <SharingView links={links} setLinks={saveLinks} isAdmin={isAdmin} />;
      case 'admin':
        return isAdmin ? (
          <AdminPanel
            projects={projects}
            setProjects={saveProjects}
            blogs={blogs}
            setBlogs={saveBlogs}
            links={links}
            setLinks={saveLinks}
          />
        ) : (
          <ProfileView projects={projects} isAdmin={isAdmin} />
        );
      default:
        return <ProfileView projects={projects} isAdmin={isAdmin} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-between">
      {/* Navbar Container */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isAdmin={isAdmin}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogoutClick={handleLogout}
      />

      {/* Main Workspace Frame */}
      <main className="flex-grow w-full px-6 py-8">
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          {renderActiveView()}
        </Suspense>
      </main>

      {/* Login Overlay Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};
