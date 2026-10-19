import 'package:flutter/material.dart';

import '../constants.dart';
import '../data/seed_data.dart';
import '../models/models.dart';
import '../state/resident_app_state.dart';
import '../widgets/fw_widgets.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key, this.focusId});

  final String? focusId;

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  bool _fires = true;
  bool _evac = true;
  String? _selectedIncidentId;
  String? _selectedEvacId;

  @override
  void initState() {
    super.initState();
    _selectedIncidentId = widget.focusId;
  }

  @override
  Widget build(BuildContext context) {
    final app = ResidentScope.of(context);
    final incidents = app.activeNearby;
    final incidentMatches = incidents.where((i) => i.id == _selectedIncidentId);
    final evacMatches = evacCenters.where((c) => c.id == _selectedEvacId);
    final selectedIncident = incidentMatches.isEmpty ? null : incidentMatches.first;
    final selectedEvac = evacMatches.isEmpty ? null : evacMatches.first;
    final nearest = evacCenters.where((c) => c.availability != EvacAvailability.full).toList()
      ..sort((a, b) => a.distanceKm.compareTo(b.distanceKm));

    return Stack(
      children: [
        const Positioned.fill(
          child: ColoredBox(
            color: Fw69Colors.neutralBg,
            child: Center(child: MapPlaceholder(height: 280)),
          ),
        ),
        Positioned(
          left: 16,
          right: 16,
          top: 16,
          child: Material(
            color: Fw69Colors.neutralSurface,
            elevation: 1,
            borderRadius: BorderRadius.circular(16),
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Expanded(
                        child: Text(
                          'BRGY. 69 · TONDO, MANILA',
                          style: TextStyle(fontSize: 11, color: Fw69Colors.neutralTextMuted),
                        ),
                      ),
                      FilledButton.icon(
                        onPressed: () => app.navigate(const AppRoute.report()),
                        icon: const Icon(Icons.videocam, size: 16),
                        label: const Text('SOS'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    children: [
                      FilterChip(
                        selected: _fires,
                        label: Text('Fires ${incidents.length}'),
                        onSelected: (v) => setState(() => _fires = v),
                      ),
                      FilterChip(
                        selected: _evac,
                        label: Text('Evacuation ${evacCenters.length}'),
                        onSelected: (v) => setState(() => _evac = v),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
        Positioned(
          left: 12,
          right: 12,
          bottom: 12,
          child: Material(
            color: Fw69Colors.neutralSurface,
            borderRadius: BorderRadius.circular(16),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: selectedIncident != null
                  ? Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text('#${selectedIncident.incidentCode}', style: const TextStyle(fontSize: 12, color: Fw69Colors.neutralTextMuted)),
                        Text(selectedIncident.addressText, style: const TextStyle(fontWeight: FontWeight.bold)),
                        const SizedBox(height: 8),
                        Row(children: [
                          SeverityChip(severity: selectedIncident.severity),
                          const SizedBox(width: 8),
                          StatusChip(status: selectedIncident.status),
                        ]),
                        const SizedBox(height: 12),
                        FilledButton(
                          style: FilledButton.styleFrom(backgroundColor: Fw69Colors.neutralActive, minimumSize: const Size.fromHeight(44)),
                          onPressed: () => app.navigate(AppRoute.detail(selectedIncident.id)),
                          child: const Text('View details'),
                        ),
                      ],
                    )
                  : selectedEvac != null
                      ? Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(selectedEvac.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                            Text(selectedEvac.addressText, style: const TextStyle(color: Fw69Colors.neutralTextMuted)),
                            Text('${selectedEvac.statusLabel} · ${selectedEvac.distanceKm} km · ${selectedEvac.walkMin} min walk'),
                            const SizedBox(height: 8),
                            const Text('Walking directions use an external maps app when Layer D is ready.'),
                          ],
                        )
                      : ListTile(
                          contentPadding: EdgeInsets.zero,
                          leading: const Icon(Icons.holiday_village_outlined),
                          title: const Text('Nearest evacuation center'),
                          subtitle: Text(nearest.isEmpty ? 'None listed' : '${nearest.first.name} · ${nearest.first.distanceKm} km'),
                          onTap: nearest.isEmpty
                              ? null
                              : () => setState(() {
                                    _selectedEvacId = nearest.first.id;
                                    _selectedIncidentId = null;
                                  }),
                        ),
            ),
          ),
        ),
        if (_fires)
          Positioned(
            left: 16,
            top: 160,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: incidents
                  .take(3)
                  .map(
                    (i) => Padding(
                      padding: const EdgeInsets.only(bottom: 6),
                      child: ActionChip(
                        label: Text(i.incidentCode),
                        onPressed: () => setState(() {
                          _selectedIncidentId = i.id;
                          _selectedEvacId = null;
                        }),
                      ),
                    ),
                  )
                  .toList(),
            ),
          ),
      ],
    );
  }
}

