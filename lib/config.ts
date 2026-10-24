export const config = {
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  momence: {
    clientId: process.env.MOMENCE_CLIENT_ID || "",
    clientSecret: process.env.MOMENCE_CLIENT_SECRET || "",
    username: process.env.MOMENCE_USERNAME || "",
    password: process.env.MOMENCE_PASSWORD || "",
    locationId: process.env.MOMENCE_LOCATION_ID ? Number(process.env.MOMENCE_LOCATION_ID) : undefined,
    daysAhead: Number(process.env.MOMENCE_DAYS_AHEAD || 60),
  },
  defaultPriceCents: Number(process.env.DEFAULT_CLASS_PRICE_CENTS || 2000),
  currency: (process.env.DEFAULT_CURRENCY || "eur").toLowerCase(),
  studioAddress: process.env.STUDIO_ADDRESS || "Dublin 2",
  timeZone: "Europe/Dublin",
  brand: "Marian Barnow Spiritual Training",
};

/** Demo mode: no Supabase configured → sample data, a pretend user, no real payments. */
export const isDemo = !config.supabaseUrl || !config.supabaseAnonKey;

export const momenceConfigured = Boolean(
  config.momence.clientId && config.momence.clientSecret && config.momence.username && config.momence.password,
);

export const stripeConfigured = Boolean(config.stripeSecretKey);
