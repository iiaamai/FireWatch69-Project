/* eslint-disable react-refresh/only-export-components */
export function ChartCard({ title, subtitle, children, className = '', empty = false }) {
  return (
    <section className={`panel p-4 ${className}`} aria-label={title}>
      <div className="mb-3">
        <h2 className="text-sm font-bold text-neutral-text">{title}</h2>
        {subtitle && <p className="text-xs text-neutral-text-muted">{subtitle}</p>}
      </div>
      {empty ? (
        <div className="flex h-[220px] items-center justify-center rounded-md border border-dashed border-neutral-border text-sm text-neutral-text-muted">No fire incidents in this range</div>
      ) : (
        children
      )}
    </section>
  );
}

export const axisProps = {
  tick: { fontSize: 11, fill: 'var(--neutral-text-muted)', fontFamily: 'ui-monospace, Consolas, monospace' },
  axisLine: { stroke: 'var(--neutral-border)' },
  tickLine: false,
};

export const tooltipStyle = {
  contentStyle: { borderRadius: 6, border: '1px solid var(--neutral-border)', fontSize: 12 },
  cursor: { fill: 'var(--neutral-bg)' },
};
