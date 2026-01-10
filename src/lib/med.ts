// src/lib/med.ts
import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { med } from "fumadocs-mdx:collections/server";

export const medSource = loader({
  baseUrl: "/med",
  source: toFumadocsSource(med, []),
});
