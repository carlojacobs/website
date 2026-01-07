// src/app/(home)/page.tsx
import Link from "next/link";
import { writingSource } from "@/lib/writing";
import { recipesSource } from "@/lib/recipes";
import { formatDate, formatYearMonth, toMillis, formatLongDate } from "@/lib/date";
import { topicSlug } from "@/lib/topics";
import { getWritingBodyText, getWritingFileName, truncateWords } from "@/lib/excerpt";
import {
  FEATURED_EXCERPT_WORDS,
  FEATURED_WRITING_FILENAME,
  getIssueMetaForDate,
} from "@/lib/site";
import { JournalHeader } from "@/components/journal";
import { IssueSelect } from "@/components/issue-select";

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

export default async function HomePage(props: {
  searchParams?: Promise<{ issue?: string }>;
}) {
  const allPosts = writingSource
    .getPages()
    .filter((p) => !p.data.draft)
    .sort((a, b) => toMillis(b.data.created) - toMillis(a.data.created));

  const allRecipes = recipesSource
    .getPages()
    .filter((p) => !p.data.draft)
    .sort((a, b) => toMillis(b.data.created) - toMillis(a.data.created));

  const issueKeyFromDate = (input: unknown): string | null => {
    const d = input instanceof Date ? input : new Date(String(input));
    if (Number.isNaN(d.getTime())) return null;
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  const isOnOrBeforeIssue = (key: string | null, issue: string | null): boolean => {
    if (!issue) return true;
    if (!key) return false;
    return key <= issue;
  };

  const issueMap = new Map<string, Date>();
  for (const p of [...allPosts, ...allRecipes]) {
    const d = p.data.created instanceof Date ? p.data.created : new Date(String(p.data.created));
    if (Number.isNaN(d.getTime())) continue;
    const key = issueKeyFromDate(d);
    if (!key) continue;
    const prev = issueMap.get(key);
    if (!prev || d.getTime() > prev.getTime()) issueMap.set(key, d);
  }

  const issueOptions = Array.from(issueMap.entries())
    .map(([key, date]) => {
      const meta = getIssueMetaForDate(date);
      return {
        value: key,
        date,
        volume: meta.volume,
        number: meta.number,
        dateISO: date.toISOString(),
        label: `Vol. ${String(meta.volume).padStart(2, "0")} No. ${String(meta.number).padStart(
          2,
          "0",
        )} · ${formatDate(date)}`,
      };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const issueSelectOptions = issueOptions.map(({ value, label, volume, number, dateISO }) => ({
    value,
    label,
    volume,
    number,
    dateISO,
  }));

  const params = props.searchParams ? await props.searchParams : undefined;
  const requestedIssue = params?.issue;
  const activeIssue =
    requestedIssue && issueOptions.some((o) => o.value === requestedIssue)
      ? requestedIssue
      : issueOptions[0]?.value ?? null;

  const posts = activeIssue
    ? allPosts.filter((p) => isOnOrBeforeIssue(issueKeyFromDate(p.data.created), activeIssue))
    : allPosts;
  const recipes = activeIssue
    ? allRecipes.filter((p) => isOnOrBeforeIssue(issueKeyFromDate(p.data.created), activeIssue))
    : allRecipes;

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



  const featured =
    posts.find((p) => getWritingFileName(p) === FEATURED_WRITING_FILENAME) ?? posts[0] ?? null;

  return (
    <main>
      {/* Masthead line */}
      <JournalHeader
        mastheadRight={
          issueOptions.length ? (
            <IssueSelect options={issueSelectOptions} value={activeIssue} />
          ) : undefined
        }
        strip={{
          paddingTopClass: "pt-5",
          className: "text-amber-800/70 opacity-100",
          showConnector: true,
          alignCenter: true,
          left: <span>Issue Summary</span>,
          right: (
            <span>
              {posts.length}{" "}
              <Link href="/writing" className="underline underline-offset-4">
                {posts.length === 1 ? "writing" : "writings"}
              </Link>{" "}
              · {recipes.length}{" "}
              <Link href="/recipes" className="underline underline-offset-4">
                {recipes.length === 1 ? "recipe" : "recipes"}
              </Link>
            </span>
          ),
        }}
      />


      <section className="mb-10">
        <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60">
          Featured Article
        </h2>

    {featured ? (
      <div className="space-y-2.5">
        <Link href={featured.url} className="block rounded-none border border-black/10 p-4">
          <div className="flex items-baseline justify-between gap-3">
            <div className="text-lg leading-snug">
              {featured.data.title}
            </div>
            <time
              className="time-citation text-sm opacity-60"
              dateTime={String(featured.data.created)}
            >
              {formatLongDate(featured.data.created)}
            </time>
          </div>
          <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60">
            Abstract
          </div>
          <p className="mt-1 text-sm leading-6 opacity-75 text-justify">
            {truncateWords(getWritingBodyText(featured), FEATURED_EXCERPT_WORDS)}
          </p>
          <div className="mt-3 text-xs uppercase tracking-[0.18em] text-amber-800/70">
            Read full text →
          </div>
        </Link>
      </div>
    ) : null}
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
                <Link href={p.url} className="underline underline-offset-4 text-[15px] leading-snug">
                  {p.data.title}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-black/10 pt-3">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60">
              Writing Topics
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
                  <Link href={r.url} className="underline underline-offset-4 text-[15px] leading-snug">
                    {r.data.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm opacity-70">No recipes yet.</p>
          )}

          <div className="mt-6 border-t border-black/10 pt-3">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60">
              Recipe Topics
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
        </section>
      </div>



      {/* <footer className="mt-16 text-sm opacity-60">
        <span>{new Date().getFullYear()}</span>
      </footer> */}
    </main>
  );
}
