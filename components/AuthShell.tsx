/* eslint-disable @next/next/no-img-element */
import { SeedOfLife } from "@/components/SeedOfLife";
import { site } from "@/lib/site";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth">
      <div className={`auth-art${site.signIn.photo ? " has-photo" : ""}`}>
        {site.signIn.photo && (
          <img className="auth-photo" src={site.signIn.photo} alt="" style={{ objectPosition: site.signIn.focus }} />
        )}
        <div className="brand">
          Marian Barnow
          <small>Spiritual Training · Dublin</small>
        </div>
        <p className="quote">
          A quiet place to keep practising between classes: guided meditations, webinars and your bookings, all in one
          room.
        </p>
        <SeedOfLife className="seed" strokeWidth={0.6} />
      </div>
      <main className="auth-main">
        <div className="auth-card">{children}</div>
      </main>
    </div>
  );
}
