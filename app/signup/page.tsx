import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { SignUpForm } from "@/components/AuthForms";
import { isDemo } from "@/lib/config";

export const metadata = { title: "Create your account" };

export default function SignUpPage() {
  return (
    <AuthShell>
      <div style={{ display: "grid", gap: 8 }}>
        <h1>Create your free account</h1>
        <p className="muted">
          Get every guided meditation and webinar recording, join live sessions, and book your place in classes in
          Dublin.
        </p>
      </div>
      <SignUpForm demo={isDemo} />
      <p className="auth-foot">
        Already have an account?{" "}
        <Link className="link" href="/login">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
