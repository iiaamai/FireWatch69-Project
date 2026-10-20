import { cn } from '../utils/cn.js';

export function Badge({ children, className = '' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded border border-neutral-border bg-neutral-surface px-1.5 py-0.5 text-xs font-medium text-neutral-text',
        className,
      )}
    >
      {children}
    </span>
  );
}
