// src/lib/site.ts
export const SITE_TITLE = "The Very Unofficial Journal of Notes, Essays & Recipes";

// Featured writing filename, e.g. "How to Write an Essay.md"
export const FEATURED_WRITING_FILENAME = "Essay Writing Protocol.md";

// Journal start date: 7.1.26 (Jan 7, 2026). Used to compute volume/number.
export const JOURNAL_START_DATE = new Date(Date.UTC(2026, 0, 7));

function getLastRepoUpdateDate(): Date {
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

function monthsSinceStart(now: Date, start: Date): number {
  const yearDiff = now.getUTCFullYear() - start.getUTCFullYear();
  const monthDiff = now.getUTCMonth() - start.getUTCMonth();
  let months = yearDiff * 12 + monthDiff;
  if (now.getUTCDate() < start.getUTCDate()) months -= 1;
  return Math.max(0, months);
}

export function getIssueMeta(): {
  volume: number;
  number: number;
  updatedAt: Date;
} {
  const now = new Date();
  const months = monthsSinceStart(now, JOURNAL_START_DATE);
  const volume = Math.floor(months / 12) + 1;
  const number = (months % 12) + 1;
  return {
    volume,
    number,
    updatedAt: getLastRepoUpdateDate(),
  };
}
