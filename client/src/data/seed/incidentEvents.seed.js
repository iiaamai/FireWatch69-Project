import { SEED_ID } from './seedIds.js';

export const seedIncidentEvents = [
  { id: 'ev-142-1', incident: SEED_ID.inc142, eventType: 'submitted', note: 'Fire reported via resident app', actor: SEED_ID.userMaricel, occurredAt: '2026-09-29T14:08:00.000Z' },
  { id: 'ev-142-2', incident: SEED_ID.inc142, eventType: 'verified', note: 'Verified by Barangay Tanod on patrol', actor: SEED_ID.userAlfredo, occurredAt: '2026-09-29T14:10:00.000Z' },
  { id: 'ev-142-3', incident: SEED_ID.inc142, assignment: 'asg-142-e1', eventType: 'assigned', note: 'Engine 1 dispatched', actor: SEED_ID.userLeonora, occurredAt: '2026-09-29T14:11:00.000Z' },
  { id: 'ev-142-4', incident: SEED_ID.inc142, assignment: 'asg-142-e1', eventType: 'status_changed', note: 'Engine 1 accepted assignment, en route', actor: SEED_ID.userMarco, occurredAt: '2026-09-29T14:14:00.000Z' },
  { id: 'ev-142-5', incident: SEED_ID.inc142, eventType: 'severity_changed', note: 'Severity raised to Critical — spread to adjacent houses', actor: SEED_ID.userLeonora, occurredAt: '2026-09-29T14:22:00.000Z', previousValue: { severity: 'high' }, newValue: { severity: 'critical' } },
  { id: 'ev-142-6', incident: SEED_ID.inc142, assignment: 'asg-142-e7', eventType: 'assigned', note: 'Engine 7 dispatched as backup', actor: SEED_ID.userLeonora, occurredAt: '2026-09-29T14:27:00.000Z' },

  { id: 'ev-143-1', incident: SEED_ID.inc143, eventType: 'submitted', note: 'Fire reported via Hotline 911', actor: null, occurredAt: '2026-09-29T13:41:00.000Z' },
  { id: 'ev-143-2', incident: SEED_ID.inc143, eventType: 'verified', note: 'Verified via CCTV', actor: SEED_ID.userLeonora, occurredAt: '2026-09-29T13:42:00.000Z' },
  { id: 'ev-143-3', incident: SEED_ID.inc143, assignment: 'asg-143-r2', eventType: 'assigned', note: 'Rescue 2 dispatched', actor: SEED_ID.userLeonora, occurredAt: '2026-09-29T13:43:00.000Z' },
  { id: 'ev-143-4', incident: SEED_ID.inc143, assignment: 'asg-143-r2', eventType: 'status_changed', note: 'Rescue 2 arrived on scene', actor: SEED_ID.userJomar, occurredAt: '2026-09-29T13:51:00.000Z' },

  { id: 'ev-141-1', incident: SEED_ID.inc141, eventType: 'submitted', note: 'Fire reported via resident app', actor: SEED_ID.userMaricel, occurredAt: '2026-09-29T12:55:00.000Z' },
  { id: 'ev-141-2', incident: SEED_ID.inc141, eventType: 'verified', note: 'Verified', actor: SEED_ID.userLeonora, occurredAt: '2026-09-29T12:56:00.000Z' },
  { id: 'ev-141-3', incident: SEED_ID.inc141, assignment: 'asg-141-b69', eventType: 'assigned', note: 'Brgy 69 Fire Brigade dispatched', actor: SEED_ID.userLeonora, occurredAt: '2026-09-29T12:56:00.000Z' },
  { id: 'ev-141-4', incident: SEED_ID.inc141, assignment: 'asg-141-b69', eventType: 'status_changed', note: 'Arrived on scene', actor: SEED_ID.userEduardo, occurredAt: '2026-09-29T13:00:00.000Z' },
  { id: 'ev-141-5', incident: SEED_ID.inc141, eventType: 'note_added', note: 'Fire contained — overhaul ongoing', actor: SEED_ID.userEduardo, occurredAt: '2026-09-29T13:40:00.000Z' },

  { id: 'ev-144-1', incident: SEED_ID.inc144, eventType: 'submitted', note: 'Fire reported by Barangay Tanod', actor: SEED_ID.userAlfredo, occurredAt: '2026-09-29T14:21:00.000Z' },
  { id: 'ev-144-2', incident: SEED_ID.inc144, eventType: 'verified', note: 'Verified', actor: SEED_ID.userLeonora, occurredAt: '2026-09-29T14:23:00.000Z' },
  { id: 'ev-144-3', incident: SEED_ID.inc144, eventType: 'note_added', note: 'Dispatch failed — Engine 6 unavailable', actor: null, occurredAt: '2026-09-29T14:24:00.000Z' },

  { id: 'ev-145-1', incident: SEED_ID.inc145, eventType: 'submitted', note: 'Fire reported via resident app', actor: SEED_ID.userCarlo, occurredAt: '2026-09-29T14:26:00.000Z' },

  { id: 'ev-140-1', incident: SEED_ID.inc140, eventType: 'submitted', note: 'Fire reported', actor: null, occurredAt: '2026-09-29T09:12:00.000Z' },
  { id: 'ev-140-2', incident: SEED_ID.inc140, eventType: 'resolved', note: 'Marked as resolved', actor: SEED_ID.userLeonora, occurredAt: '2026-09-29T09:58:00.000Z' },
];
