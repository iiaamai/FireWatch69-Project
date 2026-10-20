import 'package:flutter/material.dart';

import 'constants.dart';
import 'screens/login_screen.dart';
import 'services/mock_auth_service.dart';

class ResponderApp extends StatefulWidget {
  const ResponderApp({super.key});

  @override
  State<ResponderApp> createState() => _ResponderAppState();
}

class _ResponderAppState extends State<ResponderApp> {
  final MockAuthService _auth = MockAuthService();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FireWatch 69 Responder',
      theme: Fw69Theme.light(),
      home: LoginScreen(auth: _auth),
    );
  }
}
