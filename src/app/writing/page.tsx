// src/app/writing/page.tsx
import Link from "next/link";
import { writingSource } from "@/lib/writing";
import { formatYearMonth, toMillis } from "@/lib/date";
import { JournalHeader } from "@/components/journal";

export default function WritingIndexPage() {
  const pages = writingSource
    .getPages()
    .filter((p) => !p.data.draft)
    .sort((a, b) => toMillis(b.data.created) - toMillis(a.data.created));
  return (
    <main>
      <JournalHeader
        strip={{
          className: "text-amber-800/70 opacity-100",
          paddingTopClass: "pt-5",
          showConnector: true,
          alignCenter: true,
          left: <span>Writing Index</span>,
          right: <span>{pages.length} {pages.length === 1 ? "writing" : "writings"}</span>,
        }}
      />

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
