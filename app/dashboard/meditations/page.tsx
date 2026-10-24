import Link from "next/link";
import { LibraryList } from "@/components/LibraryList";
import { requireUser } from "@/lib/auth";
import { listCompleted, listContent } from "@/lib/content";

export const metadata = { title: "Meditations" };

export default async function MeditationsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const user = await requireUser();
  const [items, completed] = await Promise.all([listContent("meditation"), listCompleted(user.id)]);

  const themes = Array.from(new Set(items.map((i) => i.theme).filter(Boolean))) as string[];
  const lengths = [
    { key: "short", label: "Under 10 min", test: (m: number) => m < 10 },
    { key: "medium", label: "10–20 min", test: (m: number) => m >= 10 && m <= 20 },
    { key: "long", label: "Over 20 min", test: (m: number) => m > 20 },
  ];
  const length = lengths.find((l) => l.key === sp.length);
  const shown = items.filter(
    (i) => (!sp.theme || i.theme === sp.theme) && (!length || length.test(i.duration_minutes ?? 0)),
  );

  const href = (params: Record<string, string | undefined>) => {
    const q = new URLSearchParams();
    Object.entries({ theme: sp.theme, length: sp.length, ...params }).forEach(([k, v]) => v && q.set(k, v));
    const s = q.toString();
    return `/dashboard/meditations${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <header className="page-head">
        <h1>Guided meditations</h1>
        <p>Free for you to return to whenever you need them. Find a quiet spot, headphones help.</p>
      </header>

      {items.length > 0 && (
        <div className="filters" role="navigation" aria-label="Filter meditations">
          <Link className="chip" href="/dashboard/meditations" aria-current={!sp.theme && !sp.length ? "true" : undefined}>
            All
          </Link>
          {lengths.map((l) => (
            <Link key={l.key} className="chip" href={href({ length: sp.length === l.key ? undefined : l.key })} aria-current={sp.length === l.key ? "true" : undefined}>
              {l.label}
            </Link>
          ))}
          {themes.map((t) => (
            <Link key={t} className="chip" href={href({ theme: sp.theme === t ? undefined : t })} aria-current={sp.theme === t ? "true" : undefined}>
              {t}
            </Link>
          ))}
        </div>
      )}

      {shown.length > 0 ? (
        <LibraryList items={shown} completed={completed} base="/dashboard/meditations" />
      ) : (
        <div className="empty">
          <p>{items.length ? "No meditations match these filters." : "New meditations are being recorded. Check back soon."}</p>
          {items.length > 0 && (
            <Link className="btn btn-quiet" href="/dashboard/meditations">
              Show all meditations
            </Link>
          )}
        </div>
      )}
    </>
  );
}
