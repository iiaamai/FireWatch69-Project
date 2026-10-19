import 'package:flutter/material.dart';

import '../constants.dart';
import '../data/seed_data.dart';
import '../models/models.dart';
import '../state/resident_app_state.dart';
import '../widgets/fw_widgets.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final app = ResidentScope.of(context);
    if (app.isGuest) return const _GuestHome();
    return const _VerifiedHome();
  }
}

class _VerifiedHome extends StatelessWidget {
  const _VerifiedHome();

  @override
  Widget build(BuildContext context) {
    final app = ResidentScope.of(context);
    final active = app.myIncident?.status.isActive == true ? app.myIncident : null;
    final alerts = app.activeNearby;

    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
      children: [
        SosButton(onPressed: () => app.navigate(const AppRoute.report())),
        if (active != null) ...[
          const SizedBox(height: 12),
          _ActiveReportCard(incident: active),
        ],
        const SizedBox(height: 24),
        _AroundYouCard(count: alerts.length),
        const SizedBox(height: 24),
        Row(
          children: [
            const Expanded(child: Text('Nearby fire alerts', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold))),
            TextButton(
              onPressed: () => app.goTab(const AppRoute.alerts()),
              child: Text('See all ${alerts.length}'),
            ),
          ],
        ),
        ...alerts.take(3).map((i) => _AlertRow(incident: i)),
        const SizedBox(height: 24),
        const Text('Latest incident updates', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        ...recentUpdates.map((u) => _UpdateCard(item: u)),
      ],
    );
  }
}

class _GuestHome extends StatelessWidget {
  const _GuestHome();

  @override
  Widget build(BuildContext context) {
    final app = ResidentScope.of(context);
    final active = app.myIncident?.status.isActive == true ? app.myIncident : null;
    final alerts = app.activeNearby;

    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
      children: [
        SosButton(onPressed: () => app.navigate(const AppRoute.report())),
        if (active != null) ...[
          const SizedBox(height: 12),
          _ActiveReportCard(incident: active, guest: true),
        ],
        const SizedBox(height: 24),
        _AroundYouCard(count: alerts.length),
        const SizedBox(height: 24),
        Text('${alerts.length} active fires nearby', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        ...alerts.map((i) => _AlertRow(incident: i)),
      ],
    );
  }
}

class _AroundYouCard extends StatelessWidget {
  const _AroundYouCard({required this.count});

  final int count;

  @override
  Widget build(BuildContext context) {
    final app = ResidentScope.of(context);
    return Container(
      decoration: BoxDecoration(
        color: Fw69Colors.neutralSurface,
        border: Border.all(color: Fw69Colors.neutralBorder),
        borderRadius: BorderRadius.circular(16),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Around you', style: TextStyle(fontWeight: FontWeight.bold)),
                    Text('$count active fires · ${evacCenters.length} evacuation centers',
                        style: const TextStyle(fontSize: 12, color: Fw69Colors.neutralTextMuted)),
                  ],
                ),
              ),
              TextButton(
                onPressed: () => app.goTab(const AppRoute.map()),
                child: const Text('Open map'),
              ),
            ],
          ),
          const SizedBox(height: 8),
          GestureDetector(
            onTap: () => app.goTab(const AppRoute.map()),
            child: const MapPlaceholder(height: 160),
          ),
        ],
      ),
    );
  }
}

class _ActiveReportCard extends StatelessWidget {
  const _ActiveReportCard({required this.incident, this.guest = false});

  final Incident incident;
  final bool guest;

  @override
  Widget build(BuildContext context) {
    final app = ResidentScope.of(context);
    return Material(
      color: Fw69Colors.neutralSurface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: Fw69Colors.neutralActive, width: 2),
      ),
      child: InkWell(
        onTap: () {
          if (guest) {
            app.goTab(const AppRoute.myReport());
          } else {
            app.navigate(AppRoute.detail(incident.id));
          }
        },
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('My active fire report', style: TextStyle(fontSize: 12, color: Fw69Colors.neutralTextMuted)),
              const SizedBox(height: 8),
              Row(
                children: [
                  Text('#${incident.incidentCode}', style: const TextStyle(fontWeight: FontWeight.w700)),
                  const SizedBox(width: 8),
                  StatusChip(status: incident.status),
                ],
              ),
              const SizedBox(height: 8),
              Text(incident.addressText, style: const TextStyle(color: Fw69Colors.neutralTextMuted)),
              const SizedBox(height: 12),
              StageStrip(status: incident.status),
              const SizedBox(height: 8),
              const Row(
                children: [
                  Text('View incident updates', style: TextStyle(fontWeight: FontWeight.w600)),
                  Spacer(),
                  Icon(Icons.chevron_right),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _HomeListCard extends StatelessWidget {
  const _HomeListCard({required this.onTap, required this.child});

  final VoidCallback onTap;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 8),
      child: Material(
        color: Fw69Colors.neutralSurface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: Fw69Colors.neutralBorder),
        ),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: child,
          ),
        ),
      ),
    );
  }
}

class _AlertRow extends StatelessWidget {
  const _AlertRow({required this.incident});

  final Incident incident;

  @override
  Widget build(BuildContext context) {
    final app = ResidentScope.of(context);
    return _HomeListCard(
      onTap: () => app.navigate(AppRoute.detail(incident.id)),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  incident.addressText,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 4),
                Text(
                  '${incident.severity.label} · ${incident.distanceKm} km · ${incident.reportedAgo}',
                  style: const TextStyle(fontSize: 12, color: Fw69Colors.neutralTextMuted),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          StatusChip(status: incident.status),
        ],
      ),
    );
  }
}

class _UpdateCard extends StatelessWidget {
  const _UpdateCard({required this.item});

  final FeedItem item;

  @override
  Widget build(BuildContext context) {
    final app = ResidentScope.of(context);
    return _HomeListCard(
      onTap: () => app.navigate(AppRoute.detail(item.incidentId)),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const CircleAvatar(
            backgroundColor: Fw69Colors.neutralBg,
            child: Icon(Icons.local_fire_department, color: Fw69Colors.neutralText, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(item.status.label, style: const TextStyle(fontWeight: FontWeight.w600)),
                const SizedBox(height: 4),
                Text(item.text, style: const TextStyle(color: Fw69Colors.neutralTextMuted)),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Text(item.timeLabel, style: const TextStyle(fontSize: 12, color: Fw69Colors.neutralTextMuted)),
        ],
      ),
    );
  }
}
