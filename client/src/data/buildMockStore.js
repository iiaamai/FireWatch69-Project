import { seedUsers, seedCurrentUserId } from './seed/users.seed.js';
import { seedTeams } from './seed/teams.seed.js';
import { seedEvacuationCenters } from './seed/evacuationCenters.seed.js';
import { seedIncidents } from './seed/incidents.seed.js';
import { seedAssignments } from './seed/assignments.seed.js';
import { seedIncidentEvents } from './seed/incidentEvents.seed.js';
import { seedAttachments } from './seed/attachments.seed.js';
import { seedNotifications } from './seed/notifications.seed.js';
import { seedActivityLogs } from './seed/activityLogs.seed.js';
import { seedHistoricalIncidents, historyLocationOptions } from './seed/historicalIncidents.seed.js';
import { lngLatToMapPosition } from './seed/geo.js';
import { centerStatusFromOccupancy } from '../utils/status.js';

const ROLE_LABELS = {
  system_admin: 'Administrator',
  barangay_official: 'Fire/Response Official',
  coordinator: 'Incident Manager',
  responder: 'Responder',
  registered_resident: 'Resident',
};

const REPORT_SOURCE_LABELS = {
  resident_app: 'Resident',
  guest_app: 'Guest',
  staff_encoded: 'Staff encoded',
  phone: 'Hotline',
  walk_in: 'Walk-in',
  other: 'Other',
};

const CENTER_STATUS_FROM_MODEL = {
  available: 'available',
  limited: 'near_capacity',
  full: 'full',
  closed: 'unavailable',
  unknown: 'unavailable',
};

const ASSIGNMENT_TO_TEAM_UI = {
  assigned: 'dispatched',
  accepted: 'dispatched',
  en_route: 'en_route',
  on_scene: 'on_scene',
  completed: 'available',
  cancelled: 'available',
};

const INCIDENT_STATUS_TO_UI = {
  submitted: 'reported',
  under_review: 'reported',
  verified: 'verified',
  dispatched: 'dispatched',
  responding: 'responding',
  on_scene: 'on_scene',
  resolved: 'resolved',
  closed: 'resolved',
  rejected: 'resolved',
};

function uiSeverity(severity) {
  return severity === 'medium' ? 'moderate' : severity;
}

function userNameById(users, id) {
  if (!id) return 'System';
  const u = users.find((x) => x.id === id);
  return u?.fullName ?? 'Unknown';
}

function toUiUser(user) {
  return {
    ...user,
    name: user.fullName,
    phone: user.phoneNumber ?? '',
    status: user.accountStatus,
    department: user.departmentOrTeam ?? '',
    role: ROLE_LABELS[user.role] ?? user.role,
    roleKey: user.role,
    lastActivity: user.updatedAt,
  };
}

function buildReporter(incident, users) {
  if (incident.reporterGuest) {
    return {
      name: incident.reporterGuest.name,
      phone: incident.reporterGuest.phone,
      type: incident.reporterGuest.label ?? 'Reporter',
    };
  }
  const reporter = users.find((u) => u.id === incident.reportedBy);
  if (reporter) {
    return {
      name: reporter.fullName,
      phone: reporter.phoneNumber ?? '',
      type: REPORT_SOURCE_LABELS[incident.reportSource] ?? 'Reporter',
    };
  }
  return { name: 'Unknown reporter', phone: '—', type: REPORT_SOURCE_LABELS[incident.reportSource] ?? 'Other' };
}

function attachmentToMedia(att, users) {
  const uploader = users.find((u) => u.id === att.uploadedBy);
  const type = att.mediaType === 'video' ? 'video' : 'photo';
  const status = att.reviewStatus === 'approved' ? 'verified' : att.reviewStatus === 'rejected' ? 'rejected' : 'pending';
  return {
    id: att.id,
    type,
    url: att.secureUrl,
    timestamp: att.capturedAt ?? att.uploadedAt,
    location: att.captureLocationText ?? '',
    status,
    submittedBy: att.submittedByLabel ?? uploader?.fullName ?? 'Unknown',
  };
}

function eventsToTimeline(events, users) {
  return events
    .slice()
    .sort((a, b) => new Date(a.occurredAt) - new Date(b.occurredAt))
    .map((e) => ({
      id: e.id,
      time: e.occurredAt,
      label: e.note ?? e.eventType,
      actor: userNameById(users, e.actor),
    }));
}

function toUiIncident(incident, { users, events, attachments, assignments }) {
  const incEvents = events.filter((e) => e.incident === incident.id);
  const incMedia = attachments.filter((a) => a.incident === incident.id);
  const primaryAssignment = assignments.find((a) => a.id === incident.currentAssignment);
  const containedNote = incEvents.some((e) => (e.note ?? '').toLowerCase().includes('contained'));
  let status = INCIDENT_STATUS_TO_UI[incident.status] ?? incident.status;
  if (status === 'on_scene' && containedNote && incident.severity === 'medium') {
    status = 'contained';
  }

  return {
    ...incident,
    location: incident.addressText,
    position: lngLatToMapPosition(incident.location.coordinates),
    severity: uiSeverity(incident.severity),
    status,
    assignedTeamId: primaryAssignment?.team ?? null,
    structuresAffected: incident.impact?.structuresAffected ?? 0,
    familiesAffected: incident.impact?.familiesAffected ?? 0,
    lastUpdate: incident.updatedAt,
    reporter: buildReporter(incident, users),
    media: incMedia.map((a) => attachmentToMedia(a, users)),
    timeline: eventsToTimeline(incEvents, users),
  };
}

