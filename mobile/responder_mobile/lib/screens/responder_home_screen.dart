import 'package:flutter/material.dart';

import '../services/mock_auth_service.dart';
import 'login_screen.dart';

class ResponderHomeScreen extends StatelessWidget {
  const ResponderHomeScreen({super.key, required this.auth});

  final MockAuthService auth;

  @override
  Widget build(BuildContext context) {
    final user = auth.user!;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Assigned incidents'),
        actions: [
          TextButton(
            onPressed: () {
              auth.signOut();
              Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute<void>(
                  builder: (_) => LoginScreen(auth: auth),
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
            Text('Welcome, ${user.fullName}', style: Theme.of(context).textTheme.titleLarge),
            Text('${user.email} · ${user.role}'),
            const SizedBox(height: 24),
            const Text(
              'Assigned incident list and status updates will be added in the Incidents module (Layer B).',
            ),
          ],
        ),
      ),
    );
  }
}
