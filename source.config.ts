// source.config.ts
import { defineConfig, defineCollections } from "fumadocs-mdx/config";
import { z } from "zod";
import { globSync } from "glob";
import wikiLinkPlugin from "@flowershow/remark-wiki-link";

const CONTENT_CWD = "src/content";
const files = globSync("**/*.{md,mdx}", { cwd: CONTENT_CWD });

function toPermalink(relPath: string): string {
  const noExt = relPath.replace(/\.(md|mdx)$/i, "");

  if (noExt.startsWith("writing/")) {
    return "/writing/" + noExt.replace(/^writing\//, "");
  }

  if (noExt.startsWith("pages/")) {
    const slug = noExt.replace(/^pages\//, "");
    if (slug === "index") return "/";
    return "/" + slug;
  }

  // Keep starter docs working if you still have it
  if (noExt.startsWith("docs/")) {
    return "/docs/" + noExt.replace(/^docs\//, "");
  }

  return "/" + noExt;
}

const permalinks: Record<string, string> = Object.fromEntries(
  files.map((f) => [f, toPermalink(f)]),
);

// source.config.ts (inside)
import { z } from "zod";

const dateLike = z.union([
  z.string(), // "2026-01-07T11:05"
  z.date(),   // in case parser returns Date
]);

/**
 * categories can come from Obsidian as:
 * - ["Writing", "Learning"]
 * - "Writing"
 * - "[[Writing]]"
 * - "[[Writing]], [[Learning]]"
 *
 * Normalize to string[] with wikilink wrappers removed.
 */
const categoriesSchema = z
  .preprocess((input) => {
    if (input == null) return undefined;

    const normalizeOne = (raw: string) =>
      raw
        .trim()
        // strip Obsidian wikilink wrappers [[...]]
        .replace(/^\[\[/, "")
        .replace(/\]\]$/, "")
        .trim();

    if (Array.isArray(input)) {
      return input.map((v) => normalizeOne(String(v))).filter(Boolean);
    }

    if (typeof input === "string") {
      const s = input.trim();
      if (!s) return [];

      // Handle comma-separated strings
      const parts = s.includes(",") ? s.split(",") : [s];
      return parts.map((p) => normalizeOne(p)).filter(Boolean);
    }

    // Anything else: coerce to string and treat as one value
    return [normalizeOne(String(input))].filter(Boolean);
  }, z.array(z.string()))
  .optional()
  .default(["uncategorized"]);


const writingFrontmatterSchema = z.object({
  title: z.string().optional().default("Untitled"),
  created: dateLike,
  updated: dateLike.optional(),
  draft: z.boolean().optional().default(false),
  categories: categoriesSchema
});



// ✅ Export collections individually.
// These names become exports in "fumadocs-mdx:collections/server".
export const docs = defineCollections({
  type: "doc",
  dir: "src/content/docs",
});

export const writing = defineCollections({
  type: "doc",
  dir: "./src/content/writing",
  schema: writingFrontmatterSchema
});

export const pages = defineCollections({
  type: "doc",
  dir: "src/content/pages",
  schema: z.object({
    title: z.string().optional(),
  }),
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [
      [
        wikiLinkPlugin,
        {
          format: "shortestPossible",
          files,
          permalinks,
          className: "wikilink",
          newClassName: "wikilink-new",
        },
      ],
    ],
  },
});
