import 'package:flutter/material.dart';

import '../constants.dart';
import '../state/resident_app_state.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _email = TextEditingController(text: 'maricel.dizon@example.invalid');
  final _password = TextEditingController();
  bool _showPassword = false;
  bool _loading = false;
  String? _error;
  bool _resetOpen = false;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  bool get _emailLooksValid {
    final v = _email.text.trim();
    return v.contains('@') || v.length >= 3;
  }

  Future<void> _submit() async {
    if (!_emailLooksValid) {
      setState(() => _error = 'Enter your email or username.');
      return;
    }
    if (_password.text.length < 8) {
      setState(() => _error = 'Password must be at least 8 characters.');
      return;
    }
    setState(() {
      _error = null;
      _loading = true;
    });
    try {
      await ResidentScope.of(context).signInVerified(_email.text, _password.text);
    } catch (e) {
      setState(() => _error = e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final app = ResidentScope.of(context);
    return Scaffold(
      backgroundColor: Fw69Colors.neutralActive,
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 32, 24, 40),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: Fw69Colors.neutralOnDark,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.local_fire_department, color: Fw69Colors.primary),
                      ),
                      const SizedBox(width: 12),
                      const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('FireWatch 69', style: TextStyle(color: Fw69Colors.neutralOnDark, fontSize: 18, fontWeight: FontWeight.w800)),
                          Text('Barangay 69 · Tondo, Manila', style: TextStyle(color: Fw69Colors.neutralOnDark, fontSize: 11)),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),
                  const Text(
                    'Fire Incident Reporting',
                    style: TextStyle(color: Fw69Colors.neutralOnDark, fontSize: 30, fontWeight: FontWeight.w800, height: 1.1),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Report a fire in seconds and follow permitted status updates until it is resolved.',
                    style: TextStyle(color: Fw69Colors.neutralOnDark, height: 1.4),
                  ),
                ],
              ),
            ),
            Expanded(
              child: Container(
                decoration: const BoxDecoration(
                  color: Fw69Colors.neutralSurface,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
                ),
                child: ListView(
                  padding: const EdgeInsets.fromLTRB(24, 28, 24, 24),
                  children: [
                    const Text('Email or username', style: TextStyle(fontWeight: FontWeight.w600)),
                    const SizedBox(height: 8),
                    TextField(
                      controller: _email,
                      keyboardType: TextInputType.emailAddress,
                      decoration: const InputDecoration(
                        prefixIcon: Icon(Icons.mail_outline),
                      ),
                    ),
                    if (_emailLooksValid) ...[
                      const SizedBox(height: 8),
                      const Text(
                        'Verified resident account (mock)',
                        style: TextStyle(color: Fw69Colors.neutralTextMuted, fontSize: 12, fontWeight: FontWeight.w600),
                      ),
                    ],
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        const Expanded(child: Text('Password', style: TextStyle(fontWeight: FontWeight.w600))),
                        TextButton(
                          onPressed: () => setState(() => _resetOpen = true),
                          child: const Text('Forgot password?'),
                        ),
                      ],
                    ),
                    TextField(
                      controller: _password,
                      obscureText: !_showPassword,
                      decoration: InputDecoration(
                        prefixIcon: const Icon(Icons.lock_outline),
                        suffixIcon: IconButton(
                          onPressed: () => setState(() => _showPassword = !_showPassword),
                          icon: Icon(_showPassword ? Icons.visibility_off : Icons.visibility),
                        ),
                      ),
                    ),
                    const SizedBox(height: 6),
                    const Text('Demo: any password with 8+ characters', style: TextStyle(fontSize: 12, color: Fw69Colors.neutralTextMuted)),
                    if (_error != null) ...[
                      const SizedBox(height: 12),
                      Text(_error!, style: const TextStyle(color: Fw69Colors.alertCriticalText)),
                    ],
                    const SizedBox(height: 16),
                    FilledButton(
                      style: FilledButton.styleFrom(
                        backgroundColor: Fw69Colors.neutralActive,
                        minimumSize: const Size.fromHeight(52),
                      ),
                      onPressed: _loading ? null : _submit,
                      child: Text(_loading ? 'Signing in…' : 'Log in'),
                    ),
                    const SizedBox(height: 20),
                    const Row(
                      children: [
                        Expanded(child: Divider()),
                        Padding(padding: EdgeInsets.symmetric(horizontal: 8), child: Text('or')),
                        Expanded(child: Divider()),
                      ],
                    ),
                    const SizedBox(height: 16),
                    OutlinedButton.icon(
                      onPressed: () => app.signInGuest(),
                      icon: const Icon(Icons.person_outline),
                      label: const Text('Continue as Guest'),
                      style: OutlinedButton.styleFrom(
                        minimumSize: const Size.fromHeight(52),
                        foregroundColor: Fw69Colors.neutralText,
                        side: const BorderSide(color: Fw69Colors.neutralActive, width: 2),
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Report a fire without an account. Guests only need a name and mobile number.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Fw69Colors.neutralTextMuted),
                    ),
                    const SizedBox(height: 24),
                    const Text(
                      'FireWatch 69 · Layer B mock',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 11, color: Fw69Colors.neutralTextMuted),
                    ),
                  ],
                ),
              ),
            ),
            if (_resetOpen)
              Material(
                color: Fw69Colors.neutralSurface,
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const Text('Reset your password', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      Text('We will send a mock reset notice to ${_email.text.isEmpty ? 'your email' : _email.text}. If you see a fire now, you can still report as a guest.'),
                      const SizedBox(height: 16),
                      FilledButton(
                        style: FilledButton.styleFrom(backgroundColor: Fw69Colors.neutralActive),
                        onPressed: () => setState(() => _resetOpen = false),
                        child: const Text('Send reset link'),
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
