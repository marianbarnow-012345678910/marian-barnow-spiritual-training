import Link from "next/link";
import { notFound } from "next/navigation";
import { CompleteForm } from "@/components/CompleteForm";
import { MediaPlayer } from "@/components/MediaPlayer";
import { requireUser } from "@/lib/auth";
import { getContent, isJoinOpen, listCompleted } from "@/lib/content";
import { formatDateTime, formatMinutes } from "@/lib/format";
import { googleCalendarUrl } from "@/lib/ics";

export default async function WebinarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const [item, completed] = await Promise.all([getContent(id), listCompleted(user.id)]);
  if (!item || item.kind !== "webinar") notFound();

  const start = item.live_at ? new Date(item.live_at) : null;
  const end = start ? new Date(start.getTime() + (item.duration_minutes ?? 60) * 60000) : null;
  const isUpcoming = Boolean(end && end.getTime() > Date.now());
  const open = isJoinOpen(item);

  return (
    <article className="detail">
      <Link className="back" href="/dashboard/webinars">
        ← All webinars
      </Link>
      <header style={{ display: "grid", gap: 10 }}>
        <h1>{item.title}</h1>
        <div className="detail-meta">
          {isUpcoming && start ? <span>Live {formatDateTime(start.toISOString())} Irish time</span> : <span>Recording</span>}
          {item.duration_minutes ? <span>{formatMinutes(item.duration_minutes)}</span> : null}
          {item.theme && <span>{item.theme}</span>}
        </div>
      </header>

      {isUpcoming && start && end ? (
        <div className="panel" style={{ maxWidth: "none" }}>
          {open ? (
            <>
              <p>The session is open. Come in a few minutes early so you can settle.</p>
              <div className="detail-actions">
                <a className="btn btn-gold" href={item.join_url!} target="_blank" rel="noopener noreferrer">
                  Join the live webinar
                </a>
              </div>
            </>
          ) : (
            <>
              <p>The join button appears on this page 15 minutes before the start. Save the date so you don&apos;t miss it.</p>
              <div className="detail-actions">
                <a className="btn" href={`/api/calendar/webinar/${item.id}`}>
                  Add to calendar (.ics)
                </a>
                <a
                  className="btn btn-quiet"
                  href={googleCalendarUrl({
                    title: `Live webinar: ${item.title}`,
                    start: start.toISOString(),
                    end: end.toISOString(),
                    details: "Join from your Marian Barnow portal — the link opens 15 minutes before.",
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Calendar
                </a>
              </div>
            </>
          )}
        </div>
      ) : (
        <MediaPlayer url={item.media_url} title={item.title} />
      )}

      {item.description && <p className="detail-body">{item.description}</p>}
      {!isUpcoming && (
        <div className="detail-actions">
          <CompleteForm contentId={item.id} done={completed.has(item.id)} />
        </div>
      )}
    </article>
  );
}
