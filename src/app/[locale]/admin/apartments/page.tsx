'use client';

import { useMemo, useState } from 'react';
import {
  Trash2,
  ExternalLink,
  Pencil,
  Plus,
  LayoutGrid,
  List as ListIcon,
  Loader2,
  Building2,
  ChevronLeft,
  ChevronRight,
  Search,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import StatusBadge from '@/components/admin/StatusBadge';
import BuildingCard from '@/components/admin/BuildingCard';
import UnitForm from '@/components/admin/forms/UnitForm';
import FloorForm from '@/components/admin/forms/FloorForm';
import ChessBoard from '@/components/admin/chess/ChessBoard';
import StoryView from '@/components/admin/story/StoryView';
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
import { Input } from '@/components/ui/input';
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
} from '@/hooks/queries/use-units';
import {
  useFloorsByBuilding,
  useCreateFloor,
  useUpdateFloor,
  useDeleteFloor,
} from '@/hooks/queries/use-floors';
import { pickLocale } from '@/lib/i18n-helpers';
import { cn } from '@/lib/utils';
import type {
  Building,
  CreateFloorInput,
  CreateUnitInput,
  Floor,
  Project,
  Unit,
  UnitStatus,
  UnitType,
  UpdateFloorInput,
} from '@/model/types/api';

const btnPrimary =
  'bg-gradient-to-b from-primary-green to-primary-green/85 text-white font-montserrat font-medium text-seu-caption px-4 py-2 rounded-lg shadow-md shadow-primary-green/25 hover:shadow-lg hover:shadow-primary-green/30 transition-all flex items-center gap-2 disabled:opacity-50';
const btnSecondary =
  'bg-admin-input-gradient border border-admin-border text-admin-fg font-montserrat font-medium text-seu-caption px-3 py-2 rounded-lg hover:border-admin-border-strong transition-all flex items-center gap-2';
const btnPage =
  'px-3 py-1.5 border border-admin-border-soft bg-admin-input-gradient rounded-lg text-seu-caption-sm text-admin-fg disabled:opacity-30 hover:bg-admin-hover transition-colors';

const STATUSES: UnitStatus[] = [
  'available',
  'reserved',
  'sold',
  'not_for_sale',
];
const TYPES: UnitType[] = ['living', 'commerce', 'parking', 'storage'];

