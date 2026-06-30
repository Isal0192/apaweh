/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { prisma } from '../utils/db';
import { revalidatePath } from 'next/cache';
import { Project, BlogPost, ShareLink } from '../types';
import { generateSlug } from '../utils/slug';
import bcrypt from 'bcryptjs';

// ==========================================
// USER / AUTHOR ACTIONS
// ==========================================

export async function loginUser(username: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return { success: false, error: 'Username atau Password salah.' };
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return { success: false, error: 'Username atau Password salah.' };
    }

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
      },
    };
  } catch (error: any) {
    console.error('Login error:', error);
    // Removed insecure demo fallback. Surface error to caller instead.
    return { success: false, error: 'Koneksi database gagal. Silakan periksa konfigurasi database.' };
  }
}

export async function resetUserPassword(username: string, newPassword: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return { success: false, error: 'Pengguna tidak ditemukan.' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { username },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error: any) {
    console.error('resetUserPassword error:', error);
    return { success: false, error: 'Gagal mengatur ulang password. Silakan coba lagi.' };
  }
}

// ==========================================
// PROJECT ACTIONS
// ==========================================

export async function getProjects() {
  try {
    const items = await prisma.project.findMany({
      orderBy: { id: 'desc' },
    });
    return items.map(p => ({
      ...p,
      category: p.category as 'Web App' | 'Homelab' | 'DevOps',
      tags: p.tags ? p.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      demoUrl: p.demoUrl || undefined,
      githubUrl: p.githubUrl || undefined,
      imageUrl: p.imageUrl || undefined,
    })) as Project[];
  } catch (error) {
    console.error('getProjects error:', error);
    return [];
  }
}

export async function createProject(data: Omit<Project, 'id'>) {
  try {
    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        tags: data.tags.join(','),
        demoUrl: data.demoUrl || null,
        githubUrl: data.githubUrl || null,
        imageUrl: data.imageUrl || null,
      },
    });
    revalidatePath('/');
    const mapped = {
      ...project,
      category: project.category as 'Web App' | 'Homelab' | 'DevOps',
      tags: project.tags ? project.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      demoUrl: project.demoUrl || undefined,
      githubUrl: project.githubUrl || undefined,
      imageUrl: project.imageUrl || undefined,
    } as Project;
    return { success: true, project: mapped };
  } catch (error: any) {
    console.error('createProject error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateProject(id: string, data: Omit<Project, 'id'>) {
  try {
    const project = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        tags: data.tags.join(','),
        demoUrl: data.demoUrl || null,
        githubUrl: data.githubUrl || null,
        imageUrl: data.imageUrl || null,
      },
    });
    revalidatePath('/');
    const mapped = {
      ...project,
      category: project.category as 'Web App' | 'Homelab' | 'DevOps',
      tags: project.tags ? project.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      demoUrl: project.demoUrl || undefined,
      githubUrl: project.githubUrl || undefined,
      imageUrl: project.imageUrl || undefined,
    } as Project;
    return { success: true, project: mapped };
  } catch (error: any) {
    console.error('updateProject error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({
      where: { id },
    });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('deleteProject error:', error);
    return { success: false, error: error.message };
  }
}

// ==========================================
// BLOG POST ACTIONS
// ==========================================

export async function getBlogs() {
  try {
    const items = await prisma.blogPost.findMany({
      orderBy: { date: 'desc' },
    });
    return items.map(b => ({
      ...b,
      tags: b.tags ? b.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    })) as BlogPost[];
  } catch (error) {
    console.error('getBlogs error:', error);
    return [];
  }
}

export async function incrementBlogViews(slug: string) {
  try {
    const blog = await prisma.blogPost.findUnique({ where: { slug } });
    if (!blog) return { success: false };

    await prisma.blogPost.update({
      where: { slug },
      data: { views: { increment: 1 } }
    });
    return { success: true };
  } catch (error) {
    console.error('incrementBlogViews error:', error);
    return { success: false };
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const blog = await prisma.blogPost.findUnique({
      where: { slug },
    });
    if (!blog) return null;
    return {
      ...blog,
      tags: blog.tags ? blog.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    } as BlogPost;
  } catch (error) {
    console.error('getBlogBySlug error:', error);
    return null;
  }
}

