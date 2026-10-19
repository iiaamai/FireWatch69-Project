import 'package:flutter/material.dart';

import 'constants.dart';
import 'screens/app_shell.dart';
import 'state/resident_app_state.dart';

class ResidentApp extends StatefulWidget {
  const ResidentApp({super.key});

  @override
  State<ResidentApp> createState() => _ResidentAppState();
}

class _ResidentAppState extends State<ResidentApp> {
  late final ResidentAppState _state = ResidentAppState();

  @override
  void dispose() {
    _state.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ResidentScope(
      state: _state,
      child: ListenableBuilder(
        listenable: _state,
        builder: (context, _) {
          return MaterialApp(
            title: 'FireWatch 69 Resident',
            theme: Fw69Theme.light(),
            home: const AppShell(),
          );
        },
      ),
    );
  }
}
