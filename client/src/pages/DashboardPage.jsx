import { useAuth } from '../hooks/useAuth.js';
import '../auth.css';

export default function DashboardPage() {
  const { user, logout, useMock } = useAuth();

  return (
    <div className="auth-shell auth-shell--wide">
      <header className="dash-header">
        <div>
          <p className="auth-eyebrow">FireWatch 69</p>
          <h1 className="auth-title">Dashboard</h1>
          <p className="auth-muted">
            Welcome, {user?.fullName} ({user?.role})
            {useMock ? ' · mock session' : ''}
          </p>
        </div>
        <button type="button" className="auth-button auth-button--secondary" onClick={logout}>
          Sign out
        </button>
      </header>
      <section className="dash-placeholder">
        <p>Incident queue and map layers will be added in the Incidents module (Layer B).</p>
      </section>
    </div>
  );
}
