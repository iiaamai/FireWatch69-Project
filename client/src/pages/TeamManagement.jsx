import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, PencilIcon, NavigationIcon, EyeIcon, SearchIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader.jsx';
import { Button } from '../components/Button.jsx';
import { Input } from '../components/Input.jsx';
import { AvatarGroup } from '../components/Avatar.jsx';
import { StatusPill } from '../components/StatusPill.jsx';
import { TeamFormDialog } from '../components/teams/TeamFormDialog.jsx';
import { TeamDetailsDrawer } from '../components/responders/TeamDetailsDrawer.jsx';
import { useAppData } from '../contexts/AppDataContext.jsx';
import { useToast } from '../components/ToastProvider.jsx';
import { teamStatusMeta } from '../utils/status.js';

export function TeamManagement() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { teams, incidents, saveTeam, setTeamStatus } = useAppData();
  const [query, setQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const viewing = teams.find((t) => t.id === viewingId) ?? null;

  const list = teams.filter((t) => `${t.name} ${t.department} ${t.leader} ${t.callsign}`.toLowerCase().includes(query.toLowerCase()));
  const counts = Object.keys(teamStatusMeta).map((s) => ({ s, n: teams.filter((t) => t.status === s).length }));

  const openEdit = (t) => {
    setEditing(t);
    setFormOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Team Management"
        description="Maintain fire response teams, their members, leaders, and availability."
        actions={<Button leftIcon={<PlusIcon className="h-4 w-4" />} onClick={() => openEdit(null)}>Create team</Button>}
      />

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {counts.map(({ s, n }) => (
          <div key={s} className="panel flex items-center justify-between p-3">
            <StatusPill meta={teamStatusMeta[s]} />
            <span className="text-2xl font-bold tabular-nums text-neutral-text">{n}</span>
          </div>
        ))}
      </div>

      <div className="mb-3 max-w-sm">
        <Input placeholder="Search teams, leaders, departments" value={query} onChange={(e) => setQuery(e.target.value)} startAdornment={<SearchIcon className="h-4 w-4" />} aria-label="Search teams" />
      </div>

      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <caption className="sr-only">Response teams</caption>
          <thead className="border-b border-neutral-border bg-neutral-bg">
            <tr>
              <th scope="col" className="table-head">Team</th>
              <th scope="col" className="table-head">Department</th>
              <th scope="col" className="table-head">Team Leader</th>
              <th scope="col" className="table-head">Members</th>
              <th scope="col" className="table-head">Current Assignment</th>
              <th scope="col" className="table-head">Availability</th>
              <th scope="col" className="table-head text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-border">
            {list.map((t) => {
              const inc = incidents.find((i) => i.id === t.assignedIncidentId);
              return (
                <tr key={t.id} className="hover:bg-neutral-bg">
                  <td className="table-cell">
                    <p className="font-semibold text-neutral-text">{t.name}</p>
                    <p className="font-mono text-[11px] text-neutral-text-muted">{t.callsign}</p>
                  </td>
                  <td className="table-cell max-w-[220px] text-sm text-neutral-text-muted"><span className="line-clamp-2">{t.department}</span></td>
                  <td className="table-cell">{t.leader}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <AvatarGroup size="xs" max={3} avatars={t.members.map((m) => ({ name: m.name, alt: m.name }))} />
                      <span className="font-mono text-xs text-neutral-text-muted">{t.members.length}</span>
                    </div>
                  </td>
                  <td className="table-cell text-sm">
                    {inc ? (
                      <button type="button" onClick={() => navigate(`/incidents?id=${inc.id}`)} className="text-left hover:underline">
                        <span className="font-mono text-xs font-semibold">{inc.incidentCode}</span>
                        <span className="block text-xs text-neutral-text-muted">{inc.location}</span>
                      </button>
                    ) : (
                      <span className="text-neutral-text-muted">—</span>
                    )}
                  </td>
                  <td className="table-cell"><StatusPill meta={teamStatusMeta[t.status]} /></td>
                  <td className="table-cell">
                    <div className="flex justify-end gap-1">
                      <Button size="small" variant="tertiary" iconOnly={<EyeIcon className="h-4 w-4" />} aria-label={`View ${t.name}`} onClick={() => setViewingId(t.id)} />
                      <Button size="small" variant="tertiary" iconOnly={<PencilIcon className="h-4 w-4" />} aria-label={`Edit ${t.name}`} onClick={() => openEdit(t)} />
                      <Button size="small" variant="tertiary" iconOnly={<NavigationIcon className="h-4 w-4" />} aria-label={`Track ${t.name}`} onClick={() => navigate(`/responders?team=${t.id}`)} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <TeamFormDialog
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        team={editing}
        existingTeams={teams}
        onSave={(t) => {
          saveTeam(t);
          addToast({ type: 'success', message: editing ? `${t.name} updated` : `${t.name} created` });
        }}
      />

      <TeamDetailsDrawer
        team={viewing}
        onClose={() => setViewingId(null)}
        footer={
          viewing && (
            <div className="space-y-3">
              <div>
                <p className="eyebrow mb-1.5">Update availability</p>
                <div className="flex gap-2" role="group" aria-label="Availability">
                  {['available', 'unavailable'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={viewing.status === s}
                      disabled={Boolean(viewing.assignedIncidentId) && s === 'unavailable'}
                      onClick={() => setTeamStatus(viewing.id, s)}
                      className={`chip flex-1 justify-center py-2 disabled:cursor-not-allowed disabled:opacity-40 ${viewing.status === s ? 'border-neutral-active bg-neutral-active text-neutral-on-dark' : 'border-neutral-border bg-neutral-surface text-neutral-text-muted hover:bg-neutral-bg'}`}
                    >
                      {teamStatusMeta[s].label}
                    </button>
                  ))}
                </div>
                {viewing.assignedIncidentId && <p className="mt-1 text-xs text-neutral-text-muted">Team is on an active assignment and can’t be set unavailable.</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1" leftIcon={<PencilIcon className="h-4 w-4" />} onClick={() => { const t = viewing; setViewingId(null); openEdit(t); }}>Edit team</Button>
                <Button className="flex-1" leftIcon={<NavigationIcon className="h-4 w-4" />} onClick={() => navigate(`/responders?team=${viewing.id}`)}>Track responders</Button>
              </div>
            </div>
          )
        }
      />
    </div>
  );
}
