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

function dayKey(input: unknown): string {
  const d = input instanceof Date ? input : new Date(String(input));
  if (Number.isNaN(d.getTime())) return "";
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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
  const hasUpdated = Boolean(updated);
  const sameDay = updated ? dayKey(updated) === dayKey(created) : false;
  const rightDate = updated ? (sameDay ? created : updated) : null;
  const showPublishedLeft = !sameDay;
  const rightLabel = sameDay ? "Published:" : "Updated:";
  const showTitleRow = showPublishedLeft || hasUpdated;
  const sameDayPublishedOnly = hasUpdated && sameDay;

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
      {sameDayPublishedOnly ? (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold leading-tight">{title}</h1>
          <div className="text-sm opacity-70">
            <MetaItem label={rightLabel}>
              <time className="time-citation" dateTime={String(rightDate)}>
                {formatLongDate(rightDate)}
              </time>
            </MetaItem>
          </div>
        </div>
      ) : (
        <>
          {showTitleRow ? (
            <div
              className={`flex flex-wrap items-baseline gap-3 text-sm opacity-70 ${showPublishedLeft ? "justify-between" : "justify-end"}`}
            >
              {showPublishedLeft ? (
                <MetaItem label="Published:">
                  <time className="time-citation" dateTime={String(created)}>
                    {formatLongDate(created)}
                  </time>
                </MetaItem>
              ) : null}
              {hasUpdated && rightDate ? (
                <MetaItem label={rightLabel}>
                  <time className="time-citation" dateTime={String(rightDate)}>
                    {formatLongDate(rightDate)}
                  </time>
                </MetaItem>
              ) : null}
            </div>
          ) : null}

          <h1 className={`${showTitleRow ? "mt-2" : "mt-0"} text-2xl font-semibold leading-tight`}>
            {title}
          </h1>
        </>
      )}

      {metaItems.length ? (
        <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm opacity-70">
          {metaItems}
        </div>
      ) : null}
    </div>
  );
}
