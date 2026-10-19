class MockUser {
  const MockUser({
    required this.id,
    required this.fullName,
    required this.email,
    required this.role,
    this.phoneNumber,
  });

  final String id;
  final String fullName;
  final String email;
  final String role;
  final String? phoneNumber;
}

const mockResidentUser = MockUser(
  id: '671f00010000000000000010',
  fullName: 'Maricel Dizon',
  email: 'maricel.dizon@example.invalid',
  role: 'registered_resident',
  phoneNumber: '09175550142',
);

const mockGuestLabel = 'Guest session (mock)';

Future<MockUser> mockResidentLogin(String email, String password) async {
  await Future<void>.delayed(const Duration(milliseconds: 400));
  if (password.length < 8) {
    throw Exception('Invalid email or password');
  }
  return MockUser(
    id: mockResidentUser.id,
    fullName: mockResidentUser.fullName,
    email: email.trim().toLowerCase(),
    role: 'registered_resident',
    phoneNumber: mockResidentUser.phoneNumber,
  );
}

Future<String> mockGuestEntry() async {
  await Future<void>.delayed(const Duration(milliseconds: 300));
  return mockGuestLabel;
}
