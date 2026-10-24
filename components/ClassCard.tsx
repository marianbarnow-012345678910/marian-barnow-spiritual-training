import { BookButton } from "@/components/BookButton";
import { Icon } from "@/components/Icons";
import { spotsLeft } from "@/lib/classes";
import { dayParts, formatMinutes, formatPrice, formatTime } from "@/lib/format";
import type { ClassSession } from "@/lib/types";

export function DateBox({ iso }: { iso: string }) {
  const p = dayParts(iso);
  return (
    <div className="datebox" aria-hidden="true">
      <span className="wd">{p.weekday}</span>
      <span className="d">{p.day}</span>
      <span className="m">{p.month}</span>
    </div>
  );
}

export function ClassCard({ session, booked, compact = false }: { session: ClassSession; booked: boolean; compact?: boolean }) {
  const left = spotsLeft(session);
  const full = left === 0;
  const end = formatTime(session.endsAt);

  return (
    <article className={`class${full && !booked ? " is-full" : ""}`}>
      <DateBox iso={session.startsAt} />
      <div className="body">
        <h3 className="name">{session.name}</h3>
        <div className="facts">
          <span>
            {formatTime(session.startsAt)}–{end}
          </span>
          <span>{formatMinutes(session.durationInMinutes)}</span>
          {session.location && <span>{session.location}</span>}
          {session.teacher && <span>with {session.teacher}</span>}
        </div>
        {!compact && session.description && <p className="about">{session.description}</p>}
      </div>
      <div className="buy">
        <div>
          <div className="price">{formatPrice(session.priceCents, session.currency)}</div>
          {left !== null && !booked && (
            <div className={`spots${left > 0 && left <= 3 ? " low" : ""}`}>
              {full ? "Full" : left === 1 ? "1 place left" : `${left} places left`}
            </div>
          )}
        </div>
        {booked ? (
          <span className="booked-tag">
            <Icon.check /> You&apos;re booked
          </span>
        ) : full ? (
          <button className="btn btn-quiet" disabled>
            Fully booked
          </button>
        ) : (
          <BookButton sessionId={session.id} label="Book my place" />
        )}
      </div>
    </article>
  );
}
