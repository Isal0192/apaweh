'use client';

import React, { useState, useRef } from 'react';
import { BlogPost } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Edit3, Trash2, Save, FileText, Bold, Italic, Quote, Code, Image as ImageIcon, List, Link as LinkIcon } from 'lucide-react';
import { sanitizeHtml } from '../../utils/sanitize';
import { generateSlug } from '../../utils/slug';
import { Input } from '../ui/Input';

const generateId = () => Math.random().toString(36).substring(2, 9);

interface AdminBlogTabProps {
  blogs: BlogPost[];
  setBlogs: (blogs: BlogPost[]) => void;
}

export const AdminBlogTab: React.FC<AdminBlogTabProps> = ({ blogs, setBlogs }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [blogId, setBlogId] = useState<string | null>(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogTags, setBlogTags] = useState('');
  const [blogReadTime, setBlogReadTime] = useState('5 min read');


  const insertHtml = (tagOpen: string, tagClose: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = tagOpen + selected + tagClose;
    setBlogContent(text.substring(0, start) + replacement + text.substring(end));
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + tagOpen.length + selected.length + tagClose.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim() || !blogContent.trim()) return;

    const slug = generateSlug(blogTitle);
    const tagsArray = blogTags.split(',').map(tag => tag.trim()).filter(Boolean);

    if (blogId) {
      const updated = blogs.map(b => b.id === blogId ? {
        ...b, title: blogTitle, slug, summary: blogSummary || blogTitle.slice(0, 100) + '...', content: blogContent, tags: tagsArray, readTime: blogReadTime
      } : b);
      setBlogs(updated);
    } else {
      const newPost: BlogPost = {
        id: generateId(),
        title: blogTitle,
        slug: slug,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        summary: blogSummary || blogContent.slice(0, 100).replace(/<[^>]*>/g, '') + '...',
        content: blogContent,
        tags: tagsArray,
        readTime: blogReadTime
      };
      setBlogs([newPost, ...blogs]);
    }
    handleResetBlogForm();
  };

  const handleEditBlog = (post: BlogPost) => {
    setBlogId(post.id || null);
    setBlogTitle(post.title);
    setBlogSummary(post.summary);
    setBlogContent(post.content);
    setBlogTags(post.tags.join(', '));
    setBlogReadTime(post.readTime);
  };

  const handleDeleteBlog = (id?: string) => {
    if (!id) return;
    if (confirm('Yakin ingin menghapus artikel ini?')) {
      setBlogs(blogs.filter(b => b.id !== id));
      if (blogId === id) handleResetBlogForm();
    }
  };

  const handleResetBlogForm = () => {
    setBlogId(null); setBlogTitle(''); setBlogSummary(''); setBlogContent(''); setBlogTags(''); setBlogReadTime('5 min read');
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Editor Pane */}
        <div className="xl:col-span-6 space-y-4">
          <Card className="border border-border shadow-md">
            <form onSubmit={handleSaveBlog} className="p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <h3 className="text-lg font-bold text-foreground">
                  {blogId ? '📝 Edit Jurnal' : '✍️ Tulis Jurnal Baru'}
                </h3>
                <Button type="button" variant="outline" size="sm" onClick={handleResetBlogForm}>Reset Form</Button>
              </div>
              <div className="space-y-4">
                <Input label="Judul Artikel" required value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} placeholder="e.g. Panduan Praktis Konfigurasi Kubernetes Multi-Node" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Tags (pisahkan koma)" value={blogTags} onChange={(e) => setBlogTags(e.target.value)} placeholder="Kubernetes, DevOps, Cluster" />
                  <Input label="Read Time" value={blogReadTime} onChange={(e) => setBlogReadTime(e.target.value)} placeholder="8 min read" />
                </div>
                <Input label="Ringkasan Singkat (Deskripsi Card)" value={blogSummary} onChange={(e) => setBlogSummary(e.target.value)} placeholder="Ringkasan pendek artikel yang akan ditampilkan pada daftar portal berita..." />
                
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1">Isi Konten (Format Rich HTML)</label>
                    <span className="text-[10px] text-muted-foreground italic">Gunakan toolbar pembantu di bawah untuk mempermudah pengetikan!</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1 p-1.5 bg-muted rounded-xl border border-border">
                    {/* Toolbar buttons */}
                    <button type="button" onClick={() => insertHtml('<h1>', '</h1>')} className="px-2 py-1 text-xs font-bold rounded-lg hover:bg-card text-foreground hover:text-primary transition-all cursor-pointer">H1</button>
                    <button type="button" onClick={() => insertHtml('<h2>', '</h2>')} className="px-2 py-1 text-xs font-bold rounded-lg hover:bg-card text-foreground hover:text-primary transition-all cursor-pointer">H2</button>
                    <button type="button" onClick={() => insertHtml('<h3>', '</h3>')} className="px-2 py-1 text-xs font-bold rounded-lg hover:bg-card text-foreground hover:text-primary transition-all cursor-pointer">H3</button>
                    <div className="w-[1px] h-5 bg-border mx-1" />
                    <button type="button" onClick={() => insertHtml('<p>', '</p>')} className="px-2 py-1 text-xs font-semibold rounded-lg hover:bg-card text-foreground hover:text-primary transition-all cursor-pointer">P</button>
                    <button type="button" onClick={() => insertHtml('<strong>', '</strong>')} className="p-1.5 rounded-lg hover:bg-card text-foreground hover:text-primary transition-all cursor-pointer"><Bold className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => insertHtml('<em>', '</em>')} className="p-1.5 rounded-lg hover:bg-card text-foreground hover:text-primary transition-all cursor-pointer"><Italic className="w-3.5 h-3.5" /></button>
                    <div className="w-[1px] h-5 bg-border mx-1" />
                    <button type="button" onClick={() => insertHtml('<blockquote className="border-l-4 border-primary pl-4 italic my-6 text-muted-foreground">', '</blockquote>')} className="p-1.5 rounded-lg hover:bg-card text-foreground hover:text-primary transition-all cursor-pointer"><Quote className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => insertHtml('<pre className="bg-muted p-5 rounded-2xl font-mono text-xs overflow-x-auto border border-border">\n<code>\n', '\n</code>\n</pre>')} className="p-1.5 rounded-lg hover:bg-card text-foreground hover:text-primary transition-all cursor-pointer"><Code className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => insertHtml('<img src="https://images.unsplash.com/photo-1618401471353-b98aedd07871" alt="Ilustrasi" className="rounded-3xl shadow-md border border-border/50 my-6 w-full max-w-none" />')} className="p-1.5 rounded-lg hover:bg-card text-foreground hover:text-primary transition-all cursor-pointer"><ImageIcon className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => insertHtml('<a href="https://example.com" target="_blank" className="text-primary hover:underline font-semibold">', '</a>')} className="p-1.5 rounded-lg hover:bg-card text-foreground hover:text-primary transition-all cursor-pointer"><LinkIcon className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => insertHtml('<ul className="list-disc pl-6 my-4 space-y-1">\n  <li>', '</li>\n  <li>Item Baru</li>\n</ul>')} className="p-1.5 rounded-lg hover:bg-card text-foreground hover:text-primary transition-all cursor-pointer"><List className="w-3.5 h-3.5" /></button>
                  </div>
                  <textarea ref={textareaRef} required value={blogContent} onChange={(e) => setBlogContent(e.target.value)} placeholder="Mulai menulis jurnal berita di sini..." className="w-full h-[500px] p-4 font-mono text-xs rounded-2xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y overflow-y-auto" />
                </div>
              </div>
              <Button type="submit" className="w-full h-11 flex items-center justify-center gap-2 mt-4 text-sm font-bold shadow-sm">
                <Save className="w-4 h-4" /> {blogId ? 'Simpan Perubahan Jurnal' : 'Publish Jurnal Baru'}
              </Button>
            </form>
          </Card>
        </div>

        {/* Live Preview Pane */}
        <div className="xl:col-span-6 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Portal News Preview
            </h4>
            <span className="text-[10px] text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-md font-semibold">Auto-sync</span>
          </div>
          <div className="bg-card text-card-foreground border border-border rounded-3xl p-6 md:p-10 shadow-sm space-y-6 min-h-[690px] overflow-y-auto max-h-[780px]">
            {blogTitle || blogContent ? (
              <article className="space-y-6">
                <header className="space-y-4 border-b border-border pb-6">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="bg-muted px-2.5 py-1 rounded-md border border-border font-semibold">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    <span className="bg-muted px-2.5 py-1 rounded-md border border-border font-semibold">{blogReadTime || '5 min read'}</span>
                  </div>
                  <h1 className="text-2xl md:text-4xl font-black tracking-tight text-foreground leading-tight">{blogTitle || 'Judul Berita Baru'}</h1>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {blogTags ? blogTags.split(',').map((tag, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-muted border border-border text-muted-foreground">#{tag.trim()}</span>
                    )) : <span className="text-[10px] text-muted-foreground italic">Belum ada tags</span>}
                  </div>
                </header>
                {blogContent ? (
                  <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed space-y-4 text-foreground prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-foreground prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-xl prose-pre:font-mono prose-pre:text-[11px] prose-pre:overflow-x-auto prose-img:rounded-2xl prose-img:shadow-md" dangerouslySetInnerHTML={{ __html: sanitizeHtml(blogContent) }} />
                ) : <p className="text-muted-foreground italic text-xs text-center py-20">Mulai tulis konten artikel Anda untuk melihat live preview di sini...</p>}
              </article>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-32 text-muted-foreground space-y-2">
                <FileText className="w-12 h-12 text-muted-foreground/30 animate-pulse" />
                <h5 className="font-bold text-sm">Preview Belum Aktif</h5>
                <p className="text-xs max-w-xs leading-relaxed">Masukkan Judul atau isi Konten artikel di sebelah kiri untuk melihat tampilan portal berita live.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* List of articles */}
      <div className="border-t border-border/80 pt-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Daftar Artikel Jurnal ({blogs.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((post) => (
            <Card key={post.id || post.slug} className="group border border-border/80 hover:border-primary/30 flex flex-col justify-between">
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">{post.title}</h4>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => handleEditBlog(post)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors cursor-pointer" title="Edit Post"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteBlog(post.id)} className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-colors cursor-pointer" title="Delete Post"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{post.summary}</p>
              </div>
              <div className="px-5 py-3.5 bg-muted/20 border-t border-border/40 flex justify-between items-center text-[10px] text-muted-foreground font-semibold">
                <span>{post.date}</span><span>{post.readTime}</span>
              </div>
            </Card>
          ))}
          {blogs.length === 0 && (
            <div className="col-span-full text-center py-12 text-xs text-muted-foreground bg-card border border-border rounded-2xl">Belum ada jurnal yang ditulis. Mulai buat jurnal pertama Anda di atas!</div>
          )}
        </div>
      </div>
    </div>
  );
};
