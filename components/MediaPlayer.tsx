import { SeedOfLife } from "@/components/SeedOfLife";
import { resolveMedia } from "@/lib/media";

export function MediaPlayer({ url, title }: { url: string | null; title: string }) {
  const media = resolveMedia(url);

  if (!media) {
    return (
      <div className="player">
        <div className="player-empty">
          <SeedOfLife className="seed" />
          <p>The recording for this session will appear here.</p>
        </div>
      </div>
    );
  }

  if (media.kind === "embed") {
    return (
      <div className="player">
        <iframe
          src={media.src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  if (media.kind === "video") {
    return (
      <div className="player">
        <video src={media.src} controls preload="metadata" playsInline />
      </div>
    );
  }

  if (media.kind === "audio") {
    return (
      <div className="player">
        <div className="player-audio">
          <SeedOfLife className="seed" />
          <audio src={media.src} controls preload="metadata" />
        </div>
      </div>
    );
  }

  return (
    <div className="player">
      <div className="player-empty">
        <SeedOfLife className="seed" />
        <a className="btn btn-gold" href={media.src} target="_blank" rel="noopener noreferrer">
          Open the recording
        </a>
      </div>
    </div>
  );
}
