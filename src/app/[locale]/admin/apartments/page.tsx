'use client';

import { useMemo, useState } from 'react';
import {
  Plus,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import UnitForm from '@/components/admin/forms/UnitForm';
import FloorForm from '@/components/admin/forms/FloorForm';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import UnitsBuildingPicker from '@/components/admin/units-page/UnitsBuildingPicker';
import UnitsBuildingContext from '@/components/admin/units-page/UnitsBuildingContext';
import {
  btnPrimary,
  btnSecondary,
  type ViewMode,
} from '@/components/admin/units-page/styles';
import { useAllProjects } from '@/hooks/queries/use-projects';
import {
  useBuilding,
  useBuildingsByProject,
} from '@/hooks/queries/use-buildings';
import {
  useUnitsList,
  useDeleteUnit,
  useCreateUnit,
  useUpdateUnit,
  useSyncUnitRooms,
} from '@/hooks/queries/use-units';
import {
  useFloorsByBuilding,
  useCreateFloor,
  useUpdateFloor,
  useDeleteFloor,
} from '@/hooks/queries/use-floors';
import { pickLocale } from '@/lib/i18n-helpers';
import type {
  CreateFloorInput,
  CreateUnitInput,
  Floor,
  Room,
  Unit,
  UnitStatus,
  UnitType,
  UpdateFloorInput,
} from '@/model/types/api';

export default function UnitsPage() {
  const projectsQ = useAllProjects();
  const projects = useMemo(() => projectsQ.data ?? [], [projectsQ.data]);

  const [pickedProjectId, setPickedProjectId] = useState('');
  const [pickedBuildingId, setPickedBuildingId] = useState('');
  const [filterStatus, setFilterStatus] = useState<'' | UnitStatus>('');
  const [filterType, setFilterType] = useState<'' | UnitType>('');
  const [view, setView] = useState<ViewMode>('grid');
  const [page, setPage] = useState(1);
  const [projectSearch, setProjectSearch] = useState('');

  // Derived: fall back to the first project when nothing is picked yet.
  const filterProject = pickedProjectId || projects[0]?.id || '';
  const setFilterProject = setPickedProjectId;

  const buildingsQ = useBuildingsByProject(filterProject || undefined);
  const buildings = useMemo(
    () => buildingsQ.data ?? [],
    [buildingsQ.data]
  );

  // Derived: clear the building when it no longer belongs to the selected project.
  const filterBuilding =
    pickedBuildingId && buildings.some((b) => b.id === pickedBuildingId)
      ? pickedBuildingId
      : '';
  const setFilterBuilding = setPickedBuildingId;

  const selectedBuildingQ = useBuilding(filterBuilding || undefined);
  const floorsQ = useFloorsByBuilding(filterBuilding || undefined);
  const floors = useMemo(() => floorsQ.data ?? [], [floorsQ.data]);

  // Dialog state for create/edit unit
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [prefillFloor, setPrefillFloor] = useState<number | undefined>();
  const [prefillUnitNumber, setPrefillUnitNumber] = useState<string>('');

  // Dialog state for floors
  const [floorDialogOpen, setFloorDialogOpen] = useState(false);
  const [editingFloor, setEditingFloor] = useState<Floor | null>(null);

  const filter = {
    project: filterProject || undefined,
    building: filterBuilding || undefined,
    status: filterStatus || undefined,
    type: filterType || undefined,
  };
  const unitsQ = useUnitsList(
    filter,
    {
      page: view === 'table' ? page : 1,
      limit: view === 'table' ? 15 : 200,
    },
    view === 'table' ? '-createdAt' : 'floor'
  );
  const deleteUnitMut = useDeleteUnit();
  const createUnitMut = useCreateUnit();
  const updateUnitMut = useUpdateUnit();
  const syncRoomsMut = useSyncUnitRooms();
  const createFloorMut = useCreateFloor();
  const updateFloorMut = useUpdateFloor();
  const deleteFloorMut = useDeleteFloor();

  const units = unitsQ.data?.items ?? [];
  const totalPages = unitsQ.data?.pagination.totalPages ?? 1;
  const total = unitsQ.data?.pagination.total ?? 0;

  const context = useMemo(() => {
    if (editingUnit) {
      const projectId =
        typeof editingUnit.project === 'string'
          ? editingUnit.project
          : editingUnit.project.id;
      const buildingId =
        typeof editingUnit.building === 'string'
          ? editingUnit.building
          : editingUnit.building.id;
      return { projectId, buildingId, block: editingUnit.block };
    }
    return {
      projectId: filterProject,
      buildingId: filterBuilding,
      block: buildings.find((b) => b.id === filterBuilding)?.block ?? '',
    };
  }, [editingUnit, filterProject, filterBuilding, buildings]);

  const filteredProjects = useMemo(() => {
    if (!projectSearch.trim()) return projects;
    const q = projectSearch.trim().toLowerCase();
    return projects.filter((p) => {
      const ka = p.name.ka?.toLowerCase() ?? '';
      const en = p.name.en?.toLowerCase() ?? '';
      return ka.includes(q) || en.includes(q);
    });
  }, [projects, projectSearch]);

  function openCreateUnit() {
    if (!filterBuilding) return;
    setEditingUnit(null);
    setPrefillFloor(undefined);
    setPrefillUnitNumber('');
    setDialogOpen(true);
  }

  function openEditUnit(u: Unit) {
    setEditingUnit(u);
    setPrefillFloor(undefined);
    setPrefillUnitNumber('');
    setDialogOpen(true);
  }

  function openCreateUnitAtFloor(floor: number, position: number) {
    if (!filterBuilding || !selectedBuildingQ.data) return;
    setEditingUnit(null);
    setPrefillFloor(floor);
    setPrefillUnitNumber(
      `${selectedBuildingQ.data.block}-${String(Math.abs(floor)).padStart(
        2,
        '0'
      )}-${position}${floor < 0 ? 'P' : ''}`
    );
    setDialogOpen(true);
  }

  function openCreateUnitOnFloorNumber(floorNumber: number) {
    if (!filterBuilding || !selectedBuildingQ.data) return;
    const positionGuess =
      units.filter((u) => u.floorNumber === floorNumber).length + 1;
    openCreateUnitAtFloor(floorNumber, positionGuess);
  }

  function openCreateFloor() {
    setEditingFloor(null);
    setFloorDialogOpen(true);
  }
  function openEditFloor(floor: Floor) {
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
    setDialogOpen(false);
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

  async function handleRemoveUnit(id: string) {
    if (!confirm('Delete this unit?')) return;
    await deleteUnitMut.mutateAsync(id);
  }

  const selectedProject = projects.find((p) => p.id === filterProject);
  const selectedBuilding = selectedBuildingQ.data;

  return (
    <div>
      <AdminPageHeader
        title="Units"
        description={
          filterBuilding
            ? 'Browse and manage units, floors, and layouts in the selected block'
            : 'Pick a project and a building to view its units'
        }
        badge={
          filterBuilding && (
            <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted">
              {total} unit{total !== 1 ? 's' : ''} · {floors.length} floor
              {floors.length !== 1 ? 's' : ''}
            </span>
          )
        }
        action={
          filterBuilding ? (
            <div className="flex gap-2">
              <button
                onClick={openCreateFloor}
                className={btnSecondary}
                title="Add a floor to this building"
              >
                <Plus className="size-4" />
                Floor
              </button>
              <button onClick={openCreateUnit} className={btnPrimary}>
                <Plus className="size-4" />
                Unit
              </button>
            </div>
          ) : null
        }
      />

      {/* Top breadcrumb / picker bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6 rounded-2xl border border-admin-border bg-admin-card-gradient shadow-admin px-4 py-3">
        <span className="size-8 rounded-md bg-primary-green/15 border border-primary-green/30 grid place-items-center shadow-sm shadow-primary-green/10">
          <Building2 className="size-4 text-primary-green" />
        </span>
        <label className="font-montserrat text-seu-caption-sm text-admin-fg-muted uppercase tracking-wider">
          Project
        </label>
        <Select
          value={filterProject || undefined}
          onValueChange={(v) => {
            setFilterProject(v);
            setFilterBuilding('');
            setPage(1);
          }}
        >
          <SelectTrigger className="w-64">
            <SelectValue
              placeholder={
                projects.length === 0 ? 'Loading…' : 'Select project'
              }
            />
          </SelectTrigger>
          <SelectContent>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {pickLocale(p.name)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {filterBuilding && selectedBuilding && (
          <>
            <ChevronRight className="size-3.5 text-admin-fg-dim" />
            <span className="font-montserrat text-seu-caption text-admin-fg">
              Block {selectedBuilding.block}
            </span>
            <button
              onClick={() => setFilterBuilding('')}
              className="ml-auto font-montserrat text-seu-caption-sm text-admin-fg-muted hover:text-admin-fg flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="size-3.5" />
              All buildings
            </button>
          </>
        )}
      </div>

      {!filterBuilding ? (
        <UnitsBuildingPicker
          loading={buildingsQ.isLoading}
          buildings={buildings}
          project={selectedProject}
          projects={filteredProjects}
          projectSearch={projectSearch}
          onProjectSearchChange={setProjectSearch}
          onPickProject={(id) => {
            setFilterProject(id);
            setFilterBuilding('');
            setProjectSearch('');
          }}
          onPick={(id) => setFilterBuilding(id)}
        />
      ) : (
        <UnitsBuildingContext
          building={selectedBuilding}
          buildingLoading={selectedBuildingQ.isLoading}
          unitsLoading={unitsQ.isLoading}
          unitsError={
            unitsQ.isError
              ? unitsQ.error instanceof Error
                ? unitsQ.error.message
                : 'Failed to load units'
              : null
          }
          units={units}
          floors={floors}
          floorsLoading={floorsQ.isLoading}
          view={view}
          setView={setView}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          filterStatus={filterStatus}
          filterType={filterType}
          setFilterStatus={(v) => {
            setFilterStatus(v);
            setPage(1);
          }}
          setFilterType={(v) => {
            setFilterType(v);
            setPage(1);
          }}
          onCellClick={openEditUnit}
          onEmptyCellClick={openCreateUnitAtFloor}
          onAddUnitOnFloor={openCreateUnitOnFloorNumber}
          onAddFloor={openCreateFloor}
          onEditFloor={openEditFloor}
          onDeleteFloor={handleDeleteFloor}
          openEdit={openEditUnit}
          handleRemove={handleRemoveUnit}
        />
      )}

      <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
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
                : 'Add a new unit to the selected block'}
            </SheetDescription>
          </SheetHeader>

          {context.projectId && context.buildingId ? (
            <UnitForm
              buildingId={context.buildingId}
              projectId={context.projectId}
              defaultBlock={context.block}
              initialData={editingUnit ?? undefined}
              initialFloor={prefillFloor}
              initialUnitNumber={prefillUnitNumber || undefined}
              onSubmit={handleUnitSubmit}
              onCancel={() => setDialogOpen(false)}
              onDelete={
                editingUnit
                  ? async () => {
                      await handleRemoveUnit(editingUnit.id);
                      setDialogOpen(false);
                      setEditingUnit(null);
                    }
                  : undefined
              }
              submitLabel={editingUnit ? 'Update' : 'Create'}
              footerVariant="sticky"
            />
          ) : (
            <div className="px-6 py-10 font-montserrat text-seu-caption text-admin-fg-muted">
              Select a project and a building first.
            </div>
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
          {filterBuilding && (
            <FloorForm
              buildingId={filterBuilding}
              initialData={editingFloor ?? undefined}
              existingFloorNumbers={floors.map((f) => f.floorNumber)}
              onSubmit={handleFloorSubmit}
              onCancel={() => setFloorDialogOpen(false)}
              submitLabel={editingFloor ? 'Update' : 'Create'}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