export async function createBlog(data: Omit<BlogPost, 'id'>) {
  try {
    const blog = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        date: data.date,
        summary: data.summary,
        content: data.content,
        tags: data.tags.join(','),
        readTime: data.readTime,
      },
    });
    revalidatePath('/');
    revalidatePath(`/blog/${data.slug}`);
    const mapped = {
      ...blog,
      tags: blog.tags ? blog.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    } as BlogPost;
    return { success: true, blog: mapped };
  } catch (error: any) {
    console.error('createBlog error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateBlog(id: string, data: Omit<BlogPost, 'id'>) {
  try {
    const blog = await prisma.blogPost.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        date: data.date,
        summary: data.summary,
        content: data.content,
        tags: data.tags.join(','),
        readTime: data.readTime,
      },
    });
    revalidatePath('/');
    revalidatePath(`/blog/${data.slug}`);
    const mapped = {
      ...blog,
      tags: blog.tags ? blog.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    } as BlogPost;
    return { success: true, blog: mapped };
  } catch (error: any) {
    console.error('updateBlog error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteBlog(id: string) {
  try {
    const blog = await prisma.blogPost.findUnique({ where: { id } });
    await prisma.blogPost.delete({
      where: { id },
    });
    revalidatePath('/');
    if (blog) revalidatePath(`/blog/${blog.slug}`);
    return { success: true };
  } catch (error: any) {
    console.error('deleteBlog error:', error);
    return { success: false, error: error.message };
  }
}

// ==========================================
// SHARE LINK ACTIONS
// ==========================================

export async function getLinks() {
  try {
    const links = await prisma.shareLink.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return links.map(link => ({
      ...link,
      slug: link.slug ?? link.id,
    }));
  } catch (error) {
    console.error('getLinks error:', error);
    return [];
  }
}

export async function getLinkBySlug(slugOrId?: string) {
  if (!slugOrId) {
    return null;
  }
  try {
    // First try to find by slug
    let link = await prisma.shareLink.findUnique({
      where: { slug: slugOrId },
    });
    // If not found (or slug undefined), fallback to id lookup
    if (!link) {
      link = await prisma.shareLink.findUnique({
        where: { id: slugOrId },
      });
    }
    return link ? { ...link, slug: link.slug ?? link.id } : null;
  } catch (error) {
    console.error('getLinkBySlug error:', error);
    return null;
  }
}

export async function createLink(data: Omit<ShareLink, 'id'>) {
  try {
    const slug = generateSlug(data.title);
    const link = await prisma.shareLink.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        url: data.url,
        createdAt: data.createdAt,
        slug,
      },
    });
    revalidatePath('/');
    return { success: true, link };
  } catch (error: any) {
    console.error('createLink error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteLink(id: string) {
  try {
    await prisma.shareLink.delete({
      where: { id },
    });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('deleteLink error:', error);
    return { success: false, error: error.message };
  }
}

// ==========================================
// CONTACT MESSAGE ACTIONS
// ==========================================

export async function createContactMessage(name: string, email: string, message: string) {
  try {
    await prisma.contactMessage.create({
      data: { name, email, message },
    });
    return { success: true };
  } catch (error: any) {
    console.error('createContactMessage error:', error);
    return { success: false, error: 'Gagal mengirim pesan.' };
  }
}

export async function getContactMessages() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return messages;
  } catch (error) {
    console.error('getContactMessages error:', error);
    return [];
  }
}

export async function deleteContactMessage(id: string) {
  try {
    await prisma.contactMessage.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error('deleteContactMessage error:', error);
    return { success: false };
  }
}

export async function getDashboardStats() {
  try {
    const [totalProjects, totalBlogs, totalLinks, messages] = await Promise.all([
      prisma.project.count(),
      prisma.blogPost.count(),
      prisma.shareLink.count(),
      prisma.contactMessage.count()
    ]);
    
    const viewsAggr = await prisma.blogPost.aggregate({
      _sum: { views: true }
    });
    
    return {
      totalProjects,
      totalBlogs,
      totalLinks,
      totalViews: viewsAggr._sum.views || 0,
      totalMessages: messages,
    };
  } catch (error) {
    console.error('getDashboardStats error:', error);
    return { totalProjects: 0, totalBlogs: 0, totalLinks: 0, totalViews: 0, totalMessages: 0 };
  }
}

// ==========================================
// PLAYGROUND APP ACTIONS
// ==========================================

export async function getPlaygroundApps() {
  try {
    const apps = await prisma.playgroundApp.findMany();
    return apps;
  } catch (error) {
    console.error('getPlaygroundApps error:', error);
    return [];
  }
}

export async function createPlaygroundApp(data: Omit<PlaygroundApp, 'id'>) {
  try {
    const app = await prisma.playgroundApp.create({
      data: {
        name: data.name,
        description: data.description,
        iconName: data.iconName,
        url: data.url,
        color: data.color,
        status: data.status,
      },
    });
    revalidatePath('/');
    return { success: true, app };
  } catch (error: any) {
    console.error('createPlaygroundApp error:', error);
    return { success: false, error: error.message };
  }
}

export async function updatePlaygroundApp(id: string, data: Omit<PlaygroundApp, 'id'>) {
  try {
    const app = await prisma.playgroundApp.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        iconName: data.iconName,
        url: data.url,
        color: data.color,
        status: data.status,
      },
    });
    revalidatePath('/');
    return { success: true, app };
  } catch (error: any) {
    console.error('updatePlaygroundApp error:', error);
    return { success: false, error: error.message };
  }
}

export async function deletePlaygroundApp(id: string) {
  try {
    await prisma.playgroundApp.delete({
      where: { id },
    });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('deletePlaygroundApp error:', error);
    return { success: false, error: error.message };
  }
}
