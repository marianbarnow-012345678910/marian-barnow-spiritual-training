import "server-only";
import { requireAdmin } from "@/lib/auth";
import { isDemo } from "@/lib/config";
import { demoBookings, demoContent } from "@/lib/demo-data";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Booking, ClassPricing, ContentItem } from "@/lib/types";

export async function adminListContent(): Promise<ContentItem[]> {
  await requireAdmin();
  if (isDemo) return demoContent;
  const { data } = await createAdminClient()
    .from("content_items")
    .select("*")
    .order("kind")
    .order("sort_order")
    .order("created_at", { ascending: false });
  return (data ?? []) as ContentItem[];
}

export async function adminGetContent(id: string): Promise<ContentItem | null> {
  await requireAdmin();
  if (isDemo) return demoContent.find((c) => c.id === id) ?? null;
  const { data } = await createAdminClient().from("content_items").select("*").eq("id", id).maybeSingle();
  return (data as ContentItem) ?? null;
}

export async function adminListPricing(): Promise<ClassPricing[]> {
  await requireAdmin();
  if (isDemo)
    return [
      { id: "p1", name_match: "Meditation Class", price_cents: 2000, currency: "eur", active: true },
      { id: "p2", name_match: "Spiritual Intuition", price_cents: 5000, currency: "eur", active: true },
      { id: "p3", name_match: "Sanctuary Meditation", price_cents: 5000, currency: "eur", active: true },
    ];
  const { data } = await createAdminClient().from("class_pricing").select("*").order("name_match");
  return (data ?? []) as ClassPricing[];
}

export type AdminBooking = Booking & { client_name: string; client_email: string };

export async function adminListBookings(): Promise<AdminBooking[]> {
  await requireAdmin();
  if (isDemo) return demoBookings.map((b) => ({ ...b, client_name: "Aoife Murphy", client_email: "demo@marianbarnow.com" }));
  const db = createAdminClient();
  const { data } = await db
    .from("bookings")
    .select("*")
    .neq("status", "pending")
    .gte("ends_at", new Date(Date.now() - 30 * 86400000).toISOString())
    .order("starts_at", { ascending: true })
    .limit(300);
  const bookings = (data ?? []) as Booking[];
  const ids = [...new Set(bookings.map((b) => b.user_id))];
  const { data: profiles } = ids.length
    ? await db.from("profiles").select("id, full_name").in("id", ids)
    : { data: [] as { id: string; full_name: string }[] };
  const names = new Map((profiles ?? []).map((p) => [p.id, p.full_name as string]));

  const emails = new Map<string, string>();
  await Promise.all(
    ids.map(async (id) => {
      const { data: u } = await db.auth.admin.getUserById(id);
      if (u.user?.email) emails.set(id, u.user.email);
    }),
  );
  return bookings.map((b) => ({ ...b, client_name: names.get(b.user_id) || "", client_email: emails.get(b.user_id) || "" }));
}

export async function adminCountClients(): Promise<number> {
  await requireAdmin();
  if (isDemo) return 1;
  const { count } = await createAdminClient().from("profiles").select("id", { count: "exact", head: true });
  return count ?? 0;
}
