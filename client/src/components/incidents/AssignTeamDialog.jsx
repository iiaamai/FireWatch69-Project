import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '../Dialog.jsx';
import { Button } from '../Button.jsx';
import { StatusPill } from '../StatusPill.jsx';
import { teamStatusMeta } from '../../utils/status.js';
import { buildRoute, formatMeters, routeLength } from '../../utils/geo.js';

export function AssignTeamDialog({ isOpen, onClose, incident, teams, onAssign }) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="md">
      {isOpen ? (
        <AssignTeamFields incident={incident} teams={teams} onAssign={onAssign} onClose={onClose} />
      ) : null}
    </Dialog>
  );
}

function AssignTeamFields({ incident, teams, onAssign, onClose }) {
  const [selected, setSelected] = useState(null);

  const ranked = teams
    .map((t) => {
      const len = routeLength(buildRoute(t.position, incident.position), t.position);
      return { team: t, len, eta: Math.max(1, Math.ceil(len / 100)) };
    })
    .sort((a, b) => {
      const rank = (t) => (t.status === 'available' ? 0 : t.status === 'unavailable' ? 2 : 1);
      return rank(a.team) - rank(b.team) || a.len - b.len;
    });

  return (
    <>
      <DialogHeader>{incident.assignedTeamId ? 'Reassign response team' : 'Assign response team'}</DialogHeader>
      <DialogContent>
        <p className="mb-3 text-sm text-neutral-text-muted">
          {incident.incidentCode} · {incident.location}. Teams are ranked by availability and estimated driving distance.
        </p>
        <fieldset>
          <legend className="sr-only">Select a team</legend>
          <ul className="max-h-[50vh] space-y-2 overflow-y-auto">
            {ranked.map(({ team, len, eta }) => {
              const disabled = team.status === 'unavailable';
              const current = team.id === incident.assignedTeamId;
              const busy = !disabled && team.status !== 'available' && !current;
              return (
                <li key={team.id}>
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 ${
                      selected === team.id ? 'border-neutral-active ring-1 ring-neutral-active' : 'border-neutral-border'
                    } ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-neutral-bg'}`}
                  >
                    <input
                      type="radio"
                      name="team"
                      value={team.id}
                      disabled={disabled || current}
                      checked={selected === team.id}
                      onChange={() => setSelected(team.id)}
                      className="h-4 w-4 accent-neutral-active"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-neutral-text">
                        {team.name} {current && <span className="ml-1 font-mono text-[10px] text-neutral-text-muted">(CURRENT)</span>}
                      </p>
                      <p className="truncate text-xs text-neutral-text-muted">
                        {team.department} · {team.members.length} members
                      </p>
                      {busy && <p className="mt-0.5 text-xs text-alert-medium-text">Currently assigned to {team.assignedIncidentId}</p>}
                    </div>
                    <div className="text-right">
                      <StatusPill meta={teamStatusMeta[team.status]} />
                      {!disabled && (
                        <p className="mt-1 font-mono text-[11px] text-neutral-text-muted">
                          {formatMeters(len)} · ~{eta} min
                        </p>
                      )}
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      </DialogContent>
      <DialogFooter>
        <div className="flex w-full justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!selected}
            onClick={() => {
              if (selected) onAssign(selected);
              onClose();
            }}
          >
            Dispatch team
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}
