import "server-only";
import { config, isDemo, momenceConfigured } from "@/lib/config";
import { demoBookings, demoSessions } from "@/lib/demo-data";
import { getSession, listUpcomingSessions, type MomenceSession } from "@/lib/momence";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Booking, ClassPricing, ClassSession } from "@/lib/types";

async function loadPricing(): Promise<ClassPricing[]> {
  if (isDemo || !config.supabaseServiceKey) return [];
  const { data } = await createAdminClient().from("class_pricing").select("*").eq("active", true);
  // Longer (more specific) matches win: "Sacred Geometry 1" before "Sacred Geometry".
  return ((data ?? []) as ClassPricing[]).sort((a, b) => b.name_match.length - a.name_match.length);
}

function priceFor(name: string, pricing: ClassPricing[]) {
  const lower = name.toLowerCase();
  const rule = pricing.find((p) => lower.includes(p.name_match.toLowerCase()));
  return rule
    ? { priceCents: rule.price_cents, currency: rule.currency.toLowerCase() }
    : { priceCents: config.defaultPriceCents, currency: config.currency };
}

function toClassSession(s: MomenceSession, pricing: ClassPricing[]): ClassSession {
  return {
    id: s.id,
    name: s.name,
    description: s.description,
    startsAt: s.startsAt,
    endsAt: s.endsAt,
    durationInMinutes: s.durationInMinutes,
    capacity: s.capacity,
    bookingCount: s.bookingCount,
    teacher: s.teacher ? `${s.teacher.firstName} ${s.teacher.lastName}`.trim() : null,
    location: s.inPersonLocation?.name ?? null,
    bannerImageUrl: s.bannerImageUrl,
    ...priceFor(s.name, pricing),
  };
}

export type ScheduleResult =
  | { ok: true; sessions: ClassSession[]; source: "momence" | "demo" }
  | { ok: false; sessions: ClassSession[]; message: string };

export async function listClasses(): Promise<ScheduleResult> {
  if (!momenceConfigured) return { ok: true, sessions: demoSessions, source: "demo" };
  try {
    const [sessions, pricing] = await Promise.all([listUpcomingSessions(), loadPricing()]);
    return { ok: true, sessions: sessions.map((s) => toClassSession(s, pricing)), source: "momence" };
  } catch (e) {
    console.error(e);
    return { ok: false, sessions: [], message: "The class calendar could not be loaded right now." };
  }
}

export async function getClass(id: number): Promise<ClassSession | null> {
  if (!momenceConfigured) return demoSessions.find((s) => s.id === id) ?? null;
  const [s, pricing] = await Promise.all([getSession(id), loadPricing()]);
  if (s.isCancelled || s.isDraft || !s.isInPerson) return null;
  return toClassSession(s, pricing);
}

export function spotsLeft(s: ClassSession) {
  if (s.capacity == null) return null;
  return Math.max(0, s.capacity - s.bookingCount);
}

export async function listMyBookings(userId: string): Promise<Booking[]> {
  if (isDemo) return demoBookings;
  const supabase = await createClient();
  const { data } = await supabase
    .from("bookings")
    .select("*")
    .eq("user_id", userId)
    .neq("status", "pending")
    .order("starts_at", { ascending: true });
  return (data ?? []) as Booking[];
}
