// src/app/writing/page.tsx
import Link from "next/link";
import { writingSource } from "@/lib/writing";
import { formatDate, formatYearMonth, toMillis, formatLongDate } from "@/lib/date";

function toDateValue(v: string | Date): number {
  if (v instanceof Date) return v.getTime();
  const t = Date.parse(v);
  return Number.isFinite(t) ? t : 0;
}

export default function WritingIndexPage() {
    const pages = writingSource
    .getPages()
    .filter((p) => !p.data.draft)
    .sort((a, b) => toDateValue(b.data.created) - toDateValue(a.data.created));


  return (
    <main>
      <header className="mb-10">
        <h1 className="text-2xl font-semibold">Writing</h1>
        <p className="mt-2 text-sm opacity-70">
          Posts, newest first. No feed algorithm, just dates.
        </p>
      </header>

      <ul className="space-y-3">
        {pages.map((p) => (
          <li key={p.url} className="flex gap-4">
            <span className="w-28 shrink-0 text-sm opacity-70">
            {formatYearMonth(p.data.created)}
            </span>
            <div className="min-w-0">
              <Link href={p.url} className="underline underline-offset-4">
                {p.data.title}
              </Link>
              <div className="mt-1 text-xs opacity-60">
                {p.data.categories.join(", ")}
                </div>
            </div>
          </li>
        ))}
      </ul>

      <footer className="mt-16 text-sm opacity-70">
        <Link href="/" className="underline underline-offset-4">
          Home
        </Link>
      </footer>
    </main>
  );
}
