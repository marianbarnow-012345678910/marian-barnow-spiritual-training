import type { Booking, ClassSession, ContentItem, PortalUser } from "@/lib/types";

/** Sample content used only in demo mode (no Supabase configured). */

export const demoUser: PortalUser = {
  id: "demo-user",
  email: "demo@marianbarnow.com",
  fullName: "Aoife Murphy",
  isAdmin: true,
};

function daysFromNow(days: number, hour: number, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

const created = "2026-09-01T10:00:00.000Z";

export const demoContent: ContentItem[] = [
  {
    id: "w-sacred-geometry-deep-dive",
    kind: "webinar",
    title: "Sacred Geometry Deep Dive",
    description:
      "An in-depth webinar on sacred geometry: the shapes and patterns that appear throughout nature, art and architecture, and how to work with them in your own spiritual practice.",
    media_url: "https://youtu.be/Qrx4AbqCYzA",
    thumbnail_url: null,
    duration_minutes: null,
    theme: "Sacred Geometry",
    live_at: null,
    join_url: null,
    published: true,
    sort_order: 1,
    created_at: created,
  },
  {
    id: "w-learn-to-meditate",
    kind: "webinar",
    title: "Learn to meditate, empty your mind, find inner peace & stillness",
    description:
      "A guided introduction to meditation: how to settle the body, quiet a busy mind, and find a place of inner peace and stillness you can return to every day.",
    media_url: "https://youtu.be/ZHm_pqbxzlo",
    thumbnail_url: null,
    duration_minutes: null,
    theme: "Meditation",
    live_at: null,
    join_url: null,
    published: true,
    sort_order: 2,
    created_at: created,
  },
];

function session(
  id: number,
  name: string,
  days: number,
  hour: number,
  minutes: number,
  priceCents: number,
  capacity: number,
  booked: number,
  description: string,
): ClassSession {
  const startsAt = daysFromNow(days, hour);
  return {
    id,
    name,
    description,
    startsAt,
    endsAt: new Date(new Date(startsAt).getTime() + minutes * 60000).toISOString(),
    durationInMinutes: minutes,
    capacity,
    bookingCount: booked,
    teacher: "Marian Barnow",
    location: "Dublin 2 studio",
    bannerImageUrl: null,
    priceCents,
    currency: "eur",
  };
}

export const demoSessions: ClassSession[] = [
  session(9001, "Meditation Class", 2, 19, 75, 2000, 14, 6, "A guided group meditation in the studio. No experience needed — cushions and chairs provided."),
  session(9002, "Spiritual Intuition", 5, 18, 120, 5000, 12, 9, "Learn to recognise and trust the quiet signals you already receive."),
  session(9003, "Meditation Class", 9, 19, 75, 2000, 14, 2, "A guided group meditation in the studio. No experience needed — cushions and chairs provided."),
  session(9004, "Sanctuary Meditation", 12, 11, 120, 5000, 12, 12, "Build an inner sanctuary you can return to whenever you need rest and guidance."),
  session(9005, "Meditation Class", 16, 19, 75, 2000, 14, 0, "A guided group meditation in the studio. No experience needed — cushions and chairs provided."),
];

export const demoBookings: Booking[] = [
  {
    id: "b1",
    user_id: demoUser.id,
    momence_session_id: 9002,
    session_name: "Spiritual Intuition",
    starts_at: demoSessions[1].startsAt,
    ends_at: demoSessions[1].endsAt,
    location: "Dublin 2 studio",
    amount_cents: 5000,
    currency: "eur",
    status: "confirmed",
    stripe_checkout_id: null,
    momence_member_id: null,
    momence_booking_id: null,
    error: null,
    created_at: created,
  },
];
