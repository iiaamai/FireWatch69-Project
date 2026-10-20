import { useEffect, useMemo, useState } from 'react';
import { useScreenInit } from '../useScreenInit.js';
import { useSearchParams } from 'react-router-dom';
import { SearchIcon, EyeIcon, InboxIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader.jsx';
import { Input } from '../components/Input.jsx';
import { Select } from '../components/Select.jsx';
import { Drawer } from '../components/Drawer.jsx';
import { StatusPill } from '../components/StatusPill.jsx';
import { IncidentDetailPanel } from '../components/incidents/IncidentDetailPanel.jsx';
import { useAppData } from '../contexts/AppDataContext.jsx';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { INCIDENT_STAGES, incidentStatusMeta, severityMeta, severityOrder } from '../utils/status.js';
import { formatMinutes, formatTime, timeAgo } from '../utils/time.js';
import { incidentLabel } from '../utils/incidentDisplay.js';

export function ManageIncidents() {
  const { incidents, teams } = useAppData();
  const [params, setParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState('all');
  const [severity, setSeverity] = useState('all');
  const [query, setQuery] = useState('');
  const isWide = useMediaQuery('(min-width: 1280px)');
  const screenInit = useScreenInit();

  useEffect(() => {
    if (screenInit.incidentId && !params.get('id')) setParams({ id: screenInit.incidentId }, { replace: true });
    // Magic Pattern canvas deep-link; apply once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedId = params.get('id');
  const tabParam = params.get('tab') ?? 'overview';
  const selected = incidents.find((i) => i.id === selectedId) ?? null;

  const filtered = useMemo(
    () =>
      incidents
        .filter((i) => statusFilter === 'all' || i.status === statusFilter)
        .filter((i) => severity === 'all' || i.severity === severity)
        .filter((i) => `${i.incidentCode} ${i.id} ${i.location} ${i.landmark}`.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => Number(a.status === 'resolved') - Number(b.status === 'resolved') || severityOrder[a.severity] - severityOrder[b.severity]),
    [incidents, statusFilter, severity, query],
  );

  const select = (id) => {
    if (id) setParams({ id });
    else setParams({});
  };

  const table = (
    <div className="panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px]">
          <caption className="sr-only">Fire incident queue</caption>
          <thead className="border-b border-neutral-border bg-neutral-bg">
            <tr>
              <th scope="col" className="table-head">Incident ID</th>
              <th scope="col" className="table-head">Location</th>
              <th scope="col" className="table-head">Severity</th>
              <th scope="col" className="table-head">Reported</th>
              <th scope="col" className="table-head">Status</th>
              <th scope="col" className="table-head">Assigned Team</th>
              <th scope="col" className="table-head">Response</th>
              <th scope="col" className="table-head">Last Update</th>
              <th scope="col" className="table-head text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-border">
            {filtered.map((inc) => {
              const team = teams.find((t) => t.id === inc.assignedTeamId);
              const isSel = inc.id === selectedId;
              return (
                <tr
                  key={inc.id}
                  onClick={() => select(inc.id)}
                  className={`cursor-pointer ${isSel ? 'bg-neutral-bg' : 'hover:bg-neutral-bg'} ${inc.status === 'resolved' ? 'text-neutral-text-muted' : ''}`}
                >
                  <td className="table-cell">
                    <span className={`font-mono text-xs font-semibold ${isSel ? 'text-neutral-text' : 'text-neutral-text-muted'}`}>{incidentLabel(inc)}</span>
                    {inc.dispatchFailed && <span className="mt-0.5 block text-[11px] font-semibold text-alert-critical-text">Dispatch failed</span>}
                  </td>
                  <td className="table-cell max-w-[220px]">
                    <p className="truncate font-medium">{inc.location}</p>
                    <p className="truncate text-xs text-neutral-text-muted">{inc.landmark}</p>
                  </td>
                  <td className="table-cell"><StatusPill meta={severityMeta[inc.severity]} pulse={inc.severity === 'critical' && inc.status !== 'resolved'} /></td>
                  <td className="table-cell font-mono text-xs">{formatTime(inc.reportedAt)}</td>
                  <td className="table-cell"><StatusPill meta={incidentStatusMeta[inc.status]} /></td>
                  <td className="table-cell text-sm">{team ? team.name : <span className="text-alert-critical-text">Unassigned</span>}</td>
                  <td className="table-cell font-mono text-xs">{formatMinutes(inc.responseTimeMin)}</td>
                  <td className="table-cell font-mono text-xs text-neutral-text-muted">{timeAgo(inc.lastUpdate)}</td>
                  <td className="table-cell text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        select(inc.id);
                      }}
                      className="inline-flex items-center gap-1 rounded-md border border-neutral-border px-2 py-1 text-xs font-medium text-neutral-text hover:bg-neutral-surface"
                      aria-label={`View ${incidentLabel(inc)}`}
                    >
                      <EyeIcon className="h-3.5 w-3.5" /> View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!filtered.length && (
        <div className="flex flex-col items-center py-14 text-center">
          <InboxIcon className="h-6 w-6 text-neutral-text-muted" aria-hidden="true" />
          <p className="mt-2 text-sm font-medium text-neutral-text">No fire incidents match these filters</p>
          <button type="button" className="mt-1 text-xs font-semibold text-neutral-text-muted hover:underline" onClick={() => { setStatusFilter('all'); setQuery(''); }}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <PageHeader title="Manage Fire Incidents" description="Triage, dispatch, and track every fire incident from report to resolution." />

      <div className="mb-4 flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by status">
          {['all', ...INCIDENT_STAGES].map((s) => {
            const count = s === 'all' ? incidents.length : incidents.filter((i) => i.status === s).length;
            const active = statusFilter === s;
            const Icon = s === 'all' ? null : incidentStatusMeta[s].icon;
            return (
              <button
                key={s}
                type="button"
                aria-pressed={active}
                onClick={() => setStatusFilter(s)}
                className={`chip ${active ? 'border-neutral-active bg-neutral-active text-neutral-on-dark' : 'border-neutral-border bg-neutral-surface text-neutral-text-muted hover:bg-neutral-bg'}`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
                {s === 'all' ? 'All' : incidentStatusMeta[s].label}
                <span className={`font-mono ${active ? 'text-neutral-on-dark' : 'text-neutral-text-muted'}`}>{count}</span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex-1">
            <Input placeholder="Search by ID, street, or landmark" value={query} onChange={(e) => setQuery(e.target.value)} startAdornment={<SearchIcon className="h-4 w-4" />} aria-label="Search incidents" />
          </div>
          <div className="sm:w-52">
            <Select
              value={severity}
              onChange={(v) => setSeverity(v)}
              options={[{ value: 'all', label: 'All severities' }, ...Object.keys(severityMeta).map((s) => ({ value: s, label: severityMeta[s].label }))]}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-5">
        <div className="min-w-0 flex-1">{table}</div>
        {isWide && selected && (
          <aside className="sticky top-20 h-[calc(100vh-6rem)] w-[460px] shrink-0 overflow-hidden rounded-lg border border-neutral-border" aria-label="Incident details">
            <IncidentDetailPanel key={selected.id} incident={selected} initialTab={tabParam} onClose={() => select(null)} />
          </aside>
        )}
      </div>

      {!isWide && (
        <Drawer isOpen={Boolean(selected)} onClose={() => select(null)} position="right" size="lg">
          {selected && <IncidentDetailPanel key={selected.id} incident={selected} initialTab={tabParam} onClose={() => select(null)} />}
        </Drawer>
      )}
    </div>
  );
}