Widget _equalFilterChip({
  required bool selected,
  required String label,
  required VoidCallback onSelected,
}) {
  return Padding(
    padding: const EdgeInsets.symmetric(horizontal: 2),
    child: FilterChip(
      showCheckmark: false,
      selected: selected,
      visualDensity: VisualDensity.compact,
      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
      padding: EdgeInsets.zero,
      labelPadding: const EdgeInsets.symmetric(horizontal: 4),
      label: SizedBox(
        width: double.infinity,
        child: FittedBox(
          fit: BoxFit.scaleDown,
          child: Text(label, maxLines: 1, textAlign: TextAlign.center),
        ),
      ),
      onSelected: (_) => onSelected(),
    ),
  );
}

class AlertsScreen extends StatefulWidget {
  const AlertsScreen({super.key});

  @override
  State<AlertsScreen> createState() => _AlertsScreenState();
}

class _AlertsScreenState extends State<AlertsScreen> {
  Severity? _filter;

  @override
  Widget build(BuildContext context) {
    final app = ResidentScope.of(context);
    final active = app.activeNearby;
    final items = _filter == null ? active : active.where((i) => i.severity == _filter).toList();

    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
      children: [
        Text('${active.length} active fires nearby (mock)', style: const TextStyle(color: Fw69Colors.neutralTextMuted)),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _equalFilterChip(
                selected: _filter == null,
                label: 'All ${active.length}',
                onSelected: () => setState(() => _filter = null),
              ),
            ),
            ...Severity.values.map(
              (s) => Expanded(
                child: _equalFilterChip(
                  selected: _filter == s,
                  label: '${s.label} ${active.where((i) => i.severity == s).length}',
                  onSelected: () => setState(() => _filter = s),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        if (items.isEmpty)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 40),
            child: Center(child: Text('No fires match this filter.')),
          )
        else
          ...items.map(
            (i) => Card(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(child: Text(i.addressText, style: const TextStyle(fontWeight: FontWeight.w600))),
                        SeverityChip(severity: i.severity),
                      ],
                    ),
                    Text('${i.incidentCode} · ${i.distanceKm} km', style: const TextStyle(fontSize: 12, color: Fw69Colors.neutralTextMuted)),
                    const SizedBox(height: 8),
                    StatusChip(status: i.status),
                    Row(
                      children: [
                        TextButton(
                          onPressed: () => app.goTab(AppRoute.map(focusId: i.id)),
                          child: const Text('Open on map'),
                        ),
                        TextButton(
                          onPressed: () => app.navigate(AppRoute.detail(i.id)),
                          child: const Text('View details'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
      ],
    );
  }
}

class MyReportsScreen extends StatefulWidget {
  const MyReportsScreen({super.key});

  @override
  State<MyReportsScreen> createState() => _MyReportsScreenState();
}

class _MyReportsScreenState extends State<MyReportsScreen> {
  int _tab = 0;

  bool _match(Incident i) {
    return switch (_tab) {
      1 => i.status.stageIndex <= 1 && i.status.isActive,
      2 => i.status.stageIndex >= 2 && i.status.isActive,
      3 => !i.status.isActive,
      _ => true,
    };
  }

  @override
  Widget build(BuildContext context) {
    final app = ResidentScope.of(context);
    final reports = app.myReports;
    final items = reports.where(_match).toList();
    const labels = ['All', 'Pending', 'Active', 'Recent'];

    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
      children: [
        const Text('Fire incidents you have reported', style: TextStyle(color: Fw69Colors.neutralTextMuted)),
        const SizedBox(height: 12),
        SegmentedButton<int>(
          showSelectedIcon: false,
          expandedInsets: EdgeInsets.zero,
          style: const ButtonStyle(
            visualDensity: VisualDensity.compact,
            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
          ),
          segments: [
            for (var i = 0; i < labels.length; i++)
              ButtonSegment(
                value: i,
                label: FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text(labels[i], maxLines: 1, style: const TextStyle(fontSize: 11)),
                ),
              ),
          ],
          selected: {_tab},
          onSelectionChanged: (s) => setState(() => _tab = s.first),
        ),
        const SizedBox(height: 16),
        if (items.isEmpty)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 40),
            child: Center(child: Text('Nothing here.')),
          )
        else
          ...items.map(
            (i) => Card(
              child: ListTile(
                title: Text('#${i.incidentCode}'),
                subtitle: Text('${i.addressText}\n${i.reportedDateLabel} · ${i.reportedAtLabel}'),
                isThreeLine: true,
                trailing: StatusChip(status: i.status),
                onTap: () => app.navigate(AppRoute.detail(i.id)),
              ),
            ),
          ),
      ],
    );
  }
}

