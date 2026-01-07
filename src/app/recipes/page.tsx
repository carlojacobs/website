// src/app/recipes/page.tsx
import Link from "next/link";
import { recipesSource } from "@/lib/recipes";
import { formatYearMonth, toMillis } from "@/lib/date";

export default function RecipesIndexPage() {
  const pages = recipesSource
    .getPages()
    .filter((p) => !p.data.draft)
    .sort((a, b) => toMillis(b.data.created) - toMillis(a.data.created));

  return (
    <main>
      <header className="mb-10">
        <h1 className="text-2xl font-semibold">Recipes</h1>
        <p className="mt-2 text-sm opacity-70">
          Notes from the kitchen.
        </p>
      </header>

      <ul className="space-y-2">
        {pages.map((p) => (
          <li key={p.url} className="flex items-baseline gap-3">
            <time
              className="time-index relative top-[1px] w-20 shrink-0 text-base text-gray-500"
              dateTime={String(p.data.created)}
            >
              {formatYearMonth(p.data.created)}
            </time>

            <Link href={p.url} className="underline underline-offset-4">
              {p.data.title}
            </Link>
          </li>
        ))}
      </ul>

      <footer className="mt-16 text-sm opacity-70">
        <Link href="/" className="underline underline-offset-4">
          Home
        </Link>
      </footer>
    </main>
  );
}
