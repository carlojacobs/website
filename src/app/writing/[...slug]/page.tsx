// src/app/writing/[...slug]/page.tsx
import Link from "next/link";
import { topicSlug } from "@/lib/topics";
import { notFound } from "next/navigation";
import { writingSource } from "@/lib/writing";
import { getMDXComponents } from "@/mdx-components";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { formatLongDate } from "@/lib/date";
import { getWritingBodyText } from "@/lib/excerpt";
import { JournalHeader } from "@/components/journal";

export default async function WritingPostPage(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;

  const page = writingSource.getPage(params.slug);
  if (!page) notFound();

  // ✅ Same as your docs route:
  const MDX = page.data.body;
  const wordCount = getWritingBodyText(page).split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.round(wordCount / 200));

  return (
    <main>
      <JournalHeader
        strip={{
          className: "text-amber-800/70 opacity-100",
          paddingTopClass: "pt-5",
          left: (
            <Link href="/" className="underline underline-offset-4">
              ← Journal Cover
            </Link>
          ),
          right: (
            <Link href="/writing" className="underline underline-offset-4">
              All Writings →
            </Link>
          ),
        }}
      />

      <div className="mb-10">
        <div className="flex flex-wrap items-baseline justify-between gap-3 text-sm opacity-70">
          <div>
            <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-70">
              Published:
            </span>
            <time className="time-citation" dateTime={String(page.data.created)}>
              {formatLongDate(page.data.created)}
            </time>
          </div>
          {page.data.updated ? (
            <div className="text-right">
              <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-70">
                Updated:
              </span>
              <time className="time-citation" dateTime={String(page.data.updated)}>
                {formatLongDate(page.data.updated)}
              </time>
            </div>
          ) : null}
        </div>

        <h1 className="mt-2 text-2xl font-semibold leading-tight">
          {page.data.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm opacity-70">
          <span>
            <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-70">
              Reading time:
            </span>
            {readingMinutes} min
          </span>
          <span>
            <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-70">
              Topics:
            </span>
            {page.data.categories.map((c: string, i: number) => (
              <span key={c}>
                <Link
                  href={`/topics/writing/${topicSlug(c)}`}
                  className="underline underline-offset-4"
                >
                  {c}
                </Link>
                {i < page.data.categories.length - 1 ? ", " : ""}
              </span>
            ))}
          </span>
        </div>
      </div>

      <article className="prose prose-neutral max-w-none text-[0.95rem]">
        <MDX
          components={getMDXComponents({
            // Allows relative file path linking inside your writing collection
            a: createRelativeLink(writingSource, page),
          })}
        />
      </article>

      <footer className="mt-16" />
    </main>
  );
}

export async function generateStaticParams() {
  return writingSource.generateParams();
}
