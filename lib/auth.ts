import "server-only";
import { redirect } from "next/navigation";
import { isDemo } from "@/lib/config";
import { demoUser } from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/server";
import type { PortalUser } from "@/lib/types";

export async function getUser(): Promise<PortalUser | null> {
  if (isDemo) return demoUser;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, is_admin")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: profile?.full_name || (user.user_metadata?.full_name as string) || "",
    isAdmin: Boolean(profile?.is_admin),
  };
}

export async function requireUser(): Promise<PortalUser> {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin(): Promise<PortalUser> {
  const user = await requireUser();
  if (!user.isAdmin) redirect("/dashboard");
  return user;
}

export function firstName(user: PortalUser) {
  return user.fullName.trim().split(/\s+/)[0] || "";
}
