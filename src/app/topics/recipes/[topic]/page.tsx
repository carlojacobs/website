// src/app/topics/recipes/[topic]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { recipesSource } from "@/lib/recipes";
import { topicSlug } from "@/lib/topics";
import { formatDate, formatYearMonth, toMillis } from "@/lib/date";
import { SITE_TITLE, getIssueMeta } from "@/lib/site";

export default async function RecipeTopicPage(props: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await props.params;

  const allRecipes = recipesSource
    .getPages()
    .filter((p) => !p.data.draft)
    .sort((a, b) => toMillis(b.data.created) - toMillis(a.data.created));

  const matching = allRecipes.filter((p) => {
    const cats = Array.isArray(p.data.categories) ? p.data.categories : [];
    return cats.some((c: string) => topicSlug(String(c)) === topic);
  });

  if (matching.length === 0) notFound();

  const pretty =
    (matching
      .flatMap((p) => p.data.categories as string[])
      .find((c) => topicSlug(String(c)) === topic) as string) ?? topic;

  const issue = getIssueMeta();

  return (
    <main>
      <header className="mt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3 text-sm">
          <div className="opacity-75">
            <span className="font-semibold tracking-tight">{SITE_TITLE}</span>
            <span className="opacity-60"> · </span>
            <span className="opacity-60">Carlo Jacobs</span>
          </div>

          <div className="opacity-65">
            <span className="font-semibold">Vol.</span>{" "}
            {String(issue.volume).padStart(2, "0")}{" "}
            <span className="opacity-60">·</span>{" "}
            <span className="font-semibold">No.</span>{" "}
            {String(issue.number).padStart(2, "0")}{" "}
            <span className="opacity-60">·</span>{" "}
            <time className="time-meta" dateTime={issue.updatedAt.toISOString()}>
              {formatDate(issue.updatedAt)}
            </time>
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between border-t border-black/20 pt-2 text-xs uppercase tracking-[0.2em] opacity-55">
          <span>Recipe Topics</span>
          <span>{matching.length} {matching.length === 1 ? "recipe" : "recipes"}</span>
        </div>
      </header>

      <hr className="my-5 opacity-35" />

      <div className="mb-2 flex items-baseline justify-between text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60">
        <span>{pretty}</span>
        <span className="opacity-50">Topic Index</span>
      </div>

      <ul className="space-y-1.5">
        {matching.map((p) => (
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
        <span className="mx-2">·</span>
        <Link href="/recipes" className="underline underline-offset-4">
          ← Recipes
        </Link>
      </footer>
    </main>
  );
}

export async function generateStaticParams() {
  const recipes = recipesSource.getPages().filter((p) => !p.data.draft);
  const slugs = new Set<string>();

  for (const p of recipes) {
    const cats = Array.isArray(p.data.categories) ? p.data.categories : [];
    for (const c of cats) slugs.add(topicSlug(String(c)));
  }

  return Array.from(slugs).map((topic) => ({ topic }));
}
