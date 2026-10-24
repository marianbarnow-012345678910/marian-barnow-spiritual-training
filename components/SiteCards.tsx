/* eslint-disable @next/next/no-img-element */
import { SeedOfLife } from "@/components/SeedOfLife";
import { config } from "@/lib/config";
import { site } from "@/lib/site";

export function TeacherCard() {
  const t = site.teacher;
  return (
    <section className="teacher" aria-labelledby="teacher-heading">
      <div className="teacher-photo">
        {t.photo ? <img src={t.photo} alt={t.photoAlt} /> : <SeedOfLife className="seed" strokeWidth={0.8} />}
      </div>
      <div className="teacher-body">
        <h2 id="teacher-heading">Your teacher</h2>
        <p>{t.bio}</p>
        <a className="link" href={t.website} target="_blank" rel="noopener noreferrer">
          More about Marian
        </a>
      </div>
    </section>
  );
}

export function StudioCard() {
  const s = site.studio;
  return (
    <section className="studio" aria-labelledby="studio-heading">
      {s.photo && <img className="studio-photo" src={s.photo} alt={s.photoAlt} />}
      <div className="studio-body">
        <h2 id="studio-heading">{s.name}</h2>
        <p className="studio-address">{config.studioAddress}</p>
        <p className="muted">{s.note}</p>
        <a
          className="link small"
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.studioAddress)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open in Google Maps
        </a>
      </div>
    </section>
  );
}
