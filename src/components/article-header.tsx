// src/components/article-header.tsx
import Link from "next/link";
import type { ReactNode } from "react";
import { formatLongDate } from "@/lib/date";
import { topicSlug } from "@/lib/topics";

type ArticleHeaderProps = {
  title: string;
  created: string | Date;
  updated?: string | Date | null;
  categories?: string[] | null;
  topicBasePath: string;
  readingMinutes?: number;
};

type MetaItemProps = {
  label: string;
  children: ReactNode;
};

function MetaItem({ label, children }: MetaItemProps) {
  return (
    <span>
      <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-70">
        {label}
      </span>
      {children}
    </span>
  );
}

export function ArticleHeader(props: ArticleHeaderProps) {
  const {
    title,
    created,
    updated,
    categories,
    topicBasePath,
    readingMinutes,
  } = props;
  const hasCategories = Array.isArray(categories) && categories.length > 0;
  const topicsBase = topicBasePath.replace(/\/$/, "");
  const metaItems: ReactNode[] = [];

  if (typeof readingMinutes === "number") {
    metaItems.push(
      <MetaItem key="reading" label="Reading time:">
        {readingMinutes} min
      </MetaItem>,
    );
  }

  if (hasCategories) {
    metaItems.push(
      <MetaItem key="topics" label="Topics:">
        {categories.map((c, i) => (
          <span key={c}>
            <Link
              href={`${topicsBase}/${topicSlug(c)}`}
              className="underline underline-offset-4"
            >
              {c}
            </Link>
            {i < categories.length - 1 ? ", " : ""}
          </span>
        ))}
      </MetaItem>,
    );
  }

  return (
    <div className="mb-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3 text-sm opacity-70">
        <MetaItem label="Published:">
          <time className="time-citation" dateTime={String(created)}>
            {formatLongDate(created)}
          </time>
        </MetaItem>
        {updated ? (
          <MetaItem label="Updated:">
            <time className="time-citation" dateTime={String(updated)}>
              {formatLongDate(updated)}
            </time>
          </MetaItem>
        ) : null}
      </div>

      <h1 className="mt-2 text-2xl font-semibold leading-tight">{title}</h1>

      {metaItems.length ? (
        <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm opacity-70">
          {metaItems}
        </div>
      ) : null}
    </div>
  );
}
