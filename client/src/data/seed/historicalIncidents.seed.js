import { point } from './geo.js';
import { lngLatToMapPosition } from './geo.js';

/** Closed incidents for analytics/history screens (fictional demo data). */
export const seedHistoricalIncidents = [
  { incidentCode: 'FW69-2026-0139', reportedAt: '2026-09-28T21:14:00.000Z', addressText: 'Tayuman St', severity: 'high', responseTimeMin: 7, teamName: 'Engine 1', resolutionTimeMin: 95, finalStatus: 'closed', location: point(120.9768, 14.6182), verifiedMedia: 5, cause: 'Electrical overload' },
  { incidentCode: 'FW69-2026-0138', reportedAt: '2026-09-26T13:02:00.000Z', addressText: 'Pritil St', severity: 'medium', responseTimeMin: 5, teamName: 'Brgy 69 Fire Brigade', resolutionTimeMin: 48, finalStatus: 'closed', location: point(120.9802, 14.6145), verifiedMedia: 2, cause: 'LPG leak' },
  { incidentCode: 'FW69-2026-0137', reportedAt: '2026-09-24T02:40:00.000Z', addressText: 'Herbosa St', severity: 'critical', responseTimeMin: 9, teamName: 'Engine 7', resolutionTimeMin: 210, finalStatus: 'closed', location: point(120.9745, 14.6168), verifiedMedia: 9, cause: 'Unattended candle' },
  { incidentCode: 'FW69-2026-0136', reportedAt: '2026-09-21T18:25:00.000Z', addressText: 'Moriones St', severity: 'low', responseTimeMin: 4, teamName: 'Brgy 69 Fire Brigade', resolutionTimeMin: 20, finalStatus: 'closed', location: point(120.9738, 14.6102), verifiedMedia: 1, cause: 'Garbage burning' },
  { incidentCode: 'FW69-2026-0135', reportedAt: '2026-09-18T11:50:00.000Z', addressText: 'Tayuman St', severity: 'medium', responseTimeMin: 6, teamName: 'Engine 4', resolutionTimeMin: 55, finalStatus: 'closed', location: point(120.977, 14.6185), verifiedMedia: 3, cause: 'Cooking fire' },
  { incidentCode: 'FW69-2026-0134', reportedAt: '2026-09-15T20:10:00.000Z', addressText: 'Velasquez St', severity: 'high', responseTimeMin: 8, teamName: 'Rescue 2', resolutionTimeMin: 120, finalStatus: 'closed', location: point(120.981, 14.6138), verifiedMedia: 4, cause: 'Electrical overload' },
  { incidentCode: 'FW69-2026-0133', reportedAt: '2026-09-12T07:35:00.000Z', addressText: 'Juan Luna St', severity: 'low', responseTimeMin: 5, teamName: 'Engine 1', resolutionTimeMin: 25, finalStatus: 'rejected', location: point(120.9715, 14.6125), verifiedMedia: 0, cause: 'Smoke from cooking' },
  { incidentCode: 'FW69-2026-0132', reportedAt: '2026-09-09T16:48:00.000Z', addressText: 'Tayuman St', severity: 'critical', responseTimeMin: 10, teamName: 'Engine 1', resolutionTimeMin: 240, finalStatus: 'closed', location: point(120.9765, 14.6175), verifiedMedia: 11, cause: 'Illegal electrical tapping' },
  { incidentCode: 'FW69-2026-0131', reportedAt: '2026-09-05T22:05:00.000Z', addressText: 'Pritil St', severity: 'medium', responseTimeMin: 6, teamName: 'Engine 7', resolutionTimeMin: 60, finalStatus: 'closed', location: point(120.9808, 14.614), verifiedMedia: 2, cause: 'LPG leak' },
  { incidentCode: 'FW69-2026-0130', reportedAt: '2026-09-02T12:20:00.000Z', addressText: 'N. Zamora St', severity: 'low', responseTimeMin: 4, teamName: 'Engine 4', resolutionTimeMin: 18, finalStatus: 'closed', location: point(120.9825, 14.6165), verifiedMedia: 1, cause: 'Overheated appliance' },
  { incidentCode: 'FW69-2026-0129', reportedAt: '2026-08-29T19:30:00.000Z', addressText: 'Herbosa St', severity: 'high', responseTimeMin: 7, teamName: 'Engine 7', resolutionTimeMin: 110, finalStatus: 'closed', location: point(120.9742, 14.6155), verifiedMedia: 6, cause: 'Electrical overload' },
  { incidentCode: 'FW69-2026-0128', reportedAt: '2026-08-25T03:15:00.000Z', addressText: 'Tayuman St', severity: 'critical', responseTimeMin: 11, teamName: 'Engine 1', resolutionTimeMin: 260, finalStatus: 'closed', location: point(120.9775, 14.6172), verifiedMedia: 8, cause: 'Unattended candle' },
].map((row) => ({
  id: row.incidentCode,
  date: row.reportedAt,
  location: row.addressText,
  severity: row.severity === 'medium' ? 'moderate' : row.severity,
  responseTimeMin: row.responseTimeMin,
  teamName: row.teamName,
  resolutionTimeMin: row.resolutionTimeMin,
  finalStatus: row.finalStatus === 'closed' ? 'resolved' : row.finalStatus === 'rejected' ? 'false_alarm' : row.finalStatus,
  position: lngLatToMapPosition(row.location.coordinates),
  verifiedMedia: row.verifiedMedia,
  cause: row.cause,
}));

export const historyLocationOptions = [
  'Tayuman St',
  'Pritil St',
  'Moriones St',
  'Juan Luna St',
  'Herbosa St',
  'Velasquez St',
  'N. Zamora St',
];
