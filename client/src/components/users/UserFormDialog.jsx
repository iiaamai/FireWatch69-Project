/* eslint-disable react-refresh/only-export-components */
import { useRef, useState } from 'react';
import { CameraIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '../Dialog.jsx';
import { Button } from '../Button.jsx';
import { Input } from '../Input.jsx';
import { Select } from '../Select.jsx';
import { Avatar } from '../Avatar.jsx';
import { nowIso } from '../../utils/time.js';

export const roles = ['Administrator', 'Fire/Response Official', 'Incident Manager', 'Responder', 'Viewer'];

export function UserFormDialog({ isOpen, onClose, user, existing, onSave }) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="md">
      {isOpen ? (
        <UserFormFields key={user?.id ?? 'new'} user={user} existing={existing} onSave={onSave} onClose={onClose} />
      ) : null}
    </Dialog>
  );
}

function UserFormFields({ user, existing, onSave, onClose }) {
  const fileRef = useRef(null);
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [role, setRole] = useState(user?.role ?? 'Viewer');
  const [department, setDepartment] = useState(user?.department ?? '');
  const [status, setStatus] = useState(user?.status ?? 'pending');
  const [avatar, setAvatar] = useState(user?.avatar);
  const [errors, setErrors] = useState({});

  const submit = () => {
    const e = {};
    if (!name.trim()) e.name = 'Full name is required.';
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email address.';
    else if (existing.some((u) => u.email.toLowerCase() === email.toLowerCase() && u.id !== user?.id)) e.email = 'This email is already in use.';
    if (!department.trim()) e.department = 'Department is required.';
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave({
      id: user?.id ?? `U-${Date.now().toString(36).toUpperCase()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
      department: department.trim(),
      status,
      avatar,
      lastActivity: user?.lastActivity ?? nowIso(),
    });
    onClose();
  };

  return (
    <>
      <DialogHeader>{user ? `Edit ${user.name}` : 'Create user'}</DialogHeader>
      <DialogContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar name={name || 'New user'} alt={name || 'New user'} src={avatar} size="lg" />
            <div className="flex gap-2">
              <Button size="small" variant="secondary" leftIcon={<CameraIcon className="h-3.5 w-3.5" />} onClick={() => fileRef.current?.click()}>
                {avatar ? 'Change photo' : 'Upload photo'}
              </Button>
              {avatar && <Button size="small" variant="tertiary" onClick={() => setAvatar(undefined)}>Remove</Button>}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="sr-only"
                aria-label="Profile photo"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setAvatar(URL.createObjectURL(f));
                  e.target.value = '';
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
            <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input label="Department" value={department} onChange={(e) => setDepartment(e.target.value)} error={errors.department} />
            <Select label="Role" value={role} onChange={(v) => setRole(v)} options={roles.map((r) => ({ value: r, label: r }))} />
            <Select
              label="Account status"
              value={status}
              onChange={(v) => setStatus(v)}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'pending', label: 'Pending' },
                { value: 'suspended', label: 'Suspended' },
              ]}
            />
          </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <div className="flex w-full justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>{user ? 'Save changes' : 'Create user'}</Button>
        </div>
      </DialogFooter>
    </>
  );
}
