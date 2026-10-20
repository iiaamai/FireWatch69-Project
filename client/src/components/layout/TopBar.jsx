import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MenuIcon, FlameIcon } from 'lucide-react';
import { format } from 'date-fns';
import { navItems } from '../../data/navigation.js';
import { NotificationBell } from './NotificationBell.jsx';
import { useAppData } from '../../contexts/AppDataContext.jsx';
import { currentTime } from '../../utils/time.js';
import { isActiveIncident } from '../../utils/status.js';

export function TopBar({ onOpenMenu }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { incidents } = useAppData();
  const [now, setNow] = useState(currentTime());
  const item = navItems.find((n) => (n.path === '/' ? location.pathname === '/' : location.pathname.startsWith(n.path)));
  const active = incidents.filter((i) => isActiveIncident(i.status));
  const critical = active.filter((i) => i.severity === 'critical').length;

  useEffect(() => {
    const t = window.setInterval(() => setNow(currentTime()), 1000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-neutral-border bg-neutral-surface/95 px-4 backdrop-blur lg:px-6">
      <button type="button" onClick={onOpenMenu} className="rounded-md p-2 text-neutral-text-muted hover:bg-neutral-bg lg:hidden" aria-label="Open navigation">
        <MenuIcon className="h-5 w-5" />
      </button>
      <div className="min-w-0 flex-1">
        <p className="eyebrow hidden sm:block">Barangay 69 · Tondo, Manila</p>
        <p className="truncate text-base font-bold text-neutral-text">{item?.label ?? 'ERRS'}</p>
      </div>
      <div className="hidden items-center gap-2 font-mono text-xs text-neutral-text-muted md:flex">
        <span className="inline-flex items-center gap-1.5 rounded border border-neutral-border px-2 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" /> LIVE
        </span>
        <time dateTime={now.toISOString()} className="tabular-nums">
          {format(now, 'EEE, MMM d · HH:mm:ss')}
        </time>
      </div>
      <button
        type="button"
        onClick={() => navigate('/incidents')}
        className="inline-flex items-center gap-2 rounded-md border border-alert-critical-border bg-alert-critical-bg px-3 py-1.5 text-sm font-semibold text-alert-critical-text hover:bg-alert-critical-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-alert-critical-border"
      >
        <FlameIcon className="h-4 w-4" aria-hidden="true" />
        <span>
          {active.length} active<span className="hidden sm:inline"> fires</span>
        </span>
        {critical > 0 && <span className="rounded bg-primary px-1.5 py-0.5 font-mono text-[10px] text-neutral-on-dark">{critical} CRITICAL</span>}
      </button>
      <NotificationBell />
    </header>
  );
}
