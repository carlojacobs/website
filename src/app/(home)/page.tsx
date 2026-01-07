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
      {/* Masthead line */}
      <header className="mt-8">
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

        <div className="mt-4 flex items-baseline justify-between text-xs uppercase tracking-[0.2em] opacity-55">
          <span>Issue Summary</span>
          <span>{posts.length} articles</span>
        </div>
      </header>

      <hr className="my-7 opacity-25" />


      <div className="grid gap-12 lg:grid-cols-[1fr_24rem] lg:gap-12">
  {/* LEFT — FEATURED */}
  <section className="min-w-0">
    <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60">
      Featured Article
    </h2>

    {latest ? (
      <div className="space-y-3">
        <div className="text-sm opacity-60">
          <time className="time-citation" dateTime={String(latest.data.created)}>
            {formatLongDate(latest.data.created)}
          </time>
        </div>

        <div className="text-2xl leading-snug">
          <Link href={latest.url} className="underline underline-offset-4">
            {latest.data.title}
          </Link>
        </div>

        {/* Abstract block */}
        <div className="border-l border-black/10 pl-4">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-55">
            Abstract
          </div>
          <p className="text-sm leading-6 opacity-75">
            {truncateSentenceOrChars(getWritingBodyText(latest), 260)}
          </p>
        </div>

        <div>
          <Link href={latest.url} className="text-sm underline underline-offset-4 opacity-70">
            Read full text →
          </Link>
        </div>
      </div>
    ) : (
      <p className="text-sm opacity-70">
        No posts yet. Add one in <code>src/content/writing</code>.
      </p>
    )}

    <hr className="my-10 opacity-25" />

    {/* TOPICS INDEX */}
    <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60">
      Topics Index
    </h2>

    {topics.length ? (
      <p className="leading-7 opacity-85">
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

  {/* RIGHT — ALL WRITING */}
  <aside className="min-w-0 lg:sticky lg:top-10 lg:self-start">
    <div>
      <div className="mb-3 flex items-baseline justify-between text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60">
        <span>Complete Contents</span>
        <span className="opacity-70">All Writing</span>
      </div>

      <ul className="space-y-2">
        {posts.map((p) => (
          <li key={p.url} className="flex items-baseline gap-3">
            <time
              dateTime={String(p.data.created)}
              className="time-index relative top-[1px] w-20 shrink-0 text-sm text-gray-500/90"
            >
              {formatYearMonth(p.data.created)}
            </time>
            <Link href={p.url} className="underline underline-offset-4 text-[15px] leading-snug">
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
