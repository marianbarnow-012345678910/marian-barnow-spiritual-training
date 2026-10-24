"use client";

import { useActionState, useState } from "react";
import { saveContent } from "@/app/admin/actions";
import { SubmitButton } from "@/components/SubmitButton";
import type { ContentItem } from "@/lib/types";

function toDublinLocal(iso: string | null) {
  if (!iso) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Dublin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(iso));
  const g = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${g("year")}-${g("month")}-${g("day")}T${g("hour") === "24" ? "00" : g("hour")}:${g("minute")}`;
}

export function ContentForm({ item }: { item?: ContentItem | null }) {
  const [state, action] = useActionState(saveContent, undefined);
  const [kind, setKind] = useState<"meditation" | "webinar">(item?.kind ?? "meditation");

  return (
    <form action={action} className="panel" style={{ maxWidth: 760 }}>
      {state?.error && <p className="notice notice-error" role="alert">{state.error}</p>}
      {state?.message && <p className="notice" role="status">{state.message}</p>}
      {item && <input type="hidden" name="id" value={item.id} />}

      <fieldset style={{ border: 0, padding: 0, margin: 0, display: "flex", gap: 20 }}>
        <legend className="visually-hidden">Type</legend>
        <label className="checkbox">
          <input type="radio" name="kind" value="meditation" checked={kind === "meditation"} onChange={() => setKind("meditation")} />
          Meditation
        </label>
        <label className="checkbox">
          <input type="radio" name="kind" value="webinar" checked={kind === "webinar"} onChange={() => setKind("webinar")} />
          Webinar
        </label>
      </fieldset>

      <div className="field">
        <label htmlFor="title">Title</label>
        <input className="input" id="title" name="title" defaultValue={item?.title} required />
      </div>
      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea className="textarea" id="description" name="description" defaultValue={item?.description ?? ""} />
      </div>
      <div className="field">
        <label htmlFor="media_url">{kind === "webinar" ? "Recording link" : "Video or audio link"}</label>
        <input className="input" id="media_url" name="media_url" type="url" defaultValue={item?.media_url ?? ""} placeholder="https://youtu.be/… or https://vimeo.com/…" />
        <span className="hint">
          YouTube (set to Unlisted), Vimeo, or a direct link to an .mp3 / .mp4 file.
          {kind === "webinar" && " Leave empty until the recording is ready."}
        </span>
      </div>

      {kind === "webinar" && (
        <div className="grid-2">
          <div className="field">
            <label htmlFor="live_at">Live date and time (Irish time)</label>
            <input className="input" id="live_at" name="live_at" type="datetime-local" defaultValue={toDublinLocal(item?.live_at ?? null)} />
            <span className="hint">Leave empty for a recording only.</span>
          </div>
          <div className="field">
            <label htmlFor="join_url">Zoom or Meet link</label>
            <input className="input" id="join_url" name="join_url" type="url" defaultValue={item?.join_url ?? ""} />
            <span className="hint">Shown to clients 15 minutes before the start.</span>
          </div>
        </div>
      )}

      <div className="grid-2">
        <div className="field">
          <label htmlFor="duration_minutes">Length in minutes</label>
          <input className="input" id="duration_minutes" name="duration_minutes" type="number" min={1} defaultValue={item?.duration_minutes ?? ""} />
        </div>
        <div className="field">
          <label htmlFor="theme">Theme</label>
          <input className="input" id="theme" name="theme" defaultValue={item?.theme ?? ""} placeholder="Grounding, Sleep, Sacred Geometry…" />
          <span className="hint">Clients can filter meditations by theme.</span>
        </div>
      </div>
      <div className="grid-2">
        <div className="field">
          <label htmlFor="thumbnail_url">Image link (optional)</label>
          <input className="input" id="thumbnail_url" name="thumbnail_url" type="url" defaultValue={item?.thumbnail_url ?? ""} />
          <span className="hint">Without an image, a sacred-geometry figure is shown.</span>
        </div>
        <div className="field">
          <label htmlFor="sort_order">Order</label>
          <input className="input" id="sort_order" name="sort_order" type="number" defaultValue={item?.sort_order ?? 0} />
          <span className="hint">Lower numbers appear first.</span>
        </div>
      </div>
      <label className="checkbox">
        <input type="checkbox" name="published" defaultChecked={item?.published ?? true} />
        Visible to clients
      </label>
      <div>
        <SubmitButton className="btn" pendingText="Saving…">
          {item ? "Save changes" : "Add to portal"}
        </SubmitButton>
      </div>
    </form>
  );
}
