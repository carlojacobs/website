// src/app/writing/[...slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { writingSource } from "@/lib/writing";
import { getMDXComponents } from "@/mdx-components";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { getWritingBodyText } from "@/lib/excerpt";
import { JournalHeader } from "@/components/journal";
import { ArticleHeader } from "@/components/article-header";

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
              ← Front Cover
            </Link>
          ),
          right: (
            <Link href="/writing" className="underline underline-offset-4">
              All Writings →
            </Link>
          ),
        }}
      />

      <ArticleHeader
        title={page.data.title}
        created={page.data.created}
        updated={page.data.updated}
        categories={page.data.categories}
        topicBasePath="/topics/writing"
        readingMinutes={readingMinutes}
      />

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
