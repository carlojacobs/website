// src/components/journal.tsx
import type { ReactNode } from "react";
import { SITE_AUTHOR, SITE_TITLE, getIssueMeta } from "@/lib/site";
import { IssueMeta } from "@/components/issue-meta";

export function JournalMasthead(props: { right?: ReactNode }) {
  const issue = getIssueMeta();
  const { right } = props;

  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3 text-sm">
      <div className="opacity-75">
        <span className="font-semibold tracking-tight">{SITE_TITLE}</span>
        <span className="opacity-60"> · </span>
        <span className="opacity-60">{SITE_AUTHOR}</span>
      </div>
      {right ?? (
        <div>
          <IssueMeta
            volume={issue.volume}
            number={issue.number}
            dateISO={issue.updatedAt}
          />
        </div>
      )}
    </div>
  );
}

export function JournalHeader(props: {
  mastheadRight?: ReactNode;
  strip?: {
    left: ReactNode;
    right: ReactNode;
    paddingTopClass?: string;
    className?: string;
    showConnector?: boolean;
    alignCenter?: boolean;
  };
  className?: string;
  showDivider?: boolean;
  dividerClassName?: string;
}) {
  const { mastheadRight, strip, className, showDivider = true, dividerClassName } = props;
  return (
    <header className={`mt-6 ${className ?? ""}`}>
      <JournalMasthead right={mastheadRight} />
      {strip ? (
        <JournalStrip
          left={strip.left}
          right={strip.right}
          paddingTopClass={strip.paddingTopClass}
          className={strip.className}
          showConnector={strip.showConnector}
          alignCenter={strip.alignCenter}
        />
      ) : null}
      {showDivider ? <JournalDivider className={dividerClassName} /> : null}
    </header>
  );
}

export function JournalDivider(props: { className?: string }) {
  const { className } = props;
  return <hr className={`my-5 border-black/20 ${className ?? ""}`} />;
}

export function JournalStrip(props: {
  left: ReactNode;
  right: ReactNode;
  paddingTopClass?: string;
  className?: string;
  showConnector?: boolean;
  alignCenter?: boolean;
}) {
  const {
    left,
    right,
    paddingTopClass = "pt-2",
    className = "opacity-55",
    showConnector = false,
    alignCenter = false,
  } = props;
  return (
    <div
      className={`mt-3 flex ${alignCenter ? "items-center" : "items-baseline"} justify-between border-t border-black/20 text-xs uppercase tracking-[0.2em] ${paddingTopClass} ${className}`}
    >
      <span>{left}</span>
      {showConnector ? <span className="mx-3 flex-1 border-t border-current/30" /> : null}
      <span>{right}</span>
    </div>
  );
}