class GuestMyReportScreen extends StatelessWidget {
  const GuestMyReportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final app = ResidentScope.of(context);
    final mine = app.myIncident;
    if (mine != null) {
      return IncidentDetailScreen(id: mine.id, embedded: true);
    }
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Spacer(),
          const Icon(Icons.assignment_outlined, size: 40, color: Fw69Colors.neutralTextMuted),
          const SizedBox(height: 12),
          const Text('No fire reported yet', textAlign: TextAlign.center, style: TextStyle(fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          const Text(
            'When you report a fire, you can follow permitted status updates here.',
            textAlign: TextAlign.center,
            style: TextStyle(color: Fw69Colors.neutralTextMuted),
          ),
          const Spacer(),
          SosButton(onPressed: () => app.navigate(const AppRoute.report())),
          const Spacer(),
        ],
      ),
    );
  }
}

class IncidentDetailScreen extends StatelessWidget {
  const IncidentDetailScreen({super.key, required this.id, this.embedded = false});

  final String id;
  final bool embedded;

  @override
  Widget build(BuildContext context) {
    final app = ResidentScope.of(context);
    final incident = app.getIncident(id);
    if (incident == null) {
      return Column(
        children: [
          if (!embedded) ScreenHeader(title: 'Fire incident', onBack: app.back),
          const Expanded(child: Center(child: Text('Incident not found'))),
        ],
      );
    }

    final canTrack = incident.team != null &&
        incident.status.stageIndex >= 2 &&
        incident.status.isActive &&
        (app.isVerified || incident.isMine);
    final guestLocked = app.isGuest && !incident.isMine && incident.team != null && incident.status.isActive;

    return ListView(
      children: [
        if (!embedded)
          ScreenHeader(
            title: 'Fire Incident #${incident.incidentCode}',
            subtitle: incident.isMine ? 'Your report' : '${incident.distanceKm} km from you',
            onBack: app.back,
          ),
        Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: incident.status.isActive ? Fw69Colors.neutralActive : Fw69Colors.neutralBg,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Current status',
                      style: TextStyle(
                        color: incident.status.isActive ? Fw69Colors.neutralOnDark.withValues(alpha: 0.7) : Fw69Colors.neutralTextMuted,
                        fontSize: 12,
                      ),
                    ),
                    Text(
                      incident.status.label,
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w800,
                        color: incident.status.isActive ? Fw69Colors.neutralOnDark : Fw69Colors.neutralText,
                      ),
                    ),
                    Text(
                      incident.updates.isEmpty ? incident.description : incident.updates.last.message,
                      style: TextStyle(
                        color: incident.status.isActive ? Fw69Colors.neutralOnDark : Fw69Colors.neutralTextMuted,
                      ),
                    ),
                    const SizedBox(height: 8),
                    SeverityChip(severity: incident.severity),
                    const SizedBox(height: 4),
                    Text(
                      incident.addressText,
                      style: TextStyle(
                        color: incident.status.isActive ? Fw69Colors.neutralOnDark : Fw69Colors.neutralText,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              _TeamCard(incident: incident),
              if (canTrack) ...[
                const SizedBox(height: 12),
                FilledButton.icon(
                  style: FilledButton.styleFrom(backgroundColor: Fw69Colors.neutralActive, minimumSize: const Size.fromHeight(48)),
                  onPressed: () => app.navigate(AppRoute.tracking(incident.id)),
                  icon: const Icon(Icons.navigation_outlined),
                  label: const Text('Track response team'),
                ),
              ],
              if (guestLocked) ...[
                const SizedBox(height: 12),
                const Text('Team tracking is available for fires you report.'),
              ],
              if (incident.reinforcement != null) ...[
                const SizedBox(height: 12),
                Card(
                  color: Fw69Colors.alertHighBg,
                  child: ListTile(
                    title: const Text('Additional response team requested'),
                    subtitle: Text(
                      '${incident.reinforcement!.team} · ${incident.reinforcement!.statusLabel} · ETA ${incident.reinforcement!.etaMin ?? 'pending'} min',
                    ),
                  ),
                ),
              ],
              const SizedBox(height: 16),
              const Text('Incident progress', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 8),
              StageStrip(status: incident.status),
              const SizedBox(height: 8),
              ...incident.updates.map(
                (u) => ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: Text(u.status.label),
                  subtitle: Text(u.message),
                  trailing: Text(u.timeLabel, style: const TextStyle(fontSize: 12)),
                ),
              ),
              const SizedBox(height: 12),
              const Text('Incident video', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              VideoPlaceholder(label: incident.hasVideo ? 'Video coming soon' : 'No live video for this incident'),
              const SizedBox(height: 16),
              Text(incident.description),
              const SizedBox(height: 12),
              const Text(
                'Some responder details are withheld. Updates are mock Layer B data — not live GPS.',
                style: TextStyle(fontSize: 12, color: Fw69Colors.neutralTextMuted),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _TeamCard extends StatelessWidget {
  const _TeamCard({required this.incident});

  final Incident incident;

  @override
  Widget build(BuildContext context) {
    final team = incident.team;
    if (team == null || incident.status.stageIndex < 2) {
      return const Card(
        child: ListTile(
          title: Text('Response team'),
          subtitle: Text('Awaiting dispatch'),
        ),
      );
    }
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Response team', style: TextStyle(fontSize: 12, color: Fw69Colors.neutralTextMuted)),
            Text(team.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            Text(team.station, style: const TextStyle(color: Fw69Colors.neutralTextMuted)),
            if (incident.status == IncidentStatus.responding && team.etaMin != null)
              Text('ETA ${team.etaMin} min · ${team.distanceKm ?? '—'} km'),
            if (incident.status == IncidentStatus.onScene)
              Text('On scene${team.arrivedAt != null ? ' since ${team.arrivedAt}' : ''}'),
          ],
        ),
      ),
    );
  }
}

class TrackingScreen extends StatelessWidget {
  const TrackingScreen({super.key, required this.id});

  final String id;

  @override
  Widget build(BuildContext context) {
    final app = ResidentScope.of(context);
    final incident = app.getIncident(id);
    final allowed = incident != null && (app.isVerified || incident.isMine);
    final team = incident?.team;

    return Column(
      children: [
        ScreenHeader(title: 'Team tracking${team != null ? ' · ${team.name}' : ''}', subtitle: '#$id', onBack: app.back),
        const Expanded(child: Center(child: MapPlaceholder(height: 220))),
        Padding(
          padding: const EdgeInsets.all(16),
          child: Material(
            color: Fw69Colors.neutralSurface,
            borderRadius: BorderRadius.circular(16),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: !allowed
                  ? const Text('You can track response teams only for fires you reported.')
                  : team == null
                      ? const Text('Live tracking starts when a team is dispatched. Map is a placeholder until Layer D.')
                      : Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            StatusChip(status: incident.status),
                            const SizedBox(height: 8),
                            Text(team.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                            if (team.etaMin != null) Text('Responder ETA ${team.etaMin} min'),
                            const SizedBox(height: 8),
                            const Text('GPS animation is not simulated. Map coming soon.'),
                          ],
                        ),
            ),
          ),
        ),
      ],
    );
  }
}
