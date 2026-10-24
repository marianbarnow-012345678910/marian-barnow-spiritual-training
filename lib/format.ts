const TZ = "Europe/Dublin";

export function formatDay(iso: string) {
  return new Intl.DateTimeFormat("en-IE", { weekday: "long", day: "numeric", month: "long", timeZone: TZ }).format(
    new Date(iso),
  );
}

export function formatShortDay(iso: string) {
  return new Intl.DateTimeFormat("en-IE", { weekday: "short", day: "numeric", month: "short", timeZone: TZ }).format(
    new Date(iso),
  );
}

export function formatTime(iso: string) {
  return new Intl.DateTimeFormat("en-IE", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: TZ }).format(
    new Date(iso),
  );
}

export function formatDateTime(iso: string) {
  return `${formatDay(iso)}, ${formatTime(iso)}`;
}

/** Calendar key (YYYY-MM-DD in Dublin time) for grouping. */
export function dayKey(iso: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date(iso));
}

export function dayParts(iso: string) {
  const d = new Date(iso);
  return {
    weekday: new Intl.DateTimeFormat("en-IE", { weekday: "short", timeZone: TZ }).format(d),
    day: new Intl.DateTimeFormat("en-IE", { day: "numeric", timeZone: TZ }).format(d),
    month: new Intl.DateTimeFormat("en-IE", { month: "short", timeZone: TZ }).format(d),
  };
}

export function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export function formatMinutes(min: number | null | undefined) {
  if (!min) return "";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export function greeting(date = new Date()) {
  const hour = Number(new Intl.DateTimeFormat("en-IE", { hour: "numeric", hour12: false, timeZone: TZ }).format(date));
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
