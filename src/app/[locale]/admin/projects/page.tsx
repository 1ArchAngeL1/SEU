'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Pencil,
  Trash2,
  ArrowRight,
  Search,
  MapPin,
  LayoutGrid,
  List as ListIcon,
  Building2,
  Star,
} from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import StatusBadge from '@/components/admin/StatusBadge';
import ProjectForm from '@/components/admin/forms/ProjectForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  useProjectsList,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from '@/hooks/queries/use-projects';
import { pickLocale } from '@/lib/i18n-helpers';
import { fileUrl } from '@/lib/file-url';
import { cn } from '@/lib/utils';
import type { Project, CreateProjectInput } from '@/model/types/api';

const btnPrimary =
  'bg-gradient-to-b from-primary-green to-primary-green/85 text-white font-montserrat font-medium text-seu-caption px-4 py-2 rounded-lg shadow-md shadow-primary-green/25 hover:shadow-lg hover:shadow-primary-green/30 transition-all flex items-center gap-2';
const btnPage =
  'px-3 py-1.5 border border-admin-border-soft bg-admin-input-gradient rounded-lg text-seu-caption-sm text-admin-fg disabled:opacity-30 hover:bg-admin-hover transition-colors';

type Layout = 'cards' | 'table';

export default function ProjectsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [layout, setLayout] = useState<Layout>('cards');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  const filter = search ? { q: search } : {};
  const projectsQ = useProjectsList(filter, { page, limit: 12 });
  const createMut = useCreateProject();
  const updateMut = useUpdateProject();
  const deleteMut = useDeleteProject();

  const items = projectsQ.data?.items ?? [];
  const totalPages = projectsQ.data?.pagination.totalPages ?? 1;
  const total = projectsQ.data?.pagination.total ?? 0;

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(project: Project) {
    setEditing(project);
    setDialogOpen(true);
  }

  async function handleSubmit(input: CreateProjectInput) {
    if (editing) {
      await updateMut.mutateAsync({ id: editing.id, input });
    } else {
      await createMut.mutateAsync(input);
    }
    setDialogOpen(false);
    setEditing(null);
  }

  async function handleRemove(id: string) {
    if (!confirm('Delete this project, its buildings and all of its units?'))
      return;
    await deleteMut.mutateAsync(id);
  }

  return (
    <div>
      <AdminPageHeader
        title="Projects"
        description="Developments — neighborhoods, status and headline data"
        badge={
          <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted">
            {total} total
          </span>
        }
        action={
          <button onClick={openCreate} className={btnPrimary}>
            <Plus className="size-4" />
            New Project
          </button>
        }
      />

      <div className="mb-5 flex items-center justify-between gap-4 flex-wrap">
        <div className="relative">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-admin-fg-dim z-10 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search projects…"
            className="pl-9 w-72"
          />
        </div>
        <div className="flex gap-1 p-1 bg-admin-deep rounded-lg border border-admin-border shadow-inner shadow-black/40">
          {(
            [
              { id: 'cards', label: 'Cards', Icon: LayoutGrid },
              { id: 'table', label: 'Table', Icon: ListIcon },
            ] as const
          ).map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setLayout(id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md font-montserrat font-medium text-seu-caption-sm transition-all',
                layout === id
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

      {projectsQ.isLoading && items.length === 0 ? (
        <div className="rounded-2xl border border-admin-border-soft bg-admin-card p-16 text-center font-montserrat text-seu-caption text-admin-fg-dim">
          Loading projects…
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-admin-border-soft bg-admin-card p-12 text-center">
          <Building2 className="size-10 text-admin-fg-dim mx-auto mb-4" />
          <p className="font-montserrat text-seu-body-sm text-admin-fg-muted mb-1">
            No projects yet
          </p>
          <p className="font-montserrat text-seu-caption text-admin-fg-muted mb-5">
            Click <em>New Project</em> to add the first development.
          </p>
          <button onClick={openCreate} className={btnPrimary + ' mx-auto'}>
            <Plus className="size-4" />
            New Project
          </button>
        </div>
      ) : layout === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onOpen={() => router.push(`/admin/projects/${p.id}`)}
              onEdit={() => openEdit(p)}
              onDelete={() => handleRemove(p.id)}
            />
          ))}
          <button
            onClick={openCreate}
            className="rounded-2xl border border-dashed border-admin-border bg-admin-card/40 p-6 text-center hover:border-primary-green/60 hover:bg-primary-green/5 transition-colors flex flex-col items-center justify-center min-h-[16rem] group"
          >
            <span className="size-12 rounded-full border border-admin-border group-hover:border-primary-green/60 grid place-items-center mb-3 transition-colors">
              <Plus className="size-5 text-admin-fg-muted group-hover:text-primary-green transition-colors" />
            </span>
            <span className="font-montserrat text-seu-caption text-admin-fg-muted group-hover:text-admin-fg transition-colors">
              New project
            </span>
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-admin-border-soft bg-admin-card">
          <table className="w-full text-seu-caption font-montserrat">
            <thead>
              <tr className="bg-admin-input text-left text-admin-fg-muted">
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Address</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium text-right">Buildings</th>
                <th className="p-3 font-medium text-right">Units</th>
                <th className="p-3 font-medium text-right">Available</th>
                <th className="p-3 font-medium w-28">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-admin-border-soft hover:bg-admin-hover transition-colors cursor-pointer group"
                  onClick={() => router.push(`/admin/projects/${p.id}`)}
                >
                  <td className="p-3 text-admin-fg">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{pickLocale(p.name)}</span>
                      {p.isFeatured && (
                        <Star className="size-3 fill-amber-300 text-amber-300" />
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-admin-fg-muted">
                    {p.location.address}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="p-3 text-admin-fg-muted text-right tabular-nums">
                    {p.totalBuildings ?? 0}
                  </td>
                  <td className="p-3 text-admin-fg-muted text-right tabular-nums">
                    {p.totalUnits ?? 0}
                  </td>
                  <td className="p-3 text-emerald-300/90 text-right tabular-nums">
                    {p.availableUnits ?? 0}
                  </td>
                  <td className="p-3">
                    <div
                      className="flex gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => openEdit(p)}
                        className="text-admin-fg-muted hover:text-admin-fg transition-colors p-1"
                        title="Edit"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => handleRemove(p.id)}
                        disabled={deleteMut.isPending}
                        className="text-rose-400/70 hover:text-rose-300 transition-colors p-1"
                        title="Delete"
                      >
                        <Trash2 className="size-4" />
                      </button>
                      <ArrowRight className="size-4 text-admin-fg-dim group-hover:text-primary-green transition-colors ml-1 self-center" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-admin-card-gradient border-admin-border-soft sm:max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-admin-fg font-[--font-bodoni]">
              {editing ? 'Edit Project' : 'New Project'}
            </DialogTitle>
          </DialogHeader>
          <ProjectForm
            initialData={editing ?? undefined}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            submitLabel={editing ? 'Update' : 'Create'}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProjectCard({
  project,
  onOpen,
  onEdit,
  onDelete,
}: {
  project: Project;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const total = project.totalUnits ?? 0;
  const available = project.availableUnits ?? 0;
  const buildingsCount = project.totalBuildings ?? 0;
  const sold = Math.max(total - available, 0);
  const occupancy = total > 0 ? Math.round((sold / total) * 100) : 0;

  return (
    <div className="group/card relative rounded-2xl border border-admin-border-soft bg-admin-card overflow-hidden hover:border-primary-green/40 hover:shadow-admin-lg transition-all">
      <button
        type="button"
        onClick={onOpen}
        className="block w-full text-left"
      >
        <div className="relative aspect-[16/9] bg-admin-input-gradient overflow-hidden border-b border-admin-border-soft">
          {project.mainImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fileUrl(project.mainImage)}
              alt={pickLocale(project.name)}
              className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover/card:opacity-90 group-hover/card:scale-105 transition-all duration-500"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <Building2 className="size-12 text-admin-fg-dim" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <StatusBadge status={project.status} />
            {project.isFeatured && (
              <span className="bg-amber-500/20 border border-amber-500/40 text-amber-200 px-2 py-0.5 rounded-full font-montserrat text-[0.65rem] uppercase tracking-wider flex items-center gap-1">
                <Star className="size-2.5 fill-amber-300 text-amber-300" />
                Featured
              </span>
            )}
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <div className="font-[--font-bodoni] text-seu-heading text-pale-gray leading-tight drop-shadow-lg line-clamp-2">
              {pickLocale(project.name)}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 font-montserrat text-seu-caption-sm text-pale-gray/85">
              <MapPin className="size-3" />
              <span className="truncate">{project.location.address}</span>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <CardStat label="Blocks" value={buildingsCount} />
            <CardStat label="Units" value={total} />
            <CardStat label="Avail" value={available} accent="emerald" />
          </div>
          {total > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted">
                  Sold
                </span>
                <span className="font-montserrat text-seu-caption-sm text-admin-fg tabular-nums">
                  {occupancy}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-admin-input overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-green to-primary-green/70 transition-all"
                  style={{ width: `${occupancy}%` }}
                />
              </div>
            </div>
          )}
          <div className="flex items-center justify-between pt-1 border-t border-admin-border-soft">
            <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted pt-3">
              Open project
            </span>
            <ArrowRight className="size-3.5 text-primary-green mt-3 group-hover/card:translate-x-1 transition-transform" />
          </div>
        </div>
      </button>

      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="bg-admin-card/95 border border-admin-border text-admin-fg-muted hover:text-admin-fg p-1.5 rounded-md backdrop-blur transition-colors"
          title="Edit project"
        >
          <Pencil className="size-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="bg-admin-card/95 border border-admin-border text-rose-400/80 hover:text-rose-300 p-1.5 rounded-md backdrop-blur transition-colors"
          title="Delete project"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

function CardStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: 'emerald';
}) {
  const text = accent === 'emerald' ? 'text-emerald-300' : 'text-admin-fg';
  return (
    <div className="rounded-lg bg-admin-input border border-admin-border-soft px-3 py-2">
      <div className="text-admin-fg-muted text-[0.65rem] font-montserrat uppercase tracking-wider">
        {label}
      </div>
      <div
        className={cn(
          'font-[--font-bodoni] text-seu-subheading leading-none mt-1 tabular-nums',
          text
        )}
      >
        {value}
      </div>
    </div>
  );
}
