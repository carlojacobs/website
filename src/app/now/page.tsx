import { notFound } from "next/navigation";
import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { pages } from "fumadocs-mdx:collections/server";

const pagesSource = loader({
  baseUrl: "/",
  source: toFumadocsSource(pages, []),
});

export default function AboutPage() {
  const page = pagesSource.getPage(["about"]);
  if (!page) notFound();

  const MDX = page.data.body;
  return (
    <main>
      <MDX />
    </main>
  );
}
