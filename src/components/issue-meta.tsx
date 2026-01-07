// src/components/issue-meta.tsx
import { formatDate } from "@/lib/date";

export function IssueMeta(props: {
  volume: number;
  number: number;
  dateISO: string | Date;
}) {
  const { volume, number, dateISO } = props;
  const iso = dateISO instanceof Date ? dateISO.toISOString() : dateISO;

  return (
    <span className="group relative inline-flex items-baseline">
      <span className="opacity-65">
        <span className="font-semibold">Vol.</span>
        {"\u00A0"}
        {String(volume).padStart(2, "0")}
        {"\u00A0"}
        <span className="opacity-60">·</span>
        {"\u00A0"}
        <span className="font-semibold">No.</span>
        {"\u00A0"}
        {String(number).padStart(2, "0")}
        {"\u00A0"}
        <span className="opacity-60">·</span>
        {"\u00A0"}
        <time className="time-meta" dateTime={iso}>
          {formatDate(iso)}
        </time>
      </span>
      <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-64 -translate-x-1/2 rounded-none border border-black/10 bg-[#f8f7f4] p-2 text-[11px] uppercase tracking-[0.18em] text-black/70 opacity-0 shadow-sm transition group-hover:opacity-100">
        Vol. counts years since the first issue. No. is the month within that year. Date marks the latest publish in that issue.
      </span>
    </span>
  );
}
