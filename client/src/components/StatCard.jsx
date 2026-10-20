import { ArrowDownRightIcon, ArrowUpRightIcon, ChevronRightIcon } from 'lucide-react';

export function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  caption,
  trend,
  indicator,
  emphasis = false,
  onClick,
}) {
  const Trend = trend?.direction === 'up' ? ArrowUpRightIcon : ArrowDownRightIcon;
  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="eyebrow">{label}</p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-md ${emphasis ? 'bg-primary text-neutral-on-dark' : 'bg-neutral-bg text-neutral-text-muted'}`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-2 flex items-baseline gap-1.5">
        <span className={`text-4xl font-extrabold tabular-nums tracking-tight ${emphasis ? 'text-primary-shade-1' : 'text-neutral-text'}`}>{value}</span>
        {unit && <span className="text-sm font-medium text-neutral-text-muted">{unit}</span>}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        {indicator}
        {trend && (
          <span className={`inline-flex items-center gap-0.5 font-medium ${trend.positive ? 'text-neutral-text-muted' : 'text-alert-critical-text'}`}>
            <Trend className="h-3.5 w-3.5" aria-hidden="true" />
            {trend.text}
          </span>
        )}
        {caption && <span className="text-neutral-text-muted">{caption}</span>}
      </div>
    </>
  );
  const base = `panel flex flex-col p-4 text-left ${emphasis ? 'border-alert-critical-border' : ''}`;
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${base} group transition-colors hover:border-neutral-text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-border`}>
        {content}
        <span className="mt-3 inline-flex items-center gap-1 border-t border-neutral-border pt-2.5 text-xs font-semibold text-neutral-text-muted group-hover:text-neutral-text">
          Open <ChevronRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </button>
    );
  }
  return <div className={base}>{content}</div>;
}
