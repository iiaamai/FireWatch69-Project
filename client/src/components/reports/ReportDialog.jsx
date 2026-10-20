import { PrinterIcon, FileDownIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '../Dialog.jsx';
import { Button } from '../Button.jsx';
import { average, countBy } from '../../utils/analytics.js';
import { severityMeta } from '../../utils/status.js';
import { formatDateTime, formatMinutes, currentTime } from '../../utils/time.js';
import { format } from 'date-fns';

export function ReportDialog({ isOpen, onClose, records, periodLabel, preparedBy, preparedRole, onExport }) {
  const locations = countBy(records, (r) => r.location);
  const teams = countBy(records, (r) => r.teamName);
  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12);
  const cell = 'border border-neutral-border px-2 py-1.5 text-left';

  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="lg">
      <DialogHeader>Report preview</DialogHeader>
      <DialogContent>
        <div className="max-h-[65vh] overflow-y-auto rounded-md border border-neutral-border bg-neutral-bg p-4">
          <article className="print-area mx-auto max-w-[760px] bg-neutral-surface p-8 font-serif text-[13px] leading-relaxed text-neutral-text shadow-sm">
            <header className="border-b-2 border-neutral-active pb-4 text-center">
              <p className="text-xs uppercase tracking-wide">Republic of the Philippines</p>
              <p className="text-xs uppercase tracking-wide">City of Manila</p>
              <p className="font-bold uppercase">Barangay 69, Zone 6, District I, Tondo</p>
              <p className="mt-1 text-xs uppercase">Barangay Disaster Risk Reduction and Management Committee</p>
            </header>
            <h1 className="mt-5 text-center text-lg font-bold uppercase tracking-wide">Fire Incident Summary Report</h1>
            <p className="text-center text-xs">Reporting period: {periodLabel} · Generated {format(currentTime(), 'MMMM d, yyyy HH:mm')}</p>

            <h2 className="mt-6 font-bold uppercase">I. Summary</h2>
            <table className="mt-2 w-full border-collapse">
              <tbody>
                <tr><th className={cell}>Total fire incidents</th><td className={cell}>{records.length}</td><th className={cell}>Critical incidents</th><td className={cell}>{records.filter((r) => r.severity === 'critical').length}</td></tr>
                <tr><th className={cell}>Average response time</th><td className={cell}>{average(records.map((r) => r.responseTimeMin)).toFixed(1)} min</td><th className={cell}>Average resolution time</th><td className={cell}>{formatMinutes(Math.round(average(records.map((r) => r.resolutionTimeMin))))}</td></tr>
                <tr><th className={cell}>Most affected location</th><td className={cell}>{locations[0]?.name ?? '—'}</td><th className={cell}>Most active team</th><td className={cell}>{teams[0]?.name ?? '—'}</td></tr>
              </tbody>
            </table>

            <h2 className="mt-6 font-bold uppercase">II. Incidents by severity</h2>
            <table className="mt-2 w-full border-collapse">
              <thead><tr><th className={cell}>Severity</th><th className={cell}>Count</th><th className={cell}>Share</th></tr></thead>
              <tbody>
                {['critical', 'high', 'moderate', 'low'].map((s) => {
                  const n = records.filter((r) => r.severity === s).length;
                  return <tr key={s}><td className={cell}>{severityMeta[s].label}</td><td className={cell}>{n}</td><td className={cell}>{records.length ? Math.round((n / records.length) * 100) : 0}%</td></tr>;
                })}
              </tbody>
            </table>

            <h2 className="mt-6 font-bold uppercase">III. Incidents by location</h2>
            <table className="mt-2 w-full border-collapse">
              <thead><tr><th className={cell}>Location</th><th className={cell}>Count</th></tr></thead>
              <tbody>{locations.map((l) => <tr key={l.name}><td className={cell}>{l.name}</td><td className={cell}>{l.value}</td></tr>)}</tbody>
            </table>

            <h2 className="mt-6 font-bold uppercase">IV. Incident log (latest {sorted.length})</h2>
            <table className="mt-2 w-full border-collapse text-[12px]">
              <thead><tr><th className={cell}>ID</th><th className={cell}>Date</th><th className={cell}>Location</th><th className={cell}>Severity</th><th className={cell}>Team</th><th className={cell}>Response</th></tr></thead>
              <tbody>
                {sorted.map((r) => (
                  <tr key={r.id}><td className={cell}>{r.id}</td><td className={cell}>{formatDateTime(r.date)}</td><td className={cell}>{r.location}</td><td className={cell}>{severityMeta[r.severity].label}</td><td className={cell}>{r.teamName}</td><td className={cell}>{formatMinutes(r.responseTimeMin)}</td></tr>
                ))}
              </tbody>
            </table>

            <div className="mt-12 grid grid-cols-2 gap-10 text-center">
              <div>
                <p className="text-left text-xs">Prepared by:</p>
                <p className="mt-8 border-t border-neutral-active pt-1 font-bold uppercase">{preparedBy}</p>
                <p className="text-xs">{preparedRole}</p>
              </div>
              <div>
                <p className="text-left text-xs">Noted by:</p>
                <p className="mt-8 border-t border-neutral-active pt-1 font-bold uppercase">Hon. Ernesto Villar</p>
                <p className="text-xs">Punong Barangay</p>
              </div>
            </div>
          </article>
        </div>
      </DialogContent>
      <DialogFooter>
        <div className="flex w-full justify-end gap-2">
          <Button variant="secondary" leftIcon={<PrinterIcon className="h-4 w-4" />} onClick={() => window.print()}>Print</Button>
          <Button leftIcon={<FileDownIcon className="h-4 w-4" />} onClick={onExport}>Export PDF</Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
}
