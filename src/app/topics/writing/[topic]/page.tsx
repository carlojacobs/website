// src/app/topics/writing/[topic]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { writingSource } from "@/lib/writing";
import { topicSlug } from "@/lib/topics";
import { formatDate, formatYearMonth, toMillis } from "@/lib/date";

export default async function WritingTopicPage(props: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await props.params;

  const allPosts = writingSource
    .getPages()
    .filter((p) => !p.data.draft)
    .sort((a, b) => toMillis(b.data.created) - toMillis(a.data.created));

  const matching = allPosts.filter((p) => {
    const cats = Array.isArray(p.data.categories) ? p.data.categories : [];
    return cats.some((c: string) => topicSlug(String(c)) === topic);
  });

  if (matching.length === 0) notFound();

  const pretty =
    (matching
      .flatMap((p) => p.data.categories as string[])
      .find((c) => topicSlug(String(c)) === topic) as string) ?? topic;

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
          <span>Writing Topics</span>
          <span>{matching.length} {matching.length === 1 ? "writing" : "writings"}</span>
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
        <Link href="/writing" className="underline underline-offset-4">
          ← Writing
        </Link>
      </footer>
    </main>
  );
}

export async function generateStaticParams() {
  const posts = writingSource.getPages().filter((p) => !p.data.draft);
  const slugs = new Set<string>();

  for (const p of posts) {
    const cats = Array.isArray(p.data.categories) ? p.data.categories : [];
    for (const c of cats) slugs.add(topicSlug(String(c)));
  }

  return Array.from(slugs).map((topic) => ({ topic }));
}
