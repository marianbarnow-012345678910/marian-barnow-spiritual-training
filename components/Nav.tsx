"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icons";
import { SeedOfLife } from "@/components/SeedOfLife";

const ITEMS = [
  { href: "/dashboard", label: "Home", short: "Home", icon: Icon.home },
  { href: "/dashboard/meditations", label: "Meditations", short: "Meditate", icon: Icon.meditate },
  { href: "/dashboard/webinars", label: "Webinars", short: "Webinars", icon: Icon.webinar },
  { href: "/dashboard/classes", label: "Classes in Dublin", short: "Classes", icon: Icon.calendar },
  { href: "/dashboard/bookings", label: "My bookings", short: "Bookings", icon: Icon.ticket },
];

function isActive(path: string, href: string) {
  return href === "/dashboard" ? path === href : path.startsWith(href);
}

export function Sidebar({ name, isAdmin }: { name: string; isAdmin: boolean }) {
  const path = usePathname();
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  return (
    <aside className="sidebar">
      <Link href="/dashboard" className="brand">
        Marian Barnow
        <small>Spiritual Training</small>
      </Link>
      <nav aria-label="Main">
        {ITEMS.map(({ href, label, icon: I }) => (
          <Link key={href} href={href} aria-current={isActive(path, href) ? "page" : undefined}>
            <I />
            {label}
          </Link>
        ))}
        {isAdmin && (
          <>
            <div className="divider" />
            <Link href="/admin" aria-current={path.startsWith("/admin") ? "page" : undefined}>
              <Icon.settings />
              Manage portal
            </Link>
          </>
        )}
      </nav>
      <Link href="/dashboard/account" className="me" aria-current={path.startsWith("/dashboard/account") ? "page" : undefined}>
        <span className="avatar">{initial}</span>
        <span>{name || "Your account"}</span>
      </Link>
      <SeedOfLife className="seed" />
    </aside>
  );
}

export function TopBar({ name }: { name: string }) {
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  return (
    <header className="topbar">
      <Link href="/dashboard" className="brand">
        <SeedOfLife strokeWidth={4} />
        Marian Barnow
      </Link>
      <Link href="/dashboard/account" className="avatar" aria-label="Your account">
        {initial}
      </Link>
    </header>
  );
}

export function TabBar() {
  const path = usePathname();
  return (
    <nav className="tabbar" aria-label="Main">
      {ITEMS.map(({ href, short, icon: I }) => (
        <Link key={href} href={href} aria-current={isActive(path, href) ? "page" : undefined}>
          <I />
          {short}
        </Link>
      ))}
    </nav>
  );
}
