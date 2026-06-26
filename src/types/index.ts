export interface User {
  id: string;
  username: string;
  role: string;
  name: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Web App' | 'Homelab' | 'DevOps';
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
}

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  date: string;
  summary: string;
  content: string; // Markdown or rich HTML
  tags: string[];
  readTime: string;
}

export interface ShareLink {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  createdAt: string;
  slug: string;
}
