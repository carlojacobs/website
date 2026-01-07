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
    <span className="inline-flex items-baseline opacity-65">
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
  );
}
