import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { config } from "@/lib/config";
import { addMemberToSession, findOrCreateMember } from "@/lib/momence";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Stripe → this endpoint after a client pays.
 * 1. Marks the booking as paid
 * 2. Finds or creates the client in Momence
 * 3. Adds them to the class roster in Momence
 * If Momence refuses, the booking is kept and flagged "needs attention" on the admin page.
 */
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(body, signature ?? "", config.stripeWebhookSecret);
  } catch (err) {
    console.error("Stripe signature check failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const db = createAdminClient();

  if (event.type === "checkout.session.expired") {
    const s = event.data.object as Stripe.Checkout.Session;
    const bookingId = s.metadata?.booking_id;
    if (bookingId) await db.from("bookings").delete().eq("id", bookingId).eq("status", "pending");
    return NextResponse.json({ received: true });
  }

  if (event.type !== "checkout.session.completed" && event.type !== "checkout.session.async_payment_succeeded") {
    return NextResponse.json({ received: true });
  }

  const s = event.data.object as Stripe.Checkout.Session;
  if (s.payment_status !== "paid") return NextResponse.json({ received: true });

  const bookingId = s.metadata?.booking_id;
  if (!bookingId) return NextResponse.json({ received: true });

  const { data: booking } = await db.from("bookings").select("*").eq("id", bookingId).maybeSingle();
  if (!booking || booking.status === "confirmed") return NextResponse.json({ received: true });

  const { data: profile } = await db.from("profiles").select("full_name").eq("id", booking.user_id).maybeSingle();
  const { data: authUser } = await db.auth.admin.getUserById(booking.user_id);
  const email = authUser.user?.email ?? s.customer_details?.email ?? s.customer_email ?? "";
  const fullName = (profile?.full_name || s.customer_details?.name || "").trim();
  const [firstName, ...rest] = fullName.split(/\s+/);

  try {
    const memberId = await findOrCreateMember({ email, firstName: firstName ?? "", lastName: rest.join(" ") });
    const momenceBookingId = await addMemberToSession(booking.momence_session_id, memberId);
    await db
      .from("bookings")
      .update({
        status: "confirmed",
        momence_member_id: memberId,
        momence_booking_id: momenceBookingId,
        stripe_payment_intent: typeof s.payment_intent === "string" ? s.payment_intent : null,
        error: null,
      })
      .eq("id", bookingId);
  } catch (err) {
    console.error("Momence booking failed", err);
    await db
      .from("bookings")
      .update({
        status: "needs_attention",
        stripe_payment_intent: typeof s.payment_intent === "string" ? s.payment_intent : null,
        error: err instanceof Error ? err.message.slice(0, 500) : "Unknown Momence error",
      })
      .eq("id", bookingId);
  }

  return NextResponse.json({ received: true });
}
