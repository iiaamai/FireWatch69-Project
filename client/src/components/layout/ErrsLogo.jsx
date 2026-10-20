import { FlameIcon } from 'lucide-react';

export function ErrsLogo({ collapsed = false, inverted = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${inverted ? 'bg-neutral-surface' : 'bg-neutral-active'}`}>
        <FlameIcon className="h-5 w-5 text-primary" aria-hidden="true" />
      </div>
      {!collapsed && (
        <div className="leading-tight">
          <p className={`text-base font-extrabold tracking-tight ${inverted ? 'text-neutral-on-dark' : 'text-neutral-text'}`}>ERRS</p>
          <p className={`font-mono text-[10px] uppercase tracking-wider ${inverted ? 'text-neutral-on-dark' : 'text-neutral-text-muted'}`}>Fire Monitoring</p>
        </div>
      )}
    </div>
  );
}
