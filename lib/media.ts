export type Media =
  | { kind: "embed"; src: string }
  | { kind: "video"; src: string }
  | { kind: "audio"; src: string }
  | { kind: "link"; src: string };

/** Turn a YouTube / Vimeo / file link into something the player can show. */
export function resolveMedia(url: string | null | undefined): Media | null {
  if (!url) return null;
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\./, "");

  if (host === "youtube.com" || host === "m.youtube.com") {
    const id = u.searchParams.get("v") || u.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/)?.[1];
    if (id) return { kind: "embed", src: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1` };
  }
  if (host === "youtu.be") {
    const id = u.pathname.slice(1);
    if (id) return { kind: "embed", src: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1` };
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const [, id, hash] = u.pathname.match(/(?:\/video)?\/(\d+)(?:\/(\w+))?/) ?? [];
    if (id) return { kind: "embed", src: `https://player.vimeo.com/video/${id}${hash ? `?h=${hash}` : ""}` };
  }
  const path = u.pathname.toLowerCase();
  if (/\.(mp3|m4a|wav|ogg|aac)$/.test(path)) return { kind: "audio", src: url };
  if (/\.(mp4|webm|mov|m4v)$/.test(path)) return { kind: "video", src: url };
  return { kind: "link", src: url };
}
