import { useMemo, useState } from 'react';
import { PlusIcon, DownloadIcon, EyeIcon, ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader.jsx';
import { Button } from '../components/Button.jsx';
import { Input } from '../components/Input.jsx';
import { Select } from '../components/Select.jsx';
import { Drawer } from '../components/Drawer.jsx';
import { StatusPill } from '../components/StatusPill.jsx';
import { IncidentMap } from '../components/map/IncidentMap.jsx';
import { FireChart } from '../components/charts/FireCharts.jsx';
import { CreateIncidentDialog } from '../components/history/CreateIncidentDialog.jsx';
import { useAppData } from '../contexts/AppDataContext.jsx';
import { useToast } from '../components/ToastProvider.jsx';
import { historyLocations } from '../data/history.js';
import { severityMeta } from '../utils/status.js';
import { formatDateTime, formatMinutes } from '../utils/time.js';
import { downloadFile, toCsv } from '../utils/analytics.js';

const PAGE_SIZE = 10;
const finalLabels = { resolved: 'Resolved', contained: 'Contained', false_alarm: 'False alarm' };

export function IncidentHistory() {
  const { history, teams, addHistory } = useAppData();
  const { addToast } = useToast();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [severity, setSeverity] = useState('all');
  const [status, setStatus] = useState('all');
  const [location, setLocation] = useState('all');
  const [team, setTeam] = useState('all');
  const [page, setPage] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [filterKey, setFilterKey] = useState(0);

  const filtered = useMemo(
    () =>
      history
        .filter((h) => (!from || h.date >= from) && (!to || h.date <= `${to}T23:59`))
        .filter((h) => severity === 'all' || h.severity === severity)
        .filter((h) => status === 'all' || h.finalStatus === status)
        .filter((h) => location === 'all' || h.location === location)
        .filter((h) => team === 'all' || h.teamName === team)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [history, from, to, severity, status, location, team],
  );
  const records = filtered.map((h) => ({ ...h, status: h.finalStatus }));
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const hasFilters = from || to || severity !== 'all' || status !== 'all' || location !== 'all' || team !== 'all';

  const clear = () => {
    setFrom(''); setTo(''); setSeverity('all'); setStatus('all'); setLocation('all'); setTeam('all'); setPage(0);
    setFilterKey((k) => k + 1);
  };

  const exportCsv = () => {
    downloadFile(
      'errs-fire-incident-history.csv',
      toCsv(filtered.map((h) => ({ 'Incident ID': h.id, Date: h.date, Location: h.location, Severity: severityMeta[h.severity].label, 'Response (min)': h.responseTimeMin, Team: h.teamName, 'Resolution (min)': h.resolutionTimeMin, 'Final status': finalLabels[h.finalStatus], Cause: h.cause }))),
    );
    addToast({ type: 'success', message: `Exported ${filtered.length} fire incident records` });
  };

  const nextNumber = Math.max(...history.map((h) => Number(h.id.slice(-4))), 145) + 1;

  return (
    <div>
      <PageHeader
        title="Fire Incident History"
        description="Search, review, and export all past fire incidents in Barangay 69."
        actions={
          <>
            <Button variant="secondary" leftIcon={<DownloadIcon className="h-4 w-4" />} onClick={exportCsv} disabled={!filtered.length}>Export history</Button>
            <Button leftIcon={<PlusIcon className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>Create fire incident</Button>
          </>
        }
      />

      <section className="panel mb-5 p-4" aria-label="Filters">
        <div key={filterKey} className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <Input label="From" type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(0); }} />
          <Input label="To" type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(0); }} />
          <Select label="Fire severity" value={severity} onChange={(v) => { setSeverity(v); setPage(0); }} options={[{ value: 'all', label: 'All' }, ...Object.keys(severityMeta).map((s) => ({ value: s, label: severityMeta[s].label }))]} />
          <Select label="Incident status" value={status} onChange={(v) => { setStatus(v); setPage(0); }} options={[{ value: 'all', label: 'All' }, ...Object.entries(finalLabels).map(([value, label]) => ({ value, label }))]} />
          <Select label="Location" value={location} onChange={(v) => { setLocation(v); setPage(0); }} options={[{ value: 'all', label: 'All' }, ...historyLocations.map((l) => ({ value: l, label: l }))]} />
          <Select label="Response team" value={team} onChange={(v) => { setTeam(v); setPage(0); }} options={[{ value: 'all', label: 'All' }, ...teams.map((t) => ({ value: t.name, label: t.name }))]} />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-neutral-text-muted">
          <span><span className="font-semibold text-neutral-text">{filtered.length}</span> of {history.length} fire incidents</span>
          {hasFilters && <button type="button" onClick={clear} className="inline-flex items-center gap-1 font-semibold text-neutral-text hover:underline"><XIcon className="h-3.5 w-3.5" />Clear filters</button>}
        </div>
      </section>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <FireChart kind="byDate" records={records} mode="month" />
        <FireChart kind="bySeverity" records={records} mode="month" />
        <FireChart kind="byLocation" records={records} mode="month" />
        <FireChart kind="response" records={records} mode="month" />
        <FireChart kind="resolution" records={records} mode="month" className="xl:col-span-2" />
      </div>

      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px]">
            <caption className="sr-only">Fire incident history</caption>
            <thead className="border-b border-neutral-border bg-neutral-bg">
              <tr>
                {['Incident ID', 'Date', 'Location', 'Fire Severity', 'Response Time', 'Assigned Team', 'Resolution Time', 'Final Status', ''].map((h) => (
                  <th key={h} scope="col" className="table-head">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-border">
              {rows.map((h) => (
                <tr key={h.id} className="hover:bg-neutral-bg">
                  <td className="table-cell font-mono text-xs font-semibold">{h.id}</td>
                  <td className="table-cell font-mono text-xs">{formatDateTime(h.date)}</td>
                  <td className="table-cell">{h.location}</td>
                  <td className="table-cell"><StatusPill meta={severityMeta[h.severity]} /></td>
                  <td className="table-cell font-mono text-xs">{formatMinutes(h.responseTimeMin)}</td>
                  <td className="table-cell">{h.teamName}</td>
                  <td className="table-cell font-mono text-xs">{formatMinutes(h.resolutionTimeMin)}</td>
                  <td className="table-cell"><span className={`rounded border px-2 py-0.5 text-xs font-medium ${h.finalStatus === 'false_alarm' ? 'border-neutral-border bg-neutral-bg text-neutral-text-muted' : 'border-neutral-border bg-neutral-surface text-neutral-text'}`}>{finalLabels[h.finalStatus]}</span></td>
                  <td className="table-cell text-right">
                    <Button size="small" variant="tertiary" leftIcon={<EyeIcon className="h-3.5 w-3.5" />} onClick={() => setViewing(h)}>Details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!rows.length && <p className="py-12 text-center text-sm text-neutral-text-muted">No fire incidents match these filters.</p>}
        <div className="flex items-center justify-between border-t border-neutral-border px-4 py-2.5 text-xs text-neutral-text-muted">
          <span>Page {page + 1} of {pages}</span>
          <div className="flex gap-1">
            <Button size="small" variant="secondary" iconOnly={<ChevronLeftIcon className="h-4 w-4" />} aria-label="Previous page" disabled={page === 0} onClick={() => setPage((p) => p - 1)} />
            <Button size="small" variant="secondary" iconOnly={<ChevronRightIcon className="h-4 w-4" />} aria-label="Next page" disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)} />
          </div>
        </div>
      </div>

      <Drawer isOpen={Boolean(viewing)} onClose={() => setViewing(null)} position="right" size="md">
        {viewing && (
          <div className="flex h-full flex-col bg-neutral-surface">
            <div className="border-b border-neutral-border p-5 pr-12">
              <p className="font-mono text-xs text-neutral-text-muted">{viewing.id}</p>
              <h2 className="text-xl font-bold text-neutral-text">{viewing.location}</h2>
              <div className="mt-2 flex gap-2"><StatusPill meta={severityMeta[viewing.severity]} /><span className="rounded border border-neutral-border px-2 py-0.5 text-xs">{finalLabels[viewing.finalStatus]}</span></div>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              <IncidentMap className="h-48" showLegend={false} cluster={false} pickedPoint={viewing.position} />
              <dl className="divide-y divide-neutral-border rounded-md border border-neutral-border text-sm">
                {[
                  ['Reported', formatDateTime(viewing.date)],
                  ['Cause', viewing.cause],
                  ['Response team', viewing.teamName],
                  ['Response time', formatMinutes(viewing.responseTimeMin)],
                  ['Resolution time', formatMinutes(viewing.resolutionTimeMin)],
                  ['Verified media', String(viewing.verifiedMedia)],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[140px_1fr] px-3 py-2.5"><dt className="eyebrow pt-0.5">{k}</dt><dd className="text-neutral-text">{v}</dd></div>
                ))}
              </dl>
            </div>
          </div>
        )}
      </Drawer>

      <CreateIncidentDialog
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        teamNames={teams.map((t) => t.name)}
        nextNumber={nextNumber}
        onCreate={(item) => { addHistory(item); addToast({ type: 'success', message: `${item.id} added to history` }); }}
      />
    </div>
  );
}
