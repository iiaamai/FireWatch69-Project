import { formatTime } from '../../utils/time.js';

export function ActivityTimeline({ entries }) {
  const sorted = [...entries].reverse();
  return (
    <ol className="relative space-y-4 border-l border-neutral-border pl-5" aria-label="Activity timeline">
      {sorted.map((e, i) => (
        <li key={e.id} className="relative">
          <span className={`absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full border-2 border-neutral-surface ${i === 0 ? 'bg-neutral-active' : 'bg-neutral-border'}`} aria-hidden="true" />
          <p className="text-sm font-medium text-neutral-text">{e.label}</p>
          <p className="font-mono text-[11px] text-neutral-text-muted">
            {formatTime(e.time)} · {e.actor}
          </p>
        </li>
      ))}
    </ol>
  );
}
