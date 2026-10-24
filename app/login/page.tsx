import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { SignInForm } from "@/components/AuthForms";
import { isDemo } from "@/lib/config";

export const metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const next = sp.next?.startsWith("/") ? sp.next : "/dashboard";
  return (
    <AuthShell>
      <div style={{ display: "grid", gap: 8 }}>
        <h1>Welcome back</h1>
        <p className="muted">Sign in to your meditations, webinars and class bookings.</p>
      </div>
      {isDemo && <p className="notice small">Demo mode: any e-mail and password will open the portal with sample content.</p>}
      <SignInForm next={next} linkError={sp.error === "link"} demo={isDemo} />
      <p className="auth-foot">
        New here?{" "}
        <Link className="link" href="/signup">
          Create a free account
        </Link>
      </p>
    </AuthShell>
  );
}
