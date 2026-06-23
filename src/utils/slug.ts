export function generateSlug(title: string): string {
  // Convert to lower case, replace non-alphanumeric with hyphens, collapse multiple hyphens, trim hyphens
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');
}
