import { PhoneIcon, TruckIcon, BuildingIcon, UserIcon } from 'lucide-react';
import { Drawer } from '../Drawer.jsx';
import { Avatar } from '../Avatar.jsx';
import { StatusPill } from '../StatusPill.jsx';
import { teamStatusMeta } from '../../utils/status.js';
import { nearestStreet } from '../../utils/geo.js';
import { timeAgo } from '../../utils/time.js';

export function TeamDetailsDrawer({ team, onClose, footer }) {
  return (
    <Drawer isOpen={Boolean(team)} onClose={onClose} position="right" size="md">
      {team && (
        <div className="flex h-full flex-col bg-neutral-surface">
          <div className="border-b border-neutral-border p-5 pr-12">
            <p className="font-mono text-xs text-neutral-text-muted">{team.callsign}</p>
            <h2 className="text-xl font-bold text-neutral-text">{team.name}</h2>
            <div className="mt-2">
              <StatusPill meta={teamStatusMeta[team.status]} size="md" />
            </div>
          </div>
          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            <dl className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex gap-3"><BuildingIcon className="mt-0.5 h-4 w-4 text-neutral-text-muted" aria-hidden="true" /><div><dt className="eyebrow">Department</dt><dd className="text-neutral-text">{team.department}</dd></div></div>
              <div className="flex gap-3"><UserIcon className="mt-0.5 h-4 w-4 text-neutral-text-muted" aria-hidden="true" /><div><dt className="eyebrow">Team leader</dt><dd className="text-neutral-text">{team.leader}</dd></div></div>
              <div className="flex gap-3"><TruckIcon className="mt-0.5 h-4 w-4 text-neutral-text-muted" aria-hidden="true" /><div><dt className="eyebrow">Vehicle</dt><dd className="text-neutral-text">{team.vehicle}</dd></div></div>
              <div className="flex gap-3"><PhoneIcon className="mt-0.5 h-4 w-4 text-neutral-text-muted" aria-hidden="true" /><div><dt className="eyebrow">Contact</dt><dd><a href={`tel:${team.contact}`} className="font-mono text-neutral-text hover:underline">{team.contact}</a></dd></div></div>
            </dl>
            <div className="rounded-md border border-neutral-border p-3 text-sm">
              <p className="eyebrow mb-1">Live position</p>
              <p className="text-neutral-text">{nearestStreet(team.position)}</p>
              <p className="font-mono text-xs text-neutral-text-muted">Last GPS update {timeAgo(team.lastGps)}</p>
              <p className="mt-2 text-neutral-text-muted">
                Assignment: <span className="font-medium text-neutral-text">{team.assignedIncidentId ?? 'None'}</span>
                {team.etaMin ? ` · ETA ${team.etaMin} min` : ''}
              </p>
            </div>
            <div>
              <p className="eyebrow mb-2">Members ({team.members.length})</p>
              <ul className="divide-y divide-neutral-border rounded-md border border-neutral-border">
                {team.members.map((m) => (
                  <li key={m.id} className="flex items-center gap-3 px-3 py-2.5">
                    <Avatar name={m.name} alt={m.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-neutral-text">{m.name}</p>
                      <p className="text-xs text-neutral-text-muted">{m.role}</p>
                    </div>
                    {m.name === team.leader && <span className="rounded border border-neutral-border px-1.5 py-0.5 font-mono text-[10px] text-neutral-text-muted">LEADER</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {footer && <div className="border-t border-neutral-border p-4">{footer}</div>}
        </div>
      )}
    </Drawer>
  );
}
