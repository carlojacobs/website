// src/app/writing/[...slug]/page.tsx
import Link from "next/link";
import { topicSlug } from "@/lib/topics";
import { notFound } from "next/navigation";
import { writingSource } from "@/lib/writing";
import { getMDXComponents } from "@/mdx-components";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { formatLongDate } from "@/lib/date";

export default async function WritingPostPage(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;

  const page = writingSource.getPage(params.slug);
  if (!page) notFound();

  // ✅ Same as your docs route:
  const MDX = page.data.body;

  return (
    <main>
      <header className="mt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3 text-sm">
          <div className="opacity-75">
            <span className="font-semibold tracking-tight">Notes & Essays</span>
            <span className="opacity-60"> · </span>
            <span className="opacity-60">Carlo Jacobs</span>
          </div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60">
            Writing
          </div>
        </div>

        <div className="mt-3 border-t border-black/20 pt-2 text-xs uppercase tracking-[0.2em] opacity-55">
          Article
        </div>
      </header>

      <hr className="my-5 opacity-35" />

      <div className="mb-10">
        <p className="text-sm opacity-70">
          <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-70">
            Published:
          </span>
          <time className="time-citation" dateTime={String(page.data.created)}>
            {formatLongDate(page.data.created)}
          </time>
        </p>

        <h1 className="mt-2 text-2xl font-semibold leading-tight">
          {page.data.title}
        </h1>

        <div className="mt-3 text-sm opacity-70">
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

          {page.data.updated ? (
            <>
              <span className="mx-2">·</span>
              <span>
                last updated{" "}
                <time className="time-citation" dateTime={String(page.data.updated)}>
                  {formatLongDate(page.data.updated)}
                </time>
              </span>
            </>
          ) : null}
        </div>
      </div>

      <article className="prose prose-neutral max-w-none">
        <MDX
          components={getMDXComponents({
            // Allows relative file path linking inside your writing collection
            a: createRelativeLink(writingSource, page),
          })}
        />
      </article>

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
  return writingSource.generateParams();
}
