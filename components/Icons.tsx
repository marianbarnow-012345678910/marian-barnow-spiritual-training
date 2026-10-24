const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export const Icon = {
  home: () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...base}>
      <path d="M4 10.5 12 4l8 6.5V20h-5.5v-5h-5v5H4z" />
    </svg>
  ),
  meditate: () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...base}>
      <circle cx="12" cy="5.5" r="2.2" />
      <path d="M12 8.5v5M6 13.5c2 .8 4 1.2 6 1.2s4-.4 6-1.2M4.5 19.5c2.5-1.6 5-2.4 7.5-2.4s5 .8 7.5 2.4" />
    </svg>
  ),
  webinar: () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...base}>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M10 9l4 2-4 2z M8 20h8" />
    </svg>
  ),
  calendar: () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...base}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  ),
  ticket: () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...base}>
      <path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z M10 7v10" />
    </svg>
  ),
  user: () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...base}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.2-3.5 4-5 7-5s5.8 1.5 7 5" />
    </svg>
  ),
  settings: () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...base}>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </svg>
  ),
  check: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...base} strokeWidth={2.2}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  ),
};
