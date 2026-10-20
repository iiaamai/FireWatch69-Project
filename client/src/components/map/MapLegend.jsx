import { TruckIcon, TentIcon } from 'lucide-react';
import { severityMeta } from '../../utils/status.js';

export function MapLegend({ showHeat = false }) {
  return (
    <div className="rounded-md border border-neutral-border bg-neutral-surface/95 p-2.5 text-[11px] text-neutral-text-muted shadow-sm">
      <p className="eyebrow mb-1.5">Legend</p>
      {showHeat ? (
        <div>
          <p className="mb-1 text-neutral-text-muted">Incident density</p>
          <div className="flex h-2.5 w-40 overflow-hidden rounded-sm">
            {[0.15, 0.3, 0.5, 0.7, 0.95].map((o) => (
              <span key={o} className="flex-1 bg-primary" style={{ opacity: o }} />
            ))}
          </div>
          <div className="mt-0.5 flex w-40 justify-between font-mono text-[10px] text-neutral-text-muted">
            <span>Low</span>
            <span>High</span>
          </div>
          <p className="mb-1 mt-2 text-neutral-text-muted">Severity concentration</p>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-0.5">
            {Object.keys(severityMeta).map((s) => (
              <li key={s} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: severityMeta[s].hex }} aria-hidden="true" />
                {severityMeta[s].label}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <ul className="space-y-1">
          {Object.keys(severityMeta).map((s) => {
            const Icon = severityMeta[s].icon;
            return (
              <li key={s} className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" style={{ color: severityMeta[s].hex }} aria-hidden="true" />
                {severityMeta[s].label} fire
              </li>
            );
          })}
          <li className="flex items-center gap-1.5">
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-sm bg-neutral-active">
              <TruckIcon className="h-2.5 w-2.5 text-neutral-on-dark" aria-hidden="true" />
            </span>
            Response team
          </li>
          <li className="flex items-center gap-1.5">
            <TentIcon className="h-3.5 w-3.5 text-neutral-text" aria-hidden="true" />
            Evacuation center
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-0 w-3.5 border-t-2 border-dashed border-primary" aria-hidden="true" />
            Driving route
          </li>
        </ul>
      )}
    </div>
  );
}
