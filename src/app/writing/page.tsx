// src/app/writing/page.tsx
import Link from "next/link";
import { writingSource } from "@/lib/writing";
import { formatDate, formatYearMonth, toMillis } from "@/lib/date";

export default function WritingIndexPage() {
  const pages = writingSource
    .getPages()
    .filter((p) => !p.data.draft)
    .sort((a, b) => toMillis(b.data.created) - toMillis(a.data.created));


  return (
    <main>
      <header className="mt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3 text-sm">
          <div className="opacity-75">
            <span className="font-semibold tracking-tight">Notes & Essays</span>
            <span className="opacity-60"> · </span>
            <span className="opacity-60">Carlo Jacobs</span>
          </div>

          <div className="opacity-65">
            <span className="font-semibold">Vol.</span> 01{" "}
            <span className="opacity-60">·</span>{" "}
            <span className="font-semibold">No.</span> 01{" "}
            <span className="opacity-60">·</span>{" "}
            <time className="time-meta" dateTime={new Date().toISOString()}>
              {formatDate(new Date())}
            </time>
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between border-t border-black/20 pt-2 text-xs uppercase tracking-[0.2em] opacity-55">
          <span>Writing Index</span>
          <span>{pages.length} {pages.length === 1 ? "writing" : "writings"}</span>
        </div>
      </header>

      <hr className="my-5 opacity-35" />

      <div className="mb-2 flex items-baseline justify-between text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60">
        <span>Writing</span>
        <span className="opacity-50">Complete Contents</span>
      </div>

      <ul className="space-y-1.5">
        {pages.map((p) => (
          <li key={p.url} className="flex items-baseline gap-3">
            <time
              className="time-index relative top-[1px] w-16 shrink-0 text-xs text-gray-500/90"
              dateTime={String(p.data.created)}
            >
              {formatYearMonth(p.data.created)}
            </time>

            <Link href={p.url} className="underline underline-offset-4 text-[14px] leading-snug">
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
