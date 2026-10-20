import { useRef, useState } from 'react';
import { CameraIcon, ShieldCheckIcon, KeyRoundIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader.jsx';
import { Button } from '../components/Button.jsx';
import { Input } from '../components/Input.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { StatusPill } from '../components/StatusPill.jsx';
import { useAppData } from '../contexts/AppDataContext.jsx';
import { useToast } from '../components/ToastProvider.jsx';
import { accountStatusMeta } from '../utils/status.js';
import { formatDateTime } from '../utils/time.js';

export function Account() {
  const { currentUser, saveUser } = useAppData();
  const { addToast } = useToast();
  const fileRef = useRef(null);
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [profileError, setProfileError] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [savingPw, setSavingPw] = useState(false);

  const saveProfile = (e) => {
    e.preventDefault();
    const errs = {};
    if (!name.trim()) errs.name = 'Name is required.';
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email address.';
    setProfileError(errs);
    if (Object.keys(errs).length) return;
    setSavingProfile(true);
    window.setTimeout(() => {
      saveUser({ ...currentUser, name: name.trim(), email: email.trim(), phone: phone.trim() });
      setSavingProfile(false);
      addToast({ type: 'success', message: 'Profile updated' });
    }, 600);
  };

  const savePassword = (e) => {
    e.preventDefault();
    const errs = {};
    if (!pw.current) errs.current = 'Enter your current password.';
    if (pw.next.length < 10) errs.next = 'Use at least 10 characters.';
    else if (!/[0-9]/.test(pw.next) || !/[A-Z]/.test(pw.next)) errs.next = 'Include at least one number and one uppercase letter.';
    if (pw.confirm !== pw.next) errs.confirm = 'Passwords do not match.';
    setPwErrors(errs);
    if (Object.keys(errs).length) return;
    setSavingPw(true);
    window.setTimeout(() => {
      setSavingPw(false);
      setPw({ current: '', next: '', confirm: '' });
      addToast({ type: 'success', message: 'Password changed. Other sessions were signed out.' });
    }, 700);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Account" description="Manage your profile, photo, and password." />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[300px_1fr]">
        <aside className="panel h-fit p-5 text-center">
          <div className="flex justify-center">
            <Avatar name={currentUser.name} alt={currentUser.name} src={currentUser.avatar} size="xl" status="online" />
          </div>
          <p className="mt-3 text-lg font-bold text-neutral-text">{currentUser.name}</p>
          <p className="text-sm text-neutral-text-muted">{currentUser.role}</p>
          <div className="mt-2 flex justify-center"><StatusPill meta={accountStatusMeta[currentUser.status]} /></div>
          <Button size="small" variant="secondary" className="mt-4 w-full" leftIcon={<CameraIcon className="h-3.5 w-3.5" />} onClick={() => fileRef.current?.click()}>
            Update profile photo
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            aria-label="Upload profile photo"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                saveUser({ ...currentUser, avatar: URL.createObjectURL(f) });
                addToast({ type: 'success', message: 'Profile photo updated' });
              }
              e.target.value = '';
            }}
          />
          <dl className="mt-5 space-y-2.5 border-t border-neutral-border pt-4 text-left text-sm">
            <div><dt className="eyebrow">User ID</dt><dd className="font-mono text-neutral-text">{currentUser.id}</dd></div>
            <div><dt className="eyebrow">Department</dt><dd className="text-neutral-text">{currentUser.department}</dd></div>
            <div><dt className="eyebrow">Last activity</dt><dd className="text-neutral-text">{formatDateTime(currentUser.lastActivity)}</dd></div>
            <div><dt className="eyebrow">Access</dt><dd className="flex items-center gap-1 text-neutral-text"><ShieldCheckIcon className="h-3.5 w-3.5 text-neutral-text-muted" aria-hidden="true" />Incidents, responders, evacuation, reports</dd></div>
          </dl>
        </aside>

        <div className="space-y-5">
          <form onSubmit={saveProfile} className="panel p-5" noValidate>
            <h2 className="text-base font-bold text-neutral-text">Edit profile</h2>
            <p className="text-sm text-neutral-text-muted">This information appears on reports and activity logs.</p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} error={profileError.name} />
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={profileError.email} />
              <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Input label="Role" value={currentUser.role} readOnly disabled helperText="Contact an administrator to change roles." />
            </div>
            <div className="mt-5 flex justify-end">
              <Button type="submit" loading={savingProfile}>Save profile</Button>
            </div>
          </form>

          <form onSubmit={savePassword} className="panel p-5" noValidate>
            <div className="flex items-center gap-2">
              <KeyRoundIcon className="h-4 w-4 text-neutral-text-muted" aria-hidden="true" />
              <h2 className="text-base font-bold text-neutral-text">Change password</h2>
            </div>
            <p className="text-sm text-neutral-text-muted">At least 10 characters with a number and an uppercase letter.</p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Input label="Current password" type="password" autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} error={pwErrors.current} />
              <Input label="New password" type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} error={pwErrors.next} />
              <Input label="Confirm new password" type="password" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} error={pwErrors.confirm} />
            </div>
            <div className="mt-5 flex justify-end">
              <Button type="submit" loading={savingPw}>Update password</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
