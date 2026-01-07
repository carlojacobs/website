// src/app/topics/[topic]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
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

function formatYmd(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "string") return v.slice(0, 10);
  return "";
}

export default async function TopicPage(props: {
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

  // Pretty name = first matching post's category label that maps to this slug
  const pretty =
    (matching
      .flatMap((p) => p.data.categories as string[])
      .find((c) => topicSlug(String(c)) === topic) as string) ?? topic;

  return (
    <main className="mx-auto max-w-[42rem] px-4 sm:px-6 py-16">
      <header className="mb-10">
        <p className="text-sm opacity-70">
          <Link href="/" className="underline underline-offset-4">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/writing" className="underline underline-offset-4">
            Writing
          </Link>
        </p>

        <h1 className="mt-2 text-3xl font-semibold leading-tight">{pretty}</h1>
        <p className="mt-2 text-sm opacity-70">
          {matching.length} post{matching.length === 1 ? "" : "s"}
        </p>
      </header>

      <ul className="space-y-3">
        {matching.map((p) => (
          <li key={p.url} className="flex gap-4">
            <span className="w-28 shrink-0 text-sm opacity-70">
              {formatYmd(p.data.created)}
            </span>
            <div className="min-w-0">
              <Link href={p.url} className="underline underline-offset-4">
                {p.data.title}
              </Link>
              <div className="mt-1 text-xs opacity-60">
                {p.data.categories?.join(", ")}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <footer className="mt-16 text-sm opacity-70">
        <Link href="/writing" className="underline underline-offset-4">
          ← Writing
        </Link>
      </footer>
    </main>
  );
}

// Optional: prebuild topic pages for all topics
export async function generateStaticParams() {
  const posts = writingSource.getPages().filter((p) => !p.data.draft);
  const slugs = new Set<string>();

  for (const p of posts) {
    const cats = Array.isArray(p.data.categories) ? p.data.categories : [];
    for (const c of cats) slugs.add(topicSlug(String(c)));
  }

  return Array.from(slugs).map((topic) => ({ topic }));
}
