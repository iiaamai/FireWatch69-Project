import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  XIcon,
  MapPinIcon,
  RefreshCwIcon,
  UserPlusIcon,
  NavigationIcon,
  MapIcon,
  ImageIcon,
  CheckCircle2Icon,
  ArrowRightIcon,
  AlertTriangleIcon,
  PhoneIcon,
} from 'lucide-react';
import { useAppData } from '../../contexts/AppDataContext.jsx';
import { Button } from '../Button.jsx';
import { StatusPill } from '../StatusPill.jsx';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs.jsx';
import { WorkflowStepper } from './WorkflowStepper.jsx';
import { MediaReviewPanel } from './MediaReviewPanel.jsx';
import { ActivityTimeline } from './ActivityTimeline.jsx';
import { AssignTeamDialog } from './AssignTeamDialog.jsx';
import { ConfirmDialog } from '../ConfirmDialog.jsx';
import { IncidentMap } from '../map/IncidentMap.jsx';
import { INCIDENT_STAGES, incidentStatusMeta, severityMeta, teamStatusMeta } from '../../utils/status.js';
import { formatDateTime, timeAgo } from '../../utils/time.js';
import { nearestStreet } from '../../utils/geo.js';

export function IncidentDetailPanel({ incident, initialTab = 'overview', onClose }) {
  const navigate = useNavigate();
  const { teams, centers, assignTeam, retryDispatch, setIncidentStatus, setMediaStatus } = useAppData();
  const [tab, setTab] = useState(initialTab);
  const [tabKey, setTabKey] = useState(0);
  const [assignOpen, setAssignOpen] = useState(false);
  const [resolveOpen, setResolveOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const team = teams.find((t) => t.id === incident.assignedTeamId);
  const next = INCIDENT_STAGES[INCIDENT_STAGES.indexOf(incident.status) + 1];
  const resolved = incident.status === 'resolved';
  const pendingMedia = incident.media.filter((m) => m.status === 'pending').length;
  const miniFocus = useMemo(() => ({ point: incident.position, key: 1, zoom: 2 }), [incident.position]);

  const openTab = (t) => {
    setTab(t);
    setTabKey((k) => k + 1);
  };

  const facts = [
    { label: 'Severity', value: <StatusPill meta={severityMeta[incident.severity]} /> },
    { label: 'Status', value: <StatusPill meta={incidentStatusMeta[incident.status]} /> },
    { label: 'Reported', value: `${formatDateTime(incident.reportedAt)} (${timeAgo(incident.reportedAt)})` },
    {
      label: 'Reporter',
      value: (
        <span>
          {incident.reporter.name} <span className="text-neutral-text-muted">· {incident.reporter.type}</span>
          <a href={`tel:${incident.reporter.phone}`} className="mt-0.5 flex items-center gap-1 font-mono text-xs text-neutral-text-muted hover:underline">
            <PhoneIcon className="h-3 w-3" aria-hidden="true" /> {incident.reporter.phone}
          </a>
        </span>
      ),
    },
    {
      label: 'Assigned team',
      value: team ? (
        <span className="flex flex-wrap items-center gap-1.5">
          {team.name} <StatusPill meta={teamStatusMeta[team.status]} />
        </span>
      ) : (
        <span className="font-medium text-alert-critical-text">Unassigned</span>
      ),
    },
    { label: 'Responder location', value: team ? `${nearestStreet(team.position)} · GPS ${timeAgo(team.lastGps)}` : '—' },
    { label: 'ETA', value: team ? (team.status === 'on_scene' ? 'Arrived on scene' : team.etaMin ? `${team.etaMin} min` : '—') : '—' },
    { label: 'Affected', value: `${incident.structuresAffected} structures · ${incident.familiesAffected} families` },
    { label: 'Exact position', value: <span className="font-mono text-xs">Grid {incident.position.x}, {incident.position.y} · {nearestStreet(incident.position)}</span> },
  ];

  return (
    <div className="flex h-full flex-col bg-neutral-surface">
      <div className="flex items-start justify-between gap-3 border-b border-neutral-border p-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-mono text-xs font-semibold text-neutral-text-muted">{incident.incidentCode}</p>
            <StatusPill meta={severityMeta[incident.severity]} pulse={incident.severity === 'critical' && !resolved} />
          </div>
          <h2 className="mt-1 text-lg font-bold leading-tight text-neutral-text">{incident.location}</h2>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-neutral-text-muted">
            <MapPinIcon className="h-3.5 w-3.5" aria-hidden="true" /> {incident.landmark}
          </p>
        </div>
        <button type="button" onClick={onClose} className="rounded-md p-1.5 text-neutral-text-muted hover:bg-neutral-bg" aria-label="Close incident details">
          <XIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <WorkflowStepper status={incident.status} />

        {incident.dispatchFailed && (
          <div role="alert" className="flex items-start gap-2.5 rounded-md border border-alert-critical-border bg-alert-critical-bg p-3 text-sm text-alert-critical-text">
            <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <div className="flex-1">
              <p className="font-semibold">Dispatch failed</p>
              <p>No team accepted the assignment. Retry to auto-dispatch the nearest available team.</p>
            </div>
            <Button size="small" variant="destructive" leftIcon={<RefreshCwIcon className="h-3.5 w-3.5" />} onClick={() => retryDispatch(incident.id)}>
              Retry
            </Button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {next && next !== 'resolved' && (
            <Button size="small" rightIcon={<ArrowRightIcon className="h-3.5 w-3.5" />} onClick={() => setIncidentStatus(incident.id, next)}>
              Mark {incidentStatusMeta[next].label}
            </Button>
          )}
          {!resolved && (
            <Button size="small" variant="secondary" leftIcon={<UserPlusIcon className="h-3.5 w-3.5" />} onClick={() => setAssignOpen(true)}>
              {team ? 'Reassign team' : 'Assign team'}
            </Button>
          )}
          {!resolved && !incident.dispatchFailed && (
            <Button size="small" variant="secondary" leftIcon={<RefreshCwIcon className="h-3.5 w-3.5" />} onClick={() => retryDispatch(incident.id)}>
              Retry dispatch
            </Button>
          )}
          <Button size="small" variant="secondary" leftIcon={<NavigationIcon className="h-3.5 w-3.5" />} disabled={!team} onClick={() => navigate(`/responders?team=${team?.id}`)}>
            View responders
          </Button>
          <Button size="small" variant="secondary" leftIcon={<MapIcon className="h-3.5 w-3.5" />} onClick={() => navigate(`/responders?incident=${incident.id}`)}>
            View on map
          </Button>
          <Button size="small" variant="secondary" leftIcon={<ImageIcon className="h-3.5 w-3.5" />} onClick={() => openTab('media')}>
            Review media{pendingMedia ? ` (${pendingMedia})` : ''}
          </Button>
          {!resolved && (
            <Button size="small" variant="tertiary" leftIcon={<CheckCircle2Icon className="h-3.5 w-3.5" />} onClick={() => setResolveOpen(true)}>
              Mark as resolved
            </Button>
          )}
        </div>

        <Tabs key={`${incident.id}-${tabKey}`} defaultTab={tab} variant="underlined">
          <TabList>
            <Tab id="overview">Details</Tab>
            <Tab id="media" badge={incident.media.length ? <span className="font-mono text-[11px]">{incident.media.length}</span> : undefined}>
              Media
            </Tab>
            <Tab id="timeline">Timeline</Tab>
          </TabList>
          <TabPanel id="overview" className="pt-4">
            <IncidentMap
              className="h-44"
              incidents={[incident]}
              teams={team ? [team] : []}
              centers={centers}
              showLegend={false}
              cluster={false}
              selectedIncidentId={incident.id}
              focus={miniFocus}
            />
            <p className="mt-4 text-sm leading-relaxed text-neutral-text-muted">{incident.description}</p>
            <dl className="mt-4 divide-y divide-neutral-border rounded-md border border-neutral-border">
              {facts.map((f) => (
                <div key={f.label} className="grid grid-cols-[130px_1fr] gap-3 px-3 py-2.5 text-sm">
                  <dt className="eyebrow pt-0.5">{f.label}</dt>
                  <dd className="text-neutral-text">{f.value}</dd>
                </div>
              ))}
            </dl>
          </TabPanel>
          <TabPanel id="media" className="pt-4">
            <MediaReviewPanel incident={incident} onSetStatus={(mediaId, status) => setMediaStatus(incident.id, mediaId, status)} />
          </TabPanel>
          <TabPanel id="timeline" className="pt-4">
            <ActivityTimeline entries={incident.timeline} />
          </TabPanel>
        </Tabs>
      </div>

      <AssignTeamDialog isOpen={assignOpen} onClose={() => setAssignOpen(false)} incident={incident} teams={teams} onAssign={(id) => assignTeam(incident.id, id)} />
      <ConfirmDialog
        isOpen={resolveOpen}
        onClose={() => {
          setResolveOpen(false);
          setNotes('');
        }}
        onConfirm={() => {
          setIncidentStatus(incident.id, 'resolved', notes.trim());
          setNotes('');
        }}
        title={`Resolve ${incident.incidentCode}?`}
        description="Resolving closes the incident, releases the assigned team, and moves it to Fire Incident History. This action is logged."
        confirmLabel="Mark as resolved"
        acknowledgement="I confirm the fire is fully extinguished and the scene has been cleared by the fire officer in charge."
        confirmDisabled={!notes.trim()}
      >
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-neutral-text">Resolution notes (required)</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="e.g. Fire out at 15:02, overhaul complete, no re-ignition."
            className="w-full rounded-md border border-neutral-border px-3 py-2 text-sm focus:border-neutral-text-muted focus:outline-none focus:ring-2 focus:ring-neutral-border"
          />
        </label>
      </ConfirmDialog>
    </div>
  );
}
