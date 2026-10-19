import '../models/models.dart';

/// Stable keys — match client/src/data/seed/seedIds.js
abstract final class SeedIds {
  static const userMaricel = '671f00010000000000000010';
  static const inc142 = '671f00040000000000000001';
  static const inc143 = '671f00040000000000000002';
  static const inc141 = '671f00040000000000000003';
  static const inc144 = '671f00040000000000000004';
  static const inc145 = '671f00040000000000000005';
  static const inc140 = '671f00040000000000000006';
  static const ecCoveredCourt = '671f00030000000000000001';
  static const ecTondoElem = '671f00030000000000000002';
  static const ecParishHall = '671f00030000000000000003';
}

const defaultAddress = '1450 Pritil St, Brgy. 69, Tondo, Manila (fictional)';

final residentProfileSeed = ResidentProfile(
  firstName: 'Maricel',
  fullName: 'Maricel Dizon',
  email: 'maricel.dizon@example.invalid',
  phone: '0917 555 0142',
  address: defaultAddress,
  verifiedSince: 'May 2026',
);

final nearbyIncidents = [
  Incident(
    id: SeedIds.inc142,
    incidentCode: 'FW69-2026-0142',
    addressText: 'Tayuman St cor. Herbosa St',
    area: 'Barangay 69, Tondo, Manila',
    severity: Severity.critical,
    status: IncidentStatus.responding,
    reportedAtLabel: '2:08 PM',
    reportedDateLabel: 'Tue, Sep 29, 2026',
    reportedAgo: '22 min ago',
    lastUpdateLabel: '2:27 PM',
    distanceKm: 0.5,
    description:
        'Residential fire spreading across 2-storey light-material houses. Heavy smoke; possible trapped occupant on 2nd floor.',
    isMine: true,
    hasVideo: true,
    team: const ResponseTeamInfo(
      name: 'Engine 1',
      station: 'BFP Tondo Fire Sub-Station',
      etaMin: 3,
      distanceKm: 0.4,
    ),
    reinforcement: const ReinforcementInfo(
      team: 'Engine 7',
      statusLabel: 'En route',
      etaMin: 7,
    ),
    updates: const [
      IncidentUpdate(status: IncidentStatus.submitted, timeLabel: '2:08 PM', message: 'Fire reported via resident app.'),
      IncidentUpdate(status: IncidentStatus.verified, timeLabel: '2:10 PM', message: 'Verified by Barangay Tanod on patrol.'),
      IncidentUpdate(status: IncidentStatus.dispatched, timeLabel: '2:11 PM', message: 'Engine 1 dispatched.'),
      IncidentUpdate(status: IncidentStatus.responding, timeLabel: '2:14 PM', message: 'Engine 1 accepted assignment, en route.'),
    ],
  ),
  Incident(
    id: SeedIds.inc143,
    incidentCode: 'FW69-2026-0143',
    addressText: 'Pritil St near Velasquez St',
    area: 'Barangay 69, Tondo, Manila',
    severity: Severity.high,
    status: IncidentStatus.onScene,
    reportedAtLabel: '1:41 PM',
    reportedDateLabel: 'Tue, Sep 29, 2026',
    reportedAgo: '49 min ago',
    lastUpdateLabel: '2:18 PM',
    distanceKm: 0.8,
    description: 'Fire at market stall storage area. LPG tanks nearby removed by vendors.',
    team: const ResponseTeamInfo(
      name: 'Rescue 2',
      station: 'BFP Special Rescue Unit',
      etaMin: 0,
      distanceKm: 0,
      arrivedAt: '1:51 PM',
    ),
    updates: const [
      IncidentUpdate(status: IncidentStatus.submitted, timeLabel: '1:41 PM', message: 'Fire reported via Hotline 911.'),
      IncidentUpdate(status: IncidentStatus.verified, timeLabel: '1:42 PM', message: 'Verified via CCTV.'),
      IncidentUpdate(status: IncidentStatus.dispatched, timeLabel: '1:43 PM', message: 'Rescue 2 dispatched.'),
      IncidentUpdate(status: IncidentStatus.onScene, timeLabel: '1:51 PM', message: 'Rescue 2 arrived on scene.'),
    ],
  ),
  Incident(
    id: SeedIds.inc145,
    incidentCode: 'FW69-2026-0145',
    addressText: 'Juan Luna St, near Moriones',
    area: 'Barangay 69, Tondo, Manila',
    severity: Severity.low,
    status: IncidentStatus.submitted,
    reportedAtLabel: '2:26 PM',
    reportedDateLabel: 'Tue, Sep 29, 2026',
    reportedAgo: '4 min ago',
    lastUpdateLabel: '2:26 PM',
    distanceKm: 0.6,
    description: 'Smoke reported from garbage pile along the sidewalk. Awaiting verification.',
    updates: const [
      IncidentUpdate(status: IncidentStatus.submitted, timeLabel: '2:26 PM', message: 'Fire reported via resident app.'),
    ],
  ),
  Incident(
    id: SeedIds.inc144,
    incidentCode: 'FW69-2026-0144',
    addressText: 'Moriones St, Interior Alley 4',
    area: 'Barangay 69, Tondo, Manila',
    severity: Severity.medium,
    status: IncidentStatus.verified,
    reportedAtLabel: '2:21 PM',
    reportedDateLabel: 'Tue, Sep 29, 2026',
    reportedAgo: '9 min ago',
    lastUpdateLabel: '2:24 PM',
    distanceKm: 0.7,
    description: 'Electrical fire at a utility pole spreading to roof of adjacent house.',
    updates: const [
      IncidentUpdate(status: IncidentStatus.submitted, timeLabel: '2:21 PM', message: 'Fire reported by Barangay Tanod.'),
      IncidentUpdate(status: IncidentStatus.verified, timeLabel: '2:23 PM', message: 'Verified by command.'),
    ],
  ),
];

