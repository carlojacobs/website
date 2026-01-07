// src/app/(home)/page.tsx
import Link from "next/link";
import { writingSource } from "@/lib/writing";
import { topicSlug } from "@/lib/topics";

function toMillis(v: unknown): number {
  if (v instanceof Date) return v.getTime();
  if (typeof v === "string") {
    const t = Date.parse(v);
    return Number.isFinite(t) ? t : 0;
  }
  return 0;
}

function ymd(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "string") return v.slice(0, 10);
  return "";
}

function yearMonth(v: unknown): string {
  const s = ymd(v); // YYYY-MM-DD
  if (!s) return "";
  return `${s.slice(0, 4)} · ${s.slice(5, 7)}`;
}

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
    <main className="mx-auto max-w-2xl px-6 py-16">
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

      {/* Latest */}
      <section className="mb-12">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide opacity-70">
          Latest
        </h2>

        {latest ? (
          <div className="space-y-2">
            <div className="text-sm opacity-70">{ymd(latest.data.created)}</div>
            <div className="text-lg">
              <Link href={latest.url} className="underline underline-offset-4">
                {latest.data.title}
              </Link>
            </div>
            <div className="text-sm opacity-70">{latest.data.category}</div>

            <div className="pt-1">
              <Link
                href={latest.url}
                className="text-sm underline underline-offset-4 opacity-80"
              >
                Keep reading →
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-sm opacity-70">
            No posts yet. Add one in <code>src/content/writing</code>.
          </p>
        )}
      </section>

      <hr className="my-10 opacity-30" />

      {/* Topics */}
      <section className="mb-12">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide opacity-70">
          Topics
        </h2>

        {topics.length ? (
          <p className="leading-7">
            {topics.map((t, i) => (
              <span key={t.slug}>
                <Link
                  href={`/topics/${t.slug}`}
                  className="underline underline-offset-4 opacity-90"
                >
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

      <hr className="my-10 opacity-30" />

      {/* Writing list */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide opacity-70">
          Writing
        </h2>

        <ul className="space-y-2">
          {posts.map((p) => (
            <li key={p.url} className="flex gap-4">
              <span className="w-24 shrink-0 text-sm opacity-70">
                {yearMonth(p.data.created)}
              </span>
              <Link href={p.url} className="underline underline-offset-4">
                {p.data.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-16 text-sm opacity-60">
        <span>{new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}
