// src/lib/excerpt.ts
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const WRITING_DIR = path.join(ROOT, "src", "content", "writing");

function stripFrontmatter(md: string): string {
  return md.replace(/^---[\s\S]*?---\s*/m, "");
}

function normalize(md: string): string {
  return md
    // remove code fences
    .replace(/```[\s\S]*?```/g, "")
    // inline code
    .replace(/`[^`]*`/g, "")
    // images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1")
    // markdown links -> text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    // obsidian wikilinks [[X]] -> X
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    // collapse whitespace
    .replace(/\s+/g, " ")
    .trim();
}

function resolveWritingFileFromUrl(url: string): string | null {
  // url like "/writing/Hoe%20te%20Studeren" or "/writing/foo/bar"
  const relEncoded = url.replace(/^\/writing\/?/, "").replace(/\/$/, "");
  if (!relEncoded) return null;

  // Decode %20 etc so it matches real filenames
  const rel = decodeURIComponent(relEncoded);

  // Try common layouts:
  const candidates = [
    path.join(WRITING_DIR, `${rel}.md`),
    path.join(WRITING_DIR, `${rel}.mdx`),
    path.join(WRITING_DIR, rel, "index.md"),
    path.join(WRITING_DIR, rel, "index.mdx"),
  ];

  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }

  // Last resort: case-insensitive match on base filename (macOS is usually case-insensitive, Linux isn't)
  try {
    const entries = fs.readdirSync(WRITING_DIR);
    const target = rel.toLowerCase();

    for (const name of entries) {
      const full = path.join(WRITING_DIR, name);

      // only files at top-level; folders handled above by index.md
      if (!fs.statSync(full).isFile()) continue;

      const noExt = name.replace(/\.(md|mdx)$/i, "");
      if (noExt.toLowerCase() === target) return full;
    }
  } catch {
    // ignore
  }

  return null;
}

export function getWritingFileName(page: { url: string }): string | null {
  const filePath = resolveWritingFileFromUrl(page.url);
  return filePath ? path.basename(filePath) : null;
}


export function getWritingBodyText(page: { url: string }): string {
    const filePath = resolveWritingFileFromUrl(page.url);
  if (!filePath) return "no file path";

  const raw = fs.readFileSync(filePath, "utf8");
  const noFm = stripFrontmatter(raw);
  return normalize(noFm);
}

export function truncateSentenceOrChars(text: string, maxChars = 160): string {
  const t = text.trim();
  if (!t) return "";

  // Prefer first sentence if it ends before maxChars
  const m = t.match(/^(.+?[.!?…])(\s|$)/);
  const first = (m ? m[1] : "").trim();

  if (first && first.length <= maxChars) {
    return first.length < t.length ? `${first}…` : first;
  }

  // Fallback: hard truncate by chars
  if (t.length <= maxChars) return t;
  return `${t.slice(0, maxChars).trimEnd()}…`;
}
