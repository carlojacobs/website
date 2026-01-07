// src/app/(home)/page.tsx
import Link from "next/link";
import { writingSource } from "@/lib/writing";
import { formatDate, formatYearMonth, toMillis, formatLongDate } from "@/lib/date";
import { topicSlug, topicLabel } from "@/lib/topics";
import { getWritingBodyText, truncateSentenceOrChars } from "@/lib/excerpt";

// function toMillis(v: unknown): number {
//   if (v instanceof Date) return v.getTime();
//   if (typeof v === "string") {
//     const t = Date.parse(v);
//     return Number.isFinite(t) ? t : 0;
//   }
//   return 0;
// }

// function ymd(v: unknown): string {
//   if (v instanceof Date) return v.toISOString().slice(0, 10);
//   if (typeof v === "string") return v.slice(0, 10);
//   return "";
// }

// function yearMonth(v: unknown): string {
//   const s = ymd(v); // YYYY-MM-DD
//   if (!s) return "";
//   return `${s.slice(0, 4)} · ${s.slice(5, 7)}`;
// }

export default function HomePage() {
  const posts = writingSource
    .getPages()
    .filter((p) => !p.data.draft)
    .sort((a, b) => toMillis(b.data.created) - toMillis(a.data.created));

  const latest = posts[0];

  const topics = Array.from(
    new Map(
      posts
        .flatMap((p) => (Array.isArray(p.data.categories) ? p.data.categories : []))
        // Map key = slug (case-insensitive), value = first-seen pretty label
        .map((label) => [topicSlug(String(label)), String(label)] as const),
    ).entries(),
  )
    // entries() gives [slug, label]
    .map(([slug, label]) => ({ slug, label }))
    .sort((a, b) => a.label.localeCompare(b.label));



  return (
    <main>
      {/* Header (small + simple, like Steph’s) */}
      <header className="mb-12 flex items-baseline justify-between gap-6">
        <Link href="/" className="text-lg font-semibold">
          {/* Change this to your name/site title */}
          Carlo Jacobs
        </Link>

        <nav className="flex gap-4 text-sm opacity-80">
          <Link href="/writing" className="hover:opacity-100">
            Writing
          </Link>
          {/* If you add /about and /now later, these will work */}
          <Link href="/about" className="hover:opacity-100">
            About
          </Link>
          <Link href="/now" className="hover:opacity-100">
            Now
          </Link>
        </nav>
      </header>

      {/* Masthead line */}
      <div className="mt-8 flex flex-wrap items-baseline justify-between gap-3 text-sm">
        <div className="opacity-80">
          <span className="font-semibold">Notes & Essays</span>
          <span className="opacity-60"> · </span>
          <span className="opacity-60">Carlo Jacobs</span>
        </div>

        <div className="opacity-70">
          <span className="font-semibold">Vol.</span> 01{" "}
          <span className="opacity-60">·</span>{" "}
          <span className="font-semibold">No.</span> 01{" "}
          <span className="opacity-60">·</span>{" "}
          <time className="time-meta" dateTime={new Date().toISOString()}>
            {formatDate(new Date())}
          </time>
        </div>
      </div>

      <hr className="my-6 opacity-30" />


      <div className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-10">
  {/* LEFT — FEATURED */}
  <section className="min-w-0">
    <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest opacity-70">
      Featured Article
    </h2>

    {latest ? (
      <div className="space-y-3">
        <div className="text-sm opacity-70">
          <time className="time-citation" dateTime={String(latest.data.created)}>
            {formatLongDate(latest.data.created)}
          </time>
        </div>

        <div className="text-xl leading-snug">
          <Link href={latest.url} className="underline underline-offset-4">
            {latest.data.title}
          </Link>
        </div>

        {/* Abstract block */}
        <div className="border-l border-black/10 pl-4">
          <div className="mb-1 text-xs font-semibold uppercase tracking-widest opacity-60">
            Abstract
          </div>
          <p className="text-sm leading-6 opacity-80">
            {truncateSentenceOrChars(getWritingBodyText(latest), 260)}
          </p>
        </div>

        <div>
          <Link href={latest.url} className="text-sm underline underline-offset-4 opacity-80">
            Read full text →
          </Link>
        </div>
      </div>
    ) : (
      <p className="text-sm opacity-70">
        No posts yet. Add one in <code>src/content/writing</code>.
      </p>
    )}

    <hr className="my-10 opacity-30" />

    {/* TOPICS INDEX */}
    <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest opacity-70">
      Topics Index
    </h2>

    {topics.length ? (
      <p className="leading-7">
        {topics.map((t, i) => (
          <span key={t.slug}>
            <Link href={`/topics/${t.slug}`} className="underline underline-offset-4 opacity-90">
              {t.label}
            </Link>
            {i < topics.length - 1 ? <span className="opacity-50">, </span> : null}
          </span>
        ))}
      </p>
    ) : (
      <p className="text-sm opacity-70">No topics yet.</p>
    )}
  </section>

  {/* RIGHT — TABLE OF CONTENTS */}
  <aside className="min-w-0 lg:sticky lg:top-10 lg:self-start">
    <div className="border-t border-black/10 pt-6">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest opacity-70">
        Table of Contents
      </h2>

      <ul className="space-y-2">
        {posts.map((p) => (
          <li key={p.url} className="flex items-baseline gap-3">
            <time
              dateTime={String(p.data.created)}
              className="time-index relative top-[1px] w-20 shrink-0 text-base text-gray-500"
            >
              {formatYearMonth(p.data.created)}
            </time>
            <Link href={p.url} className="underline underline-offset-4">
              {p.data.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </aside>
</div>



      {/* <footer className="mt-16 text-sm opacity-60">
        <span>{new Date().getFullYear()}</span>
      </footer> */}
    </main>
  );
}
