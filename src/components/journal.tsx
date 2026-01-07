// src/components/journal.tsx
import type { ReactNode } from "react";
import { formatDate } from "@/lib/date";
import { SITE_AUTHOR, SITE_TITLE, getIssueMeta } from "@/lib/site";

export function JournalMasthead() {
  const issue = getIssueMeta();

  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3 text-sm">
      <div className="opacity-75">
        <span className="font-semibold tracking-tight">{SITE_TITLE}</span>
        <span className="opacity-60"> · </span>
        <span className="opacity-60">{SITE_AUTHOR}</span>
      </div>
      <div className="opacity-65">
        <span className="font-semibold">Vol.</span>{" "}
        {String(issue.volume).padStart(2, "0")}{" "}
        <span className="opacity-60">·</span>{" "}
        <span className="font-semibold">No.</span>{" "}
        {String(issue.number).padStart(2, "0")}{" "}
        <span className="opacity-60">·</span>{" "}
        <time className="time-meta" dateTime={issue.updatedAt.toISOString()}>
          {formatDate(issue.updatedAt)}
        </time>
      </div>
    </div>
  );
}

export function JournalStrip(props: {
  left: ReactNode;
  right: ReactNode;
  paddingTopClass?: string;
  className?: string;
}) {
  const { left, right, paddingTopClass = "pt-2", className = "opacity-55" } = props;
  return (
    <div
      className={`mt-3 flex items-baseline justify-between border-t border-black/20 text-xs uppercase tracking-[0.2em] ${paddingTopClass} ${className}`}
    >
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}
