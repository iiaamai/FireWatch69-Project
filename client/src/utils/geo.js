import { streets } from '../data/mapLayout.js';

export const METERS_PER_UNIT = 1.5;

export function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function formatMeters(units) {
  const m = units * METERS_PER_UNIT;
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m / 10) * 10} m`;
}

export function routeLength(points, start) {
  let total = 0;
  let prev = start;
  for (const p of points) {
    total += distance(prev, p);
    prev = p;
  }
  return total;
}

const STREET_ROWS = [130, 300, 470];

export function buildRoute(from, to) {
  const row = STREET_ROWS.reduce(
    (best, r) => (Math.abs(r - to.y) < Math.abs(best - to.y) ? r : best),
    STREET_ROWS[0],
  );
  return [
    { x: from.x, y: row },
    { x: to.x, y: row },
    { x: to.x, y: to.y },
  ];
}

export function nearestStreet(p) {
  let best = streets[0];
  let bestD = Infinity;
  for (const s of streets) {
    const [a, b] = s.points;
    const d =
      a[0] === b[0]
        ? Math.abs(p.x - a[0]) + (p.y < Math.min(a[1], b[1]) || p.y > Math.max(a[1], b[1]) ? 999 : 0)
        : Math.abs(p.y - a[1]) + (p.x < Math.min(a[0], b[0]) || p.x > Math.max(a[0], b[0]) ? 999 : 0);
    if (d < bestD) {
      bestD = d;
      best = s;
    }
  }
  return best.name;
}
