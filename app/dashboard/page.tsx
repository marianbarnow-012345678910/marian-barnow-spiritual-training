import Link from "next/link";
import { ClassCard } from "@/components/ClassCard";
import { LibraryList } from "@/components/LibraryList";
import { SeedOfLife } from "@/components/SeedOfLife";
import { TeacherCard } from "@/components/SiteCards";
import { firstName, requireUser } from "@/lib/auth";
import { listClasses, listMyBookings } from "@/lib/classes";
import { isJoinOpen, listCompleted, listContent, splitWebinars } from "@/lib/content";
import { formatDateTime, greeting } from "@/lib/format";
import { googleCalendarUrl } from "@/lib/ics";

export const metadata = { title: "Home" };

export default async function DashboardHome({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const user = await requireUser();
  const [meditations, webinars, completed, bookings, schedule] = await Promise.all([
    listContent("meditation"),
    listContent("webinar"),
    listCompleted(user.id),
    listMyBookings(user.id),
    listClasses(),
  ]);

  const now = Date.now();
  const nextBooking = bookings.find((b) => b.status !== "cancelled" && new Date(b.ends_at).getTime() > now);
  const { upcoming } = splitWebinars(webinars);
  const nextWebinar = upcoming[0];
  const bookedIds = new Set(bookings.filter((b) => b.status !== "cancelled").map((b) => b.momence_session_id));
  const suggestedClasses = schedule.sessions.filter((s) => !bookedIds.has(s.id)).slice(0, 2);

  const fresh = [...meditations.filter((m) => !completed.has(m.id)), ...meditations.filter((m) => completed.has(m.id))].slice(0, 3);
  const name = firstName(user);

  return (
    <>
      {sp.password === "updated" && (
        <p className="notice notice-ok" style={{ marginBottom: 20 }}>
          Your new password is saved.
        </p>
      )}

      <section className="welcome">
        <SeedOfLife className="seed" strokeWidth={0.7} />
        <h1>
          {greeting()}
          {name ? `, ${name}` : ""}
        </h1>
        <p>
          {completed.size > 0
            ? `You've completed ${completed.size} ${completed.size === 1 ? "practice" : "practices"} so far. Pick up where you left off, or try something new.`
            : "Everything here is yours to use freely. Start with a short meditation below."}
        </p>
      </section>

      {(nextBooking || nextWebinar) && (
        <div className="next-up">
          {nextBooking && (
            <div className="next-item">
              <span className="kind">Your next class</span>
              <h3>{nextBooking.session_name}</h3>
              <p className="when">
                {formatDateTime(nextBooking.starts_at)}
                {nextBooking.location ? ` · ${nextBooking.location}` : ""}
              </p>
              <div className="actions">
                <a className="btn btn-quiet btn-small" href={`/api/calendar/booking/${nextBooking.id}`}>
                  Add to calendar
                </a>
                <Link className="btn btn-quiet btn-small" href="/dashboard/bookings">
                  All bookings
                </Link>
              </div>
            </div>
          )}
          {nextWebinar && (
            <div className="next-item">
              <span className="kind">Next live webinar</span>
              <h3>{nextWebinar.title}</h3>
              <p className="when">{formatDateTime(nextWebinar.live_at!)} · Online</p>
              <div className="actions">
                {isJoinOpen(nextWebinar) ? (
                  <a className="btn btn-gold btn-small" href={nextWebinar.join_url!} target="_blank" rel="noopener noreferrer">
                    Join now
                  </a>
                ) : (
                  <a
                    className="btn btn-quiet btn-small"
                    href={googleCalendarUrl({
                      title: `Live webinar: ${nextWebinar.title}`,
                      start: nextWebinar.live_at!,
                      end: new Date(new Date(nextWebinar.live_at!).getTime() + (nextWebinar.duration_minutes ?? 60) * 60000).toISOString(),
                      details: "Join from your Marian Barnow portal — the link opens 15 minutes before.",
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Add to Google Calendar
                  </a>
                )}
                <Link className="btn btn-quiet btn-small" href={`/dashboard/webinars/${nextWebinar.id}`}>
                  Details
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {fresh.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Meditate today</h2>
            <Link className="link" href="/dashboard/meditations">
              All meditations
            </Link>
          </div>
          <LibraryList items={fresh} completed={completed} base="/dashboard/meditations" />
        </section>
      )}

      {suggestedClasses.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Coming up in Dublin</h2>
            <Link className="link" href="/dashboard/classes">
              Full class calendar
            </Link>
          </div>
          <div className="classes">
            {suggestedClasses.map((s) => (
              <ClassCard key={s.id} session={s} booked={false} compact />
            ))}
          </div>
        </section>
      )}

      <TeacherCard />
    </>
  );
}
