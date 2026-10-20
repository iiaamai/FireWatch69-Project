import { MapLegend } from './MapLegend.jsx';

export function IncidentMap({
  heatPoints,
  showLegend = true,
  className = '',
  ariaLabel = 'Map of Barangay 69, Tondo, Manila',
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-neutral-border bg-neutral-bg ${className}`}
      role="img"
      aria-label={ariaLabel}
    >
      <div className="flex h-full min-h-[12rem] w-full items-center justify-center px-4">
        <p className="text-sm font-medium text-neutral-text-muted">Map coming soon</p>
      </div>
      {showLegend ? (
        <div className="absolute bottom-3 left-3 hidden sm:block">
          <MapLegend showHeat={Boolean(heatPoints)} />
        </div>
      ) : null}
    </div>
  );
}
