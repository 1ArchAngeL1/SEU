'use client';

import { useMemo, useState } from 'react';
import {
  Bed,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import ApartmentTypeForm from './forms/ApartmentTypeForm';
import { fileUrl } from '@/lib/file-url';
import { pickLocalized } from '@/lib/i18n-helpers';
import {
  useApartmentTypesByProject,
  useCreateApartmentType,
  useUpdateApartmentType,
  useDeleteApartmentType,
} from '@/hooks/queries/use-apartment-types';
import type {
  ApartmentType,
  CreateApartmentTypeInput,
} from '@/model/types/api';

interface ApartmentTypesPanelProps {
  projectId: string;
}

function bedroomLabel(t: ApartmentType): string {
  const localized = pickLocalized(t.nameEn, t.nameKa);
  if (localized) return localized;
  if (t.bedrooms === 0) return 'Studio';
  return `${t.bedrooms} Bedroom${t.bedrooms !== 1 ? 's' : ''}`;
}

function sizeLabel(t: ApartmentType): string {
  if (t.sizeFrom === t.sizeTo) return `${t.sizeFrom} m²`;
  return `${t.sizeFrom}–${t.sizeTo} m²`;
}

export default function ApartmentTypesPanel({
  projectId,
}: ApartmentTypesPanelProps) {
  const typesQ = useApartmentTypesByProject(projectId);
  const createMut = useCreateApartmentType();
  const updateMut = useUpdateApartmentType();
  const deleteMut = useDeleteApartmentType();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ApartmentType | null>(null);

  const types = useMemo(() => typesQ.data ?? [], [typesQ.data]);
  const sortedTypes = useMemo(
    () =>
      [...types].sort(
        (a, b) => a.bedrooms - b.bedrooms || a.sizeFrom - b.sizeFrom
      ),
    [types]
  );

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(t: ApartmentType) {
    setEditing(t);
    setDialogOpen(true);
  }

  async function handleSubmit(input: CreateApartmentTypeInput) {
    if (editing) {
      const { project: _project, ...updateInput } = input;
      void _project;
      await updateMut.mutateAsync({ id: editing.id, input: updateInput });
    } else {
      await createMut.mutateAsync(input);
    }
    setDialogOpen(false);
    setEditing(null);
  }

  async function handleDelete(t: ApartmentType) {
    if (!confirm(`Delete apartment type "${bedroomLabel(t)}"?`)) return;
    await deleteMut.mutateAsync(t.id);
  }

  return (
    <div className="rounded-2xl border border-admin-border bg-admin-card-gradient shadow-admin overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-admin-border-soft">
        <div className="flex items-center gap-2.5">
          <span className="size-9 rounded-lg bg-gradient-to-br from-primary-green/25 to-primary-green/10 border border-primary-green/40 grid place-items-center text-primary-green shadow-sm shadow-primary-green/20">
            <Bed className="size-4" />
          </span>
          <div>
            <h3 className="font-[--font-bodoni] text-seu-subheading text-admin-fg leading-none">
              Apartment Types
            </h3>
            <p className="font-montserrat text-seu-caption-sm text-admin-fg-muted mt-0.5">
              {types.length} type{types.length !== 1 ? 's' : ''} defined
            </p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="bg-gradient-to-b from-primary-green to-primary-green/85 text-white font-montserrat font-medium text-seu-caption-sm px-3 py-1.5 rounded-lg shadow-md shadow-primary-green/25 hover:shadow-lg hover:shadow-primary-green/30 transition-all flex items-center gap-1.5"
        >
          <Plus className="size-3.5" />
          Add type
        </button>
      </div>

      {typesQ.isLoading ? (
        <div className="flex items-center justify-center py-10 text-admin-fg-muted">
          <Loader2 className="size-5 animate-spin mr-2" />
          Loading apartment types…
        </div>
      ) : types.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <Bed className="size-8 text-admin-fg-dim mx-auto mb-3" />
          <p className="font-montserrat text-seu-caption text-admin-fg-muted">
            No apartment types yet. Add Studio, 1-Bedroom, 2-Bedroom etc. to show them on the project page.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-admin-border-soft">
          {sortedTypes.map((t) => {
            const image = fileUrl(t.image);
            return (
              <li
                key={t.id}
                className="flex items-center gap-4 px-5 py-3 group hover:bg-admin-hover transition-colors"
              >
                <div className="size-12 shrink-0 rounded-lg border border-admin-border bg-admin-deep overflow-hidden grid place-items-center">
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image}
                      alt={bedroomLabel(t)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="size-4 text-admin-fg-dim" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-montserrat font-medium text-seu-caption text-admin-fg truncate">
                    {bedroomLabel(t)}
                    {!t.isActive && (
                      <span className="ml-2 text-seu-caption-sm text-admin-fg-dim italic">
                        (inactive)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 font-montserrat text-seu-caption-sm text-admin-fg-muted">
                    <span>{sizeLabel(t)}</span>
                    <span className="text-admin-fg-dim">·</span>
                    <span>
                      {t.bedrooms === 0
                        ? 'Studio'
                        : `${t.bedrooms} bed${t.bedrooms !== 1 ? 's' : ''}`}
                    </span>
                  </div>
                </div>

                <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(t)}
                    className="text-admin-fg-muted hover:text-admin-fg transition-colors p-1.5 rounded-md hover:bg-admin-hover"
                    title="Edit apartment type"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t)}
                    disabled={deleteMut.isPending}
                    className="text-rose-400/70 hover:text-rose-300 transition-colors p-1.5 rounded-md hover:bg-rose-500/10"
                    title="Delete apartment type"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl flex flex-col p-0">
          <SheetHeader>
            <SheetTitle>
              {editing
                ? `Edit ${bedroomLabel(editing)}`
                : 'New apartment type'}
            </SheetTitle>
            <SheetDescription>
              {editing
                ? 'Update apartment type details'
                : 'Add a new apartment type to this project'}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <ApartmentTypeForm
              projectId={projectId}
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