type ViewMode = 'table' | 'grid' | 'storey';

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

  async function handleUnitSubmit(data: CreateUnitInput) {
    if (editingUnit) {
      const { building: _b, project: _p, ...update } = data;
      void _b;
      void _p;
      await updateUnitMut.mutateAsync({ id: editingUnit.id, input: update });
    } else {
      await createUnitMut.mutateAsync(data);
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
        <BuildingPicker
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
        <BuildingContext
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

function BuildingPicker({
  loading,
  buildings,
  project,
  projects,
  projectSearch,
  onProjectSearchChange,
  onPickProject,
  onPick,
}: {
  loading: boolean;
  buildings: Building[];
  project: Project | undefined;
  projects: Project[];
  projectSearch: string;
  onProjectSearchChange: (v: string) => void;
  onPickProject: (id: string) => void;
  onPick: (id: string) => void;
}) {
  return (
    <div className="grid lg:grid-cols-[20rem_1fr] gap-6">
      <aside className="space-y-3">
        <div className="relative">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-admin-fg-dim z-10 pointer-events-none" />
          <Input
            value={projectSearch}
            onChange={(e) => onProjectSearchChange(e.target.value)}
            placeholder="Search projects…"
            className="pl-9"
          />
        </div>
        <div className="rounded-2xl border border-admin-border bg-admin-card-gradient shadow-admin overflow-hidden">
          <div className="px-4 py-3 border-b border-admin-border-soft flex items-center gap-2">
            <span className="font-montserrat text-seu-caption-sm text-admin-fg uppercase tracking-wider">
              Projects
            </span>
            <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted ml-auto">
              {projects.length}
            </span>
          </div>
          <ul className="max-h-[60vh] overflow-y-auto">
            {projects.map((p) => {
              const isActive = project?.id === p.id;
              return (
                <li key={p.id}>
                  <button
                    onClick={() => onPickProject(p.id)}
                    className={cn(
                      'w-full text-left px-4 py-3 border-l-2 transition-colors',
                      isActive
                        ? 'border-primary-green bg-primary-green/5'
                        : 'border-transparent hover:bg-admin-hover'
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          'font-montserrat text-seu-caption font-medium truncate',
                          isActive ? 'text-admin-fg' : 'text-admin-fg-muted'
                        )}
                      >
                        {pickLocale(p.name)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 font-montserrat text-seu-caption-sm text-admin-fg-muted">
                      <MapPin className="size-3 shrink-0" />
                      <span className="truncate">{p.location.address}</span>
                    </div>
                  </button>
                </li>
              );
            })}
            {projects.length === 0 && (
              <li className="px-4 py-8 text-center font-montserrat text-seu-caption-sm text-admin-fg-muted">
                {projectSearch ? 'No projects match.' : 'No projects yet.'}
              </li>
            )}
          </ul>
        </div>
      </aside>

      <section className="min-w-0">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-admin-fg-muted">
            <Loader2 className="size-5 animate-spin mr-2" />
            Loading buildings…
          </div>
        ) : buildings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-admin-border-soft bg-admin-card p-12 text-center">
            <Building2 className="size-10 text-admin-fg-dim mx-auto mb-4" />
            <p className="font-montserrat text-seu-body-sm text-admin-fg-muted mb-1">
              No buildings yet
              {project ? ` in ${pickLocale(project.name)}` : ''}.
            </p>
            <p className="font-montserrat text-seu-caption text-admin-fg-muted">
              Add one from the Buildings tab to start placing units here.
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-[--font-bodoni] text-seu-heading text-admin-fg leading-none mb-1">
              Buildings
              {project ? (
                <span className="text-admin-fg-dim font-montserrat text-seu-caption-sm ml-2">
                  · {pickLocale(project.name)}
                </span>
              ) : null}
            </h2>
            <p className="font-montserrat text-seu-caption-sm text-admin-fg-muted mb-5">
              Pick a block to view its floors and units
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {buildings.map((b) => (
                <BuildingCard
                  key={b.id}
                  building={b}
                  onClick={() => onPick(b.id)}
                  cta="View units"
                />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function BuildingContext({
  building,
  buildingLoading,
  unitsLoading,
  unitsError,
  units,
  floors,
  floorsLoading,
  view,
  setView,
  page,
  setPage,
  totalPages,
  filterStatus,
  filterType,
  setFilterStatus,
  setFilterType,
  onCellClick,
  onEmptyCellClick,
  onAddUnitOnFloor,
  onAddFloor,
  onEditFloor,
  onDeleteFloor,
  openEdit,
  handleRemove,
}: {
  building: Building | undefined;
  buildingLoading: boolean;
  unitsLoading: boolean;
  unitsError: string | null;
  units: Unit[];
  floors: Floor[];
  floorsLoading: boolean;
  view: ViewMode;
  setView: (v: ViewMode) => void;
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
  filterStatus: '' | UnitStatus;
  filterType: '' | UnitType;
  setFilterStatus: (v: '' | UnitStatus) => void;
  setFilterType: (v: '' | UnitType) => void;
  onCellClick: (u: Unit) => void;
  onEmptyCellClick: (floor: number, position: number) => void;
  onAddUnitOnFloor: (floorNumber: number) => void;
  onAddFloor: () => void;
  onEditFloor: (floor: Floor) => void;
  onDeleteFloor: (floor: Floor) => void;
  openEdit: (u: Unit) => void;
  handleRemove: (id: string) => void;
}) {
  if (buildingLoading || !building) {
    return (
      <div className="flex items-center justify-center py-16 text-admin-fg-muted">
        <Loader2 className="size-5 animate-spin mr-2" />
        Loading building…
      </div>
    );
  }

  const stats = {
    total: units.length,
    available: units.filter((u) => u.status === 'available').length,
    reserved: units.filter((u) => u.status === 'reserved').length,
    sold: units.filter((u) => u.status === 'sold').length,
  };

  const aboveGroundFloorCount = floors.filter((f) => f.floorNumber >= 1).length;
  const fallbackFloorCount = floors.length === 0 ? 1 : 0;

  return (
    <div className="space-y-5">
      {/* Building hero header */}
      <div className="rounded-2xl border border-admin-border-soft bg-admin-card-gradient p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 size-48 rounded-full bg-primary-green/10 blur-3xl pointer-events-none" />
        <div className="relative flex items-end justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 min-w-0">
            <div className="size-14 rounded-xl border border-admin-border bg-admin-input grid place-items-center font-[--font-bodoni] text-seu-heading text-admin-fg leading-none shrink-0">
              {building.block}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h2 className="font-[--font-bodoni] text-seu-heading-lg text-admin-fg leading-none">
                  Block {building.block}
                </h2>
                <StatusBadge status={building.status} />
              </div>
              <p className="font-montserrat text-seu-caption text-admin-fg-muted">
                {pickLocale(building.name) || `Block ${building.block}`} ·{' '}
                {aboveGroundFloorCount} floor
                {aboveGroundFloorCount !== 1 ? 's' : ''}
                {building.basementFloors > 0 &&
                  ` · ${building.basementFloors} basement`}
                {(building.parkingSpaces ?? 0) > 0 &&
                  ` · ${building.parkingSpaces} parking`}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 text-center">
            <MicroStat label="Total" value={stats.total} />
            <MicroStat
              label="Avail"
              value={stats.available}
              accent="emerald"
            />
            <MicroStat
              label="Rsrvd"
              value={stats.reserved}
              accent="amber"
            />
            <MicroStat label="Sold" value={stats.sold} accent="rose" />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select
          value={filterStatus || '__all__'}
          onValueChange={(v) =>
            setFilterStatus(v === '__all__' ? '' : (v as UnitStatus))
          }
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s.replace(/_/g, ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filterType || '__all__'}
          onValueChange={(v) =>
            setFilterType(v === '__all__' ? '' : (v as UnitType))
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All types</SelectItem>
            {TYPES.map((t) => (
              <SelectItem key={t} value={t} className="capitalize">
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-1 p-1 bg-admin-deep rounded-lg border border-admin-border shadow-inner shadow-black/40 ml-auto">
          {(
            [
              { id: 'grid', label: 'Chess', Icon: LayoutGrid },
              { id: 'storey', label: 'Storey', Icon: ListIcon },
              { id: 'table', label: 'Table', Icon: ListIcon },
            ] as const
          ).map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md font-montserrat font-medium text-seu-caption-sm transition-all',
                view === id
                  ? 'bg-admin-elevated-gradient text-admin-fg border border-primary-green/30 shadow-sm shadow-primary-green/10'
                  : 'text-admin-fg-muted hover:text-admin-fg hover:bg-admin-hover border border-transparent'
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* No floors warning when chess/storey */}
      {floors.length === 0 && !floorsLoading && view !== 'table' && (
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
            className="font-montserrat text-seu-caption flex-1"
            style={{ color: 'var(--admin-warning-text)' }}
          >
            No floors registered yet — add a floor first so units can be placed
            properly.
          </div>
          <button
            onClick={onAddFloor}
            className="font-montserrat text-seu-caption-sm bg-primary-green text-white px-3 py-1.5 rounded-md hover:bg-primary-green/85 transition-colors flex items-center gap-1 shrink-0"
          >
            <Plus className="size-3.5" />
            Add floor
          </button>
        </div>
      )}

      {unitsError ? (
        <div
          className="rounded-2xl border p-6 font-montserrat text-seu-caption"
          style={{
            borderColor: 'var(--admin-danger-border)',
            background: 'var(--admin-danger-shell)',
            color: 'var(--admin-danger-text)',
          }}
        >
          Failed to load units — {unitsError}
        </div>
      ) : view === 'grid' ? (
        unitsLoading && units.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-admin-fg-muted">
            <Loader2 className="size-5 animate-spin mr-2" />
            Loading units…
          </div>
        ) : (
          <ChessBoard
            units={units}
            floorCount={fallbackFloorCount}
            basementFloors={building.basementFloors}
            definedFloorNumbers={floors.map((f) => f.floorNumber)}
            onCellClick={onCellClick}
            onEmptyCellClick={onEmptyCellClick}
          />
        )
      ) : view === 'storey' ? (
        unitsLoading && units.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-admin-fg-muted">
            <Loader2 className="size-5 animate-spin mr-2" />
            Loading units…
          </div>
        ) : (
          <StoryView
            units={units}
            floors={floors}
            fallbackFloorCount={fallbackFloorCount}
            onUnitClick={onCellClick}
            onAddUnitToFloor={onAddUnitOnFloor}
            onEditFloor={onEditFloor}
            onDeleteFloor={onDeleteFloor}
          />
        )
      ) : (
        <TableView
          loading={unitsLoading}
          units={units}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          openEdit={openEdit}
          handleRemove={handleRemove}
        />
      )}
    </div>
  );
}

function MicroStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: 'emerald' | 'amber' | 'rose';
}) {
  const text =
    accent === 'emerald'
      ? 'text-emerald-300'
      : accent === 'amber'
        ? 'text-amber-300'
        : accent === 'rose'
          ? 'text-rose-300'
          : 'text-admin-fg';
  return (
    <div className="rounded-lg border border-admin-border bg-admin-card/50 px-3 py-2 min-w-[3.5rem]">
      <div className="font-montserrat text-[0.65rem] text-admin-fg-muted uppercase tracking-wider">
        {label}
      </div>
      <div
        className={cn(
          'font-[--font-bodoni] text-seu-subheading leading-none mt-0.5 tabular-nums',
          text
        )}
      >
        {value}
      </div>
    </div>
  );
}

function TableView({
  loading,
  units,
  page,
  totalPages,
  setPage,
  openEdit,
  handleRemove,
}: {
  loading: boolean;
  units: Unit[];
  page: number;
  totalPages: number;
  setPage: (p: number) => void;
  openEdit: (u: Unit) => void;
  handleRemove: (id: string) => void;
}) {
  return (
    <>
      <div className="overflow-hidden rounded-xl border border-admin-border-soft bg-admin-card">
        <table className="w-full text-seu-caption font-montserrat">
          <thead>
            <tr className="bg-admin-input text-left text-admin-fg-muted">
              <th className="p-3 font-medium">Floor</th>
              <th className="p-3 font-medium">Unit #</th>
              <th className="p-3 font-medium">Type</th>
              <th className="p-3 font-medium text-right">m²</th>
              <th className="p-3 font-medium text-right">Beds</th>
              <th className="p-3 font-medium text-right">Price</th>
              <th className="p-3 font-medium text-right">/m²</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && units.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="p-8 text-center text-admin-fg-dim"
                >
                  Loading…
                </td>
              </tr>
            ) : units.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="p-10 text-center text-admin-fg-dim"
                >
                  No units found
                </td>
              </tr>
            ) : (
              units.map((u) => {
                const buildingId =
                  typeof u.building === 'string' ? u.building : u.building.id;
                return (
                  <tr
                    key={u.id}
                    className="border-t border-admin-border-soft hover:bg-admin-hover transition-colors"
                  >
                    <td className="p-3 text-admin-fg-muted tabular-nums">
                      {u.floorNumber}
                    </td>
                    <td className="p-3 text-admin-fg font-medium">
                      #{u.unitNumber}
                    </td>
                    <td className="p-3 text-admin-fg-muted capitalize">
                      {u.type}
                    </td>
                    <td className="p-3 text-admin-fg-muted text-right tabular-nums">
                      {u.totalSize}
                    </td>
                    <td className="p-3 text-admin-fg-muted text-right tabular-nums">
                      {u.bedrooms ?? 0}
                    </td>
                    <td className="p-3 text-admin-fg text-right tabular-nums">
                      {currencySymbol(u.price.currency)}
                      {u.price.amount.toLocaleString()}
                    </td>
                    <td className="p-3 text-admin-fg-muted text-right tabular-nums">
                      {u.totalSize > 0
                        ? `${currencySymbol(u.price.currency)}${Math.round(
                            u.price.amount / u.totalSize
                          ).toLocaleString()}`
                        : '—'}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={u.status} />
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(u)}
                          className="text-admin-fg-muted hover:text-admin-fg transition-colors p-1"
                          title="Edit"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <Link
                          href={`/admin/buildings/${buildingId}`}
                          className="text-primary-green/80 hover:text-primary-green transition-colors p-1"
                          title="Open building"
                        >
                          <ExternalLink className="size-4" />
                        </Link>
                        <button
                          onClick={() => handleRemove(u.id)}
                          className="text-rose-400/70 hover:text-rose-300 transition-colors p-1"
                          title="Delete"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

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
    </>
  );
}

function currencySymbol(c: string) {
  if (c === 'USD') return '$';
  if (c === 'EUR') return '€';
  if (c === 'GEL') return '₾';
  return '';
}
