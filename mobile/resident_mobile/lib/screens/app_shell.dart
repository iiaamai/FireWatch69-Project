import 'package:flutter/material.dart';

import '../constants.dart';
import '../models/models.dart';
import '../state/resident_app_state.dart';
import 'home_screen.dart';
import 'login_screen.dart';
import 'map_alerts_reports.dart';
import 'profile_report.dart';

class AppShell extends StatelessWidget {
  const AppShell({super.key});

  static const _tabNames = {
    AppRouteName.home,
    AppRouteName.map,
    AppRouteName.alerts,
    AppRouteName.reports,
    AppRouteName.profile,
    AppRouteName.myReport,
  };

  @override
  Widget build(BuildContext context) {
    final app = ResidentScope.of(context);
    final showNav = app.role != null && _tabNames.contains(app.screen.name);

    return ColoredBox(
      color: Fw69Colors.neutralBg,
      child: SafeArea(
        child: Column(
          children: [
            if (app.bannerText != null)
              Material(
                color: Fw69Colors.neutralActive,
                child: ListTile(
                  title: Text(app.bannerText!, style: const TextStyle(color: Fw69Colors.neutralOnDark)),
                  trailing: IconButton(
                    icon: const Icon(Icons.close, color: Fw69Colors.neutralOnDark),
                    onPressed: app.dismissBanner,
                  ),
                  onTap: () {
                    final id = app.bannerIncidentId;
                    app.dismissBanner();
                    if (id != null) app.navigate(AppRoute.detail(id));
                  },
                ),
              ),
            Expanded(
              child: Scaffold(
                appBar: _tabAppBar(app),
                body: _screen(app),
              ),
            ),
            if (showNav) _BottomNav(app: app),
          ],
        ),
      ),
    );
  }

  PreferredSizeWidget? _tabAppBar(ResidentAppState app) {
    final name = app.screen.name;
    if (!_tabNames.contains(name)) return null;

    if (name == AppRouteName.home) {
      return _HomeAppBar(app: app);
    }

    final title = switch (name) {
      AppRouteName.map => 'Fire map',
      AppRouteName.alerts => 'Fire alerts',
      AppRouteName.reports => 'My reports',
      AppRouteName.profile => 'Profile',
      AppRouteName.myReport => 'My report',
      _ => '',
    };

    return AppBar(
      automaticallyImplyLeading: false,
      title: Text(title),
    );
  }

  Widget _screen(ResidentAppState app) {
    final s = app.screen;
    return switch (s.name) {
      AppRouteName.login => const LoginScreen(),
      AppRouteName.home => const HomeScreen(),
      AppRouteName.map => MapScreen(focusId: s.focusId),
      AppRouteName.alerts => const AlertsScreen(),
      AppRouteName.reports => const MyReportsScreen(),
      AppRouteName.profile => const ProfileScreen(),
      AppRouteName.myReport => const GuestMyReportScreen(),
      AppRouteName.detail => IncidentDetailScreen(id: s.id ?? ''),
      AppRouteName.tracking => TrackingScreen(id: s.id ?? ''),
      AppRouteName.report => const ReportFireScreen(),
    };
  }
}

class _HomeAppBar extends StatelessWidget implements PreferredSizeWidget {
  const _HomeAppBar({required this.app});

  final ResidentAppState app;

  @override
  Size get preferredSize => const Size.fromHeight(72);

  @override
  Widget build(BuildContext context) {
    if (app.isGuest) {
      return AppBar(
        automaticallyImplyLeading: false,
        toolbarHeight: 72,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Browsing as guest',
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.w500, color: Fw69Colors.neutralTextMuted),
            ),
            Text('Brgy. 69, Tondo', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          ],
        ),
        actions: [
          TextButton.icon(
            onPressed: app.signOut,
            icon: const Icon(Icons.login, size: 16),
            label: const Text('Log in'),
          ),
        ],
      );
    }

    final alerts = app.activeNearby;
    final hour = DateTime.now().hour;
    final greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    return AppBar(
      automaticallyImplyLeading: false,
      toolbarHeight: 72,
      title: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.place_outlined, size: 12, color: Fw69Colors.neutralTextMuted),
              SizedBox(width: 4),
              Text(
                'Brgy. 69, Tondo, Manila',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.w500, color: Fw69Colors.neutralTextMuted),
              ),
            ],
          ),
          Text(
            '$greet, ${app.profile.firstName}',
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
        ],
      ),
      actions: [
        Padding(
          padding: const EdgeInsets.only(right: 8),
          child: IconButton.outlined(
            onPressed: () => app.goTab(const AppRoute.alerts()),
            icon: Badge(
              isLabelVisible: alerts.isNotEmpty,
              label: Text('${alerts.length}'),
              child: const Icon(Icons.notifications_outlined),
            ),
          ),
        ),
      ],
    );
  }
}

class _BottomNav extends StatelessWidget {
  const _BottomNav({required this.app});

  final ResidentAppState app;

  @override
  Widget build(BuildContext context) {
    final guest = app.isGuest;
    final items = guest
        ? const [
            (AppRouteName.home, Icons.home_outlined, 'Home'),
            (AppRouteName.map, Icons.map_outlined, 'Map'),
            (AppRouteName.myReport, Icons.assignment_outlined, 'My Report'),
          ]
        : const [
            (AppRouteName.home, Icons.home_outlined, 'Home'),
            (AppRouteName.map, Icons.map_outlined, 'Map'),
            (AppRouteName.alerts, Icons.notifications_outlined, 'Alerts'),
            (AppRouteName.reports, Icons.assignment_outlined, 'My Reports'),
            (AppRouteName.profile, Icons.person_outline, 'Profile'),
          ];

    final current = app.screen.name;
    final alertCount = app.activeNearby.length;

    return Material(
      color: Fw69Colors.neutralSurface,
      child: Row(
        children: [
          for (final item in items)
            Expanded(
              child: InkWell(
                onTap: () {
                  final route = switch (item.$1) {
                    AppRouteName.home => const AppRoute.home(),
                    AppRouteName.map => const AppRoute.map(),
                    AppRouteName.alerts => const AppRoute.alerts(),
                    AppRouteName.reports => const AppRoute.reports(),
                    AppRouteName.profile => const AppRoute.profile(),
                    AppRouteName.myReport => const AppRoute.myReport(),
                    _ => const AppRoute.home(),
                  };
                  app.goTab(route);
                },
                child: SizedBox(
                  height: 64,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Badge(
                        isLabelVisible: item.$1 == AppRouteName.alerts && alertCount > 0,
                        label: Text('$alertCount'),
                        child: Icon(
                          item.$2,
                          color: current == item.$1 ? Fw69Colors.neutralActive : Fw69Colors.neutralTextMuted,
                        ),
                      ),
                      Text(
                        item.$3,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: current == item.$1 ? Fw69Colors.neutralActive : Fw69Colors.neutralTextMuted,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
