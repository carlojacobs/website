// src/app/writing/page.tsx
import Link from "next/link";
import { writingSource } from "@/lib/writing";
import { formatYearMonth, toMillis } from "@/lib/date";

function toDateValue(v: string | Date): number {
  if (v instanceof Date) return v.getTime();
  const t = Date.parse(v);
  return Number.isFinite(t) ? t : 0;
}

export default function WritingIndexPage() {
    const pages = writingSource
    .getPages()
    .filter((p) => !p.data.draft)
    .sort((a, b) => toMillis(b.data.created) - toMillis(a.data.created));


  return (
    <main>
      <header className="mb-10">
        <h1 className="text-2xl font-semibold">Writing</h1>
        <p className="mt-2 text-sm opacity-70">
          My thoughts on paper.
        </p>
      </header>

    <ul className="space-y-2">
      {pages.map((p) => (
        <li key={p.url} className="flex items-baseline gap-3">
          <time
            className="time-index relative top-[1px] w-20 shrink-0 text-base text-gray-500"
            dateTime={String(p.data.created)}
          >
            {formatYearMonth(p.data.created)}
          </time>

          <Link href={p.url} className="underline underline-offset-4">
            {p.data.title}
          </Link>
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
