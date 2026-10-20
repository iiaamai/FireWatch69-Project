import { useMemo, useState } from 'react';
import { MapPinIcon, ImageIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader.jsx';
import { IncidentMap } from '../components/map/IncidentMap.jsx';
import { Toggle } from '../components/Toggle.jsx';
import { Checkbox } from '../components/Checkbox.jsx';
import { Select } from '../components/Select.jsx';
import { useAppData } from '../contexts/AppDataContext.jsx';
import { countBy, filterByRange, rangeBounds, rangeLabels, toRecords } from '../utils/analytics.js';
import { isActiveIncident, severityMeta } from '../utils/status.js';

const severityWeight = { critical: 1.6, high: 1.25, moderate: 1, low: 0.7 };

export function Heatmap() {
  const { history, incidents, teams } = useAppData();
  const [range, setRange] = useState('quarter');
  const [severities, setSeverities] = useState(['critical', 'high', 'moderate', 'low']);
  const [mediaWeighting, setMediaWeighting] = useState(false);
  const [showActive, setShowActive] = useState(true);
  const [focus, setFocus] = useState(null);

  const records = useMemo(
    () => filterByRange(toRecords(history, incidents, teams), rangeBounds(range)).filter((r) => severities.includes(r.severity)),
    [history, incidents, teams, range, severities],
  );

  const heatPoints = records.map((r) => ({
    position: r.position,
    severity: r.severity,
    weight: mediaWeighting ? 0.4 + r.verifiedMedia * 0.35 : severityWeight[r.severity],
  }));

  const hotspots = countBy(records, (r) => r.location).slice(0, 6);
  const maxCount = hotspots[0]?.value ?? 1;
  const active = incidents.filter((i) => isActiveIncident(i.status) && severities.includes(i.severity));
  const mediaTotal = records.reduce((s, r) => s + r.verifiedMedia, 0);

  const toggleSeverity = (s) => setSeverities((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  return (
    <div>
      <PageHeader title="Fire Incident Heatmap" description="Fire incident density, recurring hotspots, and severity concentration across Barangay 69." />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]">
        <IncidentMap
          className="h-[520px] xl:h-[calc(100vh-12rem)]"
          heatPoints={heatPoints}
          incidents={showActive ? active : []}
          focus={focus}
          ariaLabel="Fire incident density heatmap of Barangay 69"
        />
        <aside className="space-y-4">
          <section className="panel space-y-4 p-4" aria-label="Heatmap filters">
            <Select
              label="Date range"
              value={range}
              onChange={(v) => setRange(v)}
              options={['week', 'month', 'quarter'].map((k) => ({ value: k, label: rangeLabels[k] })).concat([{ value: 'custom', label: 'All time' }])}
            />
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-neutral-text">Fire severity</legend>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(severityMeta).map((s) => {
                  const Icon = severityMeta[s].icon;
                  return (
                    <Checkbox
                      key={s}
                      size="sm"
                      checked={severities.includes(s)}
                      onChange={() => toggleSeverity(s)}
                      label={<span className="inline-flex items-center gap-1 text-sm"><Icon className="h-3.5 w-3.5" style={{ color: severityMeta[s].hex }} aria-hidden="true" />{severityMeta[s].label}</span>}
                    />
                  );
                })}
              </div>
            </fieldset>
            <div className="space-y-3 border-t border-neutral-border pt-3">
              <Toggle checked={showActive} onChange={setShowActive} label="Show active fire incidents" size="small" />
              <div>
                <Toggle checked={mediaWeighting} onChange={setMediaWeighting} label="Media weighting view" size="small" />
                <p className="mt-1 flex items-center gap-1 text-xs text-neutral-text-muted"><ImageIcon className="h-3 w-3" aria-hidden="true" />Weights density by verified incident media ({mediaTotal} items). Authorized users only.</p>
              </div>
            </div>
          </section>

          <section className="panel p-4" aria-labelledby="hotspots-title">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 id="hotspots-title" className="text-sm font-bold text-neutral-text">High-frequency locations</h2>
              <span className="font-mono text-[11px] text-neutral-text-muted">{records.length} incidents</span>
            </div>
            {hotspots.length ? (
              <ol className="space-y-2.5">
                {hotspots.map((h, i) => {
                  const first = records.find((r) => r.location === h.name);
                  return (
                    <li key={h.name}>
                      <button type="button" onClick={() => first && setFocus({ point: first.position, key: Date.now() })} className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-border">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 font-medium text-neutral-text"><span className="w-4 font-mono text-xs text-neutral-text-muted">{i + 1}</span><MapPinIcon className="h-3.5 w-3.5 text-neutral-text-muted" aria-hidden="true" />{h.name}</span>
                          <span className="font-mono text-xs text-neutral-text-muted">{h.value}</span>
                        </div>
                        <div className="ml-6 mt-1 h-1.5 overflow-hidden rounded-full bg-neutral-bg">
                          <div className="h-full rounded-full bg-alert-high-text" style={{ width: `${(h.value / maxCount) * 100}%` }} />
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="text-sm text-neutral-text-muted">No fire incidents for these filters.</p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
