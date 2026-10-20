import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { byHourBlock, countBy, groupByDate } from '../../utils/analytics.js';
import { severityMeta } from '../../utils/status.js';
import { ChartCard, axisProps, tooltipStyle } from './ChartCard.jsx';

const titles = {
  byDate: ['Fire incidents by date', 'Number of reported fire incidents'],
  bySeverity: ['Fire incidents by severity', 'Share of incidents per severity level'],
  response: ['Average response time', 'Minutes from report to team arrival'],
  resolution: ['Average resolution time', 'Minutes from report to resolution'],
  byLocation: ['Fire incidents by location', 'Nearest street within Barangay 69'],
  frequency: ['Incident frequency by time of day', 'When fires are most often reported'],
  teamActivity: ['Response team activity', 'Incidents handled per team'],
};

export function FireChart({ kind, records, mode, className }) {
  const [title, subtitle] = titles[kind];
  const series = groupByDate(records, mode);

  const body = () => {
    switch (kind) {
      case 'byDate':
        return (
          <BarChart data={series}>
            <CartesianGrid vertical={false} stroke="var(--neutral-border)" />
            <XAxis dataKey="label" {...axisProps} />
            <YAxis allowDecimals={false} width={28} {...axisProps} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="incidents" name="Incidents" fill="var(--neutral-active)" radius={[3, 3, 0, 0]} maxBarSize={28} />
          </BarChart>
        );
      case 'response':
      case 'resolution':
        return (
          <LineChart data={series}>
            <CartesianGrid vertical={false} stroke="var(--neutral-border)" />
            <XAxis dataKey="label" {...axisProps} />
            <YAxis width={34} {...axisProps} unit="m" />
            <Tooltip {...tooltipStyle} />
            <Line type="monotone" dataKey={kind} name={kind === 'response' ? 'Avg response (min)' : 'Avg resolution (min)'} stroke={kind === 'response' ? 'var(--neutral-active)' : 'var(--neutral-text-muted)'} strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        );
      case 'bySeverity': {
        const data = ['critical', 'high', 'moderate', 'low'].map((s) => ({ name: severityMeta[s].label, key: s, value: records.filter((r) => r.severity === s).length }));
        return (
          <PieChart>
            <Tooltip {...tooltipStyle} />
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2} stroke="var(--neutral-surface)">
              {data.map((d) => (
                <Cell key={d.key} fill={severityMeta[d.key].hex} />
              ))}
            </Pie>
          </PieChart>
        );
      }
      case 'byLocation':
      case 'teamActivity': {
        const data = countBy(records, (r) => (kind === 'byLocation' ? r.location : r.teamName));
        return (
          <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
            <CartesianGrid horizontal={false} stroke="var(--neutral-border)" />
            <XAxis type="number" allowDecimals={false} {...axisProps} />
            <YAxis type="category" dataKey="name" width={120} {...axisProps} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="value" name="Incidents" fill={kind === 'byLocation' ? 'var(--neutral-active)' : 'var(--neutral-text-muted)'} radius={[0, 3, 3, 0]} maxBarSize={18} />
          </BarChart>
        );
      }
      case 'frequency':
        return (
          <BarChart data={byHourBlock(records)}>
            <CartesianGrid vertical={false} stroke="var(--neutral-border)" />
            <XAxis dataKey="name" {...axisProps} />
            <YAxis allowDecimals={false} width={28} {...axisProps} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="value" name="Incidents" fill="var(--neutral-text-muted)" radius={[3, 3, 0, 0]} maxBarSize={36} />
          </BarChart>
        );
      default:
        return null;
    }
  };

  return (
    <ChartCard title={title} subtitle={subtitle} className={className} empty={!records.length}>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          {body()}
        </ResponsiveContainer>
      </div>
      {kind === 'bySeverity' && (
        <ul className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-neutral-text-muted">
          {['critical', 'high', 'moderate', 'low'].map((s) => {
            const Icon = severityMeta[s].icon;
            return (
              <li key={s} className="flex items-center gap-1">
                <Icon className="h-3.5 w-3.5" style={{ color: severityMeta[s].hex }} aria-hidden="true" />
                {severityMeta[s].label} <span className="font-mono text-neutral-text-muted">{records.filter((r) => r.severity === s).length}</span>
              </li>
            );
          })}
        </ul>
      )}
    </ChartCard>
  );
}
