export type ContentKind = "meditation" | "webinar";

export interface ContentItem {
  id: string;
  kind: ContentKind;
  title: string;
  description: string | null;
  media_url: string | null;
  thumbnail_url: string | null;
  duration_minutes: number | null;
  theme: string | null;
  /** Webinars only: when the live session starts. Null for recordings. */
  live_at: string | null;
  /** Webinars only: Zoom / Meet link for the live session. */
  join_url: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
}

export interface ClassSession {
  id: number;
  name: string;
  description: string | null;
  startsAt: string;
  endsAt: string;
  durationInMinutes: number;
  capacity: number | null;
  bookingCount: number;
  teacher: string | null;
  location: string | null;
  bannerImageUrl: string | null;
  priceCents: number;
  currency: string;
}

export type BookingStatus = "pending" | "confirmed" | "needs_attention" | "cancelled";

export interface Booking {
  id: string;
  user_id: string;
  momence_session_id: number;
  session_name: string;
  starts_at: string;
  ends_at: string;
  location: string | null;
  amount_cents: number;
  currency: string;
  status: BookingStatus;
  stripe_checkout_id: string | null;
  momence_member_id: number | null;
  momence_booking_id: number | null;
  error: string | null;
  created_at: string;
}

export interface PortalUser {
  id: string;
  email: string;
  fullName: string;
  isAdmin: boolean;
}

export interface ClassPricing {
  id: string;
  name_match: string;
  price_cents: number;
  currency: string;
  active: boolean;
}
