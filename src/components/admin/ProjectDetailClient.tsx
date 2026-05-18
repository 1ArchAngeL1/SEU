'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  Plus,
  Pencil,
  Loader2,
  MapPin,
  Building2,
  Image as ImageIcon,
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import StatCard from './StatCard';
import BuildingCard from './BuildingCard';
import ApartmentTypesPanel from './ApartmentTypesPanel';
import ProjectForm from './forms/ProjectForm';
import BuildingForm from './forms/BuildingForm';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  useProject,
  useUpdateProject,
} from '@/hooks/queries/use-projects';
import {
  useBuildingsByProject,
  useCreateBuilding,
} from '@/hooks/queries/use-buildings';
import { useUnitStats } from '@/hooks/queries/use-units';
import { pickLocale } from '@/lib/i18n-helpers';
import { fileUrl } from '@/lib/file-url';
import type {
  CreateBuildingInput,
  CreateProjectInput,
} from '@/model/types/api';

export default function ProjectDetailClient({
  projectId,
}: {
  projectId: string;
}) {
  const projectQ = useProject(projectId);
  const buildingsQ = useBuildingsByProject(projectId);
  const statsQ = useUnitStats(projectId);
  const updateProjectMut = useUpdateProject();
  const createBuildingMut = useCreateBuilding();

  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [newBuildingOpen, setNewBuildingOpen] = useState(false);

  const project = projectQ.data;
  const buildings = buildingsQ.data ?? [];

  if (projectQ.isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-admin-fg-muted">
        <Loader2 className="size-5 animate-spin mr-2" />
        Loading project…
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <p className="font-montserrat text-seu-body text-admin-fg-muted">
          Project not found.
        </p>
        <Link
          href="/admin/projects"
          className="inline-block mt-4 text-primary-orange font-montserrat text-seu-caption hover:underline"
        >
          ← Back to projects
        </Link>
      </div>
    );
  }

  const stats = statsQ.data;
  const byStatus = stats?.byStatus ?? {};
  const totalUnits =
    project.totalUnits ??
    Object.values(byStatus).reduce((s, n) => s + (n ?? 0), 0);
  const available = project.availableUnits ?? byStatus.available ?? 0;

  async function handleProjectUpdate(input: CreateProjectInput) {
    await updateProjectMut.mutateAsync({ id: projectId, input });
    setEditProjectOpen(false);
  }

  async function handleBuildingCreate(input: CreateBuildingInput) {
    await createBuildingMut.mutateAsync({ ...input, project: projectId });
    setNewBuildingOpen(false);
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 font-montserrat text-seu-caption-sm">
        <Link
          href="/admin/projects"
          className="text-admin-fg-muted hover:text-admin-fg transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="size-3.5" />
          Projects
        </Link>
        <span className="text-admin-fg-dim">/</span>
        <span className="text-admin-fg">{pickLocale(project.name)}</span>
      </div>

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden border border-admin-border-soft bg-admin-card mb-8">
        <div className="aspect-[3/1] relative">
          {project.mainImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fileUrl(project.mainImage)}
              alt={pickLocale(project.name)}
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-admin-fg-dim">
              <ImageIcon className="size-20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-admin-bg via-admin-bg/50 to-transparent" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={project.status} />
                {project.isFeatured && (
                  <span className="text-amber-300 text-seu-caption-sm font-montserrat">
                    ★ Featured
                  </span>
                )}
              </div>
              <h1 className="font-[--font-bodoni] font-normal text-seu-title text-pale-gray leading-none">
                {pickLocale(project.name)}
              </h1>
              <div className="flex items-center gap-2 font-montserrat text-seu-caption text-pale-gray/80">
                <MapPin className="size-3.5" />
                <span>
                  {project.location.address}
                  {project.location.city && ` · ${project.location.city}`}
                  {project.location.district &&
                    ` · ${project.location.district}`}
                </span>
              </div>
            </div>
            <button
              onClick={() => setEditProjectOpen(true)}
              className="bg-admin-input hover:bg-admin-hover border border-admin-border-soft text-admin-fg font-montserrat font-medium text-seu-caption px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Pencil className="size-3.5" />
              Edit project
            </button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Buildings"
          value={buildings.length}
          accent="sky"
          icon={<Building2 className="size-5" />}
        />
        <StatCard label="Total units" value={totalUnits} />
        <StatCard label="Available" value={available} accent="green" />
        <StatCard
          label="Sold"
          value={byStatus.sold ?? 0}
          accent="rose"
        />
      </div>

      {/* Description */}
      {(project.description?.ka || project.description?.en) && (
        <div className="rounded-2xl border border-admin-border-soft bg-admin-card p-5 mb-8">
          <h2 className="font-montserrat text-seu-caption-sm text-admin-fg-muted uppercase tracking-wider mb-2">
            About this project
          </h2>
          <p className="font-montserrat text-seu-body-sm text-admin-fg-muted whitespace-pre-line">
            {pickLocale(project.description) ?? ''}
          </p>
        </div>
      )}

      {/* Buildings */}
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <h2 className="font-[--font-bodoni] text-seu-heading text-admin-fg leading-none">
            Buildings
          </h2>
          <p className="font-montserrat text-seu-caption text-admin-fg-muted mt-1">
            {buildings.length} block{buildings.length !== 1 ? 's' : ''} in this
            project
          </p>
        </div>
        <button
          onClick={() => setNewBuildingOpen(true)}
          className="bg-primary-orange text-white font-montserrat font-medium text-seu-caption px-4 py-2 rounded-lg hover:bg-primary-orange/85 transition-colors flex items-center gap-2"
        >
          <Plus className="size-4" />
          New Building
        </button>
      </div>

      {buildingsQ.isLoading ? (
        <div className="flex items-center justify-center py-12 text-admin-fg-muted">
          <Loader2 className="size-5 animate-spin mr-2" />
          Loading buildings…
        </div>
      ) : buildings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-admin-border-soft bg-admin-card p-10 text-center">
          <Building2 className="size-8 text-admin-fg-dim mx-auto mb-3" />
          <p className="font-montserrat text-seu-caption text-admin-fg-muted">
            No buildings yet. Add the first block to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {buildings.map((b) => (
            <BuildingCard key={b.id} building={b} />
          ))}
        </div>
      )}

      {/* Apartment types panel */}
      <div className="mt-10">
        <ApartmentTypesPanel projectId={projectId} />
      </div>

      <Sheet open={editProjectOpen} onOpenChange={setEditProjectOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl flex flex-col p-0">
          <SheetHeader>
            <SheetTitle>Edit project</SheetTitle>
            <SheetDescription>Update project details</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <ProjectForm
              initialData={project}
              onSubmit={handleProjectUpdate}
              onCancel={() => setEditProjectOpen(false)}
              submitLabel="Update"
            />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={newBuildingOpen} onOpenChange={setNewBuildingOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl flex flex-col p-0">
          <SheetHeader>
            <SheetTitle>New building in {pickLocale(project.name)}</SheetTitle>
            <SheetDescription>Add a new building to this project</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <BuildingForm
              fixedProjectId={projectId}
              onSubmit={handleBuildingCreate}
              onCancel={() => setNewBuildingOpen(false)}
              submitLabel="Create"
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
