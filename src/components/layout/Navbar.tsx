'use client';

import React, { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { LayoutDashboard, User, BookOpen, Code, Share2, Menu, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isAdmin, 
  onLoginClick, 
  onLogoutClick 
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { id: 'portfolio', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'blog', label: 'Tulisan', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'playground', label: 'Playground', icon: <Code className="w-4 h-4" /> },
    { id: 'sharing', label: 'Sharing Hub', icon: <Share2 className="w-4 h-4" /> },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin Panel', icon: <ShieldCheck className="w-4 h-4 text-amber-500 animate-pulse" /> }] : []),
  ];

  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileOpen(false);
  };

  return (
    <div className="sticky top-4 z-40 w-full px-4 md:px-8 pointer-events-none">
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="glass-panel mx-auto max-w-7xl pointer-events-auto shadow-lg shadow-black/5 dark:shadow-white/5"
      >
        <div className="w-full px-4 h-16 flex items-center justify-between">
          
          {/* Brand/Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 select-none cursor-pointer" 
            onClick={() => handleTabSelect('portfolio')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-pink-500 flex items-center justify-center text-white shadow-md">
              <LayoutDashboard className="w-5 h-5 animate-pulse" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent hidden sm:inline-block">
              Workspace Hub
            </span>
          </motion.div>

          {/* Desktop Tabs */}
          <div className="hidden md:flex items-center gap-1.5">
            {menuItems.map((item) => (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                key={item.id}
                onClick={() => handleTabSelect(item.id)}
                className={`px-4 py-2 text-sm font-semibold rounded-full flex items-center gap-2 transition-all duration-300 focus:outline-none ${
                  activeTab === item.id
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                    : 'text-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {item.icon}
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Theme Toggle, Admin Controls & Mobile Menu Trigger */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            {/* Admin Login/Logout Desktop */}
            {isAdmin ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogoutClick}
                className="hidden md:inline-flex px-4 py-1.5 text-sm font-bold rounded-full border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors"
              >
                Logout
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLoginClick}
                className="hidden md:inline-flex px-4 py-1.5 text-sm font-bold rounded-full border border-border text-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Login
              </motion.button>
            )}
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 rounded-full border border-border text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>

        </div>

        {/* Mobile Drawer Overlay */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-border/50 bg-black/5 dark:bg-white/5 backdrop-blur-xl rounded-b-2xl"
            >
              <div className="px-4 py-4 space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabSelect(item.id)}
                    className={`w-full px-4 py-3 text-sm font-semibold rounded-xl flex items-center gap-3 transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
                
                {/* Mobile Admin Action Button */}
                <div className="pt-2 border-t border-border/50 mt-2">
                  {isAdmin ? (
                    <button
                      onClick={() => { onLogoutClick(); setIsMobileOpen(false); }}
                      className="w-full px-4 py-3 text-sm font-bold text-red-500 rounded-xl hover:bg-red-500/10 transition-colors text-left"
                    >
                      Logout Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => { onLoginClick(); setIsMobileOpen(false); }}
                      className="w-full px-4 py-3 text-sm font-bold text-primary rounded-xl hover:bg-primary/10 transition-colors text-left"
                    >
                      Login Admin
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};
