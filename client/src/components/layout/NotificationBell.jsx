import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BellIcon } from 'lucide-react';
import { useAppData } from '../../contexts/AppDataContext.jsx';
import { NotificationItem } from '../NotificationItem.jsx';

export function NotificationBell() {
  const { notifications, unreadCount, markAllRead, markRead } = useAppData();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`Notifications, ${unreadCount} unread`}
        className="relative rounded-md border border-neutral-border bg-neutral-surface p-2 text-neutral-text-muted hover:bg-neutral-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-border"
      >
        <BellIcon className="h-[18px] w-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 font-mono text-[10px] font-semibold text-neutral-on-dark">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Recent notifications"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-40 mt-2 w-[380px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-neutral-border bg-neutral-surface shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-neutral-border px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-neutral-text">Notifications</p>
                <p className="font-mono text-[11px] text-neutral-text-muted">{unreadCount} unread</p>
              </div>
              <button type="button" onClick={markAllRead} className="text-xs font-medium text-neutral-text-muted underline-offset-2 hover:underline disabled:text-neutral-text-muted" disabled={unreadCount === 0}>
                Mark all as read
              </button>
            </div>
            <ul className="max-h-[420px] divide-y divide-neutral-border overflow-y-auto">
              {notifications.slice(0, 7).map((n) => (
                <li key={n.id}>
                  <NotificationItem
                    notification={n}
                    compact
                    onOpen={() => {
                      markRead(n.id);
                      setOpen(false);
                      if (n.incidentId) navigate(`/incidents?id=${n.incidentId}`);
                      else navigate('/evacuation');
                    }}
                    onMarkRead={() => markRead(n.id)}
                  />
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate('/notifications');
              }}
              className="w-full border-t border-neutral-border px-4 py-2.5 text-center text-sm font-medium text-neutral-text hover:bg-neutral-bg"
            >
              View notification history
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
