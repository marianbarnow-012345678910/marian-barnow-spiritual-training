"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Content", match: (p: string) => p === "/admin" || p.startsWith("/admin/content") },
  { href: "/admin/prices", label: "Class prices", match: (p: string) => p.startsWith("/admin/prices") },
  { href: "/admin/bookings", label: "Bookings", match: (p: string) => p.startsWith("/admin/bookings") },
];

export function AdminTabs() {
  const path = usePathname();
  return (
    <nav className="tabs" aria-label="Admin sections">
      {TABS.map((t) => (
        <Link key={t.href} href={t.href} aria-current={t.match(path) ? "page" : undefined}>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
