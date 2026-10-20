import 'package:flutter/material.dart';

import 'constants.dart';
import 'screens/resident_home_screen.dart';
import 'services/mock_auth_service.dart';

class ResidentApp extends StatefulWidget {
  const ResidentApp({super.key});

  @override
  State<ResidentApp> createState() => _ResidentAppState();
}

class _ResidentAppState extends State<ResidentApp> {
  final MockAuthService _auth = MockAuthService();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FireWatch 69 Resident',
      theme: Fw69Theme.light(),
      home: ResidentEntryScreen(auth: _auth),
    );
  }
}
