import { CrosshairIcon, ExternalLinkIcon, TruckIcon, ClockIcon, HomeIcon } from 'lucide-react';
import { Button } from '../Button.jsx';
import { StatusPill } from '../StatusPill.jsx';
import { incidentStatusMeta, severityMeta } from '../../utils/status.js';
import { timeAgo } from '../../utils/time.js';

export function SituationBanner({ incident, team, onFlyTo, onOpen }) {
  const sev = severityMeta[incident.severity];
  const isCritical = incident.severity === 'critical';
  return (
    <section
      aria-label="Highest priority incident"
      className={`flex flex-col gap-4 rounded-lg border p-4 lg:flex-row lg:items-center ${isCritical ? 'border-alert-critical-border bg-alert-critical-bg' : 'border-neutral-border bg-neutral-surface'}`}
    >
      <div className="flex flex-1 flex-wrap items-center gap-x-5 gap-y-3">
        <div className="flex items-center gap-3">
          <StatusPill meta={sev} size="md" pulse={isCritical} />
          <div>
            <p className="text-base font-bold text-neutral-text">{incident.location}</p>
            <p className="font-mono text-[11px] text-neutral-text-muted">
              {incident.incidentCode} · reported {timeAgo(incident.reportedAt)}
            </p>
          </div>
        </div>
        <StatusPill meta={incidentStatusMeta[incident.status]} size="md" />
        <dl className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
          <div className="flex items-center gap-1.5">
            <TruckIcon className="h-4 w-4 text-neutral-text-muted" aria-hidden="true" />
            <dt className="sr-only">Responding team</dt>
            <dd className="font-medium text-neutral-text">{team ? team.name : 'No team assigned'}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <ClockIcon className="h-4 w-4 text-neutral-text-muted" aria-hidden="true" />
            <dt className="sr-only">ETA</dt>
            <dd className="font-medium text-neutral-text">{team?.status === 'on_scene' ? 'On scene' : team?.etaMin ? `ETA ${team.etaMin} min` : '—'}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <HomeIcon className="h-4 w-4 text-neutral-text-muted" aria-hidden="true" />
            <dt className="sr-only">Affected</dt>
            <dd className="text-neutral-text-muted">
              {incident.structuresAffected} structures · {incident.familiesAffected} families
            </dd>
          </div>
        </dl>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" size="small" leftIcon={<CrosshairIcon className="h-4 w-4" />} onClick={onFlyTo}>
          Fly to incident
        </Button>
        <Button size="small" leftIcon={<ExternalLinkIcon className="h-4 w-4" />} onClick={onOpen}>
          Open incident
        </Button>
      </div>
    </section>
  );
}
