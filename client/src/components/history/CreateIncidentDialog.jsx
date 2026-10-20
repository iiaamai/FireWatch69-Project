import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '../Dialog.jsx';
import { Button } from '../Button.jsx';
import { Input } from '../Input.jsx';
import { Select } from '../Select.jsx';
import { IncidentMap } from '../map/IncidentMap.jsx';
import { severityMeta } from '../../utils/status.js';
import { nearestStreet } from '../../utils/geo.js';

export function CreateIncidentDialog({ isOpen, onClose, teamNames, nextNumber, onCreate }) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="lg">
      {isOpen ? (
        <CreateIncidentFields key="create" teamNames={teamNames} nextNumber={nextNumber} onCreate={onCreate} onClose={onClose} />
      ) : null}
    </Dialog>
  );
}

function CreateIncidentFields({ teamNames, nextNumber, onCreate, onClose }) {
  const [date, setDate] = useState('2026-09-29T08:00');
  const [severity, setSeverity] = useState('moderate');
  const [team, setTeam] = useState('');
  const [response, setResponse] = useState('');
  const [resolution, setResolution] = useState('');
  const [finalStatus, setFinalStatus] = useState('resolved');
  const [cause, setCause] = useState('');
  const [point, setPoint] = useState(null);
  const [errors, setErrors] = useState({});

  const submit = () => {
    const e = {};
    if (!date) e.date = 'Date and time are required.';
    if (!point) e.point = 'Pick the incident location on the map.';
    if (!team) e.team = 'Select the responding team.';
    if (!(Number(response) > 0)) e.response = 'Enter minutes (> 0).';
    if (!(Number(resolution) > 0)) e.resolution = 'Enter minutes (> 0).';
    setErrors(e);
    if (Object.keys(e).length || !point) return;
    onCreate({
      id: `FW69-2026-${String(nextNumber).padStart(4, '0')}`,
      date: `${date}:00`,
      location: nearestStreet(point),
      severity,
      responseTimeMin: Number(response),
      resolutionTimeMin: Number(resolution),
      teamName: team,
      finalStatus,
      position: point,
      verifiedMedia: 0,
      cause: cause.trim() || 'Under investigation',
    });
    onClose();
  };

  return (
    <>
      <DialogHeader>Create fire incident record</DialogHeader>
      <DialogContent>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-4">
            <Input label="Date & time reported" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} error={errors.date} />
            <div className="grid grid-cols-2 gap-3">
              <Select label="Fire severity" value={severity} onChange={(v) => setSeverity(v)} options={Object.keys(severityMeta).map((s) => ({ value: s, label: severityMeta[s].label }))} />
              <Select
                label="Final status"
                value={finalStatus}
                onChange={(v) => setFinalStatus(v)}
                options={[
                  { value: 'resolved', label: 'Resolved' },
                  { value: 'contained', label: 'Contained' },
                  { value: 'false_alarm', label: 'False alarm' },
                ]}
              />
            </div>
            <Select label="Response team" required value={team} onChange={(v) => setTeam(v)} error={errors.team} options={teamNames.map((t) => ({ value: t, label: t }))} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Response time (min)" type="number" min={1} value={response} onChange={(e) => setResponse(e.target.value)} error={errors.response} />
              <Input label="Resolution time (min)" type="number" min={1} value={resolution} onChange={(e) => setResolution(e.target.value)} error={errors.resolution} />
            </div>
            <Input label="Cause" value={cause} onChange={(e) => setCause(e.target.value)} placeholder="e.g. Electrical overload" />
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-neutral-text">Location (map picker)</p>
            <IncidentMap className="h-80" showLegend={false} pickedPoint={point} onPick={setPoint} />
            <p className={`mt-1 text-xs ${errors.point ? 'text-alert-critical-text' : 'text-neutral-text-muted'}`}>
              {errors.point ?? (point ? `Nearest street: ${nearestStreet(point)} · grid ${point.x}, ${point.y}` : 'Click the map to place the incident.')}
            </p>
          </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <div className="flex w-full justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>Create record</Button>
        </div>
      </DialogFooter>
    </>
  );
}
