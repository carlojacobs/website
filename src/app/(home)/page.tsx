// src/app/(home)/page.tsx
import Link from "next/link";
import { writingSource } from "@/lib/writing";
import { recipesSource } from "@/lib/recipes";
import { formatDate, formatYearMonth, toMillis, formatLongDate } from "@/lib/date";
import { topicSlug } from "@/lib/topics";
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
  const recipes = recipesSource
    .getPages()
    .filter((p) => !p.data.draft)
    .sort((a, b) => toMillis(b.data.created) - toMillis(a.data.created));

  const writingTopics = Array.from(
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

  const recipeTopics = Array.from(
    new Map(
      recipes
        .flatMap((p) => (Array.isArray(p.data.categories) ? p.data.categories : []))
        .map((label) => [topicSlug(String(label)), String(label)] as const),
    ).entries(),
  )
    .map(([slug, label]) => ({ slug, label }))
    .sort((a, b) => a.label.localeCompare(b.label));



  return (
    <main>
      {/* Masthead line */}
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
          <span>Issue Summary</span>
          <span>
            {posts.length} writings · {recipes.length} recipes
          </span>
        </div>
      </header>

      <hr className="my-5 opacity-35" />


      <section className="mb-10">
        <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60">
          Featured Article
        </h2>

        {latest ? (
          <div className="space-y-2.5">
            <div className="text-sm opacity-60">
              <time className="time-citation" dateTime={String(latest.data.created)}>
                {formatLongDate(latest.data.created)}
              </time>
            </div>

            <div className="text-xl leading-snug">
              <Link href={latest.url} className="underline underline-offset-4">
                {latest.data.title}
              </Link>
            </div>

            <p className="text-sm leading-6 opacity-75 text-justify">
              <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-70">
                Abstract:
              </span>
              {truncateSentenceOrChars(getWritingBodyText(latest), 260)}
            </p>

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
      </section>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-10">
        <section className="min-w-0">
          <div className="mb-2 flex items-baseline justify-between text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60">
            <span>Writing</span>
            <span className="opacity-50">Complete Contents</span>
          </div>

          <ul className="space-y-1.5">
            {posts.map((p) => (
              <li key={p.url} className="flex items-baseline gap-3">
                <time
                  dateTime={String(p.data.created)}
                  className="time-index relative top-[1px] w-16 shrink-0 text-xs text-gray-500/90"
                >
                  {formatYearMonth(p.data.created)}
                </time>
                <Link href={p.url} className="underline underline-offset-4 text-[14px] leading-snug">
                  {p.data.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="min-w-0 lg:border-l lg:border-black/20 lg:pl-8">
          <div className="mb-2 flex items-baseline justify-between text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60">
            <span>Recipes</span>
            <span className="opacity-50">Complete Contents</span>
          </div>

          {recipes.length ? (
            <ul className="space-y-1.5">
              {recipes.map((r) => (
                <li key={r.url} className="flex items-baseline gap-3">
                  <time
                    dateTime={String(r.data.created)}
                    className="time-index relative top-[1px] w-16 shrink-0 text-xs text-gray-500/90"
                  >
                    {formatYearMonth(r.data.created)}
                  </time>
                  <Link href={r.url} className="underline underline-offset-4 text-[14px] leading-snug">
                    {r.data.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm opacity-70">No recipes yet.</p>
          )}
        </section>
      </div>

      <section className="mt-10 border-t border-black/20 pt-4">
        <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60">
          Topics Index
        </h2>

        <div className="space-y-6">
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60">
              Writing
            </div>
            {writingTopics.length ? (
              <p className="leading-7 opacity-85">
                {writingTopics.map((t, i) => (
                  <span key={t.slug}>
                    <Link
                      href={`/topics/writing/${t.slug}`}
                      className="underline underline-offset-4 opacity-90"
                    >
                      {t.label}
                    </Link>
                    {i < writingTopics.length - 1 ? <span className="opacity-50">, </span> : null}
                  </span>
                ))}
              </p>
            ) : (
              <p className="text-sm opacity-70">No writing topics yet.</p>
            )}
          </div>

          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60">
              Recipes
            </div>
            {recipeTopics.length ? (
              <p className="leading-7 opacity-85">
                {recipeTopics.map((t, i) => (
                  <span key={t.slug}>
                    <Link
                      href={`/topics/recipes/${t.slug}`}
                      className="underline underline-offset-4 opacity-90"
                    >
                      {t.label}
                    </Link>
                    {i < recipeTopics.length - 1 ? <span className="opacity-50">, </span> : null}
                  </span>
                ))}
              </p>
            ) : (
              <p className="text-sm opacity-70">No recipe topics yet.</p>
            )}
          </div>
        </div>
      </section>



      {/* <footer className="mt-16 text-sm opacity-60">
        <span>{new Date().getFullYear()}</span>
      </footer> */}
    </main>
  );
}
