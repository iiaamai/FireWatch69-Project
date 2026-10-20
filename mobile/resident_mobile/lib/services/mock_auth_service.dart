import '../mocks/auth_mock.dart';

/// Layer B — replace with API client in Layer C.
class MockAuthService {
  MockUser? _resident;
  String? _guestLabel;

  bool get isResidentSignedIn => _resident != null;
  bool get isGuest => _guestLabel != null;
  MockUser? get resident => _resident;
  String? get guestLabel => _guestLabel;

  Future<MockUser> loginResident(String email, String password) async {
    _guestLabel = null;
    _resident = await mockResidentLogin(email, password);
    return _resident!;
  }

  Future<String> continueAsGuest() async {
    _resident = null;
    _guestLabel = await mockGuestEntry();
    return _guestLabel!;
  }

  void signOut() {
    _resident = null;
    _guestLabel = null;
  }
}
