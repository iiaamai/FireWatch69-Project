/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useToast } from '../components/ToastProvider.jsx';
import { createInitialMockStore } from '../data/buildMockStore.js';
import { buildRoute, distance, routeLength } from '../utils/geo.js';
import { nowIso } from '../utils/time.js';
import { incidentStatusMeta } from '../utils/status.js';

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const { addToast } = useToast();
  const initialStore = useMemo(() => createInitialMockStore(), []);
  const [incidents, setIncidents] = useState(initialStore.incidents);
  const [teams, setTeams] = useState(initialStore.teams);
  const [centers, setCenters] = useState(initialStore.centers);
  const [users, setUsers] = useState(initialStore.users);
  const [logs, setLogs] = useState(initialStore.logs);
  const [notifications, setNotifications] = useState(initialStore.notifications);
  const [history, setHistory] = useState(initialStore.history);
  const counter = useRef(200);

  const sessionUserId = initialStore.currentUser.id;
  const currentUser = users.find((u) => u.id === sessionUserId) ?? users[0];
  const nextId = (prefix) => `${prefix}-${++counter.current}`;

  const addLog = useCallback((action, module, description, incidentId = null) => {
    setLogs((prev) => [
      {
        id: nextId('L'),
        userName: currentUser?.name ?? 'Unknown',
        action,
        module,
        timestamp: nowIso(),
        incidentId,
        description,
      },
      ...prev,
    ]);
  }, [currentUser?.name]);

  const pushNotification = useCallback((n) => {
    setNotifications((prev) => [{ ...n, id: nextId('N'), timestamp: nowIso(), read: false }, ...prev]);
  }, []);

  const appendTimeline = (inc, label, actor) => ({
    ...inc,
    lastUpdate: nowIso(),
    timeline: [...inc.timeline, { id: nextId('t'), time: nowIso(), label, actor }],
  });

  const setIncidentStatus = (id, status, note) => {
    const inc = incidents.find((i) => i.id === id);
    if (!inc) return;
    const label = `Status updated to ${incidentStatusMeta[status].label}${note ? ` — ${note}` : ''}`;
    setIncidents((prev) => prev.map((i) => (i.id === id ? appendTimeline({ ...i, status }, label, currentUser.name) : i)));
    if (status === 'resolved') {
      setTeams((prev) =>
        prev.map((t) =>
          t.assignedIncidentId === id ? { ...t, status: 'available', assignedIncidentId: null, route: [], etaMin: null } : t,
        ),
      );
    }
    const type = status === 'resolved' ? 'resolved' : status === 'contained' ? 'contained' : status === 'verified' ? 'verified' : 'status_changed';
    pushNotification({
      type,
      title: `Fire incident ${incidentStatusMeta[status].label.toLowerCase()}`,
      message: `${inc.incidentCode} · ${inc.location}`,
      severity: inc.severity,
      incidentId: id,
    });
    addLog(status === 'resolved' ? 'Resolved incident' : 'Changed status', 'Incidents', `${inc.incidentCode} marked as ${incidentStatusMeta[status].label}.`, id);
    addToast({ type: 'success', message: `${inc.incidentCode} marked as ${incidentStatusMeta[status].label}` });
  };

  const assignTeam = (incidentId, teamId) => {
    const inc = incidents.find((i) => i.id === incidentId);
    const team = teams.find((t) => t.id === teamId);
    if (!inc || !team) return;
    const route = buildRoute(team.position, inc.position);
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          return {
            ...t,
            status: 'dispatched',
            assignedIncidentId: incidentId,
            route,
            etaMin: Math.max(1, Math.ceil(routeLength(route, t.position) / 100)),
          };
        }
        if (t.id === inc.assignedTeamId && t.id !== teamId) {
          return { ...t, status: 'available', assignedIncidentId: null, route: [], etaMin: null };
        }
        return t;
      }),
    );
    const stageIndex = ['reported', 'verified'].includes(inc.status);
    setIncidents((prev) =>
      prev.map((i) =>
        i.id === incidentId
          ? appendTimeline(
              { ...i, assignedTeamId: teamId, dispatchFailed: false, status: stageIndex ? 'dispatched' : i.status },
              `${team.name} ${inc.assignedTeamId ? 'reassigned' : 'dispatched'}`,
              currentUser.name,
            )
          : i,
      ),
    );
    pushNotification({ type: 'dispatched', title: 'Response team dispatched', message: `${team.name} → ${inc.location}`, severity: inc.severity, incidentId });
    addLog(inc.assignedTeamId ? 'Reassigned team' : 'Dispatched team', 'Incidents', `${team.name} assigned to ${inc.incidentCode}.`, incidentId);
    addToast({ type: 'info', message: `${team.name} dispatched to ${inc.incidentCode}` });
  };

  const retryDispatch = (incidentId) => {
    const inc = incidents.find((i) => i.id === incidentId);
    if (!inc) return;
    const available = teams
      .filter((t) => t.status === 'available')
      .sort((a, b) => distance(a.position, inc.position) - distance(b.position, inc.position));
    if (!available.length) {
      addToast({ type: 'error', message: 'No available teams. Request mutual aid from BFP Manila District.' });
      return;
    }
    assignTeam(incidentId, available[0].id);
  };

  const setMediaStatus = (incidentId, mediaId, status) => {
    setIncidents((prev) =>
      prev.map((i) => (i.id === incidentId ? { ...i, media: i.media.map((m) => (m.id === mediaId ? { ...m, status } : m)) } : i)),
    );
    addLog(status === 'verified' ? 'Verified media' : 'Rejected media', 'Incidents', `Media ${mediaId} ${status}.`, incidentId);
  };

  const saveTeam = (team) => {
    const exists = teams.some((t) => t.id === team.id);
    setTeams((prev) => (exists ? prev.map((t) => (t.id === team.id ? team : t)) : [...prev, team]));
    addLog(exists ? 'Edited team' : 'Created team', 'Teams', `${exists ? 'Updated' : 'Created'} team ${team.name}.`);
  };

  const setTeamStatus = (teamId, status) => {
    setTeams((prev) => prev.map((t) => (t.id === teamId ? { ...t, status } : t)));
    const team = teams.find((t) => t.id === teamId);
    addLog('Updated availability', 'Teams', `${team?.name} set to ${status.replace('_', ' ')}.`);
  };

  const saveCenter = (center) => {
    const exists = centers.some((c) => c.id === center.id);
    setCenters((prev) => (exists ? prev.map((c) => (c.id === center.id ? center : c)) : [...prev, center]));
    addLog(exists ? 'Edited center' : 'Created center', 'Evacuation', `${exists ? 'Updated' : 'Created'} ${center.name}.`);
  };

  const setCenterStatus = (centerId, status) => {
    const center = centers.find((c) => c.id === centerId);
    setCenters((prev) => prev.map((c) => (c.id === centerId ? { ...c, status, lastUpdated: nowIso() } : c)));
    pushNotification({ type: 'center_status', title: 'Evacuation center status changed', message: `${center?.name} is now ${status.replace('_', ' ')}.`, severity: 'info', incidentId: null });
    addLog('Changed status', 'Evacuation', `${center?.name} status set to ${status.replace('_', ' ')}.`);
  };

  const saveUser = (user) => {
    const exists = users.some((u) => u.id === user.id);
    setUsers((prev) => (exists ? prev.map((u) => (u.id === user.id ? user : u)) : [user, ...prev]));
    addLog(exists ? 'Edited user' : 'Created user', 'Users', `${exists ? 'Updated' : 'Created'} account for ${user.name}.`);
  };

  const deleteUser = (userId) => {
    const user = users.find((u) => u.id === userId);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    addLog('Deleted user', 'Users', `Deleted account of ${user?.name}.`);
  };

  const setUserStatus = (userId, status) => {
    const user = users.find((u) => u.id === userId);
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status } : u)));
    addLog('Changed user status', 'Users', `${user?.name} set to ${status}.`);
  };

  const addHistory = (item) => {
    setHistory((prev) => [item, ...prev]);
    addLog('Created incident', 'History', `Encoded fire incident ${item.id} at ${item.location}.`, item.id);
  };

  const markRead = (id) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const value = {
    incidents,
    teams,
    centers,
    users,
    logs,
    notifications,
    history,
    currentUser,
    unreadCount,
    setIncidentStatus,
    assignTeam,
    retryDispatch,
    setMediaStatus,
    saveTeam,
    setTeamStatus,
    saveCenter,
    setCenterStatus,
    saveUser,
    deleteUser,
    setUserStatus,
    addHistory,
    markRead,
    markAllRead,
    addLog,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
