import Link from "next/link";
import { DateBox } from "@/components/ClassCard";
import { Icon } from "@/components/Icons";
import { requireUser } from "@/lib/auth";
import { listMyBookings } from "@/lib/classes";
import { formatPrice, formatTime } from "@/lib/format";
import { googleCalendarUrl } from "@/lib/ics";
import type { Booking } from "@/lib/types";

export const metadata = { title: "My bookings" };

const STATUS: Record<Booking["status"], string> = {
  pending: "Waiting for payment",
  confirmed: "Confirmed",
  needs_attention: "Paid — Marian is confirming your place",
  cancelled: "Cancelled",
};

export default async function BookingsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const user = await requireUser();
  const bookings = await listMyBookings(user.id);
  const now = Date.now();
  const upcoming = bookings.filter((b) => new Date(b.ends_at).getTime() >= now);
  const past = bookings.filter((b) => new Date(b.ends_at).getTime() < now).reverse();
  const justBooked = sp.booked ? bookings.find((b) => b.id === sp.booked) : undefined;

  return (
    <>
      <header className="page-head">
        <h1>My bookings</h1>
        <p>Your places in classes in Dublin. Add them to your calendar so you get a reminder.</p>
      </header>

      {sp.booked && (
        <p className="notice notice-ok" style={{ marginBottom: 24 }} role="status">
          {justBooked
            ? `Thank you — your place in ${justBooked.session_name} is booked. A receipt is on its way to your e-mail.`
            : "Thank you — your payment went through. Your booking will appear here within a minute; refresh the page if you don't see it yet."}
        </p>
      )}

      {upcoming.length > 0 ? (
        <div className="tickets">
          {upcoming.map((b) => (
            <Ticket key={b.id} booking={b} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <p>You have no upcoming classes booked.</p>
          <Link className="btn" href="/dashboard/classes">
            See the class calendar
          </Link>
        </div>
      )}

      {past.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Past classes</h2>
          </div>
          <div className="tickets">
            {past.map((b) => (
              <Ticket key={b.id} booking={b} past />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function Ticket({ booking: b, past = false }: { booking: Booking; past?: boolean }) {
  return (
    <article className={`ticket${past ? " past" : ""}`}>
      <DateBox iso={b.starts_at} />
      <div className="body">
        <span className={`status status-${b.status}`}>
          {b.status === "confirmed" && <Icon.check />}
          {past && b.status === "confirmed" ? "Attended" : STATUS[b.status]}
        </span>
        <h3>{b.session_name}</h3>
        <p className="muted small">
          {formatTime(b.starts_at)}–{formatTime(b.ends_at)}
          {b.location ? ` · ${b.location}` : ""} · {formatPrice(b.amount_cents, b.currency)} paid
        </p>
        {!past && b.status !== "cancelled" && (
          <div className="actions">
            <a className="btn btn-quiet btn-small" href={`/api/calendar/booking/${b.id}`}>
              Add to calendar (.ics)
            </a>
            <a
              className="btn btn-quiet btn-small"
              href={googleCalendarUrl({
                title: `${b.session_name} with Marian Barnow`,
                start: b.starts_at,
                end: b.ends_at,
                location: b.location ?? undefined,
              })}
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Calendar
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
