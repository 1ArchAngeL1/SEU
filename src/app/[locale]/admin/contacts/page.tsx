'use client';

import { useState } from 'react';
import {
  Search,
  Inbox,
  Phone,
  Mail,
  User,
  CheckCircle2,
  Circle,
  Clock,
} from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { Input } from '@/components/ui/input';
import {
  useContactsList,
  useUpdateContactStatus,
} from '@/hooks/queries/use-contacts';
import type { Contact, ContactStatus } from '@/model/types/api';
import { cn } from '@/lib/utils';

const btnPage =
  'px-3 py-1.5 border border-admin-border-soft bg-admin-input-gradient rounded-lg text-seu-caption-sm text-admin-fg disabled:opacity-30 hover:bg-admin-hover transition-colors';

const statusTabs: { label: string; value: ContactStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Closed', value: 'closed' },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ContactsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContactStatus | 'all'>(
    'all'
  );

  const contactsQ = useContactsList(
    { page, limit: 20 },
    statusFilter === 'all' ? undefined : statusFilter
  );
  const statusMut = useUpdateContactStatus();

  const allItems = contactsQ.data?.items ?? [];
  const items = search
    ? allItems.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.phone.includes(search) ||
          c.email?.toLowerCase().includes(search.toLowerCase())
      )
    : allItems;
  const totalPages = contactsQ.data?.pagination.totalPages ?? 1;
  const total = contactsQ.data?.pagination.total ?? 0;

  async function toggleStatus(contact: Contact) {
    const next: ContactStatus =
      contact.status === 'open' ? 'closed' : 'open';
    await statusMut.mutateAsync({ id: contact.id, status: next });
  }

  return (
    <div className="admin-fade-in">
      <AdminPageHeader
        title="Contact Requests"
        description="Incoming requests from public contact forms"
        badge={
          <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted">
            {total} total
          </span>
        }
      />

      {/* Filters */}
      <div
        className="flex flex-col sm:flex-row gap-3 mb-5 admin-slide-down"
        style={{ animationDelay: '100ms' }}
      >
        <div className="relative">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-admin-fg-dim z-10 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts..."
            className="pl-9 w-72"
          />
        </div>

        <div className="flex rounded-lg border border-admin-border-soft overflow-hidden">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
              }}
              className={cn(
                'px-4 py-2 font-montserrat text-seu-caption-sm transition-all duration-200',
                statusFilter === tab.value
                  ? 'bg-primary-orange text-white shadow-md shadow-primary-orange/25'
                  : 'bg-admin-input-gradient text-admin-fg-muted hover:text-admin-fg hover:bg-admin-hover'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {contactsQ.isLoading && items.length === 0 ? (
        <div className="rounded-2xl border border-admin-border-soft bg-admin-card p-16 text-center">
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="size-10 rounded-full bg-admin-fg-dim/10" />
            <div className="h-4 w-40 rounded bg-admin-fg-dim/10" />
            <div className="h-3 w-56 rounded bg-admin-fg-dim/5" />
          </div>
        </div>
      ) : items.length === 0 ? (
        <div
          className="rounded-2xl border border-dashed border-admin-border-soft bg-admin-card p-12 text-center admin-slide-up"
          style={{ animationDelay: '200ms' }}
        >
          <Inbox className="size-10 text-admin-fg-dim mx-auto mb-4" />
          <p className="font-montserrat text-seu-body-sm text-admin-fg-muted mb-1">
            No contact requests yet
          </p>
          <p className="font-montserrat text-seu-caption text-admin-fg-muted">
            When visitors submit the contact form, their requests will appear
            here.
          </p>
        </div>
      ) : (
        <div
          className="rounded-2xl border border-admin-border-soft overflow-hidden admin-slide-up"
          style={{ animationDelay: '150ms' }}
        >
          {/* Table header */}
          <div className="hidden sm:grid grid-cols-[1fr_1fr_1fr_8rem_6rem] gap-4 px-5 py-3 bg-admin-deep border-b border-admin-border-soft">
            <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted uppercase tracking-wider">
              Name
            </span>
            <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted uppercase tracking-wider">
              Phone
            </span>
            <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted uppercase tracking-wider">
              Email
            </span>
            <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted uppercase tracking-wider">
              Date
            </span>
            <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted uppercase tracking-wider text-center">
              Status
            </span>
          </div>

          {/* Rows */}
          {items.map((contact, i) => (
            <div
              key={contact.id}
              className={cn(
                'grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_8rem_6rem] gap-2 sm:gap-4 px-5 py-4 border-b border-admin-border-soft last:border-b-0 bg-admin-card-gradient hover:bg-admin-hover transition-all duration-200 admin-slide-left',
                contact.status === 'closed' && 'opacity-60'
              )}
              style={{ animationDelay: `${250 + i * 60}ms` }}
            >
              {/* Name */}
              <div className="flex items-center gap-2.5 min-w-0">
                <User className="size-4 shrink-0 text-admin-fg-dim" />
                <span className="font-montserrat text-seu-caption text-admin-fg truncate">
                  {contact.name}
                </span>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2.5 min-w-0">
                <Phone className="size-4 shrink-0 text-admin-fg-dim sm:hidden" />
                <a
                  href={`tel:${contact.phone.replace(/\s/g, '')}`}
                  className="font-montserrat text-seu-caption text-admin-fg hover:text-primary-orange transition-colors truncate"
                >
                  {contact.phone}
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2.5 min-w-0">
                <Mail className="size-4 shrink-0 text-admin-fg-dim sm:hidden" />
                {contact.email ? (
                  <a
                    href={`mailto:${contact.email}`}
                    className="font-montserrat text-seu-caption text-admin-fg hover:text-primary-orange transition-colors truncate"
                  >
                    {contact.email}
                  </a>
                ) : (
                  <span className="font-montserrat text-seu-caption text-admin-fg-dim">
                    —
                  </span>
                )}
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 min-w-0">
                <Clock className="size-3.5 shrink-0 text-admin-fg-dim sm:hidden" />
                <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted">
                  {formatDate(contact.createdAt)}
                </span>
              </div>

              {/* Status toggle */}
              <div className="flex items-center justify-center">
                <button
                  onClick={() => toggleStatus(contact)}
                  disabled={statusMut.isPending}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1 rounded-full font-montserrat text-seu-caption-sm transition-all duration-300 active:scale-95',
                    contact.status === 'open'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 hover:shadow-[0_0_12px_rgba(52,211,153,0.15)]'
                      : 'bg-admin-fg-dim/10 text-admin-fg-muted border border-admin-border-soft hover:bg-admin-hover'
                  )}
                >
                  {contact.status === 'open' ? (
                    <Circle className="size-3 animate-pulse" />
                  ) : (
                    <CheckCircle2 className="size-3" />
                  )}
                  {contact.status === 'open' ? 'Open' : 'Closed'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="flex gap-3 mt-6 items-center justify-center admin-fade-in"
          style={{ animationDelay: '400ms' }}
        >
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className={cn(btnPage, 'active:scale-95')}
          >
            Prev
          </button>
          <span className="text-seu-caption-sm text-admin-fg-muted">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className={cn(btnPage, 'active:scale-95')}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
