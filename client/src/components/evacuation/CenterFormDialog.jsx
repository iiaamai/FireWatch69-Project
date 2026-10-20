import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '../Dialog.jsx';
import { Button } from '../Button.jsx';
import { Input } from '../Input.jsx';
import { IncidentMap } from '../map/IncidentMap.jsx';
import { centerStatusFromOccupancy } from '../../utils/status.js';
import { nowIso } from '../../utils/time.js';

export function CenterFormDialog({ isOpen, onClose, center, onSave }) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="lg">
      {isOpen ? (
        <CenterFormFields key={center?.id ?? 'new'} center={center} onSave={onSave} onClose={onClose} />
      ) : null}
    </Dialog>
  );
}

function CenterFormFields({ center, onSave, onClose }) {
  const [name, setName] = useState(center?.name ?? '');
  const [address, setAddress] = useState(center?.address ?? '');
  const [capacity, setCapacity] = useState(center ? String(center.capacity) : '');
  const [occupants, setOccupants] = useState(center ? String(center.occupants) : '0');
  const [contactPerson, setContactPerson] = useState(center?.contactPerson ?? '');
  const [contactNumber, setContactNumber] = useState(center?.contactNumber ?? '');
  const [facilities, setFacilities] = useState(center?.facilities.join(', ') ?? '');
  const [point, setPoint] = useState(center?.position ?? null);
  const [errors, setErrors] = useState({});

  const submit = () => {
    const e = {};
    const cap = Number(capacity);
    const occ = Number(occupants);
    if (!name.trim()) e.name = 'Center name is required.';
    if (!address.trim()) e.address = 'Address is required.';
    if (!Number.isInteger(cap) || cap <= 0) e.capacity = 'Enter a capacity greater than 0.';
    if (!Number.isInteger(occ) || occ < 0) e.occupants = 'Enter 0 or more.';
    else if (occ > cap) e.occupants = 'Occupants cannot exceed capacity.';
    if (!point) e.point = 'Click the map to set the center’s location.';
    setErrors(e);
    if (Object.keys(e).length || !point) return;
    onSave({
      id: center?.id ?? `EC-${Date.now().toString(36).toUpperCase()}`,
      name: name.trim(),
      address: address.trim(),
      capacity: cap,
      occupants: occ,
      position: point,
      status: center?.status === 'unavailable' ? 'unavailable' : centerStatusFromOccupancy(occ, cap),
      photos: center?.photos ?? [],
      lastUpdated: nowIso(),
      contactPerson: contactPerson.trim(),
      contactNumber: contactNumber.trim(),
      facilities: facilities.split(',').map((f) => f.trim()).filter(Boolean),
    });
    onClose();
  };

  return (
    <>
      <DialogHeader>{center ? `Edit ${center.name}` : 'Create evacuation center'}</DialogHeader>
      <DialogContent>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-4">
            <Input label="Center name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
            <Input label="Address" value={address} onChange={(e) => setAddress(e.target.value)} error={errors.address} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Capacity" type="number" min={1} value={capacity} onChange={(e) => setCapacity(e.target.value)} error={errors.capacity} />
              <Input label="Current occupants" type="number" min={0} value={occupants} onChange={(e) => setOccupants(e.target.value)} error={errors.occupants} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Contact person" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
              <Input label="Contact number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
            </div>
            <Input label="Facilities" value={facilities} onChange={(e) => setFacilities(e.target.value)} helperText="Separate with commas" />
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-neutral-text">Map location</p>
            <IncidentMap className="h-72" showLegend={false} pickedPoint={point} onPick={setPoint} />
            <p className={`mt-1 text-xs ${errors.point ? 'text-alert-critical-text' : 'text-neutral-text-muted'}`}>{errors.point ?? (point ? `Pinned at grid ${point.x}, ${point.y}` : 'Click the map to drop a pin.')}</p>
          </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <div className="flex w-full justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>{center ? 'Save changes' : 'Create center'}</Button>
        </div>
      </DialogFooter>
    </>
  );
}
