import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, BanIcon, CircleCheckIcon, SearchIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader.jsx';
import { Button } from '../components/Button.jsx';
import { Input } from '../components/Input.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { StatusPill } from '../components/StatusPill.jsx';
import { ConfirmDialog } from '../components/ConfirmDialog.jsx';
import { UserFormDialog, roles } from '../components/users/UserFormDialog.jsx';
import { useAppData } from '../contexts/AppDataContext.jsx';
import { useToast } from '../components/ToastProvider.jsx';
import { accountStatusMeta } from '../utils/status.js';
import { timeAgo } from '../utils/time.js';

export function ManageUsers() {
  const { users, currentUser, saveUser, deleteUser, setUserStatus } = useAppData();
  const { addToast } = useToast();
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [suspending, setSuspending] = useState(null);

  const list = users
    .filter((u) => roleFilter === 'all' || u.role === roleFilter)
    .filter((u) => `${u.name} ${u.email} ${u.department}`.toLowerCase().includes(query.toLowerCase()));

  const openForm = (u) => {
    setEditing(u);
    setFormOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Manage Users"
        description="Control who can access ERRS and what they can do. Administrator access required."
        actions={<Button leftIcon={<PlusIcon className="h-4 w-4" />} onClick={() => openForm(null)}>Create user</Button>}
      />

      <div className="mb-4 flex flex-wrap gap-1.5" role="group" aria-label="Filter by role">
        {['all', ...roles].map((r) => (
          <button key={r} type="button" aria-pressed={roleFilter === r} onClick={() => setRoleFilter(r)} className={`chip ${roleFilter === r ? 'border-neutral-active bg-neutral-active text-neutral-on-dark' : 'border-neutral-border bg-neutral-surface text-neutral-text-muted hover:bg-neutral-bg'}`}>
            {r === 'all' ? 'All roles' : r}
            <span className="font-mono opacity-70">{r === 'all' ? users.length : users.filter((u) => u.role === r).length}</span>
          </button>
        ))}
      </div>
      <div className="mb-3 max-w-sm">
        <Input placeholder="Search name, email, department" value={query} onChange={(e) => setQuery(e.target.value)} startAdornment={<SearchIcon className="h-4 w-4" />} aria-label="Search users" />
      </div>

      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[860px]">
          <caption className="sr-only">User accounts</caption>
          <thead className="border-b border-neutral-border bg-neutral-bg">
            <tr>
              {['User', 'Role', 'Department', 'Account Status', 'Last Activity', ''].map((h) => (
                <th key={h} scope="col" className="table-head">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-border">
            {list.map((u) => {
              const isSelf = u.id === currentUser.id;
              return (
                <tr key={u.id} className="hover:bg-neutral-bg">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} alt={u.name} src={u.avatar} size="sm" />
                      <div>
                        <p className="font-semibold text-neutral-text">{u.name} {isSelf && <span className="ml-1 font-mono text-[10px] text-neutral-text-muted">(YOU)</span>}</p>
                        <p className="text-xs text-neutral-text-muted">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell"><span className="rounded border border-neutral-border bg-neutral-surface px-2 py-0.5 text-xs font-medium text-neutral-text">{u.role}</span></td>
                  <td className="table-cell text-sm text-neutral-text-muted">{u.department}</td>
                  <td className="table-cell"><StatusPill meta={accountStatusMeta[u.status]} /></td>
                  <td className="table-cell font-mono text-xs text-neutral-text-muted">{timeAgo(u.lastActivity)}</td>
                  <td className="table-cell">
                    <div className="flex justify-end gap-1">
                      <Button size="small" variant="tertiary" iconOnly={<PencilIcon className="h-4 w-4" />} aria-label={`Edit ${u.name}`} onClick={() => openForm(u)} />
                      {u.status === 'suspended' || u.status === 'pending' ? (
                        <Button size="small" variant="tertiary" iconOnly={<CircleCheckIcon className="h-4 w-4" />} aria-label={`Activate ${u.name}`} onClick={() => { setUserStatus(u.id, 'active'); addToast({ type: 'success', message: `${u.name} activated` }); }} />
                      ) : (
                        <Button size="small" variant="tertiary" iconOnly={<BanIcon className="h-4 w-4" />} aria-label={`Suspend ${u.name}`} disabled={isSelf} onClick={() => setSuspending(u)} />
                      )}
                      <Button size="small" variant="tertiary" iconOnly={<TrashIcon className="h-4 w-4" />} aria-label={`Delete ${u.name}`} disabled={isSelf} onClick={() => setDeleting(u)} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!list.length && <p className="py-12 text-center text-sm text-neutral-text-muted">No users match these filters.</p>}
      </div>

      <UserFormDialog
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        user={editing}
        existing={users}
        onSave={(u) => { saveUser(u); addToast({ type: 'success', message: editing ? `${u.name} updated` : `${u.name} created` }); }}
      />
      <ConfirmDialog
        isOpen={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => { if (deleting) { deleteUser(deleting.id); addToast({ type: 'success', message: `${deleting.name} deleted` }); } }}
        title={`Delete ${deleting?.name ?? 'user'}?`}
        description="The account will be permanently removed and the user will lose access immediately. Their past activity stays in the audit log."
        confirmLabel="Delete user"
        destructive
        acknowledgement="I understand this cannot be undone."
      />
      <ConfirmDialog
        isOpen={Boolean(suspending)}
        onClose={() => setSuspending(null)}
        onConfirm={() => { if (suspending) { setUserStatus(suspending.id, 'suspended'); addToast({ type: 'info', message: `${suspending.name} suspended` }); } }}
        title={`Suspend ${suspending?.name ?? 'user'}?`}
        description="The user will be signed out and blocked from ERRS until reactivated."
        confirmLabel="Suspend user"
        destructive
      />
    </div>
  );
}
