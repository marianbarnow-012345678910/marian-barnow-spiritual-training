import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { listMyBookings } from "@/lib/classes";
import { config } from "@/lib/config";
import { buildIcs, icsResponse } from "@/lib/ics";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUser();
  if (!user) return NextResponse.redirect(new URL("/login", config.siteUrl));

  const booking = (await listMyBookings(user.id)).find((b) => b.id === id);
  if (!booking) return new Response("Not found", { status: 404 });

  return icsResponse(
    buildIcs({
      uid: `booking-${booking.id}`,
      title: `${booking.session_name} with Marian Barnow`,
      start: booking.starts_at,
      end: booking.ends_at,
      location: booking.location ?? config.studioAddress,
      description: `Your place is booked. See your bookings: ${config.siteUrl}/dashboard/bookings`,
      url: `${config.siteUrl}/dashboard/bookings`,
    }),
    booking.session_name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  );
}
