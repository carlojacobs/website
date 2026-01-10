// src/app/med/page.tsx
import Link from "next/link";
import { medSource } from "@/lib/med";
import { formatYearMonth, toMillis } from "@/lib/date";
import { topicSlug } from "@/lib/topics";
import { JournalHeader } from "@/components/journal";
import timeline from "@/content/med/timeline.json";

type MedPage = {
  url: string;
  data: { created: unknown; categories?: string[]; title: string; draft?: boolean };
};

const getCategories = (page: MedPage) =>
  Array.isArray(page.data.categories)
    ? page.data.categories.map((c) => String(c).toLowerCase())
    : [];

const hasCategory = (page: MedPage, target: string) =>
  getCategories(page).includes(target.toLowerCase());

export default function MedIndexPage() {
  const pages = medSource
    .getPages()
    .filter((p) => !p.data.draft)
    .sort((a, b) => toMillis(b.data.created) - toMillis(a.data.created));

  const journalEntries = pages.filter(
    (p) => hasCategory(p as MedPage, "rotation journal") || hasCategory(p as MedPage, "journal"),
  );

  const noteEntries = pages.filter(
    (p) => hasCategory(p as MedPage, "clinical pearl") || hasCategory(p as MedPage, "knowledge note"),
  );

  const topics = Array.from(
    new Map(
      pages
        .flatMap((p) => (Array.isArray(p.data.categories) ? p.data.categories : []))
        .map((label) => [topicSlug(String(label)), String(label)] as const),
    ).entries(),
  )
    .map(([slug, label]) => ({ slug, label }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const timelineItems = timeline;

  return (
    <main>
      <JournalHeader
        strip={{
          className: "text-amber-800/70 opacity-100",
          paddingTopClass: "pt-5",
          showConnector: true,
          alignCenter: true,
          left: (
            <Link href="/" className="underline underline-offset-4">
              ← Front Cover
            </Link>
          ),
          right: <span>{pages.length} {pages.length === 1 ? "entry" : "entries"}</span>,
        }}
      />

      <section className="mb-10">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60">
          Clinical Rotations & Medical School
        </div>
        <h1 className="mt-2 text-2xl font-semibold leading-tight">Field Notes, Pearls, and Practice</h1>
        <p className="mt-3 text-sm leading-6 opacity-75">
          This section keeps the running diary of rotations and a set of compact notes that
          translate patient encounters into study material. It is not a protocol library; it is
          memory, structure, and small lessons I want to keep for later.
        </p>
      </section>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-10">
        <section>
          <div className="mb-2 flex items-baseline justify-between text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60">
            <span>Rotation Journal</span>
            <span className="opacity-50">Daily Logs</span>
          </div>
          {journalEntries.length ? (
            <ul className="space-y-1.5">
              {journalEntries.map((p) => (
                <li key={p.url} className="flex items-baseline gap-3">
                  <time
                    className="time-index relative top-[1px] w-16 shrink-0 text-xs text-gray-500/90"
                    dateTime={String(p.data.created)}
                  >
                    {formatYearMonth(p.data.created)}
                  </time>
                  <Link href={p.url} className="underline underline-offset-4 text-[15px] leading-snug">
                    {p.data.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm opacity-70">No journal entries yet.</p>
          )}
        </section>

        <section>
          <div className="mb-2 flex items-baseline justify-between text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60">
            <span>Clinical Notes</span>
            <span className="opacity-50">Quick Maps</span>
          </div>
          {noteEntries.length ? (
            <ul className="space-y-1.5">
              {noteEntries.map((p) => (
                <li key={p.url} className="flex items-baseline gap-3">
                  <time
                    className="time-index relative top-[1px] w-16 shrink-0 text-xs text-gray-500/90"
                    dateTime={String(p.data.created)}
                  >
                    {formatYearMonth(p.data.created)}
                  </time>
                  <Link href={p.url} className="underline underline-offset-4 text-[15px] leading-snug">
                    {p.data.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm opacity-70">No clinical notes yet.</p>
          )}
        </section>
      </div>

      <section className="mt-6 border-t border-black/10 pt-3">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60">
          Timeline
        </div>
        <ol className="space-y-1.5 pl-6 ml-[79px] relative">
          <div className="h-full absolute bg-fd-border my-1 w-0.5 left-0 rounded-full" />
          {timelineItems.map((item) => (
            <li key={item.title} className="flex items-baseline gap-4 relative">
              <time
                className="time-index w-16 absolute -translate-x-24 top-0 shrink-0 text-xs text-gray-500/90"
                dateTime={item.dateISO}
              >
                {formatYearMonth(item.dateISO)}
              </time>
              <div className="absolute top-[2px] left-0 -translate-x-7 size-2.5 rounded-full border-fd-border border-2 bg-[#f8f7f4]"/>
              <div className="space-y-1.5">
                <div className="text-sm leading-none font-semibold">{item.title}</div>
                <p className="text-sm leading-none opacity-70">{item.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-6 border-t border-black/10 pt-3">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60">
          Topics
        </div>
        {topics.length ? (
          <p className="leading-7 opacity-85">
            {topics.map((t, i) => (
              <span key={t.slug}>
                <Link href={`/topics/med/${t.slug}`} className="underline underline-offset-4 opacity-90">
                  {t.label}
                </Link>
                {i < topics.length - 1 ? <span className="opacity-50">, </span> : null}
              </span>
            ))}
          </p>
        ) : (
          <p className="text-sm opacity-70">No topics yet.</p>
        )}
      </section>

      <footer className="mt-16" />
    </main>
  );
}
