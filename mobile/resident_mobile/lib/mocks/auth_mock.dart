class MockUser {
  const MockUser({
    required this.fullName,
    required this.email,
    required this.role,
  });

  final String fullName;
  final String email;
  final String role;
}

const mockResidentUser = MockUser(
  fullName: 'Resident (Mock)',
  email: 'resident@firewatch69.local',
  role: 'registered_resident',
);

const mockGuestLabel = 'Guest session (mock)';

Future<MockUser> mockResidentLogin(String email, String password) async {
  await Future<void>.delayed(const Duration(milliseconds: 400));
  if (password.length < 8) {
    throw Exception('Invalid email or password');
  }
  return MockUser(
    fullName: 'Resident (Mock)',
    email: email.trim().toLowerCase(),
    role: 'registered_resident',
  );
}

Future<String> mockGuestEntry() async {
  await Future<void>.delayed(const Duration(milliseconds: 300));
  return mockGuestLabel;
}
