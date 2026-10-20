export function CapacityBar({ occupants, capacity, className = '' }) {
  const pct = capacity ? Math.min(100, Math.round((occupants / capacity) * 100)) : 0;
  const color = pct >= 100 ? 'bg-primary' : pct >= 85 ? 'bg-alert-medium-text' : 'bg-neutral-active';
  return (
    <div className={className}>
      <div className="mb-1 flex justify-between font-mono text-[11px] text-neutral-text-muted">
        <span>
          {occupants} / {capacity} occupants
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-border" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Occupancy">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
