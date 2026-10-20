import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastProvider } from './components/ToastProvider.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { AppDataProvider } from './contexts/AppDataContext.jsx';
import { AppDataErrorBoundary } from './components/AppDataErrorBoundary.jsx';
import { AppShell } from './components/layout/AppShell.jsx';
import { Login } from './pages/Login.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { ManageIncidents } from './pages/ManageIncidents.jsx';
import { TrackResponders } from './pages/TrackResponders.jsx';
import { TeamManagement } from './pages/TeamManagement.jsx';
import { EvacuationCenters } from './pages/EvacuationCenters.jsx';
import { IncidentHistory } from './pages/IncidentHistory.jsx';
import { Analytics } from './pages/Analytics.jsx';
import { Heatmap } from './pages/Heatmap.jsx';
import { Notifications } from './pages/Notifications.jsx';
import { ActivityLogs } from './pages/ActivityLogs.jsx';
import { ManageUsers } from './pages/ManageUsers.jsx';
import { Account } from './pages/Account.jsx';

function AuthGate({ children }) {
  const { loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas text-sm text-neutral-text-muted">
        Checking session…
      </div>
    );
  }
  return children;
}

function ProtectedRoutes() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <AppDataErrorBoundary>
      <AppDataProvider>
        <AppShell />
      </AppDataProvider>
    </AppDataErrorBoundary>
  );
}

function LoginRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <Login />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AuthGate>
            <Routes>
              <Route path="/login" element={<LoginRoute />} />
              <Route element={<ProtectedRoutes />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/incidents" element={<ManageIncidents />} />
                <Route path="/responders" element={<TrackResponders />} />
                <Route path="/teams" element={<TeamManagement />} />
                <Route path="/evacuation" element={<EvacuationCenters />} />
                <Route path="/history" element={<IncidentHistory />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/heatmap" element={<Heatmap />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/logs" element={<ActivityLogs />} />
                <Route path="/users" element={<ManageUsers />} />
                <Route path="/account" element={<Account />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthGate>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
