'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import {
  createBuilding,
  getBuildingsPaged,
  updateBuilding,
  removeBuilding,
} from '@/prisma/building';
import { getAllProjects } from '@/prisma/project';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import BuildingForm from '@/components/admin/forms/BuildingForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const btnPrimary =
  'bg-primary-green text-white font-montserrat font-medium text-seu-caption px-4 py-2 rounded-lg hover:bg-primary-green/85 transition-colors flex items-center gap-2';
const btnPage =
  'px-3 py-1.5 border border-secondary-black rounded-lg text-seu-caption-sm text-pale-gray disabled:opacity-30 hover:bg-secondary-black/40 transition-colors';
const selectClass =
  'bg-secondary-black/40 border border-secondary-black text-pale-gray rounded-lg px-3 py-2 text-seu-caption focus:outline-none focus:border-pale-gray/40 transition-colors';

type BuildingItem = {
  id: string;
  block: string;
  floorCount: number;
  projectId: string;
  createdAt: Date;
  project: { name: string };
};

export default function BuildingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectFilter = searchParams.get('project') ?? '';

  const [page, setPage] = useState(1);
  const [rev, setRev] = useState(0);
  const [data, setData] = useState<{
    items: BuildingItem[];
    totalPages: number;
  }>({ items: [], totalPages: 1 });
  const [projects, setProjects] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [filterProject, setFilterProject] = useState(projectFilter);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BuildingItem | null>(null);

  useEffect(() => {
    getAllProjects().then(setProjects);
  }, []);

  useEffect(() => {
    getBuildingsPaged({ page, pageSize: 10 }).then((res) => {
      let items = res.items as BuildingItem[];
      if (filterProject) {
        items = items.filter((b) => b.projectId === filterProject);
      }
      setData({ items, totalPages: res.totalPages });
    });
  }, [page, rev, filterProject]);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(building: BuildingItem) {
    setEditing(building);
    setDialogOpen(true);
  }

  async function handleSubmit(formData: {
    projectId: string;
    block: string;
    floorCount: number;
  }) {
    if (editing) {
      await updateBuilding(editing.id, {
        block: formData.block,
        floorCount: formData.floorCount,
      });
    } else {
      await createBuilding(formData);
    }
    setDialogOpen(false);
    setEditing(null);
    setRev((r) => r + 1);
  }

  async function handleRemove(id: string) {
    if (!confirm('Delete this building and all its apartments?')) return;
    await removeBuilding(id);
    setRev((r) => r + 1);
  }

  return (
    <div>
      <AdminPageHeader
        title="Buildings"
        description="Manage building blocks within projects"
        action={
          <button onClick={openCreate} className={btnPrimary}>
            <Plus className="size-4" />
            New Building
          </button>
        }
      />

      <div className="mb-4">
        <select
          value={filterProject}
          onChange={(e) => {
            setFilterProject(e.target.value);
            setPage(1);
          }}
          className={selectClass}
        >
          <option value="">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-secondary-black">
        <table className="w-full text-seu-caption font-montserrat">
          <thead>
            <tr className="bg-secondary-black/40 text-left text-secondary-grey">
              <th className="p-3 font-medium">Project</th>
              <th className="p-3 font-medium">Block</th>
              <th className="p-3 font-medium">Floors</th>
              <th className="p-3 font-medium">Created</th>
              <th className="p-3 font-medium w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.items.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center text-secondary-grey/60"
                >
                  No buildings yet
                </td>
              </tr>
            ) : (
              data.items.map((b) => (
                <tr
                  key={b.id}
                  className="border-t border-secondary-black hover:bg-secondary-black/20 transition-colors"
                >
                  <td className="p-3 text-pale-gray">{b.project.name}</td>
                  <td className="p-3 text-pale-gray">Block {b.block}</td>
                  <td className="p-3 text-pale-gray/70">{b.floorCount}</td>
                  <td className="p-3 text-pale-gray/50">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          router.push(`/admin/buildings/${b.id}`)
                        }
                        className="text-primary-green/80 hover:text-primary-green transition-colors"
                        title="Chess / Story View"
                      >
                        <Eye className="size-4" />
                      </button>
                      <button
                        onClick={() => openEdit(b)}
                        className="text-secondary-grey hover:text-pale-gray transition-colors"
                        title="Edit"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => handleRemove(b.id)}
                        className="text-red/60 hover:text-red transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data.totalPages > 1 && (
        <div className="flex gap-3 mt-6 items-center justify-center">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className={btnPage}
          >
            Prev
          </button>
          <span className="text-seu-caption-sm text-secondary-grey">
            {page} / {data.totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(data.totalPages, page + 1))}
            disabled={page === data.totalPages}
            className={btnPage}
          >
            Next
          </button>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-dark-green border-secondary-black">
          <DialogHeader>
            <DialogTitle className="text-pale-gray font-[--font-bodoni]">
              {editing ? 'Edit Building' : 'New Building'}
            </DialogTitle>
          </DialogHeader>
          <BuildingForm
            initialData={
              editing
                ? {
                    projectId: editing.projectId,
                    block: editing.block,
                    floorCount: editing.floorCount,
                  }
                : undefined
            }
            fixedProjectId={editing ? editing.projectId : undefined}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            submitLabel={editing ? 'Update' : 'Create'}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
