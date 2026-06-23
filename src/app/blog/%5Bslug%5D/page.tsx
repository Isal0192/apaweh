import { Metadata } from 'next';
import { getBlogBySlug } from '../../actions';
import { Calendar, BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sanitizeHtml } from '../../../utils/sanitize';

interface Props {
  params: Promise<{ slug: string }>;
}

// Force dynamic server rendering so database queries run per request
export const dynamic = 'force-dynamic';

// Generate dynamic metadata for Google indexing
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  
  if (!post) {
    return {
      title: 'Tulisan Tidak Ditemukan | Workspace Hub Tulisan',
      description: 'Membaca tulisan teknologi dan dokumentasi server homelab.',
    };
  }

  return {
    title: `${post.title} | Workspace Hub Tulisan`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: new Date().toISOString(),
      authors: ['Faisal S.'],
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    'headline': post.title,
    'description': post.summary,
    'datePublished': new Date().toISOString(),
    'author': {
      '@type': 'Person',
      'name': 'Faisal S.',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Workspace Hub',
    },
    'keywords': post.tags.join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(JSON.stringify(jsonLd)) }}
      />

      <main className="max-w-3xl mx-auto px-6 py-12 md:py-20 min-h-screen space-y-8">
        {/* Back Link */}
        <Link
          href="/?tab=blog"
          className="inline-flex items-center text-sm font-semibold text-primary hover:underline gap-1.5 animate-fade-in"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dashboard
        </Link>

        {/* Article Details */}
        <article className="bg-card text-card-foreground border border-border rounded-2xl p-6 md:p-10 shadow-sm space-y-6 animate-fade-in-up">
          <header className="space-y-4 border-b border-border pb-6">
            {/* Meta */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              {post.title}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted border border-border text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          {/* Rich Content HTML Body */}
          <div
            className="prose prose-slate dark:prose-invert max-w-none text-foreground leading-relaxed space-y-4
            prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-foreground
            prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground
            prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-xl prose-pre:font-mono prose-pre:text-xs prose-pre:overflow-x-auto
            prose-img:rounded-2xl prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
          />
        </article>
      </main>
    </>
  );
}
