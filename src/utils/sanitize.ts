// Minimal HTML sanitizer to remove obvious XSS vectors.
// Note: For production consider using a battle-tested library like DOMPurify.
export function sanitizeHtml(input: string): string {
  if (!input) return '';

  // Remove script tags and their content
  let out = input.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');

  // Remove event handler attributes like onclick="..."
  out = out.replace(/on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // Remove javascript: URIs in href/src
  out = out.replace(/(href|src)\s*=\s*("|')?javascript:[^"'>\s]*/gi, '$1=$2#');

  // Strip iframe srcdoc or potentially dangerous attributes
  out = out.replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, '');

  return out;
}
