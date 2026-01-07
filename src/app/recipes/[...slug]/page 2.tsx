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

      <div className="mx-auto max-w-[40rem]">
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
                  href={`/topics/${topicSlug(c)}`}
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
              a: createRelativeLink(recipesSource, page),
            })}
          />
        </article>
      </div>

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
  return recipesSource.generateParams();
}
