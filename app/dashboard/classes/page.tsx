import { ClassCard } from "@/components/ClassCard";
import { StudioCard } from "@/components/SiteCards";
import { requireUser } from "@/lib/auth";
import { listClasses, listMyBookings } from "@/lib/classes";
import { config } from "@/lib/config";
import type { ClassSession } from "@/lib/types";

export const metadata = { title: "Classes in Dublin" };

function mondayOf(iso: string) {
  // Week grouping in Dublin time.
  const local = new Date(new Date(iso).toLocaleString("en-US", { timeZone: config.timeZone }));
  const day = (local.getDay() + 6) % 7;
  local.setHours(0, 0, 0, 0);
  local.setDate(local.getDate() - day);
  return local;
}

function weekLabel(monday: Date) {
  const thisMonday = mondayOf(new Date().toISOString());
  const diff = Math.round((monday.getTime() - thisMonday.getTime()) / (7 * 86400000));
  if (diff === 0) return "This week";
  if (diff === 1) return "Next week";
  return `Week of ${new Intl.DateTimeFormat("en-IE", { day: "numeric", month: "long" }).format(monday)}`;
}

export default async function ClassesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const user = await requireUser();
  const [schedule, bookings] = await Promise.all([listClasses(), listMyBookings(user.id)]);
  const booked = new Set(bookings.filter((b) => b.status !== "cancelled").map((b) => b.momence_session_id));

  const weeks = new Map<string, { label: string; sessions: ClassSession[] }>();
  for (const s of schedule.sessions) {
    const m = mondayOf(s.startsAt);
    const key = m.toISOString();
    if (!weeks.has(key)) weeks.set(key, { label: weekLabel(m), sessions: [] });
    weeks.get(key)!.sessions.push(s);
  }

  return (
    <>
      <header className="page-head">
        <h1>Classes in Dublin</h1>
        <p>
          Book your place here and pay securely by card — you&apos;ll get a confirmation and can add the class to your
          calendar.
        </p>
      </header>

      <StudioCard />

      {sp.cancelled && (
        <p className="notice" style={{ marginBottom: 24 }}>
          Checkout was cancelled and nothing was charged. Your place is not reserved yet.
        </p>
      )}
      {!schedule.ok && (
        <p className="notice notice-error" style={{ marginBottom: 24 }}>
          {schedule.message} Please try again in a few minutes.
        </p>
      )}

      {weeks.size > 0 ? (
        [...weeks.values()].map((w) => (
          <section key={w.label} className="week" aria-label={w.label}>
            <h2>{w.label}</h2>
            <div className="classes">
              {w.sessions.map((s) => (
                <ClassCard key={s.id} session={s} booked={booked.has(s.id)} />
              ))}
            </div>
          </section>
        ))
      ) : schedule.ok ? (
        <div className="empty">
          <p>New class dates are on their way. Meanwhile, the meditations and webinar recordings are open to you anytime.</p>
        </div>
      ) : null}
    </>
  );
}
