import { NextResponse, type NextRequest } from "next/server";
import { isDemo } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  if (!isDemo) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  return NextResponse.redirect(url, { status: 303 });
}
