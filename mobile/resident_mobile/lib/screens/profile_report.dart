import 'package:flutter/material.dart';

import '../constants.dart';
import '../data/seed_data.dart';
import '../models/models.dart';
import '../state/resident_app_state.dart';
import '../widgets/fw_widgets.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _location = true;
  bool _notifications = true;
  bool _camera = true;

  @override
  Widget build(BuildContext context) {
    final app = ResidentScope.of(context);
    final p = app.profile;
    final total = app.myReports.length;
    final active = app.myReports.where((i) => i.status.isActive).length;

    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
      children: [
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(p.fullName, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text('Verified resident · since ${p.verifiedSince}', style: const TextStyle(color: Fw69Colors.neutralTextMuted)),
                const SizedBox(height: 12),
                Text(p.phone),
                Text(p.email),
                Text(p.address),
                const SizedBox(height: 12),
                OutlinedButton.icon(
                  onPressed: () async {
                    final name = TextEditingController(text: p.fullName);
                    final phone = TextEditingController(text: p.phone);
                    final email = TextEditingController(text: p.email);
                    final address = TextEditingController(text: p.address);
                    final saved = await showModalBottomSheet<bool>(
                      context: context,
                      isScrollControlled: true,
                      builder: (ctx) => Padding(
                        padding: EdgeInsets.only(bottom: MediaQuery.of(ctx).viewInsets.bottom, left: 16, right: 16, top: 16),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Text('Edit profile', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                            TextField(controller: name, decoration: const InputDecoration(labelText: 'Full name')),
                            TextField(controller: phone, decoration: const InputDecoration(labelText: 'Mobile')),
                            TextField(controller: email, decoration: const InputDecoration(labelText: 'Email')),
                            TextField(controller: address, decoration: const InputDecoration(labelText: 'Address')),
                            const SizedBox(height: 12),
                            FilledButton(
                              onPressed: () => Navigator.pop(ctx, true),
                              child: const Text('Save changes'),
                            ),
                            const SizedBox(height: 16),
                          ],
                        ),
                      ),
                    );
                    if (saved == true && context.mounted) {
                      app.updateProfile(
                        ResidentProfile(
                          firstName: name.text.split(' ').first,
                          fullName: name.text,
                          email: email.text,
                          phone: phone.text,
                          address: address.text,
                          verifiedSince: p.verifiedSince,
                        ),
                      );
                    }
                  },
                  icon: const Icon(Icons.edit_outlined),
                  label: const Text('Edit profile'),
                ),
              ],
            ),
          ),
        ),
        ListTile(
          leading: const Icon(Icons.assignment_outlined),
          title: const Text('My reports'),
          subtitle: Text('$total reports · $active active'),
          trailing: const Icon(Icons.chevron_right),
          onTap: () => app.goTab(const AppRoute.reports()),
        ),
        const SizedBox(height: 8),
        const Text('Manage permissions', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        SwitchListTile(
          title: const Text('Location (GPS)'),
          subtitle: const Text('Used when you report a fire. Live tracking is Layer D.'),
          value: _location,
          onChanged: (v) => setState(() => _location = v),
        ),
        SwitchListTile(
          title: const Text('Notifications'),
          subtitle: const Text('In-app alerts for report status (mock).'),
          value: _notifications,
          onChanged: (v) => setState(() => _notifications = v),
        ),
        SwitchListTile(
          title: const Text('Camera & microphone'),
          subtitle: Text(_camera ? 'Needed later for SOS video.' : 'SOS will send a report without live video.'),
          value: _camera,
          onChanged: (v) => setState(() => _camera = v),
        ),
        const SizedBox(height: 16),
        OutlinedButton.icon(
          onPressed: app.signOut,
          icon: const Icon(Icons.logout),
          label: const Text('Sign out'),
          style: OutlinedButton.styleFrom(
            foregroundColor: Fw69Colors.alertCriticalText,
            side: const BorderSide(color: Fw69Colors.alertCriticalBorder),
            minimumSize: const Size.fromHeight(48),
          ),
        ),
      ],
    );
  }
}

class ReportFireScreen extends StatefulWidget {
  const ReportFireScreen({super.key});

  @override
  State<ReportFireScreen> createState() => _ReportFireScreenState();
}

class _ReportFireScreenState extends State<ReportFireScreen> {
  String _step = 'locating';
  final _name = TextEditingController();
  final _phone = TextEditingController();
  final _notes = TextEditingController();
  bool _touched = false;

  @override
  void initState() {
    super.initState();
    Future<void>.delayed(const Duration(milliseconds: 900), () {
      if (mounted) setState(() => _step = 'confirm');
    });
  }

