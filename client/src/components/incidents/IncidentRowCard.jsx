import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon, CrosshairIcon, ExternalLinkIcon, NavigationIcon, TruckIcon, ClockIcon, ArrowRightIcon } from 'lucide-react';
import { StatusPill } from '../StatusPill.jsx';
import { WorkflowStepper } from './WorkflowStepper.jsx';
import { Button } from '../Button.jsx';
import { INCIDENT_STAGES, incidentStatusMeta, severityMeta } from '../../utils/status.js';
import { formatTime, timeAgo } from '../../utils/time.js';

export function IncidentRowCard({ incident, team, defaultOpen = false, onOpen, onFlyTo, onTrack, onAdvance }) {
  const [open, setOpen] = useState(defaultOpen);
  const sev = severityMeta[incident.severity];
  const idx = INCIDENT_STAGES.indexOf(incident.status);
  const next = INCIDENT_STAGES[idx + 1];
  const canAdvance = next && next !== 'resolved';

  return (
    <div className={`rounded-lg border bg-neutral-surface ${incident.severity === 'critical' ? 'border-alert-critical-border' : 'border-neutral-border'}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-border"
      >
        <StatusPill meta={sev} pulse={incident.severity === 'critical'} />
        <div className="min-w-[180px] flex-1">
          <p className="text-sm font-semibold text-neutral-text">{incident.location}</p>
          <p className="font-mono text-[11px] text-neutral-text-muted">
            {incident.incidentCode} · reported {formatTime(incident.reportedAt)}
          </p>
        </div>
        <StatusPill meta={incidentStatusMeta[incident.status]} />
        <div className="flex w-36 items-center gap-1.5 text-xs text-neutral-text-muted">
          <TruckIcon className="h-3.5 w-3.5 text-neutral-text-muted" aria-hidden="true" />
          {team ? team.name : <span className="font-medium text-alert-critical-text">Unassigned</span>}
        </div>
        <div className="flex w-24 items-center gap-1.5 text-xs text-neutral-text-muted">
          <ClockIcon className="h-3.5 w-3.5 text-neutral-text-muted" aria-hidden="true" />
          {team?.status === 'on_scene' ? 'On scene' : team?.etaMin ? `ETA ${team.etaMin} min` : '—'}
        </div>
        <ChevronDownIcon className={`h-4 w-4 text-neutral-text-muted transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden">
            <div className="space-y-4 border-t border-neutral-border px-4 py-4">
              <WorkflowStepper status={incident.status} compact />
              <p className="text-sm text-neutral-text-muted">{incident.description}</p>
              <div className="flex flex-wrap items-center gap-2">
                {canAdvance && (
                  <Button size="small" rightIcon={<ArrowRightIcon className="h-3.5 w-3.5" />} onClick={onAdvance}>
                    Mark {incidentStatusMeta[next].label}
                  </Button>
                )}
                <Button size="small" variant="secondary" leftIcon={<ExternalLinkIcon className="h-3.5 w-3.5" />} onClick={onOpen}>
                  Open incident
                </Button>
                <Button size="small" variant="secondary" leftIcon={<CrosshairIcon className="h-3.5 w-3.5" />} onClick={onFlyTo}>
                  Fly to
                </Button>
                {team && (
                  <Button size="small" variant="tertiary" leftIcon={<NavigationIcon className="h-3.5 w-3.5" />} onClick={onTrack}>
                    Track {team.callsign}
                  </Button>
                )}
                <span className="ml-auto font-mono text-[11px] text-neutral-text-muted">Updated {timeAgo(incident.lastUpdate)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
