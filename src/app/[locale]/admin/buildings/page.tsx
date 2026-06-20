'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { Plus } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import BuildingForm from '@/components/admin/forms/BuildingForm';
import BuildingsGridSection from '@/components/admin/buildings-page/BuildingsGridSection';
import ProjectPickerRail from '@/components/admin/buildings-page/ProjectPickerRail';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  useBuildingsByProject,
  useCreateBuilding,
  useDeleteBuilding,
  useUpdateBuilding,
} from '@/hooks/queries/use-buildings';
import { useAllProjects } from '@/hooks/queries/use-projects';
import { pickLocalized } from '@/lib/i18n-helpers';
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
      const ka = p.nameKa?.toLowerCase() ?? '';
      const en = p.nameEn?.toLowerCase() ?? '';
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
        `Delete Block ${b.block} (${pickLocalized(b.nameEn, b.nameKa) || ''}) and all of its units?`
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
        <ProjectPickerRail
          projects={projects}
          filteredProjects={filteredProjects}
          selectedProjectId={selectedProjectId}
          onSelect={setSelectedProjectId}
          search={search}
          onSearchChange={setSearch}
          loading={projectsQ.isLoading}
        />

        <BuildingsGridSection
          selectedProject={selectedProject}
          buildings={buildings}
          loading={buildingsQ.isLoading}
          onAddBuilding={openCreate}
          onEdit={openEdit}
          onDelete={handleRemove}
          onOpenProject={(id) => router.push(`/admin/projects/${id}`)}
          deletingId={deleteMut.isPending}
        />
      </div>

      <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl flex flex-col p-0">
          <SheetHeader>
            <SheetTitle>
              {editing
                ? `Edit Block ${editing.block}`
                : `New building in ${selectedProject ? pickLocalized(selectedProject.nameEn, selectedProject.nameKa) : ''}`}
            </SheetTitle>
            <SheetDescription>
              {editing ? 'Update building details' : 'Add a new building to the project'}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <BuildingForm
              initialData={editing ?? undefined}
              fixedProjectId={selectedProjectId}
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
