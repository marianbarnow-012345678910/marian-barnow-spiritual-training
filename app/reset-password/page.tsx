import { AuthShell } from "@/components/AuthShell";
import { NewPasswordForm } from "@/components/AuthForms";

export const metadata = { title: "Choose a new password" };

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <div style={{ display: "grid", gap: 8 }}>
        <h1>Choose a new password</h1>
        <p className="muted">You&apos;ll stay signed in on this device afterwards.</p>
      </div>
      <NewPasswordForm />
    </AuthShell>
  );
}
