"use server";

import { redirect } from "next/navigation";
import { config, isDemo } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error?: string; message?: string } | undefined;

function safeNext(value: FormDataEntryValue | null) {
  const v = typeof value === "string" ? value : "";
  return v.startsWith("/") && !v.startsWith("//") ? v : "/dashboard";
}

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const next = safeNext(formData.get("next"));
  if (isDemo) redirect(next);

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!email || !password) return { error: "Enter your e-mail and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.message.toLowerCase().includes("confirm")) {
      return { error: "Please confirm your e-mail first — check your inbox for the link we sent." };
    }
    return { error: "That e-mail and password don't match. Try again or reset your password." };
  }
  redirect(next);
}

export async function signUp(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isDemo) redirect("/dashboard");

  const fullName = String(formData.get("full_name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!fullName) return { error: "Enter your name." };
  if (!email) return { error: "Enter your e-mail." };
  if (password.length < 8) return { error: "Choose a password with at least 8 characters." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${config.siteUrl}/auth/callback?next=/dashboard`,
    },
  });
  if (error) {
    if (error.message.toLowerCase().includes("registered")) {
      return { error: "There is already an account with this e-mail. Sign in instead." };
    }
    return { error: error.message };
  }
  if (data.session) redirect("/dashboard");
  return { message: `Almost there. We sent a confirmation link to ${email} — open it to activate your account.` };
}

export async function requestReset(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isDemo) return { message: "In the demo no e-mails are sent." };
  const email = String(formData.get("email") || "").trim();
  if (!email) return { error: "Enter your e-mail." };

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${config.siteUrl}/auth/callback?next=/reset-password`,
  });
  // Same answer whether or not the account exists.
  return { message: `If there is an account for ${email}, a link to set a new password is on its way.` };
}

export async function updatePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isDemo) redirect("/dashboard");
  const password = String(formData.get("password") || "");
  if (password.length < 8) return { error: "Choose a password with at least 8 characters." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: "The reset link has expired. Request a new one." };
  redirect("/dashboard?password=updated");
}
