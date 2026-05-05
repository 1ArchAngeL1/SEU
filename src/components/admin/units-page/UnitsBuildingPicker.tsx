'use client';

import { Loader2, Building2, Search, MapPin } from 'lucide-react';
import BuildingCard from '@/components/admin/BuildingCard';
import { Input } from '@/components/ui/input';
import { pickLocale } from '@/lib/i18n-helpers';
import { cn } from '@/lib/utils';
import type { Building, Project } from '@/model/types/api';

export default function UnitsBuildingPicker({
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
                        ? 'border-primary-orange bg-primary-orange/5'
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
