'use client';

import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Handshake,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import PartnerForm from '@/components/admin/forms/PartnerForm';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import {
  usePartnersList,
  useCreatePartner,
  useUpdatePartner,
  useDeletePartner,
} from '@/hooks/queries/use-partners';
import { fileUrl } from '@/lib/file-url';
import type { Partner, CreatePartnerInput } from '@/model/types/api';

const btnPrimary =
  'bg-gradient-to-b from-primary-orange to-primary-orange/85 text-white font-montserrat font-medium text-seu-caption px-4 py-2 rounded-lg shadow-md shadow-primary-orange/25 hover:shadow-lg hover:shadow-primary-orange/30 transition-all flex items-center gap-2';
const btnPage =
  'px-3 py-1.5 border border-admin-border-soft bg-admin-input-gradient rounded-lg text-seu-caption-sm text-admin-fg disabled:opacity-30 hover:bg-admin-hover transition-colors';

export default function PartnersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);

  const partnersQ = usePartnersList({ page, limit: 12 });
  const createMut = useCreatePartner();
  const updateMut = useUpdatePartner();
  const deleteMut = useDeletePartner();

  const allItems = partnersQ.data?.items ?? [];
  const items = search
    ? allItems.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    : allItems;
  const totalPages = partnersQ.data?.pagination.totalPages ?? 1;
  const total = partnersQ.data?.pagination.total ?? 0;

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(partner: Partner) {
    setEditing(partner);
    setDialogOpen(true);
  }

  async function handleSubmit(input: CreatePartnerInput) {
    if (editing) {
      await updateMut.mutateAsync({ id: editing.id, input });
    } else {
      await createMut.mutateAsync(input);
    }
    setDialogOpen(false);
    setEditing(null);
  }

  async function handleRemove(id: string) {
    if (!confirm('Delete this partner?')) return;
    await deleteMut.mutateAsync(id);
  }

  return (
    <div>
      <AdminPageHeader
        title="Partners"
        description="Manage SEU partner companies and organizations"
        badge={
          <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted">
            {total} total
          </span>
        }
        action={
          <button onClick={openCreate} className={btnPrimary}>
            <Plus className="size-4" />
            New Partner
          </button>
        }
      />

      <div className="mb-5">
        <div className="relative">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-admin-fg-dim z-10 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search partners…"
            className="pl-9 w-72"
          />
        </div>
      </div>

      {partnersQ.isLoading && items.length === 0 ? (
        <div className="rounded-2xl border border-admin-border-soft bg-admin-card p-16 text-center font-montserrat text-seu-caption text-admin-fg-dim">
          Loading partners…
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-admin-border-soft bg-admin-card p-12 text-center">
          <Handshake className="size-10 text-admin-fg-dim mx-auto mb-4" />
          <p className="font-montserrat text-seu-body-sm text-admin-fg-muted mb-1">
            No partners yet
          </p>
          <p className="font-montserrat text-seu-caption text-admin-fg-muted mb-5">
            Click <em>New Partner</em> to add the first one.
          </p>
          <button onClick={openCreate} className={btnPrimary + ' mx-auto'}>
            <Plus className="size-4" />
            New Partner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-admin-border-soft bg-admin-card-gradient overflow-hidden shadow-admin group hover:border-primary-orange/30 transition-colors"
            >
              {/* Logo area */}
              <div className="h-32 bg-admin-deep flex items-center justify-center border-b border-admin-border-soft">
                {p.logoId ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={fileUrl(p.logoId)}
                    alt={p.name}
                    className="max-h-20 max-w-[80%] object-contain"
                  />
                ) : (
                  <Handshake className="size-10 text-admin-fg-dim" />
                )}
              </div>

              {/* Info */}
              <div className="p-4 space-y-2">
                <h3 className="font-[--font-bodoni] text-seu-subheading text-admin-fg leading-tight">
                  {p.name}
                </h3>

                {p.description && (
                  <p className="font-montserrat text-seu-caption-sm text-admin-fg-muted line-clamp-2">
                    {p.description}
                  </p>
                )}

                <div className="space-y-1 pt-1">
                  {p.mail && (
                    <div className="flex items-center gap-2 font-montserrat text-seu-caption-sm text-admin-fg-muted">
                      <Mail className="size-3.5 shrink-0" />
                      <span className="truncate">{p.mail}</span>
                    </div>
                  )}
                  {p.phone && (
                    <div className="flex items-center gap-2 font-montserrat text-seu-caption-sm text-admin-fg-muted">
                      <Phone className="size-3.5 shrink-0" />
                      <span>{p.phone}</span>
                    </div>
                  )}
                  {p.address && (
                    <div className="flex items-center gap-2 font-montserrat text-seu-caption-sm text-admin-fg-muted">
                      <MapPin className="size-3.5 shrink-0" />
                      <span className="truncate">{p.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex border-t border-admin-border-soft">
                <button
                  onClick={() => openEdit(p)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-admin-fg-muted hover:text-admin-fg hover:bg-admin-hover transition-colors font-montserrat text-seu-caption-sm"
                >
                  <Pencil className="size-3.5" />
                  Edit
                </button>
                <div className="w-px bg-admin-border-soft" />
                <button
                  onClick={() => handleRemove(p.id)}
                  disabled={deleteMut.isPending}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-rose-400/70 hover:text-rose-300 hover:bg-admin-hover transition-colors font-montserrat text-seu-caption-sm"
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* Add card */}
          <button
            onClick={openCreate}
            className="rounded-2xl border border-dashed border-admin-border bg-admin-card/40 p-6 text-center hover:border-primary-orange/60 hover:bg-primary-orange/5 transition-colors flex flex-col items-center justify-center min-h-[16rem] group"
          >
            <span className="size-12 rounded-full border border-admin-border group-hover:border-primary-orange/60 grid place-items-center mb-3 transition-colors">
              <Plus className="size-5 text-admin-fg-muted group-hover:text-primary-orange transition-colors" />
            </span>
            <span className="font-montserrat text-seu-caption text-admin-fg-muted group-hover:text-admin-fg transition-colors">
              New partner
            </span>
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex gap-3 mt-6 items-center justify-center">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className={btnPage}
          >
            Prev
          </button>
          <span className="text-seu-caption-sm text-admin-fg-muted">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className={btnPage}
          >
            Next
          </button>
        </div>
      )}

      <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl flex flex-col p-0">
          <SheetHeader>
            <SheetTitle>
              {editing ? 'Edit Partner' : 'New Partner'}
            </SheetTitle>
            <SheetDescription>
              {editing
                ? 'Update partner details'
                : 'Add a new partner organization'}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <PartnerForm
              initialData={editing ?? undefined}
              onSubmit={handleSubmit}
              onCancel={() => setDialogOpen(false)}
              submitLabel={editing ? 'Update' : 'Create'}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
