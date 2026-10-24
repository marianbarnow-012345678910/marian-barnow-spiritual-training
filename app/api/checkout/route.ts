import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { getClass, spotsLeft } from "@/lib/classes";
import { config, isDemo, stripeConfigured } from "@/lib/config";
import { formatDateTime } from "@/lib/format";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  const { sessionId } = (await request.json().catch(() => ({}))) as { sessionId?: number };
  if (!sessionId) return NextResponse.json({ error: "No class selected." }, { status: 400 });

  if (isDemo || !stripeConfigured) {
    return NextResponse.json(
      { error: "Payments are switched off in the demo. Add your Stripe and Supabase keys to take real bookings." },
      { status: 400 },
    );
  }

  const session = await getClass(Number(sessionId)).catch(() => null);
  if (!session) return NextResponse.json({ error: "This class no longer exists." }, { status: 404 });
  if (new Date(session.startsAt).getTime() < Date.now()) {
    return NextResponse.json({ error: "This class has already started." }, { status: 400 });
  }
  if (spotsLeft(session) === 0) {
    return NextResponse.json({ error: "This class is full." }, { status: 409 });
  }

  const db = createAdminClient();

  const { data: existing } = await db
    .from("bookings")
    .select("id")
    .eq("user_id", user.id)
    .eq("momence_session_id", session.id)
    .in("status", ["confirmed", "needs_attention"])
    .limit(1);
  if (existing?.length) return NextResponse.json({ error: "You already have a place in this class." }, { status: 409 });

  const { data: booking, error } = await db
    .from("bookings")
    .insert({
      user_id: user.id,
      momence_session_id: session.id,
      session_name: session.name,
      starts_at: session.startsAt,
      ends_at: session.endsAt,
      location: session.location ?? config.studioAddress,
      amount_cents: session.priceCents,
      currency: session.currency,
      status: "pending",
    })
    .select("id")
    .single();
  if (error || !booking) {
    console.error(error);
    return NextResponse.json({ error: "Could not start the booking. Please try again." }, { status: 500 });
  }

  const checkout = await stripe().checkout.sessions.create({
    mode: "payment",
    customer_email: user.email,
    client_reference_id: booking.id,
    metadata: { booking_id: booking.id, user_id: user.id, momence_session_id: String(session.id) },
    payment_intent_data: {
      description: `${session.name} — ${formatDateTime(session.startsAt)}`,
      metadata: { booking_id: booking.id, momence_session_id: String(session.id) },
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: session.currency,
          unit_amount: session.priceCents,
          product_data: {
            name: session.name,
            description: `${formatDateTime(session.startsAt)} · ${session.location ?? config.studioAddress}`,
          },
        },
      },
    ],
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    success_url: `${config.siteUrl}/dashboard/bookings?booked=${booking.id}`,
    cancel_url: `${config.siteUrl}/dashboard/classes?cancelled=1`,
  });

  await db.from("bookings").update({ stripe_checkout_id: checkout.id }).eq("id", booking.id);

  return NextResponse.json({ url: checkout.url });
}
