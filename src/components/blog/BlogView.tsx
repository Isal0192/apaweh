'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { BlogPost } from '../../types';
import { BlogDetail } from './BlogDetail';
import { BlogList } from './BlogList';
import { AnimatePresence } from 'framer-motion';

interface BlogViewProps {
  blogs: BlogPost[];
  isAdmin: boolean;
}

export const BlogView: React.FC<BlogViewProps> = ({ blogs, isAdmin }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('Semua');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Dynamic tags aggregation from all blogs
  const [allTags, setAllTags] = useState<string[]>(['Semua']);

  useEffect(() => {
    const tags = new Set<string>();
    blogs.forEach(post => {
      post.tags.forEach(tag => {
        if (tag.trim()) tags.add(tag.trim());
      });
    });
    const timer = setTimeout(() => {
      setAllTags(['Semua', ...Array.from(tags)]);
    }, 0);
    return () => clearTimeout(timer);
  }, [blogs]);

  // Sync state with URL search param on client-side initial mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const postSlug = params.get('post');
    const matchedPost = postSlug ? blogs.find(post => post.slug === postSlug) || null : null;
    if (matchedPost) {
      const timer = setTimeout(() => {
        setSelectedPost(matchedPost);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [blogs]);

  // Handler to close detail post and update URL
  const handleClosePost = () => {
    setSelectedPost(null);
    const params = new URLSearchParams(window.location.search);
    params.delete('post');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Handler to open detail post and update URL
  const handleOpenPost = (post: BlogPost) => {
    setSelectedPost(post);
    const params = new URLSearchParams(window.location.search);
    params.set('post', post.slug);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Filter posts based on search query and category tag
  const filteredPosts = blogs.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTag = selectedTag === 'Semua' || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  // Split filtered posts into Pinned/Headline and regular Grid items
  const headlinePost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const gridPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

  return (
    <AnimatePresence mode="wait">
      {selectedPost ? (
        <BlogDetail
          key="detail"
          selectedPost={selectedPost}
          blogs={blogs}
          handleClosePost={handleClosePost}
          handleOpenPost={handleOpenPost}
        />
      ) : (
        <BlogList
          key="list"
          filteredPosts={filteredPosts}
          headlinePost={headlinePost}
          gridPosts={gridPosts}
          allTags={allTags}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isAdmin={isAdmin}
          handleOpenPost={handleOpenPost}
        />
      )}
    </AnimatePresence>
  );
};
