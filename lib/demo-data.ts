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
    id: "m1",
    kind: "meditation",
    title: "Grounding into the Earth",
    description:
      "A gentle practice to bring your awareness down through the body and root it into the earth. Use it in the morning or whenever your mind is racing ahead of you.",
    media_url: null,
    thumbnail_url: null,
    duration_minutes: 12,
    theme: "Grounding",
    live_at: null,
    join_url: null,
    published: true,
    sort_order: 1,
    created_at: created,
  },
  {
    id: "m2",
    kind: "meditation",
    title: "Breath of the Heart",
    description:
      "Slow, rhythmic breathing into the heart centre. A short reset you can do at your desk between sessions.",
    media_url: null,
    thumbnail_url: null,
    duration_minutes: 8,
    theme: "Breath",
    live_at: null,
    join_url: null,
    published: true,
    sort_order: 2,
    created_at: created,
  },
  {
    id: "m3",
    kind: "meditation",
    title: "Clearing the Energy Field",
    description:
      "Visualise light moving through and around your body, washing away what you have picked up from other people during the day.",
    media_url: null,
    thumbnail_url: null,
    duration_minutes: 20,
    theme: "Energy",
    live_at: null,
    join_url: null,
    published: true,
    sort_order: 3,
    created_at: created,
  },
  {
    id: "m4",
    kind: "meditation",
    title: "Evening Release",
    description: "Let the day go before sleep. Lie down for this one.",
    media_url: null,
    thumbnail_url: null,
    duration_minutes: 15,
    theme: "Sleep",
    live_at: null,
    join_url: null,
    published: true,
    sort_order: 4,
    created_at: created,
  },
  {
    id: "w1",
    kind: "webinar",
    title: "The Language of Creation: an introduction to Sacred Geometry",
    description:
      "Why the same shapes appear in flowers, shells, temples and the human body, and how working with them can support your own practice. Live Q&A at the end.",
    media_url: null,
    thumbnail_url: null,
    duration_minutes: 60,
    theme: "Sacred Geometry",
    live_at: daysFromNow(6, 19, 30),
    join_url: "https://zoom.us/j/0000000000",
    published: true,
    sort_order: 1,
    created_at: created,
  },
  {
    id: "w2",
    kind: "webinar",
    title: "What happens in a Life Activation?",
    description:
      "A walk through the session from start to finish: what you will feel, how to prepare, and what people notice in the weeks afterwards.",
    media_url: null,
    thumbnail_url: null,
    duration_minutes: 45,
    theme: "Healing",
    live_at: null,
    join_url: null,
    published: true,
    sort_order: 2,
    created_at: created,
  },
  {
    id: "w3",
    kind: "webinar",
    title: "Protecting your energy as a sensitive person",
    description: "Practical tools for people who feel everything in a room.",
    media_url: null,
    thumbnail_url: null,
    duration_minutes: 50,
    theme: "Energy",
    live_at: null,
    join_url: null,
    published: true,
    sort_order: 3,
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
