'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Building2,
  ChevronRight,
  Search,
  MapPin,
} from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import StatusBadge from '@/components/admin/StatusBadge';
import BuildingForm from '@/components/admin/forms/BuildingForm';
import BuildingCard from '@/components/admin/BuildingCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  useBuildingsByProject,
  useCreateBuilding,
  useUpdateBuilding,
  useDeleteBuilding,
} from '@/hooks/queries/use-buildings';
import { useAllProjects } from '@/hooks/queries/use-projects';
import { pickLocale } from '@/lib/i18n-helpers';
import { cn } from '@/lib/utils';
import type { Building, CreateBuildingInput } from '@/model/types/api';

const btnPrimary =
  'bg-gradient-to-b from-primary-green to-primary-green/85 text-white font-montserrat font-medium text-seu-caption px-4 py-2 rounded-lg shadow-md shadow-primary-green/25 hover:shadow-lg hover:shadow-primary-green/30 transition-all flex items-center gap-2 disabled:opacity-50';

export default function BuildingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialProject = searchParams.get('project') ?? '';

  const [pickedProjectId, setPickedProjectId] = useState(initialProject);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Building | null>(null);

  const projectsQ = useAllProjects();
  const projects = useMemo(() => projectsQ.data ?? [], [projectsQ.data]);

  // Derived: fall back to the first project when nothing is picked yet.
  const selectedProjectId =
    pickedProjectId || projects[0]?.id || '';
  const setSelectedProjectId = setPickedProjectId;

  const filteredProjects = useMemo(() => {
    if (!search.trim()) return projects;
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      const ka = p.name.ka?.toLowerCase() ?? '';
      const en = p.name.en?.toLowerCase() ?? '';
      return ka.includes(q) || en.includes(q);
    });
  }, [projects, search]);

  const buildingsQ = useBuildingsByProject(selectedProjectId || undefined);
  const buildings = buildingsQ.data ?? [];

  const createMut = useCreateBuilding();
  const updateMut = useUpdateBuilding();
  const deleteMut = useDeleteBuilding();

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(b: Building) {
    setEditing(b);
    setDialogOpen(true);
  }

  async function handleSubmit(data: CreateBuildingInput) {
    if (editing) {
      const { project: _p, ...update } = data;
      void _p;
      await updateMut.mutateAsync({ id: editing.id, input: update });
    } else {
      await createMut.mutateAsync({ ...data, project: selectedProjectId });
    }
    setDialogOpen(false);
    setEditing(null);
  }

  async function handleRemove(b: Building, e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (
      !confirm(
        `Delete Block ${b.block} (${pickLocale(b.name) || ''}) and all of its units?`
      )
    )
      return;
    await deleteMut.mutateAsync(b.id);
  }

  return (
    <div>
      <AdminPageHeader
        title="Buildings"
        description="Pick a project on the left, then add or remove its buildings"
        badge={
          selectedProject && (
            <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted">
              {buildings.length} block{buildings.length !== 1 ? 's' : ''}
            </span>
          )
        }
        action={
          <button
            onClick={openCreate}
            className={btnPrimary}
            disabled={!selectedProjectId}
            title={
              !selectedProjectId
                ? 'Pick a project first'
                : 'Add a building to the selected project'
            }
          >
            <Plus className="size-4" />
            New Building
          </button>
        }
      />

      <div className="grid lg:grid-cols-[20rem_1fr] gap-6">
        {/* Project picker rail */}
        <aside className="space-y-3">
          <div className="relative">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-admin-fg-dim z-10 pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects…"
              className="pl-9"
            />
          </div>
          <div className="rounded-2xl border border-admin-border bg-admin-card-gradient shadow-admin overflow-hidden">
            <div className="px-4 py-3 border-b border-admin-border-soft flex items-center gap-2">
              <span className="size-7 rounded-md bg-primary-green/15 border border-primary-green/30 grid place-items-center shadow-sm shadow-primary-green/10">
                <Building2 className="size-3.5 text-primary-green" />
              </span>
              <span className="font-montserrat text-seu-caption-sm text-admin-fg uppercase tracking-wider">
                Projects
              </span>
              <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted ml-auto">
                {projects.length}
              </span>
            </div>

            {projectsQ.isLoading ? (
              <div className="flex items-center justify-center py-10 text-admin-fg-muted">
                <Loader2 className="size-4 animate-spin mr-2" />
                Loading…
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="px-4 py-8 text-center font-montserrat text-seu-caption-sm text-admin-fg-muted">
                {search ? 'No projects match.' : 'No projects yet.'}
              </div>
            ) : (
              <ul className="max-h-[60vh] overflow-y-auto">
                {filteredProjects.map((p) => {
                  const isActive = p.id === selectedProjectId;
                  return (
                    <li key={p.id}>
                      <button
                        onClick={() => setSelectedProjectId(p.id)}
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
                          {p.isFeatured && (
                            <span className="text-amber-300 text-seu-caption-sm shrink-0">
                              ★
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 font-montserrat text-seu-caption-sm text-admin-fg-muted">
                          <MapPin className="size-3 shrink-0" />
                          <span className="truncate">{p.location.address}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 font-montserrat text-[0.65rem] text-admin-fg-dim uppercase tracking-wider">
                          <span>{p.totalBuildings ?? 0} blocks</span>
                          <span>·</span>
                          <span>{p.totalUnits ?? 0} units</span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>

        {/* Buildings grid */}
        <section className="min-w-0">
          {!selectedProject ? (
            <EmptyState message="Pick a project to manage its buildings." />
          ) : buildingsQ.isLoading ? (
            <div className="flex items-center justify-center py-16 text-admin-fg-muted">
              <Loader2 className="size-5 animate-spin mr-2" />
              Loading buildings…
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-admin-border-soft bg-admin-card-gradient p-5 sm:p-6 mb-5 relative overflow-hidden">
                <div className="absolute -top-16 -right-16 size-48 rounded-full bg-primary-green/10 blur-3xl pointer-events-none" />
                <div className="relative flex items-end justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <StatusBadge status={selectedProject.status} />
                      {selectedProject.isFeatured && (
                        <span className="text-amber-300 font-montserrat text-seu-caption-sm">
                          ★ Featured
                        </span>
                      )}
                    </div>
                    <h2 className="font-[--font-bodoni] text-seu-heading-lg text-admin-fg leading-none">
                      {pickLocale(selectedProject.name)}
                    </h2>
                    <div className="flex items-center gap-1.5 mt-1.5 font-montserrat text-seu-caption text-admin-fg-muted">
                      <MapPin className="size-3.5" />
                      <span>{selectedProject.location.address}</span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      router.push(`/admin/projects/${selectedProject.id}`)
                    }
                    className="font-montserrat text-seu-caption-sm text-primary-green hover:text-primary-green/80 transition-colors flex items-center gap-1"
                  >
                    Open project
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </div>

              {buildings.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-admin-border-soft bg-admin-card p-12 text-center">
                  <Building2 className="size-10 text-admin-fg-dim mx-auto mb-4" />
                  <p className="font-montserrat text-seu-body-sm text-admin-fg-muted mb-1">
                    No buildings in this project yet
                  </p>
                  <p className="font-montserrat text-seu-caption text-admin-fg-muted mb-5">
                    Add the first block to start defining floors and units.
                  </p>
                  <button onClick={openCreate} className={btnPrimary + ' mx-auto'}>
                    <Plus className="size-4" />
                    Add first building
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {buildings.map((b) => (
                    <div key={b.id} className="relative group/card">
                      <BuildingCard building={b} />
                      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity z-10">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openEdit(b);
                          }}
                          className="bg-admin-card/95 border border-admin-border text-admin-fg-muted hover:text-admin-fg p-1.5 rounded-md backdrop-blur transition-colors"
                          title="Edit building"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleRemove(b, e)}
                          disabled={deleteMut.isPending}
                          className="bg-admin-card/95 border border-admin-border text-rose-400/80 hover:text-rose-300 p-1.5 rounded-md backdrop-blur transition-colors"
                          title="Delete building"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={openCreate}
                    className="rounded-2xl border border-dashed border-admin-border bg-admin-card/40 p-6 text-center hover:border-primary-green/60 hover:bg-primary-green/5 transition-colors flex flex-col items-center justify-center min-h-[18rem] group"
                  >
                    <span className="size-12 rounded-full border border-admin-border group-hover:border-primary-green/60 grid place-items-center mb-3 transition-colors">
                      <Plus className="size-5 text-admin-fg-muted group-hover:text-primary-green transition-colors" />
                    </span>
                    <span className="font-montserrat text-seu-caption text-admin-fg-muted group-hover:text-admin-fg transition-colors">
                      Add another block
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-admin-card-gradient border-admin-border-soft sm:max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-admin-fg font-[--font-bodoni]">
              {editing
                ? `Edit Block ${editing.block}`
                : `New building in ${selectedProject ? pickLocale(selectedProject.name) : ''}`}
            </DialogTitle>
          </DialogHeader>
          <BuildingForm
            initialData={editing ?? undefined}
            fixedProjectId={selectedProjectId}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            submitLabel={editing ? 'Update' : 'Create'}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-admin-border-soft bg-admin-card p-12 text-center">
      <Building2 className="size-10 text-admin-fg-dim mx-auto mb-3" />
      <p className="font-montserrat text-seu-caption text-admin-fg-muted">
        {message}
      </p>
    </div>
  );
}
