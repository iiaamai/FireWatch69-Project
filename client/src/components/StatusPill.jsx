import { InfoIcon } from 'lucide-react';

const fallbackMeta = {
  label: 'Unknown',
  icon: InfoIcon,
  className: 'bg-neutral-surface text-neutral-text-muted border-neutral-border',
  dot: 'bg-neutral-text-muted',
};

export function StatusPill({ meta, size = 'sm', pulse = false, className = '' }) {
  const safe = meta ?? fallbackMeta;
  const Icon = safe.icon;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border font-medium ${safe.className} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
      } ${className}`}
    >
      {pulse ? (
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${safe.dot}`} />
          <span className={`relative inline-flex h-2 w-2 rounded-full ${safe.dot}`} />
        </span>
      ) : (
        <Icon className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} aria-hidden="true" />
      )}
      {safe.label}
    </span>
  );
}
