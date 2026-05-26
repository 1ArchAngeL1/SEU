'use client';

import { Building2, Loader2, MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { pickLocale } from '@/lib/i18n-helpers';
import { cn } from '@/lib/utils';
import type { Project } from '@/model/types/api';

interface ProjectPickerRailProps {
  projects: Project[];
  filteredProjects: Project[];
  selectedProjectId: string;
  onSelect: (id: string) => void;
  search: string;
  onSearchChange: (v: string) => void;
  loading: boolean;
}

export default function ProjectPickerRail({
  projects,
  filteredProjects,
  selectedProjectId,
  onSelect,
  search,
  onSearchChange,
  loading,
}: ProjectPickerRailProps) {
  return (
    <aside className="space-y-3">
      <div className="relative">
        <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-admin-fg-dim z-10 pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
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

        {loading ? (
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
                    onClick={() => onSelect(p.id)}
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
  );
}
