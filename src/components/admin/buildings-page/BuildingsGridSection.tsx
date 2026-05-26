'use client';

import {
  Building2,
  ChevronRight,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import BuildingCard from '@/components/admin/BuildingCard';
import StatusBadge from '@/components/admin/StatusBadge';
import { pickLocale } from '@/lib/i18n-helpers';
import type { Building, Project } from '@/model/types/api';
import EmptyState from './EmptyState';

const btnPrimary =
  'bg-gradient-to-b from-primary-green to-primary-green/85 text-white font-montserrat font-medium text-seu-caption px-4 py-2 rounded-lg shadow-md shadow-primary-green/25 hover:shadow-lg hover:shadow-primary-green/30 transition-all flex items-center gap-2 disabled:opacity-50';

interface BuildingsGridSectionProps {
  selectedProject: Project | undefined;
  buildings: Building[];
  loading: boolean;
  onAddBuilding: () => void;
  onEdit: (b: Building) => void;
  onDelete: (b: Building, e: React.MouseEvent) => void;
  onOpenProject: (id: string) => void;
  deletingId?: boolean;
}

export default function BuildingsGridSection({
  selectedProject,
  buildings,
  loading,
  onAddBuilding,
  onEdit,
  onDelete,
  onOpenProject,
  deletingId,
}: BuildingsGridSectionProps) {
  return (
    <section className="min-w-0">
      {!selectedProject ? (
        <EmptyState message="Pick a project to manage its buildings." />
      ) : loading ? (
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
                onClick={() => onOpenProject(selectedProject.id)}
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
              <button onClick={onAddBuilding} className={btnPrimary + ' mx-auto'}>
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
                        onEdit(b);
                      }}
                      className="bg-admin-card/95 border border-admin-border text-admin-fg-muted hover:text-admin-fg p-1.5 rounded-md backdrop-blur transition-colors"
                      title="Edit building"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={(e) => onDelete(b, e)}
                      disabled={deletingId}
                      className="bg-admin-card/95 border border-admin-border text-rose-400/80 hover:text-rose-300 p-1.5 rounded-md backdrop-blur transition-colors"
                      title="Delete building"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={onAddBuilding}
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
  );
}
