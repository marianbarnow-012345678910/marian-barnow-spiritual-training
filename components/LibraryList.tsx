import Link from "next/link";
import { Glyph } from "@/components/Glyph";
import { Icon } from "@/components/Icons";
import { formatMinutes } from "@/lib/format";
import type { ContentItem } from "@/lib/types";

export function LibraryList({ items, completed, base }: { items: ContentItem[]; completed: Set<string>; base: string }) {
  return (
    <div className="library">
      {items.map((item) => (
        <Link key={item.id} href={`${base}/${item.id}`} className="library-row">
          <Glyph item={item} />
          <div>
            <div className="title">{item.title}</div>
            {item.description && <p className="desc">{item.description}</p>}
          </div>
          <div className="meta">
            {completed.has(item.id) ? (
              <span className="done">
                <Icon.check /> Done
              </span>
            ) : (
              formatMinutes(item.duration_minutes)
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
