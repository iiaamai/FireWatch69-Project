import { useEffect, useMemo, useState } from 'react';
import { useScreenInit } from '../useScreenInit.js';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ExternalLinkIcon, RouteIcon, InfoIcon, ClockIcon, SatelliteIcon, MapPinIcon, CameraIcon, XIcon } from 'lucide-react';
import { IncidentMap } from '../components/map/IncidentMap.jsx';
import { StatusPill } from '../components/StatusPill.jsx';
import { Button } from '../components/Button.jsx';
import { NotificationItem } from '../components/NotificationItem.jsx';
import { TeamDetailsDrawer } from '../components/responders/TeamDetailsDrawer.jsx';
import { useAppData } from '../contexts/AppDataContext.jsx';
import { isActiveIncident, severityMeta, teamStatusMeta } from '../utils/status.js';
import { nearestStreet, formatMeters, routeLength } from '../utils/geo.js';
import { formatTime, timeAgo } from '../utils/time.js';

const feedTypes = ['dispatched', 'accepted', 'arrived', 'route_changed', 'gps_update', 'status_changed', 'contained', 'resolved'];

export function TrackResponders() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { teams, incidents, centers, notifications, markRead } = useAppData();
  const [filter, setFilter] = useState('all');
  const [routeFocus, setRouteFocus] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const screenInit = useScreenInit();

  useEffect(() => {
    if (screenInit.teamId && !params.get('team') && !params.get('incident')) setParams({ team: screenInit.teamId }, { replace: true });
    // Magic Pattern canvas deep-link; apply once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedTeamId = params.get('team');
  const incidentParam = params.get('incident');
  const selected = teams.find((t) => t.id === selectedTeamId) ?? null;
  const assigned = incidents.find((i) => i.id === selected?.assignedIncidentId);
  const incidentFocus = incidents.find((i) => i.id === incidentParam);
  const active = incidents.filter((i) => isActiveIncident(i.status));
  const feed = useMemo(() => notifications.filter((n) => feedTypes.includes(n.type)).slice(0, 12), [notifications]);
  const gpsFeed = useMemo(
    () =>
      [...teams]
        .filter((t) => t.status !== 'unavailable' && t.lastGps)
        .sort((a, b) => String(b.lastGps).localeCompare(String(a.lastGps)))
        .slice(0, 4),
    [teams],
  );

  const focus = routeFocus
    ?? (selected ? { point: selected.position, key: selectedTeamId, zoom: 2 } : null)
    ?? (incidentFocus ? { point: incidentFocus.position, key: incidentParam, zoom: 2.4 } : null);

  const selectTeam = (id) => {
    setRouteFocus(null);
    setParams(id ? { team: id } : {});
  };

  const viewRoute = () => {
    if (!selected) return;
    const pts = [selected.position, ...selected.route];
    const xs = pts.map((p) => p.x);
    const ys = pts.map((p) => p.y);
    const span = Math.max(Math.max(...xs) - Math.min(...xs), (Math.max(...ys) - Math.min(...ys)) * 1.5, 120);
    setRouteFocus({
      point: { x: (Math.max(...xs) + Math.min(...xs)) / 2, y: (Math.max(...ys) + Math.min(...ys)) / 2 },
      key: `${selected.id}-route-${selected.route.length}`,
      zoom: Math.min(3, 800 / span),
    });
  };

  const statuses = ['all', 'en_route', 'dispatched', 'on_scene', 'available', 'unavailable'];
  const listed = teams.filter((t) => filter === 'all' || t.status === filter);

  return (
    <div className="grid gap-4 xl:h-[calc(100vh-7rem)] xl:grid-cols-[300px_1fr_320px]">
      <section className="panel flex min-h-0 flex-col" aria-labelledby="teams-title">
        <div className="border-b border-neutral-border p-4">
          <h1 id="teams-title" className="text-base font-bold text-neutral-text">Response Teams</h1>
          <p className="text-xs text-neutral-text-muted">Select a team to track its live location and route.</p>
          <div className="mt-3 flex flex-wrap gap-1" role="group" aria-label="Filter teams by status">
            {statuses.map((s) => (
              <button key={s} type="button" aria-pressed={filter === s} onClick={() => setFilter(s)} className={`chip py-1 ${filter === s ? 'border-neutral-active bg-neutral-active text-neutral-on-dark' : 'border-neutral-border bg-neutral-surface text-neutral-text-muted hover:bg-neutral-bg'}`}>
                {s === 'all' ? 'All' : teamStatusMeta[s].label}
                <span className="font-mono opacity-70">{s === 'all' ? teams.length : teams.filter((t) => t.status === s).length}</span>
              </button>
            ))}
          </div>
        </div>
        <ul className="min-h-0 flex-1 divide-y divide-neutral-border overflow-y-auto">
          {listed.map((t) => (
            <li key={t.id}>
              <button type="button" onClick={() => selectTeam(t.id)} aria-pressed={t.id === selectedTeamId} className={`w-full px-4 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-border ${t.id === selectedTeamId ? 'bg-neutral-bg' : 'hover:bg-neutral-bg'}`}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-neutral-text">{t.name}</p>
                  <StatusPill meta={teamStatusMeta[t.status]} />
                </div>
                <p className="mt-0.5 font-mono text-[11px] text-neutral-text-muted">{t.callsign} · {nearestStreet(t.position)}</p>
                {t.assignedIncidentId && (
                  <p className="mt-1 text-xs text-neutral-text-muted">
                    → {t.assignedIncidentId} {t.status === 'en_route' || t.status === 'dispatched' ? <span className="font-semibold">· ETA {t.etaMin} min</span> : null}
                  </p>
                )}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="relative min-h-[520px]" aria-label="Live responder map">
        <IncidentMap
          className="h-full min-h-[520px]"
          incidents={active}
          teams={teams}
          centers={centers}
          selectedTeamId={selectedTeamId}
          selectedIncidentId={assigned?.id ?? incidentParam}
          onSelectTeam={selectTeam}
          onSelectIncident={(id) => navigate(`/incidents?id=${id}`)}
          focus={focus}
          cluster={false}
        />
        {selected && (
          <div className="absolute inset-x-3 bottom-14 z-10 mx-auto max-w-xl rounded-lg border border-neutral-border bg-neutral-surface p-4 shadow-lg sm:bottom-12">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-base font-bold text-neutral-text">{selected.name}</p>
                  <StatusPill meta={teamStatusMeta[selected.status]} />
                </div>
                <p className="text-xs text-neutral-text-muted">{selected.department} · Leader: {selected.leader} · {selected.members.length} members</p>
              </div>
              <button type="button" onClick={() => selectTeam(null)} className="rounded-md p-1 text-neutral-text-muted hover:bg-neutral-bg" aria-label="Close team panel">
                <XIcon className="h-4 w-4" />
              </button>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div><dt className="eyebrow">Location</dt><dd className="flex items-center gap-1 text-neutral-text"><MapPinIcon className="h-3.5 w-3.5 text-neutral-text-muted" aria-hidden="true" />{nearestStreet(selected.position)}</dd></div>
              <div><dt className="eyebrow">Assigned</dt><dd className="font-mono text-xs text-neutral-text">{assigned ? assigned.id : '—'}</dd>{assigned && <dd><StatusPill meta={severityMeta[assigned.severity]} className="mt-0.5" /></dd>}</div>
              <div><dt className="eyebrow">ETA</dt><dd className="text-lg font-bold text-neutral-text">{selected.status === 'on_scene' ? 'Arrived' : selected.etaMin ? `${selected.etaMin} min` : '—'}</dd>{selected.route.length > 0 && <dd className="font-mono text-[11px] text-neutral-text-muted">{formatMeters(routeLength(selected.route, selected.position))} left</dd>}</div>
              <div><dt className="eyebrow">Last GPS</dt><dd className="flex items-center gap-1 text-neutral-text"><ClockIcon className="h-3.5 w-3.5 text-neutral-text-muted" aria-hidden="true" />{timeAgo(selected.lastGps)}</dd></div>
            </dl>
            {selected.status === 'on_scene' && (
              <div className="mt-3 flex items-center gap-3 rounded-md border border-dashed border-primary-tint-1 bg-primary-tint-2 p-3 text-sm text-primary-shade-2">
                <CameraIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <p><span className="font-semibold">On Scene.</span> Team arrived at {assigned?.location ?? 'the incident'}. On-scene reports and photos from the team will appear here.</p>
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="small" leftIcon={<ExternalLinkIcon className="h-3.5 w-3.5" />} disabled={!assigned} onClick={() => assigned && navigate(`/incidents?id=${assigned.id}`)}>Open related incident</Button>
              <Button size="small" variant="secondary" leftIcon={<RouteIcon className="h-3.5 w-3.5" />} disabled={!selected.route.length} onClick={viewRoute}>View route</Button>
              <Button size="small" variant="secondary" leftIcon={<InfoIcon className="h-3.5 w-3.5" />} onClick={() => setDetailsOpen(true)}>View team details</Button>
            </div>
          </div>
        )}
      </section>

      <section className="panel flex min-h-0 flex-col" aria-labelledby="feed-title">
        <div className="flex items-center justify-between border-b border-neutral-border p-4">
          <h2 id="feed-title" className="text-base font-bold text-neutral-text">Live Feed</h2>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-neutral-text-muted"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-active" aria-hidden="true" />Streaming</span>
        </div>
        <div className="border-b border-neutral-border px-4 py-3">
          <p className="eyebrow mb-2">GPS updates</p>
          <ul className="space-y-1.5" aria-live="polite">
            {gpsFeed.map((t) => (
              <li key={t.id} className="flex items-center gap-2 font-mono text-[11px] text-neutral-text-muted">
                <SatelliteIcon className="h-3 w-3 text-neutral-text-muted" aria-hidden="true" />
                <span className="w-12 text-neutral-text-muted">{formatTime(t.lastGps)}</span>
                <span className="font-semibold">{t.callsign}</span>
                <span className="truncate text-neutral-text-muted">{nearestStreet(t.position)}</span>
              </li>
            ))}
          </ul>
        </div>
        <ul className="min-h-0 flex-1 divide-y divide-neutral-border overflow-y-auto" aria-live="polite">
          {feed.map((n) => (
            <li key={n.id}>
              <NotificationItem notification={n} compact onOpen={() => { markRead(n.id); if (n.incidentId) navigate(`/incidents?id=${n.incidentId}`); }} onMarkRead={() => markRead(n.id)} />
            </li>
          ))}
        </ul>
      </section>

      <TeamDetailsDrawer team={detailsOpen ? selected : null} onClose={() => setDetailsOpen(false)} />
    </div>
  );
}
