import '../mocks/auth_mock.dart';

/// Layer B — replace with API client in Layer C.
class MockAuthService {
  MockResponder? _user;

  bool get isSignedIn => _user != null;
  MockResponder? get user => _user;

  Future<MockResponder> login(String email, String password) async {
    _user = await mockResponderLogin(email, password);
    return _user!;
  }

  void signOut() {
    _user = null;
  }
}
