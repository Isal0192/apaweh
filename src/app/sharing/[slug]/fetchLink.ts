import { getLinkBySlug } from '@/app/actions';

export async function fetchLink(slug: string) {
  // Server‑side helper that re‑uses existing action
  return await getLinkBySlug(slug);
}
