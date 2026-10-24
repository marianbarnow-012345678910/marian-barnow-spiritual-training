import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";

export default function NotFound() {
  return (
    <AuthShell>
      <h1>This page isn&apos;t here</h1>
      <p className="muted">It may have been moved or taken offline.</p>
      <div>
        <Link className="btn" href="/dashboard">
          Go to your portal
        </Link>
      </div>
    </AuthShell>
  );
}