  @override
  void dispose() {
    _name.dispose();
    _phone.dispose();
    _notes.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final app = ResidentScope.of(context);
    if (_step == 'locating') {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const CircularProgressIndicator(),
            const SizedBox(height: 16),
            const Text('Getting your location…', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            const Text('Using a mock pin for responders', style: TextStyle(color: Fw69Colors.neutralTextMuted)),
            TextButton(onPressed: app.back, child: const Text('Cancel')),
          ],
        ),
      );
    }
    if (_step == 'confirm') {
      return _confirm(app);
    }
    if (_step == 'video') {
      return Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            const ScreenHeader(title: 'SOS sent'),
            const SizedBox(height: 16),
            const VideoPlaceholder(),
            const SizedBox(height: 16),
            Text('#${app.myIncident?.incidentCode ?? ''}'),
            const Text('Live camera is a placeholder until Layer D.'),
            const Spacer(),
            FilledButton(
              style: FilledButton.styleFrom(backgroundColor: Fw69Colors.neutralActive, minimumSize: const Size.fromHeight(48)),
              onPressed: () => setState(() => _step = 'sent'),
              child: const Text('Continue without video'),
            ),
          ],
        ),
      );
    }
    final mine = app.myIncident;
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          const Icon(Icons.check_circle, color: Fw69Colors.neutralText, size: 48),
          const SizedBox(height: 12),
          const Text('Fire Incident Report Sent', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
          const SizedBox(height: 8),
          const Text('Responders have your mock location. Live video and GPS come later.'),
          const SizedBox(height: 16),
          if (mine != null) ...[
            ListTile(title: const Text('Incident ID'), trailing: Text('#${mine.incidentCode}')),
            ListTile(title: const Text('Location'), trailing: Text(mine.addressText, textAlign: TextAlign.end)),
            ListTile(title: const Text('Status'), trailing: StatusChip(status: mine.status)),
          ],
          const Spacer(),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: Fw69Colors.neutralActive, minimumSize: const Size.fromHeight(48)),
            onPressed: () {
              if (app.isGuest) {
                app.goTab(const AppRoute.myReport());
              } else if (mine != null) {
                app.goTab(const AppRoute.home());
                app.navigate(AppRoute.detail(mine.id));
              }
            },
            child: const Text('View incident updates'),
          ),
          TextButton(onPressed: () => app.goTab(const AppRoute.home()), child: const Text('Back to home')),
        ],
      ),
    );
  }

  Widget _confirm(ResidentAppState app) {
    final guest = app.isGuest;
    final digits = _phone.text.replaceAll(RegExp(r'\D'), '');
    final nameError = guest && _name.text.trim().length < 2 ? 'Enter your name or a display name.' : null;
    final phoneError = guest && !RegExp(r'^(09\d{9}|639\d{9})$').hasMatch(digits)
        ? 'Enter an 11-digit mobile number (09XX XXX XXXX).'
        : null;

    return Column(
      children: [
        ScreenHeader(title: 'Report Fire Incident?', onBack: app.back),
        Expanded(
          child: ListView(
            padding: const EdgeInsets.all(20),
            children: [
              const MapPlaceholder(height: 160),
              const SizedBox(height: 12),
              const Text(defaultAddress, style: TextStyle(fontWeight: FontWeight.w600)),
              const Text('Pin is mock data — map coming soon.', style: TextStyle(fontSize: 12, color: Fw69Colors.neutralTextMuted)),
              const SizedBox(height: 12),
              const Text('Your camera would open after confirm. Video is a placeholder in Layer B.'),
              if (guest) ...[
                const SizedBox(height: 16),
                const Text('Your details', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                TextField(controller: _name, decoration: const InputDecoration(labelText: 'Name or display name')),
                if (_touched && nameError != null) Text(nameError, style: const TextStyle(color: Fw69Colors.alertCriticalText, fontSize: 12)),
                TextField(controller: _phone, decoration: const InputDecoration(labelText: 'Mobile number', hintText: '09XX XXX XXXX')),
                if (_touched && phoneError != null) Text(phoneError, style: const TextStyle(color: Fw69Colors.alertCriticalText, fontSize: 12)),
                TextField(controller: _notes, decoration: const InputDecoration(labelText: 'Landmark or details (optional)')),
              ],
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              FilledButton.icon(
                onPressed: () {
                  setState(() => _touched = true);
                  if (nameError != null || phoneError != null) return;
                  app.startReport(
                    ReportDraft(
                      location: defaultAddress,
                      reporterName: _name.text.trim(),
                      reporterPhone: digits,
                      notes: _notes.text,
                    ),
                  );
                  setState(() => _step = 'video');
                },
                icon: const Icon(Icons.send),
                label: const Text('Confirm + Send SOS'),
                style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(52)),
              ),
              TextButton(onPressed: app.back, child: const Text('Cancel')),
            ],
          ),
        ),
      ],
    );
  }
}
