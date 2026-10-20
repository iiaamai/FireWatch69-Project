import 'package:flutter/material.dart';

import '../services/mock_auth_service.dart';
import 'resident_home_screen.dart';

class GuestEntryScreen extends StatefulWidget {
  const GuestEntryScreen({super.key, required this.auth});

  final MockAuthService auth;

  @override
  State<GuestEntryScreen> createState() => _GuestEntryScreenState();
}

class _GuestEntryScreenState extends State<GuestEntryScreen> {
  bool _loading = false;

  Future<void> _continueAsGuest() async {
    setState(() => _loading = true);
    await widget.auth.continueAsGuest();
    if (!mounted) return;
    Navigator.of(context).pushReplacement(
      MaterialPageRoute<void>(
        builder: (_) => ResidentHomeScreen(auth: widget.auth),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Continue as guest')),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Report an incident with limited access. Guest entry stays mock-only until '
                'Phase 5 guest APIs; resident sign-in will use the live API in Layer C.',
              ),
              const Spacer(),
              FilledButton(
                onPressed: _loading ? null : _continueAsGuest,
                child: Text(_loading ? 'Please wait…' : 'Continue as guest (mock)'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
