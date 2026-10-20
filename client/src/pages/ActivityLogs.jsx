import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, ArrowDownWideNarrowIcon, ArrowUpWideNarrowIcon, ScrollTextIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader.jsx';
import { Input } from '../components/Input.jsx';
import { Select } from '../components/Select.jsx';
import { Button } from '../components/Button.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { useAppData } from '../contexts/AppDataContext.jsx';
import { formatDateTime } from '../utils/time.js';

export function ActivityLogs() {
  const navigate = useNavigate();
  const { logs } = useAppData();
  const [query, setQuery] = useState('');
  const [user, setUser] = useState('all');
  const [module, setModule] = useState('all');
  const [action, setAction] = useState('all');
  const [date, setDate] = useState('');
  const [newestFirst, setNewestFirst] = useState(true);

  const uniq = (arr) => Array.from(new Set(arr)).sort();
  const users = uniq(logs.map((l) => l.userName));
  const modules = uniq(logs.map((l) => l.module));
  const actions = uniq(logs.map((l) => l.action));

  const list = logs
    .filter((l) => `${l.userName} ${l.action} ${l.description} ${l.incidentId ?? ''}`.toLowerCase().includes(query.toLowerCase()))
    .filter((l) => user === 'all' || l.userName === user)
    .filter((l) => module === 'all' || l.module === module)
    .filter((l) => action === 'all' || l.action === action)
    .filter((l) => !date || l.timestamp.startsWith(date))
    .sort((a, b) => (newestFirst ? b.timestamp.localeCompare(a.timestamp) : a.timestamp.localeCompare(b.timestamp)));

  const opt = (items, all) => [{ value: 'all', label: all }, ...items.map((i) => ({ value: i, label: i }))];

  return (
    <div>
      <PageHeader title="Activity Logs" description="Audit trail of every change made in ERRS — who did what, when, and to which fire incident." />
      <section className="panel mb-4 p-4" aria-label="Log filters">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto] xl:items-end">
          <Input label="Search" placeholder="User, action, description, incident ID" value={query} onChange={(e) => setQuery(e.target.value)} startAdornment={<SearchIcon className="h-4 w-4" />} />
          <Select label="User" value={user} onChange={(v) => setUser(v)} options={opt(users, 'All users')} searchable />
          <Select label="Module" value={module} onChange={(v) => setModule(v)} options={opt(modules, 'All modules')} />
          <Select label="Action" value={action} onChange={(v) => setAction(v)} options={opt(actions, 'All actions')} searchable />
          <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Button
            variant="secondary"
            leftIcon={newestFirst ? <ArrowDownWideNarrowIcon className="h-4 w-4" /> : <ArrowUpWideNarrowIcon className="h-4 w-4" />}
            onClick={() => setNewestFirst((n) => !n)}
            aria-label={`Sort by ${newestFirst ? 'oldest' : 'newest'} first`}
          >
            {newestFirst ? 'Newest' : 'Oldest'}
          </Button>
        </div>
      </section>

      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <caption className="sr-only">Activity log entries</caption>
            <thead className="border-b border-neutral-border bg-neutral-bg">
              <tr>
                {['Date / Time', 'User', 'Action', 'Module', 'Related Incident', 'Description'].map((h) => (
                  <th key={h} scope="col" className="table-head">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-border">
              {list.map((l) => (
                <tr key={l.id} className="hover:bg-neutral-bg">
                  <td className="table-cell whitespace-nowrap font-mono text-xs">{formatDateTime(l.timestamp)}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <Avatar name={l.userName} alt={l.userName} size="xs" />
                      <span className="whitespace-nowrap text-sm">{l.userName}</span>
                    </div>
                  </td>
                  <td className="table-cell font-medium">{l.action}</td>
                  <td className="table-cell"><span className="rounded border border-neutral-border bg-neutral-surface px-1.5 py-0.5 font-mono text-[11px] text-neutral-text-muted">{l.module}</span></td>
                  <td className="table-cell">
                    {l.incidentId ? (
                      <button type="button" onClick={() => navigate(`/incidents?id=${l.incidentId}`)} className="font-mono text-xs font-semibold text-neutral-text underline-offset-2 hover:underline">{l.incidentCode ?? l.incidentId}</button>
                    ) : (
                      <span className="text-neutral-text-muted">—</span>
                    )}
                  </td>
                  <td className="table-cell max-w-md text-sm text-neutral-text-muted">{l.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!list.length && (
          <div className="flex flex-col items-center py-14 text-center">
            <ScrollTextIcon className="h-6 w-6 text-neutral-text-muted" aria-hidden="true" />
            <p className="mt-2 text-sm font-medium text-neutral-text">No log entries match these filters</p>
          </div>
        )}
        <div className="border-t border-neutral-border px-4 py-2.5 font-mono text-[11px] text-neutral-text-muted">{list.length} entries · Logs are retained for 5 years and cannot be edited</div>
      </div>
    </div>
  );
}
