import "server-only";
import { isDemo } from "@/lib/config";
import { demoContent } from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/server";
import type { ContentItem, ContentKind } from "@/lib/types";

export async function listContent(kind: ContentKind): Promise<ContentItem[]> {
  if (isDemo) return demoContent.filter((c) => c.kind === kind && c.published);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_items")
    .select("*")
    .eq("kind", kind)
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ContentItem[];
}

export async function getContent(id: string): Promise<ContentItem | null> {
  if (isDemo) return demoContent.find((c) => c.id === id) ?? null;
  const supabase = await createClient();
  const { data } = await supabase.from("content_items").select("*").eq("id", id).maybeSingle();
  return (data as ContentItem) ?? null;
}

/** IDs of items the visitor has marked as done. */
export async function listCompleted(userId: string): Promise<Set<string>> {
  if (isDemo) return new Set(["m2"]);
  const supabase = await createClient();
  const { data } = await supabase.from("content_completions").select("content_id").eq("user_id", userId);
  return new Set((data ?? []).map((r) => r.content_id as string));
}

/** Webinars split into upcoming live sessions and recordings. */
export function splitWebinars(items: ContentItem[], now = new Date()) {
  const upcoming: ContentItem[] = [];
  const recordings: ContentItem[] = [];
  for (const item of items) {
    if (item.live_at) {
      const end = new Date(item.live_at).getTime() + (item.duration_minutes ?? 60) * 60000;
      if (end > now.getTime()) {
        upcoming.push(item);
        continue;
      }
    }
    if (item.media_url || !item.live_at) recordings.push(item);
  }
  upcoming.sort((a, b) => new Date(a.live_at!).getTime() - new Date(b.live_at!).getTime());
  return { upcoming, recordings };
}

/** The join link opens 15 minutes before a live webinar and stays open until it ends. */
export function isJoinOpen(item: ContentItem, now = new Date()) {
  if (!item.live_at || !item.join_url) return false;
  const start = new Date(item.live_at).getTime();
  const end = start + (item.duration_minutes ?? 60) * 60000;
  return now.getTime() >= start - 15 * 60000 && now.getTime() <= end;
}
