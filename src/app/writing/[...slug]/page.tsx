// src/app/writing/[...slug]/page.tsx
import Link from "next/link";
import { topicSlug } from "@/lib/topics";
import { notFound } from "next/navigation";
import { writingSource } from "@/lib/writing";
import { getMDXComponents } from "@/mdx-components";
import { createRelativeLink } from "fumadocs-ui/mdx";

function formatYmd(v: unknown): string {
  // Handles Date objects and strings like "2026-01-07T11:05"
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "string") return v.slice(0, 10);
  return "";
}

export default async function WritingPostPage(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;

  const page = writingSource.getPage(params.slug);
  if (!page) notFound();

  // ✅ Same as your docs route:
  const MDX = page.data.body;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <header className="mb-10">
        <p className="text-sm opacity-70">{formatYmd(page.data.created)}</p>

        <h1 className="mt-2 text-3xl font-semibold leading-tight">
          {page.data.title}
        </h1>

        <div className="mt-3 text-sm opacity-70">
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
            <span>Updated {formatYmd(page.data.updated)}</span>
            </>
        ) : null}
        </div>



      </header>

      <article className="prose prose-neutral max-w-none">
        <MDX
          components={getMDXComponents({
            // Allows relative file path linking inside your writing collection
            a: createRelativeLink(writingSource, page),
          })}
        />
      </article>

      <footer className="mt-16 text-sm opacity-70">
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
