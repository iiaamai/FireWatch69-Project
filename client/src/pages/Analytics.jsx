import { useMemo, useState } from 'react';
import { FileTextIcon, FileDownIcon, FlameIcon, TimerIcon, HourglassIcon, MapPinIcon, AlertOctagonIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader.jsx';
import { Button } from '../components/Button.jsx';
import { Input } from '../components/Input.jsx';
import { FireChart } from '../components/charts/FireCharts.jsx';
import { ReportDialog } from '../components/reports/ReportDialog.jsx';
import { useAppData } from '../contexts/AppDataContext.jsx';
import { useToast } from '../components/ToastProvider.jsx';
import { average, countBy, filterByRange, rangeBounds, rangeLabels, toRecords } from '../utils/analytics.js';
import { formatMinutes } from '../utils/time.js';
import { format } from 'date-fns';

export function Analytics() {
  const { history, incidents, teams, currentUser, addLog } = useAppData();
  const { addToast } = useToast();
  const [range, setRange] = useState('quarter');
  const [from, setFrom] = useState('2026-06-01');
  const [to, setTo] = useState('2026-09-29');
  const [reportOpen, setReportOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  const all = useMemo(() => toRecords(history, incidents, teams), [history, incidents, teams]);
  const bounds = rangeBounds(range, from, to);
  const records = filterByRange(all, bounds);
  const mode = range === 'quarter' || range === 'custom' ? 'month' : 'day';
  const periodLabel = range === 'custom' ? `${from} to ${to}` : `${rangeLabels[range]} (${format(bounds[0], 'MMM d')} – ${format(new Date(bounds[1].getTime() - 86400000), 'MMM d, yyyy')})`;
  const topLocation = countBy(records, (r) => r.location)[0];

  const kpis = [
    { label: 'Fire incidents', value: String(records.length), icon: FlameIcon },
    { label: 'Critical incidents', value: String(records.filter((r) => r.severity === 'critical').length), icon: AlertOctagonIcon },
    { label: 'Avg response time', value: `${average(records.map((r) => r.responseTimeMin)).toFixed(1)} min`, icon: TimerIcon },
    { label: 'Avg resolution time', value: formatMinutes(Math.round(average(records.map((r) => r.resolutionTimeMin)))), icon: HourglassIcon },
    { label: 'Most affected', value: topLocation?.name ?? '—', icon: MapPinIcon },
  ];

  const generate = () => {
    setGenerating(true);
    window.setTimeout(() => {
      setGenerating(false);
      setReportOpen(true);
      addLog('Generated report', 'Reports', `Generated fire incident report for ${periodLabel}.`);
    }, 700);
  };

  const exportPdf = () => {
    addLog('Exported report', 'Reports', `Exported fire incident report (PDF) for ${periodLabel}.`);
    addToast({ type: 'success', message: 'Use “Save as PDF” in the print dialog to export.' });
    window.setTimeout(() => window.print(), 150);
  };

  return (
    <div>
      <PageHeader
        title="Analytics & Reports"
        description="Fire incident trends, response performance, and official reports for Barangay 69."
        actions={
          <>
            <Button variant="secondary" leftIcon={<FileDownIcon className="h-4 w-4" />} onClick={() => setReportOpen(true)}>Export PDF</Button>
            <Button leftIcon={<FileTextIcon className="h-4 w-4" />} loading={generating} onClick={generate}>Generate report</Button>
          </>
        }
      />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Date range">
          {Object.keys(rangeLabels).map((k) => (
            <button key={k} type="button" aria-pressed={range === k} onClick={() => setRange(k)} className={`chip px-3 py-2 ${range === k ? 'border-neutral-active bg-neutral-active text-neutral-on-dark' : 'border-neutral-border bg-neutral-surface text-neutral-text-muted hover:bg-neutral-bg'}`}>
              {rangeLabels[k]}
            </button>
          ))}
        </div>
        {range === 'custom' && (
          <div className="flex gap-2">
            <Input label="From" type="date" size="small" value={from} onChange={(e) => setFrom(e.target.value)} />
            <Input label="To" type="date" size="small" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        )}
        <p className="font-mono text-xs text-neutral-text-muted lg:ml-auto">{periodLabel}</p>
      </div>

      <section aria-label="Key metrics" className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {kpis.map((k) => (
          <div key={k.label} className="panel p-4">
            <div className="flex items-center justify-between"><p className="eyebrow">{k.label}</p><k.icon className="h-4 w-4 text-neutral-text-muted" aria-hidden="true" /></div>
            <p className="mt-2 truncate text-2xl font-extrabold tabular-nums text-neutral-text">{k.value}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <FireChart kind="byDate" records={records} mode={mode} className="xl:col-span-2" />
        <FireChart kind="bySeverity" records={records} mode={mode} />
        <FireChart kind="response" records={records} mode={mode} />
        <FireChart kind="resolution" records={records} mode={mode} />
        <FireChart kind="frequency" records={records} mode={mode} />
        <FireChart kind="byLocation" records={records} mode={mode} />
        <FireChart kind="teamActivity" records={records} mode={mode} className="xl:col-span-2" />
      </div>

      <ReportDialog
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        records={records}
        periodLabel={periodLabel}
        preparedBy={currentUser.name}
        preparedRole={`${currentUser.role}, ${currentUser.department}`}
        onExport={exportPdf}
      />
    </div>
  );
}
