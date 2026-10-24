import "server-only";
import Stripe from "stripe";
import { config } from "@/lib/config";

let client: Stripe | null = null;

export function stripe() {
  if (!config.stripeSecretKey) throw new Error("STRIPE_SECRET_KEY is not set");
  client ??= new Stripe(config.stripeSecretKey);
  return client;
}
