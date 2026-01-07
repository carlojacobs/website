// src/lib/writing.ts
import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { writing } from "fumadocs-mdx:collections/server";

export const writingSource = loader({
  baseUrl: "/writing",
  source: toFumadocsSource(writing, []),
});
