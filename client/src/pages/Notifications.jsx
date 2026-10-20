import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCheckIcon, BellOffIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader.jsx';
import { Button } from '../components/Button.jsx';
import { NotificationItem } from '../components/NotificationItem.jsx';
import { useAppData } from '../contexts/AppDataContext.jsx';

const groups = {
  incidents: ['new_incident', 'verified', 'status_changed', 'contained', 'resolved'],
  responders: ['dispatched', 'accepted', 'arrived', 'route_changed', 'gps_update'],
  evacuation: ['center_status'],
};

const labels = { all: 'All', unread: 'Unread', incidents: 'Fire incidents', responders: 'Responders', evacuation: 'Evacuation centers' };

export function Notifications() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markRead, markAllRead } = useAppData();
  const [filter, setFilter] = useState('all');

  const match = (type, read, f) =>
    f === 'all' ? true : f === 'unread' ? !read : groups[f].includes(type);
  const list = notifications.filter((n) => match(n.type, n.read, filter));

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Notifications"
        description="Real-time alerts for fire incidents, responder movement, and evacuation centers."
        actions={<Button variant="secondary" leftIcon={<CheckCheckIcon className="h-4 w-4" />} disabled={!unreadCount} onClick={markAllRead}>Mark all as read</Button>}
      />
      <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Filter notifications">
        {Object.keys(labels).map((f) => (
          <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)} className={`chip ${filter === f ? 'border-neutral-active bg-neutral-active text-neutral-on-dark' : 'border-neutral-border bg-neutral-surface text-neutral-text-muted hover:bg-neutral-bg'}`}>
            {labels[f]}
            <span className="font-mono opacity-70">{notifications.filter((n) => match(n.type, n.read, f)).length}</span>
          </button>
        ))}
      </div>
      <div className="panel overflow-hidden">
        {list.length ? (
          <ul className="divide-y divide-neutral-border">
            {list.map((n) => (
              <li key={n.id}>
                <NotificationItem
                  notification={n}
                  onOpen={() => {
                    markRead(n.id);
                    navigate(n.incidentId ? `/incidents?id=${n.incidentId}` : '/evacuation');
                  }}
                  onMarkRead={() => markRead(n.id)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center py-16 text-center">
            <BellOffIcon className="h-6 w-6 text-neutral-text-muted" aria-hidden="true" />
            <p className="mt-2 text-sm font-medium text-neutral-text">You’re all caught up</p>
            <p className="text-xs text-neutral-text-muted">New fire alerts will appear here in real time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
