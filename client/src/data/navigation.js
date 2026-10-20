import {
  LayoutDashboardIcon,
  FlameIcon,
  NavigationIcon,
  UsersIcon,
  TentIcon,
  HistoryIcon,
  BarChart3Icon,
  MapIcon,
  BellIcon,
  ScrollTextIcon,
  UserCogIcon,
  CircleUserIcon,
} from 'lucide-react';

export const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboardIcon, group: 'Operations' },
  { path: '/incidents', label: 'Manage Fire Incidents', icon: FlameIcon, group: 'Operations', badge: 'activeIncidents' },
  { path: '/responders', label: 'Track Responders', icon: NavigationIcon, group: 'Operations' },
  { path: '/teams', label: 'Team Management', icon: UsersIcon, group: 'Resources' },
  { path: '/evacuation', label: 'Evacuation Centers', icon: TentIcon, group: 'Resources' },
  { path: '/history', label: 'Fire Incident History', icon: HistoryIcon, group: 'Insights' },
  { path: '/analytics', label: 'Analytics & Reports', icon: BarChart3Icon, group: 'Insights' },
  { path: '/heatmap', label: 'Fire Incident Heatmap', icon: MapIcon, group: 'Insights' },
  { path: '/notifications', label: 'Notifications', icon: BellIcon, group: 'System', badge: 'unread' },
  { path: '/logs', label: 'Activity Logs', icon: ScrollTextIcon, group: 'System' },
  { path: '/users', label: 'Manage Users', icon: UserCogIcon, group: 'System' },
  { path: '/account', label: 'Account', icon: CircleUserIcon, group: 'System' },
];