function teamUiStatus(team, assignments) {
  if (team.availability === 'unavailable') return 'unavailable';
  const active = assignments
    .filter((a) => a.team === team.id && a.status !== 'completed' && a.status !== 'cancelled')
    .sort((a, b) => new Date(b.assignedAt) - new Date(a.assignedAt))[0];
  if (!active) return team.availability === 'assigned' ? 'available' : 'available';
  return ASSIGNMENT_TO_TEAM_UI[active.status] ?? 'dispatched';
}

function toUiTeam(team, assignments, users) {
  const active = assignments
    .filter((a) => a.team === team.id && a.status !== 'completed' && a.status !== 'cancelled')
    .sort((a, b) => new Date(b.assignedAt) - new Date(a.assignedAt))[0];
  const leader = users.find((u) => u.id === team.leader);
  const members = team.members.map((memberId, i) => {
    const m = users.find((u) => u.id === memberId);
    return {
      id: memberId || `m-${i}`,
      name: m?.fullName ?? 'Member',
      role: memberId === team.leader ? 'Team Leader' : 'Member',
    };
  });

  return {
    id: team.id,
    name: team.teamName,
    callsign: team.teamCode,
    department: team.department,
    leader: leader?.fullName ?? '—',
    members,
    status: teamUiStatus(team, assignments),
    position: active?.uiMapPosition ?? team.stationMapPosition,
    route: active?.route ?? [],
    assignedIncidentId: active?.incident ?? null,
    etaMin: active?.etaMin ?? null,
    lastGps: active?.lastGpsAt ?? team.updatedAt ?? '2026-09-29T14:29:00.000Z',
    contact: team.contactPhone,
    vehicle: team.vehicleLabel,
    station: team.stationMapPosition,
    availability: team.availability,
  };
}

function toUiCenter(center) {
  const occupants = center.currentOccupancy ?? 0;
  const derived =
    center.availabilityStatus === 'limited' || center.availabilityStatus === 'full'
      ? CENTER_STATUS_FROM_MODEL[center.availabilityStatus]
      : center.availabilityStatus === 'closed'
        ? 'unavailable'
        : centerStatusFromOccupancy(occupants, center.capacity ?? 0);

  return {
    id: center.id,
    name: center.centerName,
    address: center.addressText,
    position: lngLatToMapPosition(center.location.coordinates),
    capacity: center.capacity ?? 0,
    occupants,
    status: derived,
    photos: center.photos ?? [],
    lastUpdated: center.lastVerifiedAt,
    contactPerson: center.contactDetails?.name ?? '',
    contactNumber: center.contactDetails?.phone ?? '',
    facilities: center.facilities ?? [],
    availabilityStatus: center.availabilityStatus,
  };
}

function entityTypeToModule(entityType) {
  const map = {
    Incident: 'Incidents',
    Assignment: 'Responders',
    EvacuationCenter: 'Evacuation',
    User: 'Users',
    Team: 'Teams',
    Auth: 'Auth',
    Report: 'Reports',
  };
  return map[entityType] ?? entityType;
}

function toUiActivityLog(log, users, incidents) {
  const actor = users.find((u) => u.id === log.actor);
  const incidentMongoId = log.entityType === 'Incident' ? log.entityId : null;
  const related = incidentMongoId ? incidents.find((i) => i.id === incidentMongoId) : null;
  return {
    id: log.id,
    userName: actor?.fullName ?? 'System',
    action: log.action,
    module: entityTypeToModule(log.entityType),
    timestamp: log.occurredAt,
    incidentId: incidentMongoId,
    incidentCode: related?.incidentCode ?? null,
    description: log.summary,
  };
}

function toUiNotification(n) {
  return {
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.body,
    timestamp: n.createdAt,
    severity: n.severity === 'medium' ? 'moderate' : n.severity,
    incidentId: n.relatedIncident,
    read: Boolean(n.readAt),
  };
}

export function createInitialMockStore() {
  const users = seedUsers.map(toUiUser);
  const userRecords = seedUsers;

  const incidents = seedIncidents
    .filter((i) => i.status !== 'closed')
    .map((inc) =>
      toUiIncident(inc, {
        users: userRecords,
        events: seedIncidentEvents,
        attachments: seedAttachments,
        assignments: seedAssignments,
      }),
    );

  const teams = seedTeams.map((t) => toUiTeam(t, seedAssignments, userRecords));
  const centers = seedEvacuationCenters.map(toUiCenter);
  const logs = seedActivityLogs.map((l) => toUiActivityLog(l, userRecords, seedIncidents));
  const notifications = seedNotifications.map(toUiNotification);
  const history = seedHistoricalIncidents;

  const currentUser = users.find((u) => u.id === seedCurrentUserId) ?? users[0];

  const personnelPool = users
    .filter((u) => u.roleKey === 'responder')
    .map((u) => u.name)
    .concat(['FO1 Mark Bernardo', 'Volunteer Ben Cortez', 'FO2 Nica Soriano']);

  return {
    users,
    currentUser,
    incidents,
    teams,
    centers,
    logs,
    notifications,
    history,
    personnelPool,
    historyLocations: historyLocationOptions,
    /** Canonical API-shaped records for Layer C alignment / debugging */
    domain: {
      users: seedUsers,
      teams: seedTeams,
      evacuationCenters: seedEvacuationCenters,
      incidents: seedIncidents,
      assignments: seedAssignments,
      incidentEvents: seedIncidentEvents,
      attachments: seedAttachments,
      notifications: seedNotifications,
      activityLogs: seedActivityLogs,
    },
  };
}
