import { StatusPill } from '../StatusPill.jsx';
import { CapacityBar } from './CapacityBar.jsx';
import { centerStatusMeta } from '../../utils/status.js';
import { distance, formatMeters } from '../../utils/geo.js';

export function CenterAvailabilityList({ centers, incidents, onOpen }) {
  const nearest = (c) => (incidents.length ? Math.min(...incidents.map((i) => distance(i.position, c.position))) : null);
  const sorted = [...centers].sort((a, b) => b.capacity - b.occupants - (a.capacity - a.occupants));
  const totalFree = centers.filter((c) => c.status !== 'unavailable').reduce((s, c) => s + Math.max(0, c.capacity - c.occupants), 0);

  return (
    <section className="panel p-4" aria-labelledby="centers-title">
      <div className="mb-1 flex items-center justify-between">
        <h2 id="centers-title" className="text-sm font-bold text-neutral-text">
          Evacuation Centers
        </h2>
        <button type="button" onClick={onOpen} className="text-xs font-semibold text-neutral-text-muted hover:underline">
          Manage
        </button>
      </div>
      <p className="mb-3 text-xs text-neutral-text-muted">
        <span className="font-semibold text-neutral-text">{totalFree}</span> spaces available across {centers.length} centers
      </p>
      <ul className="space-y-3">
        {sorted.map((c) => {
          const d = nearest(c);
          return (
            <li key={c.id} className="rounded-md border border-neutral-border p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-neutral-text">{c.name}</p>
                  <p className="font-mono text-[11px] text-neutral-text-muted">{d !== null ? `${formatMeters(d)} from nearest fire` : 'No active fires'}</p>
                </div>
                <StatusPill meta={centerStatusMeta[c.status]} />
              </div>
              <CapacityBar occupants={c.occupants} capacity={c.capacity} className="mt-2" />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
