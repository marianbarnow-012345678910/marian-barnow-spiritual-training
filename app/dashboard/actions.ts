"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { isDemo } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export async function toggleComplete(formData: FormData) {
  const user = await requireUser();
  if (isDemo) return;
  const contentId = String(formData.get("content_id"));
  const done = formData.get("done") === "1";
  const supabase = await createClient();
  if (done) {
    await supabase.from("content_completions").delete().eq("user_id", user.id).eq("content_id", contentId);
  } else {
    await supabase.from("content_completions").upsert({ user_id: user.id, content_id: contentId });
  }
  revalidatePath("/dashboard", "layout");
}

export async function updateProfile(_prev: { error?: string; message?: string } | undefined, formData: FormData) {
  const user = await requireUser();
  if (isDemo) return { message: "Saved (demo — nothing is stored)." };
  const fullName = String(formData.get("full_name") || "").trim();
  if (!fullName) return { error: "Enter your name." };
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id);
  if (error) return { error: "Could not save. Please try again." };
  await supabase.auth.updateUser({ data: { full_name: fullName } });
  revalidatePath("/dashboard", "layout");
  return { message: "Your name is saved." };
}

export async function changePassword(_prev: { error?: string; message?: string } | undefined, formData: FormData) {
  await requireUser();
  if (isDemo) return { message: "Password changed (demo — nothing is stored)." };
  const password = String(formData.get("password") || "");
  if (password.length < 8) return { error: "Choose a password with at least 8 characters." };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  return { message: "Your password is changed." };
}
