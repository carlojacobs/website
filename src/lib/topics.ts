// src/lib/topics.ts

// URL slug from category display text (case-insensitive, stable)
export function topicSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Pretty label from raw category value
// - strips [[...]]
// - trims
export function topicLabel(input: string): string {
  return input
    .trim()
    .replace(/^\[\[/, "")
    .replace(/\]\]$/, "")
    .trim();
}
