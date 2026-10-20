class MockResponder {
  const MockResponder({
    required this.fullName,
    required this.email,
    required this.role,
  });

  final String fullName;
  final String email;
  final String role;
}

Future<MockResponder> mockResponderLogin(String email, String password) async {
  await Future<void>.delayed(const Duration(milliseconds: 400));
  if (password.length < 8) {
    throw Exception('Invalid email or password');
  }
  return MockResponder(
    fullName: 'Responder (Mock)',
    email: email.trim().toLowerCase(),
    role: 'responder',
  );
}
