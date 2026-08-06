'use client';

import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Handshake,
  Link2,
  ArrowUpDown,
} from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import LandingPartnerForm from '@/components/admin/forms/LandingPartnerForm';
import ReorderSheet from '@/components/admin/ReorderSheet';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import {
  useLandingPartnersList,
  useAllLandingPartners,
  useCreateLandingPartner,
  useUpdateLandingPartner,
  useDeleteLandingPartner,
  useReorderLandingPartners,
} from '@/hooks/queries/use-landing-partners';
import { fileUrl } from '@/lib/file-url';
import type { LandingPartner, CreateLandingPartnerInput } from '@/model/types/api';

const btnPrimary =
  'bg-gradient-to-b from-primary-green to-primary-green/85 text-white font-montserrat font-medium text-seu-caption px-4 py-2 rounded-lg shadow-md shadow-primary-green/25 hover:shadow-lg hover:shadow-primary-green/30 transition-all flex items-center gap-2';
const btnSecondary =
  'border border-admin-border-soft bg-admin-input-gradient text-admin-fg font-montserrat font-medium text-seu-caption px-4 py-2 rounded-lg hover:bg-admin-hover transition-colors flex items-center gap-2 disabled:opacity-40 disabled:pointer-events-none';
const btnPage =
  'px-3 py-1.5 border border-admin-border-soft bg-admin-input-gradient rounded-lg text-seu-caption-sm text-admin-fg disabled:opacity-30 hover:bg-admin-hover transition-colors';

export default function LandingPartnersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reorderOpen, setReorderOpen] = useState(false);
  const [editing, setEditing] = useState<LandingPartner | null>(null);

  const partnersQ = useLandingPartnersList({ page, limit: 12 });
  const allPartnersQ = useAllLandingPartners();
  const createMut = useCreateLandingPartner();
  const updateMut = useUpdateLandingPartner();
  const deleteMut = useDeleteLandingPartner();
  const reorderMut = useReorderLandingPartners();

  const allItems = partnersQ.data?.items ?? [];
  const items = search
    ? allItems.filter((p) => {
        const q = search.toLowerCase();
        return (
          p.nameEn.toLowerCase().includes(q) || p.nameKa.toLowerCase().includes(q)
        );
      })
    : allItems;
  const totalPages = partnersQ.data?.pagination.totalPages ?? 1;
  const total = partnersQ.data?.pagination.total ?? 0;

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(partner: LandingPartner) {
    setEditing(partner);
    setDialogOpen(true);
  }

  async function handleSubmit(input: CreateLandingPartnerInput) {
    if (editing) {
      await updateMut.mutateAsync({ id: editing.id, input });
    } else {
      await createMut.mutateAsync(input);
    }
    setDialogOpen(false);
    setEditing(null);
  }

  async function handleRemove(id: string) {
    if (!confirm('Delete this landing partner?')) return;
    await deleteMut.mutateAsync(id);
  }

  return (
    <div>
      <AdminPageHeader
        title="Landing Partners"
        description="Manage the partner logos shown on the landing page"
        badge={
          <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted">
            {total} total
          </span>
        }
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setReorderOpen(true)}
              disabled={(allPartnersQ.data?.length ?? 0) < 2}
              className={btnSecondary}
            >
              <ArrowUpDown className="size-4" />
              Reorder
            </button>
            <button onClick={openCreate} className={btnPrimary}>
              <Plus className="size-4" />
              New Landing Partner
            </button>
          </div>
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
            placeholder="Search landing partners…"
            className="pl-9 w-72"
          />
        </div>
      </div>

      {partnersQ.isLoading && items.length === 0 ? (
        <div className="rounded-2xl border border-admin-border-soft bg-admin-card p-16 text-center font-montserrat text-seu-caption text-admin-fg-dim">
          Loading landing partners…
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-admin-border-soft bg-admin-card p-12 text-center">
          <Handshake className="size-10 text-admin-fg-dim mx-auto mb-4" />
          <p className="font-montserrat text-seu-body-sm text-admin-fg-muted mb-1">
            No landing partners yet
          </p>
          <p className="font-montserrat text-seu-caption text-admin-fg-muted mb-5">
            Click <em>New Landing Partner</em> to add the first one.
          </p>
          <button onClick={openCreate} className={btnPrimary + ' mx-auto'}>
            <Plus className="size-4" />
            New Landing Partner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-admin-border-soft bg-admin-card-gradient overflow-hidden shadow-admin group hover:border-primary-green/30 transition-colors"
            >
              {/* Logo area */}
              <div className="h-32 bg-admin-deep flex items-center justify-center border-b border-admin-border-soft">
                {p.logoId ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={fileUrl(p.logoId)}
                    alt={p.nameEn || p.nameKa}
                    className="max-h-20 max-w-[80%] object-contain"
                  />
                ) : (
                  <Handshake className="size-10 text-admin-fg-dim" />
                )}
              </div>

              {/* Info */}
              <div className="p-4 space-y-2">
                <h3 className="font-[--font-bodoni] text-seu-subheading text-admin-fg leading-tight">
                  {p.nameEn}
                </h3>
                <h4 className="font-[--font-bodoni] text-seu-body text-admin-fg-muted leading-tight">
                  {p.nameKa}
                </h4>

                {(p.descriptionEn || p.descriptionKa) && (
                  <p className="font-montserrat text-seu-caption-sm text-admin-fg-muted line-clamp-2">
                    {p.descriptionEn || p.descriptionKa}
                  </p>
                )}

                {p.websiteLink && (
                  <div className="flex items-center gap-2 pt-1 font-montserrat text-seu-caption-sm text-admin-fg-muted">
                    <Link2 className="size-3.5 shrink-0" />
                    <a
                      href={p.websiteLink}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate hover:text-admin-fg transition-colors"
                    >
                      {p.websiteLink}
                    </a>
                  </div>
                )}
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
            className="rounded-2xl border border-dashed border-admin-border bg-admin-card/40 p-6 text-center hover:border-primary-green/60 hover:bg-primary-green/5 transition-colors flex flex-col items-center justify-center min-h-[16rem] group"
          >
            <span className="size-12 rounded-full border border-admin-border group-hover:border-primary-green/60 grid place-items-center mb-3 transition-colors">
              <Plus className="size-5 text-admin-fg-muted group-hover:text-primary-green transition-colors" />
            </span>
            <span className="font-montserrat text-seu-caption text-admin-fg-muted group-hover:text-admin-fg transition-colors">
              New landing partner
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
              {editing ? 'Edit Landing Partner' : 'New Landing Partner'}
            </SheetTitle>
            <SheetDescription>
              {editing
                ? 'Update landing partner details'
                : 'Add a new partner to the landing page'}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <LandingPartnerForm
              initialData={editing ?? undefined}
              onSubmit={handleSubmit}
              onCancel={() => setDialogOpen(false)}
              submitLabel={editing ? 'Update' : 'Create'}
            />
          </div>
        </SheetContent>
      </Sheet>

      <ReorderSheet
        open={reorderOpen}
        onOpenChange={setReorderOpen}
        items={allPartnersQ.data ?? []}
        onSave={(ids) => reorderMut.mutateAsync(ids)}
        saving={reorderMut.isPending}
        title="Reorder landing partners"
        description="Drag rows or use the arrows to set the order logos appear in the landing-page marquee, then save."
      />
    </div>
  );
}