final pastReports = [
  Incident(
    id: SeedIds.inc140,
    incidentCode: 'FW69-2026-0140',
    addressText: 'Moriones St cor. N. Zamora St',
    area: 'Barangay 69, Tondo, Manila',
    severity: Severity.low,
    status: IncidentStatus.closed,
    reportedAtLabel: '9:12 AM',
    reportedDateLabel: 'Tue, Sep 29, 2026',
    reportedAgo: 'Today',
    lastUpdateLabel: '9:58 AM',
    distanceKm: 0.3,
    description: 'Small fire from overheated extension cord. Extinguished; no re-ignition.',
    isMine: true,
    updates: const [
      IncidentUpdate(status: IncidentStatus.submitted, timeLabel: '9:12 AM', message: 'Fire reported.'),
      IncidentUpdate(status: IncidentStatus.resolved, timeLabel: '9:58 AM', message: 'Marked as resolved and closed.'),
    ],
  ),
  const Incident(
    id: 'hist-0139',
    incidentCode: 'FW69-2026-0139',
    addressText: 'Tayuman St',
    area: 'Barangay 69, Tondo, Manila',
    severity: Severity.high,
    status: IncidentStatus.closed,
    reportedAtLabel: '9:14 PM',
    reportedDateLabel: 'Mon, Sep 28, 2026',
    reportedAgo: '1 day ago',
    lastUpdateLabel: 'Sep 28, 10:49 PM',
    distanceKm: 0.4,
    description: 'Electrical overload fire (fictional closed record).',
    isMine: true,
    updates: [
      IncidentUpdate(status: IncidentStatus.submitted, timeLabel: '9:14 PM', message: 'Fire reported.'),
      IncidentUpdate(status: IncidentStatus.resolved, timeLabel: '10:49 PM', message: 'Incident closed.'),
    ],
  ),
];

final evacCenters = [
  EvacCenter(
    id: SeedIds.ecCoveredCourt,
    name: 'Barangay 69 Covered Court',
    addressText: 'Herbosa St cor. Pritil St (fictional demo address)',
    availability: EvacAvailability.limited,
    capacity: 250,
    occupancy: 186,
    distanceKm: 0.4,
    walkMin: 6,
  ),
  EvacCenter(
    id: SeedIds.ecTondoElem,
    name: 'Tondo Elementary School – Annex',
    addressText: 'Moriones St, Tondo, Manila (fictional)',
    availability: EvacAvailability.limited,
    capacity: 400,
    occupancy: 352,
    distanceKm: 0.6,
    walkMin: 8,
  ),
  EvacCenter(
    id: SeedIds.ecParishHall,
    name: 'Sto. Niño Parish Hall',
    addressText: 'N. Zamora St, Tondo, Manila (fictional)',
    availability: EvacAvailability.full,
    capacity: 120,
    occupancy: 120,
    distanceKm: 0.5,
    walkMin: 7,
  ),
];

final recentUpdates = [
  FeedItem(
    incidentId: SeedIds.inc143,
    status: IncidentStatus.onScene,
    timeLabel: '1:51 PM',
    text: 'Rescue 2 arrived on scene at Pritil Public Market.',
  ),
  FeedItem(
    incidentId: SeedIds.inc142,
    status: IncidentStatus.responding,
    timeLabel: '2:14 PM',
    text: 'Engine 1 traveling to Tayuman St.',
  ),
  FeedItem(
    incidentId: SeedIds.inc144,
    status: IncidentStatus.verified,
    timeLabel: '2:23 PM',
    text: 'Electrical fire on Moriones St verified.',
  ),
];
