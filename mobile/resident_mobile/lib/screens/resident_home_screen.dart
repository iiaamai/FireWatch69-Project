import 'package:flutter/material.dart';

import '../services/mock_auth_service.dart';
import 'guest_entry_screen.dart';
import 'login_screen.dart';

class ResidentHomeScreen extends StatelessWidget {
  const ResidentHomeScreen({super.key, required this.auth});

  final MockAuthService auth;

  @override
  Widget build(BuildContext context) {
    final subtitle = auth.isResidentSignedIn
        ? '${auth.resident!.fullName} · ${auth.resident!.role}'
        : auth.guestLabel ?? 'Unknown session';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Home'),
        actions: [
          TextButton(
            onPressed: () {
              auth.signOut();
              Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute<void>(
                  builder: (_) => ResidentEntryScreen(auth: auth),
                ),
                (_) => false,
              );
            },
            child: const Text('Sign out'),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('FireWatch 69 — Resident', style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            Text(subtitle),
            const SizedBox(height: 24),
            const Text(
              'SOS reporting and map layers will be added in the Incidents module (Layer B).',
            ),
          ],
        ),
      ),
    );
  }
}

/// Entry: choose resident login or guest (Layer B).
class ResidentEntryScreen extends StatelessWidget {
  const ResidentEntryScreen({super.key, required this.auth});

  final MockAuthService auth;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Spacer(),
              Text('FireWatch 69', style: Theme.of(context).textTheme.headlineMedium),
              Text(
                'Resident & guest · mock (Layer B)',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
              ),
              const Spacer(),
              FilledButton(
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute<void>(
                      builder: (_) => LoginScreen(auth: auth),
                    ),
                  );
                },
                child: const Text('Sign in as resident'),
              ),
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute<void>(
                      builder: (_) => GuestEntryScreen(auth: auth),
                    ),
                  );
                },
                child: const Text('Continue as guest'),
              ),
              const Spacer(),
            ],
          ),
        ),
      ),
    );
  }
}
