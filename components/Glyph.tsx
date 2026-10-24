import type { ContentItem } from "@/lib/types";

/**
 * Generated thumbnail for content without an image: one of four
 * sacred-geometry figures, chosen from the item id so it stays stable.
 */
function hash(s: string) {
  // FNV-1a
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

function Figure({ n }: { n: number }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.6 } as const;
  switch (n % 4) {
    case 0: // vesica piscis
      return (
        <svg viewBox="0 0 60 60" aria-hidden="true">
          <circle cx="23" cy="30" r="14" {...common} />
          <circle cx="37" cy="30" r="14" {...common} />
        </svg>
      );
    case 1: // triad
      return (
        <svg viewBox="0 0 60 60" aria-hidden="true">
          <circle cx="30" cy="22" r="12" {...common} />
          <circle cx="23" cy="34" r="12" {...common} />
          <circle cx="37" cy="34" r="12" {...common} />
        </svg>
      );
    case 2: // star tetrahedron outline
      return (
        <svg viewBox="0 0 60 60" aria-hidden="true">
          <path d="M30 8 L50 42 L10 42 Z" {...common} />
          <path d="M30 52 L10 18 L50 18 Z" {...common} />
        </svg>
      );
    default: // circle squared
      return (
        <svg viewBox="0 0 60 60" aria-hidden="true">
          <circle cx="30" cy="30" r="19" {...common} />
          <rect x="16.5" y="16.5" width="27" height="27" {...common} />
          <circle cx="30" cy="30" r="3" fill="currentColor" />
        </svg>
      );
  }
}

export function Glyph({ item }: { item: Pick<ContentItem, "id" | "thumbnail_url" | "title"> }) {
  const h = hash(item.id);
  if (item.thumbnail_url) {
    return (
      <div className="glyph">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.thumbnail_url} alt="" />
      </div>
    );
  }
  return (
    <div className="glyph" data-tone={(h >>> 8) % 4}>
      <Figure n={h % 4} />
    </div>
  );
}
