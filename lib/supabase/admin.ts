import "server-only";
import { createClient } from "@supabase/supabase-js";
import { config } from "@/lib/config";

/** Service-role client. Bypasses row-level security — server code only. */
export function createAdminClient() {
  if (!config.supabaseServiceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  return createClient(config.supabaseUrl, config.supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
