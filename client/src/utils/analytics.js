import { format, startOfDay, subDays, subMonths } from 'date-fns';
import { NOW } from './time.js';
import { nearestStreet } from './geo.js';

export const rangeLabels = {
  today: 'Today',
  week: 'This week',
  month: 'This month',
  quarter: 'Last 3 months',
  custom: 'Custom range',
};

export function toRecords(history, incidents, teams) {
  const live = incidents.map((i) => ({
    id: i.id,
    date: i.reportedAt,
    location: nearestStreet(i.position),
    severity: i.severity,
    responseTimeMin: i.responseTimeMin,
    resolutionTimeMin: i.status === 'resolved' ? 46 : null,
    teamName: teams.find((t) => t.id === i.assignedTeamId)?.name ?? 'Unassigned',
    verifiedMedia: i.media.filter((m) => m.status === 'verified').length,
    position: i.position,
    status: i.status,
  }));
  const past = history.map((h) => ({
    id: h.id,
    date: h.date,
    location: h.location,
    severity: h.severity,
    responseTimeMin: h.responseTimeMin,
    resolutionTimeMin: h.resolutionTimeMin,
    teamName: h.teamName,
    verifiedMedia: h.verifiedMedia,
    position: h.position,
    status: h.finalStatus,
  }));
  return [...live, ...past];
}

export function rangeBounds(range, from, to) {
  const end = new Date(NOW.getTime() + 24 * 3600 * 1000);
  switch (range) {
    case 'today':
      return [startOfDay(NOW), end];
    case 'week':
      return [startOfDay(subDays(NOW, 6)), end];
    case 'month':
      return [new Date(NOW.getFullYear(), NOW.getMonth(), 1), end];
    case 'quarter':
      return [startOfDay(subMonths(NOW, 3)), end];
    case 'custom':
      return [from ? new Date(from) : new Date('2026-01-01'), to ? new Date(`${to}T23:59:59`) : end];
    default:
      return [startOfDay(subMonths(NOW, 3)), end];
  }
}

export function filterByRange(records, bounds) {
  const [start, end] = bounds;
  return records.filter((r) => {
    const d = new Date(r.date);
    return d >= start && d <= end;
  });
}

export function average(values) {
  const v = values.filter((x) => x !== null && x !== undefined);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0;
}

export function groupByDate(records, mode) {
  const map = new Map();
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
  for (const r of sorted) {
    const d = new Date(r.date);
    const key = mode === 'day' ? format(d, 'yyyy-MM-dd') : format(d, 'yyyy-MM');
    const label = mode === 'day' ? format(d, 'MMM d') : format(d, 'MMM');
    const entry = map.get(key) ?? { label, count: 0, response: [], resolution: [] };
    entry.count += 1;
    entry.response.push(r.responseTimeMin);
    entry.resolution.push(r.resolutionTimeMin);
    map.set(key, entry);
  }
  return Array.from(map.values()).map((e) => ({
    label: e.label,
    incidents: e.count,
    response: Number(average(e.response).toFixed(1)),
    resolution: Math.round(average(e.resolution)),
  }));
}

export function countBy(records, key) {
  const map = new Map();
  records.forEach((r) => map.set(key(r), (map.get(key(r)) ?? 0) + 1));
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function byHourBlock(records) {
  const blocks = ['00–04', '04–08', '08–12', '12–16', '16–20', '20–24'];
  const counts = blocks.map((b) => ({ name: b, value: 0 }));
  records.forEach((r) => {
    counts[Math.floor(new Date(r.date).getHours() / 4)].value += 1;
  });
  return counts;
}

export function toCsv(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
  return [headers.join(','), ...rows.map((r) => headers.map((h) => esc(r[h])).join(','))].join('\n');
}

export function downloadFile(filename, content, type = 'text/csv') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
