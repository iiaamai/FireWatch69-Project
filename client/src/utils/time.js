import { format, differenceInMinutes } from 'date-fns';

export const NOW = new Date('2026-09-29T14:30:00');
const BOOT = Date.now();

export function currentTime() {
  return new Date(NOW.getTime() + (Date.now() - BOOT));
}

export function nowIso() {
  return format(currentTime(), "yyyy-MM-dd'T'HH:mm:ss");
}

export function timeAgo(iso) {
  const mins = differenceInMinutes(currentTime(), new Date(iso));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function formatTime(iso) {
  return format(new Date(iso), 'HH:mm');
}

export function formatDateTime(iso) {
  return format(new Date(iso), 'MMM d, yyyy · HH:mm');
}

export function formatDate(iso) {
  return format(new Date(iso), 'MMM d, yyyy');
}

export function formatMinutes(mins) {
  if (mins === null || mins === undefined) return '—';
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}
