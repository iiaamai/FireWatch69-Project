import { CheckIcon } from 'lucide-react';
import { INCIDENT_STAGES, incidentStatusMeta } from '../../utils/status.js';

export function WorkflowStepper({ status, compact = false }) {
  const current = INCIDENT_STAGES.indexOf(status);
  return (
    <ol className="flex w-full items-start overflow-x-auto pb-1" aria-label="Incident response progress">
      {INCIDENT_STAGES.map((stage, i) => {
        const meta = incidentStatusMeta[stage];
        const Icon = meta.icon;
        const done = i < current;
        const isCurrent = i === current;
        return (
          <li key={stage} className="flex min-w-[64px] flex-1 flex-col items-center" aria-current={isCurrent ? 'step' : undefined}>
            <div className="flex w-full items-center">
              <span className={`h-0.5 flex-1 ${i === 0 ? 'invisible' : done || isCurrent ? 'bg-neutral-active' : 'bg-neutral-border'}`} />
              <span
                className={`flex shrink-0 items-center justify-center rounded-full border-2 ${compact ? 'h-6 w-6' : 'h-8 w-8'} ${
                  done ? 'border-neutral-active bg-neutral-active text-neutral-on-dark' : isCurrent ? `${meta.className} ring-4 ring-neutral-bg` : 'border-neutral-border bg-neutral-surface text-neutral-text-muted'
                }`}
              >
                {done ? <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" /> : <Icon className={compact ? 'h-3 w-3' : 'h-4 w-4'} aria-hidden="true" />}
              </span>
              <span className={`h-0.5 flex-1 ${i === INCIDENT_STAGES.length - 1 ? 'invisible' : done ? 'bg-neutral-active' : 'bg-neutral-border'}`} />
            </div>
            <span className={`mt-1.5 text-center leading-tight ${compact ? 'text-[10px]' : 'text-[11px]'} ${isCurrent ? 'font-bold text-neutral-text' : done ? 'text-neutral-text-muted' : 'text-neutral-text-muted'}`}>
              {meta.label}
            </span>
            {isCurrent && !compact && <span className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-neutral-text-muted">Current</span>}
          </li>
        );
      })}
    </ol>
  );
}
