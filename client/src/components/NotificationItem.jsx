import {
  FlameIcon,
  ShieldCheckIcon,
  SendIcon,
  MapPinIcon,
  RefreshCwIcon,
  ShieldIcon,
  CheckCircle2Icon,
  TentIcon,
  CheckIcon,
  RouteIcon,
  SatelliteIcon,
  HandIcon,
} from 'lucide-react';
import { severityMeta } from '../utils/status.js';
import { timeAgo } from '../utils/time.js';

const typeIcon = {
  new_incident: FlameIcon,
  verified: ShieldCheckIcon,
  dispatched: SendIcon,
  accepted: HandIcon,
  arrived: MapPinIcon,
  route_changed: RouteIcon,
  gps_update: SatelliteIcon,
  status_changed: RefreshCwIcon,
  contained: ShieldIcon,
  resolved: CheckCircle2Icon,
  center_status: TentIcon,
};

export function NotificationItem({ notification: n, onOpen, onMarkRead, compact = false }) {
  const Icon = typeIcon[n.type] ?? FlameIcon;
  const sev = n.severity === 'info' ? null : severityMeta[n.severity];
  return (
    <div className={`group flex gap-3 ${compact ? 'px-4 py-3' : 'px-5 py-4'} ${n.read ? 'bg-neutral-surface' : 'bg-neutral-bg'}`}>
      <div className="relative mt-0.5">
        <span className={`flex h-8 w-8 items-center justify-center rounded-md border ${sev ? sev.className : 'border-neutral-border bg-neutral-surface text-neutral-text-muted'}`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        {!n.read && <span className="absolute -left-1.5 top-3 h-2 w-2 rounded-full bg-primary" aria-label="Unread" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm ${n.read ? 'font-medium text-neutral-text' : 'font-semibold text-neutral-text'}`}>{n.title}</p>
          <span className="shrink-0 font-mono text-[11px] text-neutral-text-muted">{timeAgo(n.timestamp)}</span>
        </div>
        <p className="mt-0.5 text-sm text-neutral-text-muted">{n.message}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {sev && (
            <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] font-medium ${sev.className}`}>
              {sev.label}
            </span>
          )}
          {n.incidentId && <span className="font-mono text-[11px] text-neutral-text-muted">{n.incidentId}</span>}
          <span className="flex-1" />
          <button type="button" onClick={onOpen} className="text-xs font-semibold text-neutral-text underline-offset-2 hover:underline">
            {n.incidentId ? 'Open incident' : 'View'}
          </button>
          {!n.read && (
            <button type="button" onClick={onMarkRead} className="inline-flex items-center gap-1 text-xs text-neutral-text-muted hover:text-neutral-text" aria-label={`Mark "${n.title}" as read`}>
              <CheckIcon className="h-3.5 w-3.5" /> {compact ? '' : 'Mark as read'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
