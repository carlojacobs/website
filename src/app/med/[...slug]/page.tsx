// src/app/med/[...slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { medSource } from "@/lib/med";
import { getMDXComponents } from "@/mdx-components";
import { JournalHeader } from "@/components/journal";
import { ArticleHeader } from "@/components/article-header";

export default async function MedEntryPage(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;

  const page = medSource.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
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
            <Link href="/med" className="underline underline-offset-4">
              All Med School Notes →
            </Link>
          ),
        }}
      />

      <ArticleHeader
        title={page.data.title}
        created={page.data.created}
        updated={page.data.updated}
        categories={page.data.categories}
        topicBasePath="/topics/med"
      />

      <article className="prose prose-neutral max-w-none text-[0.95rem]">
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(medSource, page),
          })}
        />
      </article>

      <footer className="mt-16" />
    </main>
  );
}

export async function generateStaticParams() {
  return medSource.generateParams();
}
