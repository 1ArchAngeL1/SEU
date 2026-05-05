'use client';

import { useMemo, useState } from 'react';
import {
  Layers,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Building2,
  Image as ImageIcon,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import FloorForm from './forms/FloorForm';
import { cn } from '@/lib/utils';
import {
  useFloorsByBuilding,
  useCreateFloor,
  useUpdateFloor,
  useDeleteFloor,
} from '@/hooks/queries/use-floors';
import type { Floor } from '@/model/types/api';

interface FloorsPanelProps {
  buildingId: string;
  selectedFloor?: number;
  onSelectFloor?: (floorNumber: number | undefined) => void;
}

export default function FloorsPanel({
  buildingId,
  selectedFloor,
  onSelectFloor,
}: FloorsPanelProps) {
  const floorsQ = useFloorsByBuilding(buildingId);
  const createMut = useCreateFloor();
  const updateMut = useUpdateFloor();
  const deleteMut = useDeleteFloor();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Floor | null>(null);

  const floors = useMemo(() => floorsQ.data ?? [], [floorsQ.data]);

  const sortedFloors = useMemo(
    () => [...floors].sort((a, b) => b.floorNumber - a.floorNumber),
    [floors]
  );
  const existingNumbers = useMemo(
    () => floors.map((f) => f.floorNumber),
    [floors]
  );
  const nextSuggestedNumber = useMemo(() => {
    if (floors.length === 0) return 1;
    const above = floors.filter((f) => f.floorNumber >= 1);
    if (above.length === 0) return 1;
    return Math.max(...above.map((f) => f.floorNumber)) + 1;
  }, [floors]);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(f: Floor) {
    setEditing(f);
    setDialogOpen(true);
  }

  async function handleSubmit(
    payload:
      | { mode: 'create'; data: import('@/model/types/api').CreateFloorInput }
      | { mode: 'update'; data: import('@/model/types/api').UpdateFloorInput }
  ) {
    if (payload.mode === 'create') {
      await createMut.mutateAsync(payload.data);
    } else if (editing) {
      await updateMut.mutateAsync({ id: editing.id, input: payload.data });
    }
    setDialogOpen(false);
    setEditing(null);
  }

  async function handleDelete(f: Floor) {
    if (
      !confirm(
        `Delete floor ${f.floorNumber}? Units on this floor will lose their floor reference.`
      )
    )
      return;
    await deleteMut.mutateAsync(f.id);
    if (selectedFloor === f.floorNumber) {
      onSelectFloor?.(undefined);
    }
  }

  return (
    <div className="rounded-2xl border border-admin-border bg-admin-card-gradient shadow-admin overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-admin-border-soft">
        <div className="flex items-center gap-2.5">
          <span className="size-9 rounded-lg bg-gradient-to-br from-primary-orange/25 to-primary-orange/10 border border-primary-orange/40 grid place-items-center text-primary-orange shadow-sm shadow-primary-orange/20">
            <Layers className="size-4" />
          </span>
          <div>
            <h3 className="font-[--font-bodoni] text-seu-subheading text-admin-fg leading-none">
              Floors
            </h3>
            <p className="font-montserrat text-seu-caption-sm text-admin-fg-muted mt-0.5">
              {floors.length} floor{floors.length !== 1 ? 's' : ''} defined
            </p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="bg-gradient-to-b from-primary-orange to-primary-orange/85 text-white font-montserrat font-medium text-seu-caption-sm px-3 py-1.5 rounded-lg shadow-md shadow-primary-orange/25 hover:shadow-lg hover:shadow-primary-orange/30 transition-all flex items-center gap-1.5"
        >
          <Plus className="size-3.5" />
          Add floor
        </button>
      </div>

      {floorsQ.isLoading ? (
        <div className="flex items-center justify-center py-10 text-admin-fg-muted">
          <Loader2 className="size-5 animate-spin mr-2" />
          Loading floors…
        </div>
      ) : floors.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <Building2 className="size-8 text-admin-fg-dim mx-auto mb-3" />
          <p className="font-montserrat text-seu-caption text-admin-fg-muted">
            No floors defined yet. Add the first floor to start placing units.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-admin-border-soft">
          {sortedFloors.map((f) => {
            const isSelected = selectedFloor === f.floorNumber;
            const isBasement = f.floorNumber < 0;
            return (
              <li
                key={f.id}
                className={cn(
                  'flex items-center gap-3 px-5 py-3 transition-colors group',
                  isSelected
                    ? 'bg-gradient-to-r from-primary-orange/15 to-transparent border-l-2 border-primary-orange'
                    : 'hover:bg-admin-hover cursor-pointer border-l-2 border-transparent'
                )}
                onClick={() => onSelectFloor?.(f.floorNumber)}
              >
                <div
                  className={cn(
                    'size-10 shrink-0 rounded-lg border grid place-items-center font-[--font-bodoni] text-seu-subheading tabular-nums leading-none shadow-sm',
                    isSelected
                      ? 'border-primary-orange/50 bg-primary-orange/15 text-admin-fg shadow-primary-orange/15'
                      : isBasement
                        ? 'border-amber-500/30 bg-amber-500/10 text-amber-200 shadow-admin'
                        : 'border-admin-border bg-admin-input-gradient text-admin-fg-muted shadow-admin'
                  )}
                >
                  {f.floorNumber}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-montserrat text-seu-caption text-admin-fg truncate">
                    {isBasement
                      ? `Basement ${Math.abs(f.floorNumber)}`
                      : `Floor ${f.floorNumber}`}
                    {f.floorImageId && (
                      <span className="text-admin-fg-dim ml-1.5">
                        · {f.floorImageId}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted">
                      {f.totalUnits} unit{f.totalUnits !== 1 ? 's' : ''}
                    </span>
                    {f.availableUnits > 0 && (
                      <span className="font-montserrat text-seu-caption-sm text-emerald-300/90">
                        {f.availableUnits} available
                      </span>
                    )}
                    {f.floorImageId ? (
                      <span className="flex items-center gap-1 font-montserrat text-seu-caption-sm text-admin-fg-dim">
                        <ImageIcon className="size-3" />
                        plan
                      </span>
                    ) : null}
                  </div>
                </div>

                <div
                  className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => openEdit(f)}
                    className="text-admin-fg-muted hover:text-admin-fg transition-colors p-1.5 rounded-md hover:bg-admin-hover"
                    title="Edit floor"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(f)}
                    disabled={deleteMut.isPending}
                    className="text-rose-400/70 hover:text-rose-300 transition-colors p-1.5 rounded-md hover:bg-rose-500/10"
                    title="Delete floor"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-admin-card-gradient border-admin-border-soft sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-admin-fg font-[--font-bodoni]">
              {editing
                ? `Edit floor ${editing.floorNumber}`
                : 'New floor'}
            </DialogTitle>
          </DialogHeader>
          <FloorForm
            buildingId={buildingId}
            initialData={editing ?? undefined}
            existingFloorNumbers={existingNumbers}
            defaultFloorNumber={editing ? undefined : nextSuggestedNumber}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            submitLabel={editing ? 'Update' : 'Create'}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
