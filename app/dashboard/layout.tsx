import { Sidebar, TabBar, TopBar } from "@/components/Nav";
import { requireUser } from "@/lib/auth";
import { isDemo } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="shell">
      <Sidebar name={user.fullName || user.email} isAdmin={user.isAdmin} />
      <TopBar name={user.fullName || user.email} />
      <main className="main" id="main">
        {isDemo && (
          <p className="notice demo-banner">
            You&apos;re looking at the demo with sample content. Connect Supabase, Stripe and Momence (see README) to
            go live.
          </p>
        )}
        {children}
      </main>
      <TabBar />
    </div>
  );
}
