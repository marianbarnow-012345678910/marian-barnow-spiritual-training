import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { config } from "@/lib/config";
import { getContent } from "@/lib/content";
import { buildIcs, icsResponse } from "@/lib/ics";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUser();
  if (!user) return NextResponse.redirect(new URL("/login", config.siteUrl));

  const item = await getContent(id);
  if (!item || item.kind !== "webinar" || !item.live_at) return new Response("Not found", { status: 404 });

  const end = new Date(new Date(item.live_at).getTime() + (item.duration_minutes ?? 60) * 60000).toISOString();
  const page = `${config.siteUrl}/dashboard/webinars/${item.id}`;
  return icsResponse(
    buildIcs({
      uid: `webinar-${item.id}`,
      title: `Live webinar: ${item.title}`,
      start: item.live_at,
      end,
      location: "Online",
      description: `Join from your portal (the link opens 15 minutes before): ${page}`,
      url: page,
    }),
    "webinar",
  );
}
