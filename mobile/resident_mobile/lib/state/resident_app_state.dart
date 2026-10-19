import 'package:flutter/material.dart';

import '../data/seed_data.dart';
import '../models/models.dart';
import '../services/mock_auth_service.dart';

class ResidentAppState extends ChangeNotifier {
  ResidentAppState({MockAuthService? auth}) : auth = auth ?? MockAuthService();

  final MockAuthService auth;

  AppRole? role;
  final List<AppRoute> _stack = [const AppRoute.login()];
  Incident? myIncident;
  ResidentProfile profile = residentProfileSeed;
  String? bannerText;
  String? bannerIncidentId;

  AppRoute get screen => _stack.last;

  bool get isGuest => role == AppRole.guest;
  bool get isVerified => role == AppRole.verified;

  List<Incident> get activeNearby =>
      nearbyIncidents.where((i) => i.status.isActive).toList();

  List<Incident> get myReports {
    final live = myIncident;
    if (live == null) return pastReports;
    return [live, ...pastReports];
  }

  void navigate(AppRoute route) {
    _stack.add(route);
    notifyListeners();
  }

  void back() {
    if (_stack.length > 1) {
      _stack.removeLast();
      notifyListeners();
    }
  }

  void goTab(AppRoute route) {
    _stack
      ..clear()
      ..add(route);
    notifyListeners();
  }

  Future<void> signInVerified(String email, String password) async {
    await auth.loginResident(email, password);
    role = AppRole.verified;
    profile = residentProfileSeed.copyWithEmail(email.trim().toLowerCase());
    _stack
      ..clear()
      ..add(const AppRoute.home());
    notifyListeners();
  }

  Future<void> signInGuest() async {
    await auth.continueAsGuest();
    role = AppRole.guest;
    _stack
      ..clear()
      ..add(const AppRoute.home());
    notifyListeners();
  }

  void signOut() {
    auth.signOut();
    role = null;
    myIncident = null;
    bannerText = null;
    _stack
      ..clear()
      ..add(const AppRoute.login());
    notifyListeners();
  }

  void startReport(ReportDraft draft) {
    myIncident = Incident(
      id: 'local-sos',
      incidentCode: 'FW69-2026-0146',
      addressText: draft.location,
      area: 'Barangay 69, Tondo, Manila',
      severity: Severity.high,
      status: IncidentStatus.submitted,
      reportedAtLabel: 'Just now',
      reportedDateLabel: 'Tue, Sep 29, 2026',
      reportedAgo: 'Just now',
      lastUpdateLabel: 'Just now',
      distanceKm: 0,
      description: (draft.notes != null && draft.notes!.trim().isNotEmpty)
          ? draft.notes!.trim()
          : 'Resident SOS fire report (mock). Video and live tracking are placeholders until Layer D.',
      isMine: true,
      hasVideo: false,
      updates: const [
        IncidentUpdate(
          status: IncidentStatus.submitted,
          timeLabel: 'Just now',
          message: 'Your fire report has been received.',
        ),
      ],
    );
    bannerText = 'Report submitted';
    bannerIncidentId = myIncident!.id;
    notifyListeners();
  }

  void dismissBanner() {
    bannerText = null;
    bannerIncidentId = null;
    notifyListeners();
  }

  void updateProfile(ResidentProfile next) {
    profile = next;
    notifyListeners();
  }

  Incident? getIncident(String id) {
    if (myIncident?.id == id) return myIncident;
    for (final i in nearbyIncidents) {
      if (i.id == id) return i;
    }
    for (final i in pastReports) {
      if (i.id == id) return i;
    }
    return null;
  }
}

extension on ResidentProfile {
  ResidentProfile copyWithEmail(String email) {
    return ResidentProfile(
      firstName: firstName,
      fullName: fullName,
      email: email,
      phone: phone,
      address: address,
      verifiedSince: verifiedSince,
    );
  }
}

class ResidentScope extends InheritedNotifier<ResidentAppState> {
  const ResidentScope({
    super.key,
    required ResidentAppState state,
    required super.child,
  }) : super(notifier: state);

  static ResidentAppState of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<ResidentScope>();
    assert(scope != null, 'ResidentScope not found');
    return scope!.notifier!;
  }
}
