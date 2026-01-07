// src/app/recipes/[...slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { recipesSource } from "@/lib/recipes";
import { topicSlug } from "@/lib/topics";
import { getMDXComponents } from "@/mdx-components";
import { formatLongDate } from "@/lib/date";
import { JournalMasthead, JournalStrip } from "@/components/journal";

export default async function RecipePage(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;

  const page = recipesSource.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  return (
    <main>
      <header className="mt-6">
        <JournalMasthead />
        <JournalStrip
          className="text-amber-800/70 opacity-100"
          paddingTopClass="pt-5"
          left={
            <Link href="/" className="underline underline-offset-4">
              ← Journal Cover
            </Link>
          }
          right={
            <Link href="/recipes" className="underline underline-offset-4">
              All Recipes →
            </Link>
          }
        />
      </header>

      <hr className="my-5 opacity-35" />

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

        <div className="mt-3 text-sm opacity-70">
          <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-70">
            Topics:
          </span>
          {page.data.categories.map((c: string, i: number) => (
            <span key={c}>
              <Link
                href={`/topics/recipes/${topicSlug(c)}`}
                className="underline underline-offset-4"
              >
                {c}
              </Link>
              {i < page.data.categories.length - 1 ? ", " : ""}
            </span>
          ))}

        </div>
      </div>

      <article className="prose prose-neutral max-w-none text-[0.95rem]">
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(recipesSource, page),
          })}
        />
      </article>

      <footer className="mt-16" />
    </main>
  );
}

export async function generateStaticParams() {
  return recipesSource.generateParams();
}
