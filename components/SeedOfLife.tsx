/** Seed of Life: seven overlapping circles inside a bounding circle. Drawn in currentColor. */
export function SeedOfLife({ className, strokeWidth = 1 }: { className?: string; strokeWidth?: number }) {
  const r = 25;
  const c = 60;
  const petals = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return { x: c + r * Math.cos(a), y: c + r * Math.sin(a) };
  });
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth={strokeWidth} aria-hidden="true">
      <circle cx={c} cy={c} r={r * 2} />
      <circle cx={c} cy={c} r={r} />
      {petals.map((p, i) => (
        <circle key={i} cx={p.x.toFixed(2)} cy={p.y.toFixed(2)} r={r} />
      ))}
    </svg>
  );
}
