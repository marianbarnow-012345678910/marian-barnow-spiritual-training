import Link from "next/link";
import { notFound } from "next/navigation";
import { CompleteForm } from "@/components/CompleteForm";
import { Icon } from "@/components/Icons";
import { MediaPlayer } from "@/components/MediaPlayer";
import { requireUser } from "@/lib/auth";
import { getContent, listCompleted } from "@/lib/content";
import { formatMinutes } from "@/lib/format";

export default async function MeditationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const [item, completed] = await Promise.all([getContent(id), listCompleted(user.id)]);
  if (!item || item.kind !== "meditation") notFound();
  const done = completed.has(item.id);

  return (
    <article className="detail">
      <Link className="back" href="/dashboard/meditations">
        ← All meditations
      </Link>
      <header style={{ display: "grid", gap: 10 }}>
        <h1>{item.title}</h1>
        <div className="detail-meta">
          {item.duration_minutes ? <span>{formatMinutes(item.duration_minutes)}</span> : null}
          {item.theme && <span>{item.theme}</span>}
          {done && (
            <span className="booked-tag">
              <Icon.check /> Completed
            </span>
          )}
        </div>
      </header>
      <MediaPlayer url={item.media_url} title={item.title} />
      {item.description && <p className="detail-body">{item.description}</p>}
      <div className="detail-actions">
        <CompleteForm contentId={item.id} done={done} />
      </div>
    </article>
  );
}
