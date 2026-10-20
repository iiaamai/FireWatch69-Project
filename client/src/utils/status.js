import {
  FlameIcon,
  AlertTriangleIcon,
  AlertCircleIcon,
  InfoIcon,
  CircleDotIcon,
  ShieldCheckIcon,
  SendIcon,
  SirenIcon,
  MapPinIcon,
  ShieldIcon,
  CheckCircle2Icon,
  CircleCheckIcon,
  NavigationIcon,
  BanIcon,
  UsersIcon,
  ClockIcon,
  XCircleIcon,
  PauseCircleIcon,
} from 'lucide-react';

const alertCritical = 'bg-alert-critical-bg text-alert-critical-text border-alert-critical-border';
const alertHigh = 'bg-alert-high-bg text-alert-high-text border-alert-high-border';
const alertMedium = 'bg-alert-medium-bg text-alert-medium-text border-alert-medium-border';
const alertLow = 'bg-alert-low-bg text-alert-low-text border-alert-low-border';
const toneNeutral = 'bg-neutral-surface text-neutral-text border-neutral-border';
const tonePrimary = 'bg-primary-tint-2 text-primary-shade-2 border-primary-tint-1';
const tonePrimaryStrong = 'bg-primary-tint-1 text-primary-shade-2 border-primary';

export const severityMeta = {
  critical: { label: 'Critical', icon: FlameIcon, className: alertCritical, dot: 'bg-primary', hex: '#991b1b' },
  high: { label: 'High', icon: AlertTriangleIcon, className: alertHigh, dot: 'bg-alert-high-text', hex: '#9a3412' },
  medium: { label: 'Medium', icon: AlertCircleIcon, className: alertMedium, dot: 'bg-alert-medium-text', hex: '#95400e' },
  moderate: { label: 'Moderate', icon: AlertCircleIcon, className: alertMedium, dot: 'bg-alert-medium-text', hex: '#95400e' },
  low: { label: 'Low', icon: InfoIcon, className: alertLow, dot: 'bg-neutral-text-muted', hex: '#374151' },
};

export const INCIDENT_STAGES = [
  'reported',
  'verified',
  'dispatched',
  'responding',
  'on_scene',
  'contained',
  'resolved',
];

export const incidentStatusMeta = {
  reported: { label: 'Reported', icon: CircleDotIcon, className: alertLow, dot: 'bg-neutral-text-muted', hex: '#374151' },
  verified: { label: 'Verified', icon: ShieldCheckIcon, className: toneNeutral, dot: 'bg-neutral-active', hex: '#111827' },
  dispatched: { label: 'Dispatched', icon: SendIcon, className: tonePrimary, dot: 'bg-primary', hex: '#dc2626' },
  responding: { label: 'Responding', icon: SirenIcon, className: tonePrimaryStrong, dot: 'bg-primary', hex: '#dc2626' },
  on_scene: { label: 'On Scene', icon: MapPinIcon, className: tonePrimaryStrong, dot: 'bg-primary-shade-1', hex: '#b01e1e' },
  contained: { label: 'Contained', icon: ShieldIcon, className: tonePrimary, dot: 'bg-primary-tone-1', hex: '#CE4538' },
  resolved: { label: 'Resolved', icon: CheckCircle2Icon, className: toneNeutral, dot: 'bg-neutral-active', hex: '#111827' },
};

export const teamStatusMeta = {
  available: { label: 'Available', icon: CircleCheckIcon, className: toneNeutral, dot: 'bg-neutral-active', hex: '#111827' },
  dispatched: { label: 'Dispatched', icon: SendIcon, className: tonePrimary, dot: 'bg-primary', hex: '#dc2626' },
  en_route: { label: 'En Route', icon: NavigationIcon, className: tonePrimaryStrong, dot: 'bg-primary', hex: '#dc2626' },
  on_scene: { label: 'On Scene', icon: MapPinIcon, className: tonePrimaryStrong, dot: 'bg-primary-shade-1', hex: '#b01e1e' },
  unavailable: { label: 'Unavailable', icon: BanIcon, className: alertLow, dot: 'bg-neutral-text-muted', hex: '#374151' },
};

export const centerStatusMeta = {
  available: { label: 'Available', icon: CircleCheckIcon, className: toneNeutral, dot: 'bg-neutral-active', hex: '#111827' },
  near_capacity: { label: 'Near Capacity', icon: UsersIcon, className: alertMedium, dot: 'bg-alert-medium-text', hex: '#95400e' },
  full: { label: 'Full', icon: XCircleIcon, className: alertCritical, dot: 'bg-primary', hex: '#991b1b' },
  unavailable: { label: 'Temporarily Unavailable', icon: PauseCircleIcon, className: alertLow, dot: 'bg-neutral-text-muted', hex: '#374151' },
};

export const mediaStatusMeta = {
  pending: { label: 'Pending review', icon: ClockIcon, className: alertMedium, dot: 'bg-alert-medium-text', hex: '#95400e' },
  verified: { label: 'Verified', icon: ShieldCheckIcon, className: toneNeutral, dot: 'bg-neutral-active', hex: '#111827' },
  rejected: { label: 'Rejected', icon: XCircleIcon, className: alertLow, dot: 'bg-neutral-text-muted', hex: '#374151' },
};

export const accountStatusMeta = {
  active: { label: 'Active', icon: CircleCheckIcon, className: toneNeutral, dot: 'bg-neutral-active', hex: '#111827' },
  pending: { label: 'Pending', icon: ClockIcon, className: alertMedium, dot: 'bg-alert-medium-text', hex: '#95400e' },
  suspended: { label: 'Suspended', icon: BanIcon, className: alertLow, dot: 'bg-neutral-text-muted', hex: '#374151' },
};

export function centerStatusFromOccupancy(occupants, capacity) {
  if (capacity <= 0) return 'unavailable';
  const ratio = occupants / capacity;
  if (ratio >= 1) return 'full';
  if (ratio >= 0.85) return 'near_capacity';
  return 'available';
}

export function isActiveIncident(status) {
  return status !== 'resolved';
}

export const severityOrder = { critical: 0, high: 1, medium: 2, moderate: 2, low: 3 };
