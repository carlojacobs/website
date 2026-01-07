// src/lib/recipes.ts
import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { recipes } from "fumadocs-mdx:collections/server";

export const recipesSource = loader({
  baseUrl: "/recipes",
  source: toFumadocsSource(recipes, []),
});
