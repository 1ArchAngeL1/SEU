'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  addProject,
  getProjectsPaged,
  updateProject,
  removeProject,
} from '@/prisma/project';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ProjectForm from '@/components/admin/forms/ProjectForm';
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

type ProjectItem = {
  id: string;
  name: string;
  address: string;
  createdAt: Date;
};

export default function ProjectsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [rev, setRev] = useState(0);
  const [data, setData] = useState<{
    items: ProjectItem[];
    totalPages: number;
  }>({ items: [], totalPages: 1 });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectItem | null>(null);

  useEffect(() => {
    getProjectsPaged({ page, pageSize: 10 }).then((res) => {
      setData({ items: res.items as ProjectItem[], totalPages: res.totalPages });
    });
  }, [page, rev]);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(project: ProjectItem) {
    setEditing(project);
    setDialogOpen(true);
  }

  async function handleSubmit(formData: { name: string; address: string }) {
    if (editing) {
      await updateProject(editing.id, formData);
    } else {
      await addProject(formData);
    }
    setDialogOpen(false);
    setEditing(null);
    setRev((r) => r + 1);
  }

  async function handleRemove(id: string) {
    if (!confirm('Delete this project and all its buildings/apartments?'))
      return;
    await removeProject(id);
    setRev((r) => r + 1);
  }

  return (
    <div>
      <AdminPageHeader
        title="Projects"
        description="Manage building projects"
        action={
          <button onClick={openCreate} className={btnPrimary}>
            <Plus className="size-4" />
            New Project
          </button>
        }
      />

      <div className="overflow-x-auto rounded-lg border border-secondary-black">
        <table className="w-full text-seu-caption font-montserrat">
          <thead>
            <tr className="bg-secondary-black/40 text-left text-secondary-grey">
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Address</th>
              <th className="p-3 font-medium">Created</th>
              <th className="p-3 font-medium w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.items.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-6 text-center text-secondary-grey/60"
                >
                  No projects yet
                </td>
              </tr>
            ) : (
              data.items.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-secondary-black hover:bg-secondary-black/20 transition-colors cursor-pointer"
                  onClick={() => router.push(`/admin/buildings?project=${p.id}`)}
                >
                  <td className="p-3 text-pale-gray">{p.name}</td>
                  <td className="p-3 text-pale-gray/70">{p.address}</td>
                  <td className="p-3 text-pale-gray/50">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(p);
                        }}
                        className="text-secondary-grey hover:text-pale-gray transition-colors"
                        title="Edit"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(p.id);
                        }}
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
              {editing ? 'Edit Project' : 'New Project'}
            </DialogTitle>
          </DialogHeader>
          <ProjectForm
            initialData={
              editing
                ? { name: editing.name, address: editing.address }
                : undefined
            }
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            submitLabel={editing ? 'Update' : 'Create'}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
