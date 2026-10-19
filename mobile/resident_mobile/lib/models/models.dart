// Layer B view models for resident/guest UI (docs/model + Magic Pattern screens).

enum AppRole { verified, guest }

enum Severity { critical, high, medium, low }

/// Display band: docs use `medium`; prototype labeled it Moderate.
extension SeverityUi on Severity {
  String get label => switch (this) {
        Severity.critical => 'Critical',
        Severity.high => 'High',
        Severity.medium => 'Moderate',
        Severity.low => 'Low',
      };
}

/// FireWatch lifecycle (docs/lifecycle.txt). `contained` is display-only.
enum IncidentStatus {
  submitted,
  underReview,
  verified,
  dispatched,
  responding,
  onScene,
  contained,
  resolved,
  closed,
}

extension IncidentStatusUi on IncidentStatus {
  String get label => switch (this) {
        IncidentStatus.submitted => 'Reported',
        IncidentStatus.underReview => 'Under review',
        IncidentStatus.verified => 'Verified',
        IncidentStatus.dispatched => 'Dispatched',
        IncidentStatus.responding => 'En route',
        IncidentStatus.onScene => 'On scene',
        IncidentStatus.contained => 'Contained',
        IncidentStatus.resolved => 'Resolved',
        IncidentStatus.closed => 'Closed',
      };

  bool get isActive =>
      this != IncidentStatus.resolved && this != IncidentStatus.closed;

  int get stageIndex => switch (this) {
        IncidentStatus.submitted || IncidentStatus.underReview => 0,
        IncidentStatus.verified => 1,
        IncidentStatus.dispatched => 2,
        IncidentStatus.responding => 3,
        IncidentStatus.onScene => 4,
        IncidentStatus.contained => 5,
        IncidentStatus.resolved || IncidentStatus.closed => 6,
      };
}

const incidentStages = [
  IncidentStatus.submitted,
  IncidentStatus.verified,
  IncidentStatus.dispatched,
  IncidentStatus.responding,
  IncidentStatus.onScene,
  IncidentStatus.contained,
  IncidentStatus.resolved,
];

class IncidentUpdate {
  const IncidentUpdate({
    required this.status,
    required this.timeLabel,
    required this.message,
  });

  final IncidentStatus status;
  final String timeLabel;
  final String message;
}

class ResponseTeamInfo {
  const ResponseTeamInfo({
    required this.name,
    required this.station,
    this.etaMin,
    this.distanceKm,
    this.arrivedAt,
  });

  final String name;
  final String station;
  final int? etaMin;
  final double? distanceKm;
  final String? arrivedAt;
}

class ReinforcementInfo {
  const ReinforcementInfo({
    required this.team,
    required this.statusLabel,
    this.etaMin,
  });

  final String team;
  final String statusLabel;
  final int? etaMin;
}

class Incident {
  const Incident({
    required this.id,
    required this.incidentCode,
    required this.addressText,
    required this.area,
    required this.severity,
    required this.status,
    required this.reportedAtLabel,
    required this.reportedDateLabel,
    required this.reportedAgo,
    required this.lastUpdateLabel,
    required this.distanceKm,
    required this.description,
    required this.updates,
    this.team,
    this.reinforcement,
    this.isMine = false,
    this.hasVideo = false,
  });

  final String id;
  final String incidentCode;
  final String addressText;
  final String area;
  final Severity severity;
  final IncidentStatus status;
  final String reportedAtLabel;
  final String reportedDateLabel;
  final String reportedAgo;
  final String lastUpdateLabel;
  final double distanceKm;
  final String description;
  final List<IncidentUpdate> updates;
  final ResponseTeamInfo? team;
  final ReinforcementInfo? reinforcement;
  final bool isMine;
  final bool hasVideo;

  Incident copyWith({
    IncidentStatus? status,
    List<IncidentUpdate>? updates,
    ResponseTeamInfo? team,
    bool? isMine,
    bool? hasVideo,
    String? lastUpdateLabel,
  }) {
    return Incident(
      id: id,
      incidentCode: incidentCode,
      addressText: addressText,
      area: area,
      severity: severity,
      status: status ?? this.status,
      reportedAtLabel: reportedAtLabel,
      reportedDateLabel: reportedDateLabel,
      reportedAgo: reportedAgo,
      lastUpdateLabel: lastUpdateLabel ?? this.lastUpdateLabel,
      distanceKm: distanceKm,
      description: description,
      updates: updates ?? this.updates,
      team: team ?? this.team,
      reinforcement: reinforcement,
      isMine: isMine ?? this.isMine,
      hasVideo: hasVideo ?? this.hasVideo,
    );
  }
}

enum EvacAvailability { available, limited, full, closed }

class EvacCenter {
  const EvacCenter({
    required this.id,
    required this.name,
    required this.addressText,
    required this.availability,
    required this.capacity,
    required this.occupancy,
    required this.distanceKm,
    required this.walkMin,
  });

  final String id;
  final String name;
  final String addressText;
  final EvacAvailability availability;
  final int capacity;
  final int? occupancy;
  final double distanceKm;
  final int walkMin;

  String get statusLabel => switch (availability) {
        EvacAvailability.available => 'Open',
        EvacAvailability.limited => 'Near capacity',
        EvacAvailability.full => 'Full',
        EvacAvailability.closed => 'Closed',
      };
}

class ResidentProfile {
  const ResidentProfile({
    required this.firstName,
    required this.fullName,
    required this.email,
    required this.phone,
    required this.address,
    required this.verifiedSince,
  });

  final String firstName;
  final String fullName;
  final String email;
  final String phone;
  final String address;
  final String verifiedSince;
}

class FeedItem {
  const FeedItem({
    required this.incidentId,
    required this.status,
    required this.timeLabel,
    required this.text,
    this.mine = false,
  });

  final String incidentId;
  final IncidentStatus status;
  final String timeLabel;
  final String text;
  final bool mine;
}

class AppRoute {
  const AppRoute.login() : name = AppRouteName.login, id = null, focusId = null;
  const AppRoute.home() : name = AppRouteName.home, id = null, focusId = null;
  const AppRoute.map({this.focusId})
      : name = AppRouteName.map,
        id = null;
  const AppRoute.alerts() : name = AppRouteName.alerts, id = null, focusId = null;
  const AppRoute.reports()
      : name = AppRouteName.reports,
        id = null,
        focusId = null;
  const AppRoute.profile()
      : name = AppRouteName.profile,
        id = null,
        focusId = null;
  const AppRoute.myReport()
      : name = AppRouteName.myReport,
        id = null,
        focusId = null;
  const AppRoute.detail(this.id)
      : name = AppRouteName.detail,
        focusId = null;
  const AppRoute.tracking(this.id)
      : name = AppRouteName.tracking,
        focusId = null;
  const AppRoute.report()
      : name = AppRouteName.report,
        id = null,
        focusId = null;

  final AppRouteName name;
  final String? id;
  final String? focusId;
}

enum AppRouteName {
  login,
  home,
  map,
  alerts,
  reports,
  profile,
  myReport,
  detail,
  tracking,
  report,
}

class ReportDraft {
  const ReportDraft({
    required this.location,
    this.reporterName,
    this.reporterPhone,
    this.notes,
  });

  final String location;
  final String? reporterName;
  final String? reporterPhone;
  final String? notes;
}
