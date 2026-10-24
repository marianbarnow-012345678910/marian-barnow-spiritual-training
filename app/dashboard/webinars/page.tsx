import Link from "next/link";
import { DateBox } from "@/components/ClassCard";
import { LibraryList } from "@/components/LibraryList";
import { requireUser } from "@/lib/auth";
import { isJoinOpen, listCompleted, listContent, splitWebinars } from "@/lib/content";
import { formatMinutes, formatTime } from "@/lib/format";

export const metadata = { title: "Webinars" };

export default async function WebinarsPage() {
  const user = await requireUser();
  const [items, completed] = await Promise.all([listContent("webinar"), listCompleted(user.id)]);
  const { upcoming, recordings } = splitWebinars(items);

  return (
    <>
      <header className="page-head">
        <h1>Webinars</h1>
        <p>Join live online sessions with Marian, or watch the recordings in your own time.</p>
      </header>

      <section>
        <div className="section-head">
          <h2>Live and upcoming</h2>
        </div>
        {upcoming.length > 0 ? (
          <div className="live-list">
            {upcoming.map((w) => (
              <article key={w.id} className="live">
                <DateBox iso={w.live_at!} />
                <div className="body">
                  <h3>
                    <Link href={`/dashboard/webinars/${w.id}`} style={{ textDecoration: "none" }}>
                      {w.title}
                    </Link>
                  </h3>
                  <p className="muted small">
                    {formatTime(w.live_at!)} Irish time · {formatMinutes(w.duration_minutes ?? 60)} · Online
                  </p>
                  {w.description && <p className="small">{w.description}</p>}
                  <div className="actions">
                    {isJoinOpen(w) ? (
                      <a className="btn btn-gold btn-small" href={w.join_url!} target="_blank" rel="noopener noreferrer">
                        Join now
                      </a>
                    ) : (
                      <a className="btn btn-quiet btn-small" href={`/api/calendar/webinar/${w.id}`}>
                        Add to calendar
                      </a>
                    )}
                    <Link className="btn btn-quiet btn-small" href={`/dashboard/webinars/${w.id}`}>
                      Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty">
            <p>No live webinars are scheduled right now. You&apos;ll find new dates here as soon as they are announced.</p>
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Recordings</h2>
        </div>
        {recordings.length > 0 ? (
          <LibraryList items={recordings} completed={completed} base="/dashboard/webinars" />
        ) : (
          <div className="empty">
            <p>Recordings of past webinars will appear here.</p>
          </div>
        )}
      </section>
    </>
  );
}
