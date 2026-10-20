import { SEED_ID } from './seedIds.js';

export const seedActivityLogs = [
  { id: '671f00060000000000000120', actor: SEED_ID.userLeonora, action: 'Dispatched team', entityType: 'Incident', entityId: SEED_ID.inc142, summary: 'Dispatched Engine 7 as backup to FW69-2026-0142.', occurredAt: '2026-09-29T14:27:00.000Z' },
  { id: '671f00060000000000000119', actor: null, action: 'Dispatch failed', entityType: 'Incident', entityId: SEED_ID.inc144, summary: 'Engine 6 unavailable — dispatch to FW69-2026-0144 failed.', occurredAt: '2026-09-29T14:24:00.000Z' },
  { id: '671f00060000000000000118', actor: SEED_ID.userLeonora, action: 'Verified incident', entityType: 'Incident', entityId: SEED_ID.inc144, summary: 'Verified report from Brgy. Tanod A. Reyes.', occurredAt: '2026-09-29T14:23:00.000Z' },
  { id: '671f00060000000000000117', actor: SEED_ID.userLeonora, action: 'Changed severity', entityType: 'Incident', entityId: SEED_ID.inc142, summary: 'Severity changed from High to Critical.', occurredAt: '2026-09-29T14:22:00.000Z' },
  { id: '671f00060000000000000116', actor: SEED_ID.userTeresa, action: 'Updated occupancy', entityType: 'EvacuationCenter', entityId: SEED_ID.ecCoveredCourt, summary: 'Barangay 69 Covered Court occupancy updated to 186.', occurredAt: '2026-09-29T14:20:00.000Z' },
  { id: '671f00060000000000000115', actor: SEED_ID.userMarco, action: 'Accepted assignment', entityType: 'Assignment', entityId: 'asg-142-e1', summary: 'Engine 1 accepted dispatch and is en route.', occurredAt: '2026-09-29T14:14:00.000Z' },
  { id: '671f00060000000000000114', actor: SEED_ID.userLeonora, action: 'Dispatched team', entityType: 'Incident', entityId: SEED_ID.inc142, summary: 'Dispatched Engine 1 to FW69-2026-0142.', occurredAt: '2026-09-29T14:11:00.000Z' },
  { id: '671f00060000000000000113', actor: SEED_ID.userTeresa, action: 'Changed status', entityType: 'EvacuationCenter', entityId: SEED_ID.ecParishHall, summary: 'Sto. Niño Parish Hall marked as Full.', occurredAt: '2026-09-29T13:50:00.000Z' },
  { id: '671f00060000000000000112', actor: SEED_ID.userEduardo, action: 'Changed status', entityType: 'Incident', entityId: SEED_ID.inc141, summary: 'FW69-2026-0141 note: fire contained, overhaul ongoing.', occurredAt: '2026-09-29T13:40:00.000Z' },
  { id: '671f00060000000000000111', actor: SEED_ID.userJomar, action: 'Arrived on scene', entityType: 'Assignment', entityId: 'asg-143-r2', summary: 'Rescue 2 arrived at Pritil Public Market.', occurredAt: '2026-09-29T13:51:00.000Z' },
  { id: '671f00060000000000000110', actor: SEED_ID.userErnesto, action: 'Created user', entityType: 'User', entityId: SEED_ID.userArnold, summary: 'Created account for Arnold Sy (pending).', occurredAt: '2026-09-29T11:05:00.000Z' },
  { id: '671f00060000000000000109', actor: SEED_ID.userLeonora, action: 'Resolved incident', entityType: 'Incident', entityId: SEED_ID.inc140, summary: 'FW69-2026-0140 marked as closed after confirmation.', occurredAt: '2026-09-29T09:58:00.000Z' },
  { id: '671f00060000000000000108', actor: SEED_ID.userRamona, action: 'Exported report', entityType: 'Report', entityId: 'report-sep-2026', summary: 'Exported September fire incident report (PDF).', occurredAt: '2026-09-28T17:30:00.000Z' },
  { id: '671f00060000000000000107', actor: SEED_ID.userErnesto, action: 'Suspended user', entityType: 'User', entityId: SEED_ID.userAlfredo, summary: 'Suspended account of Brgy. Tanod Alfredo Reyes.', occurredAt: '2026-09-28T16:02:00.000Z' },
  { id: '671f00060000000000000106', actor: SEED_ID.userLeonora, action: 'Signed in', entityType: 'Auth', entityId: SEED_ID.userLeonora, summary: 'Signed in from Barangay Command Post.', occurredAt: '2026-09-28T07:58:00.000Z' },
  { id: '671f00060000000000000105', actor: SEED_ID.userTeresa, action: 'Created team', entityType: 'Team', entityId: SEED_ID.teamTanker5, summary: 'Created team Water Tanker 5.', occurredAt: '2026-09-27T15:20:00.000Z' },
  { id: '671f00060000000000000104', actor: SEED_ID.userLeonora, action: 'Created incident', entityType: 'Incident', entityId: SEED_ID.inc140, summary: 'Encoded historical incident from paper logbook.', occurredAt: '2026-09-26T10:10:00.000Z' },
];
