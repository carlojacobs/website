// src/lib/date.ts

function toDate(input: unknown): Date | null {
  if (input instanceof Date) return input;
  if (typeof input === "string") {
    const d = new Date(input);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

/** For sorting newest-first reliably */
export function toMillis(input: unknown): number {
  const d = toDate(input);
  return d ? d.getTime() : 0;
}

/** Global full date style: 7.1.26 (no leading zeros) */
export function formatDate(input: unknown): string {
  const d = toDate(input);
  if (!d) return "";

  // Use UTC parts to avoid off-by-one when frontmatter is YYYY-MM-DD
  const day = d.getUTCDate();
  const month = d.getUTCMonth() + 1;
  const year = d.getUTCFullYear() % 100;

  return `${day}.${month}.${year}`;
}

/** Writing list style: 2026-01 (YYYY-MM, month padded) */
export function formatYearMonth(input: unknown): string {
  const d = toDate(input);
  if (!d) return "";

  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

// src/lib/date.ts

function ordinal(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;

  if (mod10 === 1 && mod100 !== 11) return "st";
  if (mod10 === 2 && mod100 !== 12) return "nd";
  if (mod10 === 3 && mod100 !== 13) return "rd";
  return "th";
}

/**
 * Long human-readable date:
 * January 1st, 2026
 * October 25th, 2024
 */
export function formatLongDate(input: unknown, locale = "en-US"): string {
  const d = input instanceof Date ? input : new Date(String(input));
  if (Number.isNaN(d.getTime())) return "";

  // Use UTC to avoid timezone shifts for YYYY-MM-DD frontmatter
  const day = d.getUTCDate();
  const year = d.getUTCFullYear();

  const month = new Intl.DateTimeFormat(locale, {
    month: "long",
    timeZone: "UTC",
  }).format(d);

  return `${month} ${day}${ordinal(day)}, ${year}`;
}
