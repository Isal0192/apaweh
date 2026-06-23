import React from 'react';
import { notFound } from 'next/navigation';
import { getLinkBySlug } from '@/app/actions';
import { SharingView } from '@/components/sharing/SharingView';

export const dynamic = 'force-dynamic'; // ensure fresh data

export default async function SharingSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);
  const link = await getLinkBySlug(decodedSlug);
  if (!link) {
    notFound();
    return null;
  }

  // Wrap the link in an array to reuse SharingView which expects array of links
  return (
    <SharingView
      links={[link]}
      isAdmin={false}
    />
  );
}
