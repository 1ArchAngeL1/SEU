'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  Plus,
  Grid3X3,
  List,
  Loader2,
  Building2,
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import ChessBoard from './chess/ChessBoard';
import StoryView from './story/StoryView';
import UnitForm from './forms/UnitForm';
import FloorForm from './forms/FloorForm';
import FloorsPanel from './FloorsPanel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { pickLocale } from '@/lib/i18n-helpers';
import { useBuilding } from '@/hooks/queries/use-buildings';
import {
  useUnitsList,
  useCreateUnit,
  useUpdateUnit,
  useDeleteUnit,
} from '@/hooks/queries/use-units';
import {
  useFloorsByBuilding,
  useCreateFloor,
  useUpdateFloor,
  useDeleteFloor,
} from '@/hooks/queries/use-floors';
import type {
  CreateFloorInput,
  CreateUnitInput,
  Floor,
  Unit,
  UpdateFloorInput,
} from '@/model/types/api';

type ViewMode = 'chess' | 'story';

interface BuildingDetailClientProps {
  buildingId: string;
}

export default function BuildingDetailClient({
  buildingId,
}: BuildingDetailClientProps) {
  const [view, setView] = useState<ViewMode>('chess');
  const [unitDialogOpen, setUnitDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [prefill, setPrefill] = useState<{
    floor?: number;
    unitNumber?: string;
  }>({});
  const [floorDialogOpen, setFloorDialogOpen] = useState(false);
  const [editingFloor, setEditingFloor] = useState<Floor | null>(null);

  const buildingQ = useBuilding(buildingId);
  const unitsQ = useUnitsList(
    { building: buildingId },
    { page: 1, limit: 200 },
    'floor'
  );
  const floorsQ = useFloorsByBuilding(buildingId);
  const createUnitMut = useCreateUnit();
  const updateUnitMut = useUpdateUnit();
  const deleteUnitMut = useDeleteUnit();
  const createFloorMut = useCreateFloor();
  const updateFloorMut = useUpdateFloor();
  const deleteFloorMut = useDeleteFloor();

  const building = buildingQ.data;
  const units = useMemo(
    () => unitsQ.data?.items ?? [],
    [unitsQ.data]
  );
  const floors = useMemo(() => floorsQ.data ?? [], [floorsQ.data]);

  const projectId =
    building &&
    (typeof building.project === 'string'
      ? building.project
      : building.project.id);
  const projectName =
    building && typeof building.project !== 'string'
      ? pickLocale(building.project.name)
      : '';

  const stats = useMemo(() => {
    const total = units.length;
    const available = units.filter((u) => u.status === 'available').length;
    const reserved = units.filter((u) => u.status === 'reserved').length;
    const sold = units.filter((u) => u.status === 'sold').length;
    const totalSizeSum = units.reduce((s, u) => s + u.totalSize, 0);
    const totalPriceSum = units.reduce((s, u) => s + u.price.amount, 0);
    const avgPricePerM2 =
      totalSizeSum > 0 ? Math.round(totalPriceSum / totalSizeSum) : 0;
    return { total, available, reserved, sold, avgPricePerM2 };
  }, [units]);

  const existingFloorNumbers = useMemo(
    () => floors.map((f) => f.floorNumber),
    [floors]
  );

  function handleCellClick(unit: Unit) {
    setEditingUnit(unit);
    setPrefill({});
    setUnitDialogOpen(true);
  }

  function handleEmptyCellClick(floor: number, position: number) {
    setEditingUnit(null);
    setPrefill({
      floor,
      unitNumber: `${building?.block ?? ''}-${floor}-${position}`,
    });
    setUnitDialogOpen(true);
  }

  function handleAddUnit() {
    setEditingUnit(null);
    setPrefill({});
    setUnitDialogOpen(true);
  }

  function handleAddUnitOnFloor(floorNumber: number) {
    setEditingUnit(null);
    const positionGuess =
      units.filter((u) => u.floorNumber === floorNumber).length + 1;
    setPrefill({
      floor: floorNumber,
      unitNumber: `${building?.block ?? ''}-${floorNumber}-${positionGuess}`,
    });
    setUnitDialogOpen(true);
  }

  function handleAddFloor() {
    setEditingFloor(null);
    setFloorDialogOpen(true);
  }

  function handleEditFloor(floor: Floor) {
    setEditingFloor(floor);
    setFloorDialogOpen(true);
  }

  async function handleDeleteFloor(floor: Floor) {
    if (
      !confirm(
        `Delete floor ${floor.floorNumber}? Units on this floor will lose their floor reference.`
      )
    )
      return;
    await deleteFloorMut.mutateAsync(floor.id);
  }

  async function handleUnitSubmit(data: CreateUnitInput) {
    if (editingUnit) {
      const { building: _b, project: _p, ...update } = data;
      void _b;
      void _p;
      await updateUnitMut.mutateAsync({ id: editingUnit.id, input: update });
    } else {
      await createUnitMut.mutateAsync(data);
    }
    setUnitDialogOpen(false);
    setEditingUnit(null);
  }

  async function handleFloorSubmit(
    payload:
      | { mode: 'create'; data: CreateFloorInput }
      | { mode: 'update'; data: UpdateFloorInput }
  ) {
    if (payload.mode === 'create') {
      await createFloorMut.mutateAsync(payload.data);
    } else if (editingFloor) {
      await updateFloorMut.mutateAsync({
        id: editingFloor.id,
        input: payload.data,
      });
    }
    setFloorDialogOpen(false);
    setEditingFloor(null);
  }

  async function handleUnitDelete() {
    if (!editingUnit) return;
    if (!confirm(`Delete unit #${editingUnit.unitNumber}?`)) return;
    await deleteUnitMut.mutateAsync(editingUnit.id);
    setUnitDialogOpen(false);
    setEditingUnit(null);
  }

  const btnToggle = (active: boolean) =>
    cn(
      'flex items-center gap-1.5 px-3 py-1.5 rounded-md font-montserrat font-medium text-seu-caption-sm transition-colors',
      active
        ? 'bg-primary-green/15 text-admin-fg border border-primary-green/30'
        : 'text-admin-fg-muted hover:text-admin-fg border border-transparent'
    );

  if (buildingQ.isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-admin-fg-muted">
        <Loader2 className="size-5 animate-spin mr-2" />
        Loading building…
      </div>
    );
  }

  if (!building || buildingQ.isError) {
    return (
      <div className="text-center py-20">
        <p className="font-montserrat text-seu-body text-admin-fg-muted">
          Building not found.
        </p>
        <Link
          href="/admin/buildings"
          className="inline-block mt-4 text-primary-green font-montserrat text-seu-caption hover:underline"
        >
          ← Back to buildings
        </Link>
      </div>
    );
  }

  const aboveGroundFloorCount = floors.filter((f) => f.floorNumber >= 1).length;
  // ChessBoard contiguous fallback only when no floors are registered.
  const fallbackFloorCount = floors.length === 0 ? 1 : 0;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 font-montserrat text-seu-caption-sm">
        <Link
          href="/admin/buildings"
          className="text-admin-fg-muted hover:text-admin-fg transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="size-3.5" />
          Buildings
        </Link>
        <span className="text-admin-fg-dim">/</span>
        {projectId ? (
          <Link
            href={`/admin/projects/${projectId}`}
            className="text-admin-fg-muted hover:text-admin-fg transition-colors"
          >
            {projectName}
          </Link>
        ) : (
          <span className="text-admin-fg-muted">{projectName}</span>
        )}
        <span className="text-admin-fg-dim">/</span>
        <span className="text-admin-fg">Block {building.block}</span>
      </div>

      {/* Hero header */}
      <div className="relative overflow-hidden rounded-2xl border border-admin-border-soft bg-admin-card-gradient mb-6">
        <div className="absolute -top-20 -right-20 size-64 rounded-full bg-primary-green/10 blur-3xl pointer-events-none" />
        <div className="relative p-6 sm:p-7 flex items-end justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 min-w-0">
            <div className="size-16 rounded-xl border border-admin-border bg-admin-input grid place-items-center font-[--font-bodoni] text-seu-title text-admin-fg leading-none shrink-0">
              {building.block}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="font-[--font-bodoni] font-normal text-seu-heading-lg text-admin-fg leading-none">
                  Block {building.block}
                </h1>
                <StatusBadge status={building.status} />
              </div>
              <p className="text-seu-caption text-admin-fg-muted font-montserrat mt-1">
                {pickLocale(building.name) || `Block ${building.block}`} ·{' '}
                {aboveGroundFloorCount} floor
                {aboveGroundFloorCount !== 1 ? 's' : ''}
                {building.basementFloors > 0 &&
                  ` · ${building.basementFloors} basement`}
                {building.constructionProgress != null &&
                  ` · ${building.constructionProgress}% built`}
              </p>
            </div>
          </div>
          <button
            onClick={handleAddUnit}
            className="bg-primary-green text-white font-montserrat font-medium text-seu-caption px-4 py-2 rounded-lg hover:bg-primary-green/85 transition-colors flex items-center gap-2 shadow-lg shadow-primary-green/20"
          >
            <Plus className="size-4" />
            Add Unit
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatPill label="Total" value={stats.total} />
        <StatPill label="Available" value={stats.available} accent="emerald" />
        <StatPill label="Reserved" value={stats.reserved} accent="amber" />
        <StatPill label="Sold" value={stats.sold} accent="rose" />
        <StatPill
          label="Avg /m²"
          value={`$${stats.avgPricePerM2.toLocaleString()}`}
        />
      </div>

      <div className="grid lg:grid-cols-[20rem_1fr] gap-6">
        {/* Floors panel */}
        <FloorsPanel buildingId={buildingId} />

        {/* Unit visualization */}
        <div className="space-y-4 min-w-0">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="font-[--font-bodoni] text-seu-subheading-lg text-admin-fg leading-none">
              Units
            </h2>
            <div className="flex gap-1 p-1 bg-admin-hover rounded-lg border border-admin-border-soft">
              <button
                onClick={() => setView('chess')}
                className={btnToggle(view === 'chess')}
              >
                <Grid3X3 className="size-3.5" />
                Chess
              </button>
              <button
                onClick={() => setView('story')}
                className={btnToggle(view === 'story')}
              >
                <List className="size-3.5" />
                Storey
              </button>
            </div>
          </div>

          {floors.length === 0 && !floorsQ.isLoading && (
            <div
              className="rounded-xl border p-4 flex items-start gap-3"
              style={{
                borderColor: 'var(--admin-warning-border)',
                background: 'var(--admin-warning-shell)',
              }}
            >
              <Building2
                className="size-4 mt-0.5 shrink-0"
                style={{ color: 'var(--admin-warning-text)' }}
              />
              <div
                className="font-montserrat text-seu-caption"
                style={{ color: 'var(--admin-warning-text)' }}
              >
                No floors registered yet — add a floor on the left to start
                placing units there.
                <button
                  onClick={handleAddFloor}
                  className="block mt-2 text-primary-green hover:text-primary-green/80 transition-colors text-seu-caption-sm"
                >
                  + Add first floor
                </button>
              </div>
            </div>
          )}

          {unitsQ.isLoading ? (
            <div className="flex items-center justify-center py-20 text-admin-fg-muted">
              <Loader2 className="size-5 animate-spin mr-2" />
              Loading units…
            </div>
          ) : unitsQ.isError ? (
            <div
              className="rounded-2xl border p-6 font-montserrat text-seu-caption"
              style={{
                borderColor: 'var(--admin-danger-border)',
                background: 'var(--admin-danger-shell)',
                color: 'var(--admin-danger-text)',
              }}
            >
              Failed to load units —{' '}
              {unitsQ.error instanceof Error
                ? unitsQ.error.message
                : 'unknown error'}
            </div>
          ) : view === 'chess' ? (
            <ChessBoard
              units={units}
              floorCount={fallbackFloorCount}
              basementFloors={building.basementFloors}
              definedFloorNumbers={existingFloorNumbers}
              onCellClick={handleCellClick}
              onEmptyCellClick={handleEmptyCellClick}
            />
          ) : (
            <StoryView
              units={units}
              floors={floors}
              fallbackFloorCount={fallbackFloorCount}
              onUnitClick={handleCellClick}
              onAddUnitToFloor={handleAddUnitOnFloor}
              onEditFloor={handleEditFloor}
              onDeleteFloor={handleDeleteFloor}
            />
          )}
        </div>
      </div>

      <Sheet open={unitDialogOpen} onOpenChange={setUnitDialogOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl flex flex-col p-0"
        >
          <SheetHeader>
            <SheetTitle>
              {editingUnit
                ? `Unit #${editingUnit.unitNumber}`
                : 'New Unit'}
            </SheetTitle>
            <SheetDescription>
              {editingUnit
                ? 'Update unit details, status, and pricing'
                : `Add a new unit to Block ${building.block}`}
            </SheetDescription>
          </SheetHeader>
          {projectId && (
            <UnitForm
              buildingId={building.id}
              projectId={projectId}
              defaultBlock={building.block}
              initialData={editingUnit ?? undefined}
              initialFloor={prefill.floor}
              initialUnitNumber={prefill.unitNumber}
              onSubmit={handleUnitSubmit}
              onCancel={() => setUnitDialogOpen(false)}
              onDelete={editingUnit ? handleUnitDelete : undefined}
              submitLabel={editingUnit ? 'Update' : 'Create'}
              footerVariant="sticky"
            />
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={floorDialogOpen} onOpenChange={setFloorDialogOpen}>
        <DialogContent className="bg-admin-card-gradient border-admin-border-soft sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-admin-fg font-[--font-bodoni]">
              {editingFloor
                ? `Edit floor ${editingFloor.floorNumber}`
                : 'New floor'}
            </DialogTitle>
          </DialogHeader>
          <FloorForm
            buildingId={buildingId}
            initialData={editingFloor ?? undefined}
            existingFloorNumbers={existingFloorNumbers}
            onSubmit={handleFloorSubmit}
            onCancel={() => setFloorDialogOpen(false)}
            submitLabel={editingFloor ? 'Update' : 'Create'}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatPill({
  label,
  value,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  accent?: 'emerald' | 'amber' | 'rose';
}) {
  const accentClass =
    accent === 'emerald'
      ? 'text-emerald-300'
      : accent === 'amber'
        ? 'text-amber-300'
        : accent === 'rose'
          ? 'text-rose-300'
          : 'text-admin-fg';
  return (
    <div className="rounded-xl border border-admin-border bg-admin-card-gradient shadow-admin px-4 py-3">
      <div className="text-seu-caption-sm font-montserrat text-admin-fg-muted uppercase tracking-wider">
        {label}
      </div>
      <div
        className={cn(
          'font-[--font-bodoni] text-seu-heading leading-none mt-1 tabular-nums',
          accentClass
        )}
      >
        {value}
      </div>
    </div>
  );
}
