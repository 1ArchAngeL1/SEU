'use client';

import {
  Pencil,
  Trash2,
  ArrowRight,
  MapPin,
  Building2,
  Star,
} from 'lucide-react';
import StatusBadge from '@/components/admin/StatusBadge';
import { pickLocale } from '@/lib/i18n-helpers';
import { fileUrl } from '@/lib/file-url';
import { cn } from '@/lib/utils';
import type { Project } from '@/model/types/api';

export default function ProjectCard({
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
    <div className="group/card relative rounded-2xl border border-admin-border-soft bg-admin-card overflow-hidden hover:border-primary-orange/40 hover:shadow-admin-lg transition-all">
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
                  className="h-full bg-gradient-to-r from-primary-orange to-primary-orange/70 transition-all"
                  style={{ width: `${occupancy}%` }}
                />
              </div>
            </div>
          )}
          <div className="flex items-center justify-between pt-1 border-t border-admin-border-soft">
            <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted pt-3">
              Open project
            </span>
            <ArrowRight className="size-3.5 text-primary-orange mt-3 group-hover/card:translate-x-1 transition-transform" />
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
