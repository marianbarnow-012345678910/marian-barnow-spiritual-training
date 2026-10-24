"use client";

import { useState } from "react";

export function BookButton({ sessionId, label }: { sessionId: number; label: string }) {
  const [state, setState] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);

  async function book() {
    setState("loading");
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Booking could not be started.");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Booking could not be started.");
      setState("idle");
    }
  }

  return (
    <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
      <button type="button" className="btn btn-gold" onClick={book} disabled={state === "loading"} aria-busy={state === "loading"}>
        {state === "loading" ? "Opening checkout…" : label}
      </button>
      {error && (
        <p role="alert" className="small" style={{ color: "var(--rose)", maxWidth: 260, textAlign: "right" }}>
          {error}
        </p>
      )}
    </div>
  );
}
