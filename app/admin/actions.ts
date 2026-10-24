"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { isDemo } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";

type S = { error?: string; message?: string } | undefined;

function str(fd: FormData, key: string) {
  const v = String(fd.get(key) ?? "").trim();
  return v === "" ? null : v;
}

/** datetime-local value is entered in Irish time; convert to an ISO instant. */
function dublinLocalToIso(value: string | null) {
  if (!value) return null;
  const [date, time] = value.split("T");
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  const tzName = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Dublin", timeZoneName: "shortOffset" })
    .formatToParts(new Date(guess))
    .find((p) => p.type === "timeZoneName")?.value ?? "GMT";
  const match = tzName.match(/GMT([+-]\d+)?(?::(\d+))?/);
  const offsetMin = match?.[1] ? Number(match[1]) * 60 + (match[2] ? Math.sign(Number(match[1])) * Number(match[2]) : 0) : 0;
  return new Date(guess - offsetMin * 60000).toISOString();
}

export async function saveContent(_prev: S, fd: FormData): Promise<S> {
  await requireAdmin();
  if (isDemo) return { message: "Demo mode — nothing is saved. Connect Supabase to manage real content." };

  const id = str(fd, "id");
  const kind = str(fd, "kind");
  const title = str(fd, "title");
  if (kind !== "meditation" && kind !== "webinar") return { error: "Choose meditation or webinar." };
  if (!title) return { error: "Give it a title." };

  const row = {
    kind,
    title,
    description: str(fd, "description"),
    media_url: str(fd, "media_url"),
    thumbnail_url: str(fd, "thumbnail_url"),
    duration_minutes: str(fd, "duration_minutes") ? Number(str(fd, "duration_minutes")) : null,
    theme: str(fd, "theme"),
    live_at: kind === "webinar" ? dublinLocalToIso(str(fd, "live_at")) : null,
    join_url: kind === "webinar" ? str(fd, "join_url") : null,
    published: fd.get("published") === "on",
    sort_order: Number(str(fd, "sort_order") ?? 0),
  };

  const db = createAdminClient();
  const { error } = id ? await db.from("content_items").update(row).eq("id", id) : await db.from("content_items").insert(row);
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/admin?saved=1");
}

export async function deleteContent(fd: FormData) {
  await requireAdmin();
  if (isDemo) return;
  await createAdminClient().from("content_items").delete().eq("id", String(fd.get("id")));
  revalidatePath("/", "layout");
  redirect("/admin?deleted=1");
}

export async function addPrice(_prev: S, fd: FormData): Promise<S> {
  await requireAdmin();
  if (isDemo) return { message: "Demo mode — nothing is saved." };
  const nameMatch = str(fd, "name_match");
  const euros = Number(String(fd.get("price") ?? "").replace(",", "."));
  if (!nameMatch) return { error: "Enter the class name as it appears in Momence." };
  if (!Number.isFinite(euros) || euros < 0) return { error: "Enter a price, e.g. 20 or 49.50." };
  const { error } = await createAdminClient()
    .from("class_pricing")
    .insert({ name_match: nameMatch, price_cents: Math.round(euros * 100) });
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { message: `${nameMatch} is now priced at €${euros}.` };
}

export async function deletePrice(fd: FormData) {
  await requireAdmin();
  if (isDemo) return;
  await createAdminClient().from("class_pricing").delete().eq("id", String(fd.get("id")));
  revalidatePath("/", "layout");
}

export async function resolveBooking(fd: FormData) {
  await requireAdmin();
  if (isDemo) return;
  await createAdminClient()
    .from("bookings")
    .update({ status: "confirmed", error: null })
    .eq("id", String(fd.get("id")));
  revalidatePath("/admin/bookings");
}
