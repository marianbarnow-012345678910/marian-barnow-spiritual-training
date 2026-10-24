import Link from "next/link";
import { AdminTabs } from "@/components/AdminTabs";
import { Sidebar, TabBar, TopBar } from "@/components/Nav";
import { requireAdmin } from "@/lib/auth";
import { isDemo } from "@/lib/config";

export const dynamic = "force-dynamic";

export const metadata = { title: "Manage portal" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return (
    <div className="shell">
      <Sidebar name={user.fullName || user.email} isAdmin />
      <TopBar name={user.fullName || user.email} />
      <main className="main" id="main">
        {isDemo && (
          <p className="notice demo-banner">Demo mode: you can look around, but changes are not saved.</p>
        )}
        <header className="page-head">
          <h1>Manage portal</h1>
          <p>Add meditations and webinars, set class prices, and check bookings.</p>
        </header>
        <AdminTabs />
        {children}
        <p className="small muted" style={{ marginTop: 40 }}>
          <Link className="link" href="/dashboard">
            Back to the client view
          </Link>
        </p>
      </main>
      <TabBar />
    </div>
  );
}

