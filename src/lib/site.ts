// src/lib/site.ts
import { toMillis } from "./date";
import { recipesSource } from "./recipes";
import { writingSource } from "./writing";

export const SITE_TITLE = "The Very Unofficial Journal of Notes, Essays & Recipes";
export const SITE_AUTHOR = "Carlo Jacobs";

// Featured writing filename, e.g. "How to Write an Essay.md"
export const FEATURED_WRITING_FILENAME = "Essay Writing Protocol.md";

// Featured excerpt length (words).
export const FEATURED_EXCERPT_WORDS = 25;

// Journal start date: 2025-01-25 (Jan 25, 2025). Earliest publish date; used for volume/number.
export const JOURNAL_START_DATE = new Date(Date.UTC(2025, 0, 25));

function getLatestContentDate(): Date {
  const allPages = [
    ...writingSource.getPages().filter((p: { data: { draft?: boolean } }) => !p.data.draft),
    ...recipesSource.getPages().filter((p: { data: { draft?: boolean } }) => !p.data.draft),
  ];

  const latest = allPages.reduce((max: number, p: { data: { created?: unknown } }) => {
    const created = toMillis(p.data.created);
    return created > max ? created : max;
  }, 0);

  return latest ? new Date(latest) : new Date();
}

export function getLastRepoUpdateDate(): Date {
  try {
    // Use last commit timestamp as "last updated" for the site.
    // ISO 8601 in UTC, e.g. 2026-01-07T12:34:56+00:00
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { execSync } = require("node:child_process");
    const out = execSync("git log -1 --format=%cI", { encoding: "utf8" }).trim();
    const d = new Date(out);
    if (!Number.isNaN(d.getTime())) return d;
  } catch {
    // Fall through to current date.
  }
  return new Date();
}

export function getIssueMeta(): {
  volume: number;
  number: number;
  updatedAt: Date;
} {
  const latest = getLatestContentDate();
  const { volume, number } = getIssueMetaForDate(latest);
  return {
    volume,
    number,
    updatedAt: latest,
  };
}

export function getIssueMetaForDate(date: Date): {
  volume: number;
  number: number;
} {
  const startYear = JOURNAL_START_DATE.getUTCFullYear();
  const volume = date.getUTCFullYear() - startYear + 1;
  const number = date.getUTCMonth() + 1;
  return {
    volume: Math.max(1, volume),
    number,
  };
}
