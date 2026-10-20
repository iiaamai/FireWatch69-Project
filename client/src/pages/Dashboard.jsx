import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FlameIcon,
  TimerIcon,
  CheckCircle2Icon,
  TruckIcon,
  ListChecksIcon,
  NavigationIcon,
  VideoIcon,
  TentIcon,
  ChevronRightIcon,
} from 'lucide-react';
import { StatCard } from '../components/StatCard.jsx';
import { IncidentMap } from '../components/map/IncidentMap.jsx';
import { LiveVideoPanel } from '../components/LiveVideoPanel.jsx';
import { IncidentRowCard } from '../components/incidents/IncidentRowCard.jsx';
import { SituationBanner } from '../components/incidents/SituationBanner.jsx';
import { CenterAvailabilityList } from '../components/evacuation/CenterAvailabilityList.jsx';
import { Select } from '../components/Select.jsx';
import { Toggle } from '../components/Toggle.jsx';
import { useAppData } from '../contexts/AppDataContext.jsx';
import { INCIDENT_STAGES, incidentStatusMeta, isActiveIncident, severityMeta, severityOrder } from '../utils/status.js';

export function Dashboard() {
  const navigate = useNavigate();
  const { incidents, teams, centers, history, setIncidentStatus } = useAppData();
  const [severity, setSeverity] = useState('all');
  const [status, setStatus] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');
  const [showCenters, setShowCenters] = useState(true);
  const [focus, setFocus] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const active = useMemo(
    () => incidents.filter((i) => isActiveIncident(i.status)).sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]),
    [incidents],
  );
  const critical = active.find((i) => i.severity === 'critical') ?? active[0];
  const respondingTeams = teams.filter((t) => ['dispatched', 'en_route', 'on_scene'].includes(t.status));
  const availableTeams = teams.filter((t) => t.status === 'available');

  const sept = history.filter((h) => h.date.startsWith('2026-09'));
  const aug = history.filter((h) => h.date.startsWith('2026-08'));
  const avg = (list) => (list.length ? list.reduce((s, h) => s + h.responseTimeMin, 0) / list.length : 0);
  const avgNow = avg([...sept, ...incidents.filter((i) => i.responseTimeMin !== null).map((i) => ({ responseTimeMin: i.responseTimeMin }))]);
  const avgPrev = avg(aug);
  const resolvedThisMonth = sept.filter((h) => h.finalStatus === 'resolved').length + incidents.filter((i) => i.status === 'resolved').length;
  const resolvedPrev = aug.filter((h) => h.finalStatus === 'resolved').length;

  const mapIncidents = incidents.filter(
    (i) =>
      (severity === 'all' || i.severity === severity) &&
      (status === 'all' ? isActiveIncident(i.status) : i.status === status) &&
      (teamFilter === 'all' || i.assignedTeamId === teamFilter),
  );
  const mapTeams = teams.filter((t) => teamFilter === 'all' || t.id === teamFilter);

  const flyTo = (id) => {
    const inc = incidents.find((i) => i.id === id);
    if (!inc) return;
    setSelectedId(id);
    setFocus({ point: inc.position, key: Date.now() });
  };

  const advance = (id) => {
    const inc = incidents.find((i) => i.id === id);
    if (!inc) return;
    const next = INCIDENT_STAGES[INCIDENT_STAGES.indexOf(inc.status) + 1];
    if (next) setIncidentStatus(id, next);
  };

  const quickActions = [
    { label: 'Manage Fire Incidents', icon: ListChecksIcon, onClick: () => navigate('/incidents') },
    { label: 'Open Live Responder Map', icon: NavigationIcon, onClick: () => navigate('/responders') },
    { label: 'Open Live Incident Video', icon: VideoIcon, onClick: () => document.getElementById('live-video-title')?.scrollIntoView({ behavior: 'smooth', block: 'center' }) },
    { label: showCenters ? 'Hide Evacuation Centers' : 'Show Evacuation Centers', icon: TentIcon, onClick: () => setShowCenters((s) => !s) },
  ];

  return (
    <div className="space-y-5">
      {critical && (
        <SituationBanner
          incident={critical}
          team={teams.find((t) => t.id === critical.assignedTeamId)}
          onFlyTo={() => flyTo(critical.id)}
          onOpen={() => navigate(`/incidents?id=${critical.id}`)}
        />
      )}

      <section aria-label="Summary" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active Fire Incidents"
          value={active.length}
          icon={FlameIcon}
          emphasis={active.some((i) => i.severity === 'critical')}
          indicator={
            <span className="inline-flex flex-wrap gap-1">
              {['critical', 'high', 'moderate', 'low'].map((s) => {
                const n = active.filter((i) => i.severity === s).length;
                return n ? (
                  <span key={s} className={`rounded border px-1.5 py-0.5 text-[11px] font-medium ${severityMeta[s].className}`}>
                    {n} {severityMeta[s].label}
                  </span>
                ) : null;
              })}
            </span>
          }
          onClick={() => navigate('/incidents')}
        />
        <StatCard
          label="Average Response Time"
          value={avgNow.toFixed(1)}
          unit="min"
          icon={TimerIcon}
          indicator={<span className="rounded border border-neutral-border bg-neutral-surface px-1.5 py-0.5 text-[11px] font-medium text-neutral-text">Timely Response</span>}
          trend={{ direction: avgNow <= avgPrev ? 'down' : 'up', text: `${Math.abs(avgPrev - avgNow).toFixed(1)} min vs Aug`, positive: avgNow <= avgPrev }}
        />
        <StatCard
          label="Resolved This Month"
          value={resolvedThisMonth}
          icon={CheckCircle2Icon}
          trend={{ direction: resolvedThisMonth >= resolvedPrev ? 'up' : 'down', text: `${resolvedThisMonth - resolvedPrev >= 0 ? '+' : ''}${resolvedThisMonth - resolvedPrev} vs Aug`, positive: true }}
          caption="September 2026"
        />
        <StatCard
          label="Active Responders"
          value={respondingTeams.length}
          unit={`/ ${teams.length} teams`}
          icon={TruckIcon}
          indicator={
            <span className="inline-flex items-center gap-1.5 text-neutral-text-muted">
              <span className={`h-2 w-2 rounded-full ${availableTeams.length ? 'bg-neutral-active' : 'bg-primary'}`} aria-hidden="true" />
              {availableTeams.length} available for dispatch
            </span>
          }
          onClick={() => navigate('/responders')}
        />
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <section className="panel flex flex-col p-4 xl:col-span-2" aria-labelledby="live-map-title">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="live-map-title" className="text-sm font-bold text-neutral-text">
                Live Fire Map
              </h2>
              <p className="text-xs text-neutral-text-muted">{mapIncidents.length} incidents · {respondingTeams.length} teams deployed</p>
            </div>
            <Toggle checked={showCenters} onChange={setShowCenters} label="Evacuation centers" size="small" />
          </div>
          <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-4">
            <Select
              placeholder="Severity"
              value={severity}
              onChange={(v) => setSeverity(v)}
              options={[{ value: 'all', label: 'All severities' }, ...Object.keys(severityMeta).map((s) => ({ value: s, label: severityMeta[s].label }))]}
            />
            <Select
              placeholder="Status"
              value={status}
              onChange={(v) => setStatus(v)}
              options={[{ value: 'all', label: 'All active statuses' }, ...INCIDENT_STAGES.map((s) => ({ value: s, label: incidentStatusMeta[s].label }))]}
            />
            <Select
              placeholder="Response team"
              value={teamFilter}
              onChange={(v) => setTeamFilter(v)}
              options={[{ value: 'all', label: 'All teams' }, ...teams.map((t) => ({ value: t.id, label: t.name }))]}
            />
            <Select placeholder="Fly to incident…" onChange={(v) => flyTo(v)} options={active.map((i) => ({ value: i.id, label: `${i.incidentCode} · ${i.location}` }))} />
          </div>
          <IncidentMap
            className="h-[420px] lg:h-[480px]"
            incidents={mapIncidents}
            teams={mapTeams}
            centers={centers}
            showCenters={showCenters}
            selectedIncidentId={selectedId}
            onSelectIncident={(id) => navigate(`/incidents?id=${id}`)}
            onSelectTeam={(id) => navigate(`/responders?team=${id}`)}
            onSelectCenter={() => navigate('/evacuation')}
            focus={focus}
          />
        </section>

        <div className="flex flex-col gap-5">
          <LiveVideoPanel />
          <section className="panel p-4" aria-labelledby="quick-actions-title">
            <h2 id="quick-actions-title" className="mb-2 text-sm font-bold text-neutral-text">
              Quick Actions
            </h2>
            <ul className="divide-y divide-neutral-border">
              {quickActions.map((a) => (
                <li key={a.label}>
                  <button type="button" onClick={a.onClick} className="flex w-full items-center gap-3 rounded-md px-1 py-2.5 text-left text-sm font-medium text-neutral-text hover:bg-neutral-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-border">
                    <a.icon className="h-4 w-4 text-neutral-text-muted" aria-hidden="true" />
                    <span className="flex-1">{a.label}</span>
                    <ChevronRightIcon className="h-4 w-4 text-neutral-text-muted" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <section className="xl:col-span-2" aria-labelledby="active-list-title">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="active-list-title" className="text-sm font-bold text-neutral-text">
              Active Fire Incidents
            </h2>
            <button type="button" onClick={() => navigate('/incidents')} className="text-xs font-semibold text-neutral-text-muted hover:underline">
              View all
            </button>
          </div>
          <div className="space-y-2">
            {active.map((inc, i) => (
              <IncidentRowCard
                key={inc.id}
                incident={inc}
                team={teams.find((t) => t.id === inc.assignedTeamId)}
                defaultOpen={i === 0}
                onOpen={() => navigate(`/incidents?id=${inc.id}`)}
                onFlyTo={() => {
                  flyTo(inc.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onTrack={() => navigate(`/responders?team=${inc.assignedTeamId}`)}
                onAdvance={() => advance(inc.id)}
              />
            ))}
          </div>
        </section>
        <CenterAvailabilityList centers={centers} incidents={active} onOpen={() => navigate('/evacuation')} />
      </div>
    </div>
  );
}
