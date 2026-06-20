'use client';

import { useState, useMemo } from 'react';
import { Link } from '@/i18n/navigation';
import { Loader2 } from 'lucide-react';
import ChessBoard from './chess/ChessBoard';
import StoryView from './story/StoryView';
import UnitForm from './forms/UnitForm';
import FloorForm from './forms/FloorForm';
import FloorsPanel from './FloorsPanel';
import BuildingDetailBreadcrumbs from './building-detail/BuildingDetailBreadcrumbs';
import BuildingDetailHero from './building-detail/BuildingDetailHero';
import BuildingStatsRow from './building-detail/BuildingStatsRow';
import UnitsViewToggle from './building-detail/UnitsViewToggle';
import NoFloorsWarning from './building-detail/NoFloorsWarning';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { pickLocale } from '@/lib/i18n-helpers';
import { useBuilding } from '@/hooks/queries/use-buildings';
import {
  useUnitsList,
  useCreateUnit,
  useUpdateUnit,
  useDeleteUnit,
  useSyncUnitRooms,
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
  Room,
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
  const syncRoomsMut = useSyncUnitRooms();
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

  async function handleUnitSubmit(data: CreateUnitInput, rooms: Room[]) {
    if (editingUnit) {
      const { building: _b, project: _p, ...update } = data;
      void _b;
      void _p;
      await updateUnitMut.mutateAsync({ id: editingUnit.id, input: update });
      await syncRoomsMut.mutateAsync({ id: editingUnit.id, rooms });
    } else {
      await createUnitMut.mutateAsync({ ...data, rooms });
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
      <BuildingDetailBreadcrumbs
        projectId={projectId}
        projectName={projectName}
        buildingBlock={building.block}
      />

      <BuildingDetailHero
        building={building}
        aboveGroundFloorCount={aboveGroundFloorCount}
        onAddUnit={handleAddUnit}
      />

      <BuildingStatsRow
        total={stats.total}
        available={stats.available}
        reserved={stats.reserved}
        sold={stats.sold}
        avgPricePerM2={stats.avgPricePerM2}
      />

      <div className="grid lg:grid-cols-[20rem_1fr] gap-6">
        {/* Floors panel */}
        <FloorsPanel buildingId={buildingId} />

        {/* Unit visualization */}
        <div className="space-y-4 min-w-0">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="font-[--font-bodoni] text-seu-subheading-lg text-admin-fg leading-none">
              Units
            </h2>
            <UnitsViewToggle view={view} setView={setView} />
          </div>

          {floors.length === 0 && !floorsQ.isLoading && (
            <NoFloorsWarning onAddFloor={handleAddFloor} />
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

      <Sheet open={floorDialogOpen} onOpenChange={setFloorDialogOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
          <SheetHeader>
            <SheetTitle>
              {editingFloor
                ? `Edit floor ${editingFloor.floorNumber}`
                : 'New floor'}
            </SheetTitle>
            <SheetDescription>
              {editingFloor ? 'Update floor details' : 'Add a new floor to this building'}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <FloorForm
              buildingId={buildingId}
              initialData={editingFloor ?? undefined}
              existingFloorNumbers={existingFloorNumbers}
              onSubmit={handleFloorSubmit}
              onCancel={() => setFloorDialogOpen(false)}
              submitLabel={editingFloor ? 'Update' : 'Create'}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
