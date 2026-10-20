import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '../Dialog.jsx';
import { Button } from '../Button.jsx';
import { Input } from '../Input.jsx';
import { Select } from '../Select.jsx';
import { personnelPool } from '../../data/teams.js';
import { teamStatusMeta } from '../../utils/status.js';

const departments = [
  'BFP Manila – Tondo Fire Sub-Station',
  'BFP Manila – Moriones Station',
  'BFP Manila – Special Rescue Unit',
  'Barangay 69 BDRRMC',
];

function empty() {
  return { name: '', callsign: '', department: '', vehicle: '', contact: '', leader: '', members: [], status: 'available' };
}

export function TeamFormDialog({ isOpen, onClose, team, existingTeams, onSave }) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="md">
      {isOpen ? (
        <TeamFormFields key={team?.id ?? 'new'} team={team} existingTeams={existingTeams} onSave={onSave} onClose={onClose} />
      ) : null}
    </Dialog>
  );
}

function TeamFormFields({ team, existingTeams, onSave, onClose }) {
  const [form, setForm] = useState(
    team
      ? { name: team.name, callsign: team.callsign, department: team.department, vehicle: team.vehicle, contact: team.contact, leader: team.leader, members: team.members.map((m) => m.name), status: team.status }
      : empty(),
  );
  const [errors, setErrors] = useState({});

  const pool = Array.from(new Set([...(team?.members.map((m) => m.name) ?? []), ...personnelPool]));

  const submit = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Team name is required.';
    else if (existingTeams.some((t) => t.name.toLowerCase() === form.name.trim().toLowerCase() && t.id !== team?.id)) e.name = 'A team with this name already exists.';
    if (!form.callsign.trim()) e.callsign = 'Callsign is required.';
    if (!form.department) e.department = 'Select a department.';
    if (form.members.length < 2) e.members = 'Assign at least 2 members.';
    if (!form.leader) e.leader = 'Assign a team leader.';
    else if (!form.members.includes(form.leader)) e.leader = 'Leader must be one of the members.';
    if (!/^[0-9 +]{7,}$/.test(form.contact.trim())) e.contact = 'Enter a valid contact number.';
    setErrors(e);
    if (Object.keys(e).length) return;
    const base = team ?? {
      id: `T-${Date.now().toString(36).toUpperCase()}`,
      name: '',
      callsign: '',
      department: '',
      leader: '',
      members: [],
      status: 'available',
      position: { x: 300, y: 250 },
      route: [],
      assignedIncidentId: null,
      etaMin: null,
      lastGps: new Date().toISOString(),
      contact: '',
      vehicle: '',
      station: { x: 300, y: 250 },
    };
    onSave({
      ...base,
      name: form.name.trim(),
      callsign: form.callsign.trim().toUpperCase(),
      department: form.department,
      vehicle: form.vehicle.trim(),
      contact: form.contact.trim(),
      leader: form.leader,
      status: form.status,
      members: form.members.map((name, i) => {
        const prev = base.members.find((m) => m.name === name);
        return prev ?? { id: `m-${Date.now()}-${i}`, name, role: name === form.leader ? 'Team Leader' : 'Member' };
      }),
    });
    onClose();
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <>
      <DialogHeader>{team ? `Edit ${team.name}` : 'Create response team'}</DialogHeader>
      <DialogContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Team name" value={form.name} onChange={(e) => set('name', e.target.value)} error={errors.name} placeholder="e.g. Engine 8" />
          <Input label="Callsign" value={form.callsign} onChange={(e) => set('callsign', e.target.value)} error={errors.callsign} placeholder="e.g. ENG-8" />
          <div className="sm:col-span-2">
            <Select label="Department" required value={form.department} onChange={(v) => set('department', v)} error={errors.department} options={departments.map((d) => ({ value: d, label: d }))} />
          </div>
          <Input label="Vehicle" value={form.vehicle} onChange={(e) => set('vehicle', e.target.value)} placeholder="e.g. Fire Truck BFP-TN-08" />
          <Input label="Contact number" value={form.contact} onChange={(e) => set('contact', e.target.value)} error={errors.contact} placeholder="0917 000 0000" />
          <div className="sm:col-span-2">
            <Select label="Members" required multiple searchable value={form.members} onChange={(v) => set('members', v)} error={errors.members} options={pool.map((p) => ({ value: p, label: p }))} placeholder="Assign members" />
          </div>
          <Select
            key={`leader-${form.members.join('|')}`}
            label="Team leader"
            required
            value={form.leader}
            onChange={(v) => set('leader', v)}
            error={errors.leader}
            options={form.members.map((m) => ({ value: m, label: m }))}
            placeholder={form.members.length ? 'Select leader' : 'Add members first'}
            disabled={!form.members.length}
          />
          <Select
            label="Availability"
            value={form.status}
            onChange={(v) => set('status', v)}
            options={['available', 'unavailable'].concat(team && !['available', 'unavailable'].includes(team.status) ? [team.status] : []).map((s) => ({ value: s, label: teamStatusMeta[s].label }))}
          />
        </div>
      </DialogContent>
      <DialogFooter>
        <div className="flex w-full justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>{team ? 'Save changes' : 'Create team'}</Button>
        </div>
      </DialogFooter>
    </>
  );
}
