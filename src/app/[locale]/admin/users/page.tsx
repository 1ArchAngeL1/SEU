'use client';

import { useState } from 'react';
import {
  Plus,
  Trash2,
  Users,
  Eye,
  EyeOff,
  User,
  AlertCircle,
} from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  useUsersList,
  useCreateUser,
  useDeleteUser,
} from '@/hooks/queries/use-users';

const btnPrimary =
  'bg-gradient-to-b from-primary-green to-primary-green/85 text-white font-montserrat font-medium text-seu-caption px-4 py-2 rounded-lg shadow-md shadow-primary-green/25 hover:shadow-lg hover:shadow-primary-green/30 transition-all flex items-center gap-2';

export default function UsersPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const usersQ = useUsersList();
  const createMut = useCreateUser();
  const deleteMut = useDeleteUser();

  const users = usersQ.data ?? [];

  function openCreate() {
    setUsername('');
    setPassword('');
    setFormError('');
    setShowPassword(false);
    setSheetOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');

    if (username.trim().length < 3) {
      setFormError('Username must be at least 3 characters');
      return;
    }
    if (password.length < 4) {
      setFormError('Password must be at least 4 characters');
      return;
    }

    try {
      await createMut.mutateAsync({ username: username.trim(), password });
      setSheetOpen(false);
    } catch (err: any) {
      setFormError(err?.message ?? 'Failed to create user');
    }
  }

  async function handleRemove(id: string, name: string) {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    await deleteMut.mutateAsync(id);
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  return (
    <div>
      <AdminPageHeader
        title="Users"
        description="Manage admin users who can access this console"
        badge={
          <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted">
            {users.length} total
          </span>
        }
        action={
          <button onClick={openCreate} className={btnPrimary}>
            <Plus className="size-4" />
            New User
          </button>
        }
      />

      {usersQ.isLoading ? (
        <div className="rounded-2xl border border-admin-border-soft bg-admin-card p-16 text-center font-montserrat text-seu-caption text-admin-fg-dim">
          Loading users...
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-admin-border-soft bg-admin-card p-12 text-center">
          <Users className="size-10 text-admin-fg-dim mx-auto mb-4" />
          <p className="font-montserrat text-seu-body-sm text-admin-fg-muted mb-1">
            No users yet
          </p>
          <p className="font-montserrat text-seu-caption text-admin-fg-muted mb-5">
            Click <em>New User</em> to add the first admin.
          </p>
          <button onClick={openCreate} className={btnPrimary + ' mx-auto'}>
            <Plus className="size-4" />
            New User
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-admin-border-soft bg-admin-card-gradient overflow-hidden shadow-admin">
          <table className="w-full">
            <thead>
              <tr className="border-b border-admin-border-soft">
                <th className="text-left px-5 py-3.5 font-montserrat font-medium text-seu-caption-sm text-admin-fg-muted uppercase tracking-wider">
                  User
                </th>
                <th className="text-left px-5 py-3.5 font-montserrat font-medium text-seu-caption-sm text-admin-fg-muted uppercase tracking-wider">
                  Created
                </th>
                <th className="text-right px-5 py-3.5 font-montserrat font-medium text-seu-caption-sm text-admin-fg-muted uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-admin-border-soft last:border-b-0 hover:bg-admin-hover transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-gradient-to-br from-primary-green/20 to-primary-green/5 border border-primary-green/20 grid place-items-center">
                        <User className="size-4 text-primary-green" />
                      </div>
                      <span className="font-montserrat font-medium text-seu-body-sm text-admin-fg">
                        {u.username}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-montserrat text-seu-caption text-admin-fg-muted">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleRemove(u.id, u.username)}
                      disabled={deleteMut.isPending}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-seu-caption-sm font-montserrat text-rose-400/70 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
          <SheetHeader>
            <SheetTitle>New User</SheetTitle>
            <SheetDescription>
              Create a new admin user with access to this console
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="flex-1 px-6 py-6 space-y-5">
            {formError && (
              <div
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-seu-caption font-montserrat border"
                style={{
                  background: 'var(--admin-danger-shell)',
                  borderColor: 'var(--admin-danger-border)',
                  color: 'var(--admin-danger-text)',
                }}
              >
                <AlertCircle className="size-4 shrink-0" />
                {formError}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="new-username"
                className="block text-seu-caption-sm font-montserrat font-medium text-admin-fg-muted uppercase tracking-wider"
              >
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-[1.125rem] text-admin-fg-dim" />
                <input
                  id="new-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full h-11 pl-11 pr-4 rounded-xl bg-admin-input-gradient border border-admin-border text-admin-fg placeholder:text-admin-fg-dim font-montserrat text-seu-caption focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="new-password"
                className="block text-seu-caption-sm font-montserrat font-medium text-admin-fg-muted uppercase tracking-wider"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 size-[1.125rem] text-admin-fg-dim grid place-items-center">
                  <span className="text-xs font-bold">*</span>
                </div>
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full h-11 pl-11 pr-12 rounded-xl bg-admin-input-gradient border border-admin-border text-admin-fg placeholder:text-admin-fg-dim font-montserrat text-seu-caption focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-admin-fg-dim hover:text-admin-fg transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="size-[1.125rem]" />
                  ) : (
                    <Eye className="size-[1.125rem]" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="flex-1 h-11 rounded-xl border border-admin-border text-admin-fg font-montserrat font-medium text-seu-caption hover:bg-admin-hover transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMut.isPending}
                className="flex-1 h-11 rounded-xl bg-gradient-to-r from-primary-green to-primary-green/85 text-white font-montserrat font-semibold text-seu-caption shadow-md shadow-primary-green/25 hover:shadow-lg hover:shadow-primary-green/30 transition-all disabled:opacity-50"
              >
                {createMut.isPending ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
