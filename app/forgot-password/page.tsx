import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { ResetRequestForm } from "@/components/AuthForms";

export const metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <div style={{ display: "grid", gap: 8 }}>
        <h1>Reset your password</h1>
        <p className="muted">Enter the e-mail you signed up with and we&apos;ll send you a link to choose a new one.</p>
      </div>
      <ResetRequestForm />
      <p className="auth-foot">
        <Link className="link" href="/login">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
