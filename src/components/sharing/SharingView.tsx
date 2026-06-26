'use client';

import React, { useState, useEffect } from 'react';
import { ShareLink, User } from '../../types';
import { generateSlug } from '../../utils/slug';
import { getGDriveEmbedUrl, getYouTubeEmbedUrl } from '../../utils/media';
import { AddLinkModal } from './AddLinkModal';
import { SharingList } from './SharingList';
import { SharingPlayer } from './SharingPlayer';
import { AnimatePresence } from 'framer-motion';

interface SharingViewProps {
  links: ShareLink[];
  setLinks?: (links: ShareLink[]) => void;
  isAdmin: boolean;
  currentUser: User | null;
}

export const SharingView: React.FC<SharingViewProps> = ({ links, setLinks, isAdmin, currentUser }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeMediaUrl, setActiveMediaUrl] = useState<string | null>(null);
  const [activeMediaTitle, setActiveMediaTitle] = useState('');
  const [activeMediaDesc, setActiveMediaDesc] = useState('');
  const [activeMediaCategory, setActiveMediaCategory] = useState('');
  const [activeMediaSlug, setActiveMediaSlug] = useState('');
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  const handleAddLink = (title: string, description: string, category: string, url: string) => {
    const slug = generateSlug(title);
    const newLink: ShareLink = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      description,
      category,
      url,
      createdAt: new Date().toLocaleDateString(),
      slug,
    };
    if (setLinks) {
      setLinks([newLink, ...links]);
    }
  };

  const handleDeleteLink = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus tautan ini?')) {
      if (setLinks) {
        setLinks(links.filter(link => link.id !== id));
      }
    }
  };

  const handleOpenPlayer = (link: ShareLink, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const gdriveEmbed = getGDriveEmbedUrl(link.url);
    const youtubeEmbed = getYouTubeEmbedUrl(link.url);
    
    setActiveMediaUrl(gdriveEmbed || youtubeEmbed || link.url);
    setActiveMediaTitle(link.title);
    setActiveMediaDesc(link.description);
    setActiveMediaCategory(link.category);
    setActiveMediaSlug(link.slug ?? link.id);

    if (typeof window !== 'undefined' && links.length !== 1) {
      window.history.pushState({}, '', `/sharing/${link.slug ?? link.id}`);
    }
  };

  const handleClosePlayer = () => {
    setActiveMediaUrl(null);
    if (typeof window !== 'undefined' && links.length !== 1) {
      window.history.pushState({}, '', '/?tab=sharing');
    }
  };

  useEffect(() => {
    // Auto open player if only one link is provided (Single Link Mode via route /sharing/[slug])
    if (links.length === 1 && !hasAutoOpened) {
      setTimeout(() => {
        handleOpenPlayer(links[0]);
        setHasAutoOpened(true);
      }, 0);
    }
  }, [links, hasAutoOpened]);

  return (
    <>
      <AnimatePresence mode="wait">
        {activeMediaUrl ? (
          <SharingPlayer
            key="player"
            url={activeMediaUrl}
            title={activeMediaTitle}
            description={activeMediaDesc}
            category={activeMediaCategory}
            slug={activeMediaSlug}
            onClose={handleClosePlayer}
            isSingleLinkMode={links.length === 1}
          />
        ) : (
          <SharingList
            key="list"
            links={links}
            isAdmin={isAdmin}
            currentUser={currentUser}
            onDeleteLink={handleDeleteLink}
            onOpenPlayer={handleOpenPlayer}
            onAddClick={() => setIsAddOpen(true)}
          />
        )}
      </AnimatePresence>

      {(isAdmin || currentUser?.role === 'author_sharing') && (
        <AddLinkModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onAddLink={handleAddLink}
        />
      )}
    </>
  );
};
