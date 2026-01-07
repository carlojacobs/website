// src/app/writing/[...slug]/page.tsx
import Link from "next/link";
import { topicSlug } from "@/lib/topics";
import { notFound } from "next/navigation";
import { writingSource } from "@/lib/writing";
import { getMDXComponents } from "@/mdx-components";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { formatDate, formatYearMonth, toMillis, formatLongDate } from "@/lib/date";

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
      <header className="mb-10">
        <p className="text-sm opacity-70"><i>{formatLongDate(page.data.created)}</i></p>

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
            <span><i>last updated {formatLongDate(page.data.updated)}</i></span>
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
