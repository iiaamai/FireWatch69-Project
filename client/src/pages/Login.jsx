import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircleIcon, CheckCircle2Icon, LockIcon, MailIcon, FlameIcon, MapPinIcon, NavigationIcon } from 'lucide-react';
import { Input } from '../components/Input.jsx';
import { Button } from '../components/Button.jsx';
import { Checkbox } from '../components/Checkbox.jsx';
import { ErrsLogo } from '../components/layout/ErrsLogo.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('l.ramos@brgy69.gov.ph');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [mode, setMode] = useState('login');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!email.trim()) errs.email = 'Email or username is required.';
    if (mode === 'login' && !password) errs.password = 'Password is required.';
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;
    setError(null);
    setLoading(true);
    if (mode === 'forgot') {
      window.setTimeout(() => {
        setLoading(false);
        setMode('sent');
      }, 900);
      return;
    }
    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen w-full bg-canvas lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden flex-col justify-between bg-neutral-active p-10 text-neutral-on-dark lg:flex">
        <ErrsLogo inverted />
        <div className="max-w-md">
          <p className="font-mono text-xs uppercase tracking-wider text-neutral-on-dark/70">Emergency Response & Reporting System</p>
          <h1 className="mt-3 text-5xl font-extrabold leading-[1.05] tracking-tight">Fire Incident Monitoring & Management</h1>
          <p className="mt-4 text-base text-neutral-on-dark/90">Command center for Barangay 69, Tondo, Manila officials and fire response teams.</p>
          <ul className="mt-8 space-y-3 text-sm text-neutral-on-dark/90">
            <li className="flex items-center gap-3">
              <FlameIcon className="h-4 w-4 text-primary-tint-1" aria-hidden="true" /> Live fire incidents with severity & status
            </li>
            <li className="flex items-center gap-3">
              <NavigationIcon className="h-4 w-4 text-neutral-on-dark/70" aria-hidden="true" /> Real-time responder GPS and ETA
            </li>
            <li className="flex items-center gap-3">
              <MapPinIcon className="h-4 w-4 text-neutral-on-dark/70" aria-hidden="true" /> Evacuation center availability
            </li>
          </ul>
        </div>
        <p className="font-mono text-[11px] text-neutral-on-dark/60">Authorized personnel only · All activity is logged</p>
      </aside>

      <main className="flex items-center justify-center p-6">
        <div className="w-full max-w-[420px]">
          <div className="mb-8 lg:hidden">
            <ErrsLogo />
            <p className="mt-3 text-sm font-semibold text-neutral-text-muted">Fire Incident Monitoring & Management</p>
          </div>

          {mode === 'sent' ? (
            <div className="panel p-6">
              <CheckCircle2Icon className="h-8 w-8 text-neutral-text-muted" aria-hidden="true" />
              <h2 className="mt-3 text-xl font-bold text-neutral-text">Check your email</h2>
              <p className="mt-1 text-sm text-neutral-text-muted">
                If an account exists for <span className="font-medium text-neutral-text">{email}</span>, a reset link has been sent. It expires in 30 minutes.
              </p>
              <Button className="mt-5 w-full" variant="secondary" onClick={() => setMode('login')}>
                Back to sign in
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="panel p-6 sm:p-8">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-text">{mode === 'login' ? 'Sign in' : 'Reset password'}</h2>
              <p className="mt-1 text-sm text-neutral-text-muted">
                {mode === 'login' ? 'Use your official ERRS account.' : 'Enter your email and we’ll send a reset link.'}
              </p>

              {error && (
                <div role="alert" className="mt-5 flex gap-2.5 rounded-md border border-alert-critical-border bg-alert-critical-bg p-3 text-sm text-alert-critical-text">
                  <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">Sign in failed</p>
                    <p>{error}</p>
                  </div>
                </div>
              )}

              <div className="mt-5 space-y-4">
                <Input
                  id="email"
                  label="Email or username"
                  type="text"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={fieldErrors.email}
                  startAdornment={<MailIcon className="h-4 w-4" />}
                  size="large"
                />
                {mode === 'login' && (
                  <Input
                    id="password"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={fieldErrors.password}
                    helperText="Demo: any password with 8+ characters"
                    startAdornment={<LockIcon className="h-4 w-4" />}
                    size="large"
                  />
                )}
              </div>

              {mode === 'login' && (
                <div className="mt-4 flex items-center justify-between">
                  <Checkbox label="Remember me" checked={remember} onChange={(e) => setRemember(e.target.checked)} size="sm" />
                  <button type="button" onClick={() => { setMode('forgot'); setError(null); }} className="text-sm font-medium text-neutral-text underline-offset-2 hover:underline">
                    Forgot password?
                  </button>
                </div>
              )}

              <Button type="submit" size="large" className="mt-6 w-full" loading={loading}>
                {mode === 'login' ? 'Sign in' : 'Send reset link'}
              </Button>

              {mode === 'forgot' && (
                <button type="button" onClick={() => setMode('login')} className="mt-4 w-full text-center text-sm font-medium text-neutral-text-muted hover:underline">
                  Back to sign in
                </button>
              )}
            </form>
          )}
          <p className="mt-6 text-center font-mono text-[11px] text-neutral-text-muted">FireWatch 69 · Barangay 69, Zone 6, Tondo, Manila</p>
        </div>
      </main>
    </div>
  );
}
