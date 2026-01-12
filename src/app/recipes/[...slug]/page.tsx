// src/app/recipes/[...slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { recipesSource } from "@/lib/recipes";
import { getMDXComponents } from "@/mdx-components";
import { JournalHeader } from "@/components/journal";
import { ArticleHeader } from "@/components/article-header";

export default async function RecipePage(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;

  const page = recipesSource.getPage(params.slug);
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
            <Link href="/recipes" className="underline underline-offset-4">
              All Recipes →
            </Link>
          ),
        }}
      />

      <ArticleHeader
        title={page.data.title}
        created={page.data.created}
        updated={page.data.updated}
        categories={page.data.categories}
        topicBasePath="/topics/recipes"
      />

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
