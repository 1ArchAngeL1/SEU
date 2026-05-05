'use client';

import Link from 'next/link';
import {
  Building2,
  FolderKanban,
  Home,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import StatCard from '@/components/admin/StatCard';
import StatusBadge from '@/components/admin/StatusBadge';
import { useAllProjects } from '@/hooks/queries/use-projects';
import { useUnitsList } from '@/hooks/queries/use-units';
import { pickLocale } from '@/lib/i18n-helpers';

export default function AdminDashboard() {
  const projectsQ = useAllProjects();
  const unitsQ = useUnitsList({}, { page: 1, limit: 100 });

  const projects = projectsQ.data ?? [];
  const units = unitsQ.data?.items ?? [];

  const totalProjects = projects.length;
  const totalUnits = unitsQ.data?.pagination.total ?? units.length;
  const totalAvailable = projects.reduce(
    (sum, p) => sum + (p.availableUnits ?? 0),
    0
  );
  const totalBuildings = projects.reduce(
    (sum, p) => sum + (p.totalBuildings ?? 0),
    0
  );

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of projects, buildings and units across SEU Development"
        badge={
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-seu-caption-sm font-montserrat text-emerald-300">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Projects"
          value={totalProjects}
          hint="All active developments"
          accent="default"
          icon={<FolderKanban className="size-5" />}
        />
        <StatCard
          label="Buildings"
          value={totalBuildings}
          hint="Across all projects"
          accent="sky"
          icon={<Building2 className="size-5" />}
        />
        <StatCard
          label="Total Units"
          value={totalUnits}
          hint="Apartments, commerce, parking"
          accent="default"
          icon={<Home className="size-5" />}
        />
        <StatCard
          label="Available"
          value={totalAvailable}
          hint="Ready to sell"
          accent="green"
          icon={<CheckCircle2 className="size-5" />}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Link
          href="/admin/projects"
          className="group block rounded-2xl border border-admin-border-soft bg-admin-card p-6 hover:border-primary-orange/40 hover:bg-admin-hover transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="size-12 rounded-xl bg-primary-orange/15 border border-primary-orange/30 grid place-items-center">
              <FolderKanban className="size-5 text-primary-orange" />
            </div>
            <ArrowRight className="size-5 text-admin-fg-muted group-hover:text-primary-orange group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-[--font-bodoni] text-seu-heading text-admin-fg mb-1">
            Projects
          </h3>
          <p className="font-montserrat text-seu-caption text-admin-fg-muted">
            Create and manage neighborhoods like SEU Varketili — set status,
            location, pricing.
          </p>
        </Link>

        <Link
          href="/admin/buildings"
          className="group block rounded-2xl border border-admin-border-soft bg-admin-card p-6 hover:border-primary-orange/40 hover:bg-admin-hover transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="size-12 rounded-xl bg-sky-500/15 border border-sky-500/30 grid place-items-center">
              <Building2 className="size-5 text-sky-300" />
            </div>
            <ArrowRight className="size-5 text-admin-fg-muted group-hover:text-sky-300 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-[--font-bodoni] text-seu-heading text-admin-fg mb-1">
            Buildings
          </h3>
          <p className="font-montserrat text-seu-caption text-admin-fg-muted">
            Define blocks, floor counts, and construction progress for each
            project.
          </p>
        </Link>
      </div>

      <div className="rounded-2xl border border-admin-border-soft bg-admin-card overflow-hidden">
        <div className="px-6 py-4 border-b border-admin-border-soft flex items-center justify-between">
          <div>
            <h2 className="font-[--font-bodoni] text-seu-subheading text-admin-fg">
              Recent projects
            </h2>
            <p className="font-montserrat text-seu-caption-sm text-admin-fg-muted mt-0.5">
              Most recently updated
            </p>
          </div>
          <Link
            href="/admin/projects"
            className="font-montserrat text-seu-caption-sm text-primary-orange hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {projectsQ.isLoading ? (
          <div className="p-10 text-center text-admin-fg-muted font-montserrat text-seu-caption">
            Loading projects…
          </div>
        ) : projects.length === 0 ? (
          <div className="p-10 text-center text-admin-fg-dim font-montserrat text-seu-caption">
            No projects yet. Click{' '}
            <span className="text-admin-fg">Projects</span> to create one.
          </div>
        ) : (
          <ul className="divide-y divide-admin-border-soft">
            {projects.slice(0, 5).map((p) => (
              <li
                key={p.id}
                className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-admin-hover transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span className="font-montserrat font-medium text-seu-body-sm text-admin-fg truncate">
                      {pickLocale(p.name)}
                    </span>
                    <StatusBadge status={p.status} />
                    {p.isFeatured && (
                      <span className="text-amber-300 text-seu-caption-sm font-montserrat">
                        ★ Featured
                      </span>
                    )}
                  </div>
                  <div className="font-montserrat text-seu-caption-sm text-admin-fg-muted truncate">
                    {p.location.address}
                  </div>
                </div>
                <div className="flex items-center gap-6 shrink-0 text-seu-caption-sm font-montserrat">
                  <div className="text-right">
                    <div className="text-admin-fg-muted">Units</div>
                    <div className="text-admin-fg font-medium">
                      {p.totalUnits ?? 0}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-admin-fg-muted">Available</div>
                    <div className="text-emerald-300 font-medium">
                      {p.availableUnits ?? 0}
                    </div>
                  </div>
                  <Link
                    href={`/admin/projects/${p.id}`}
                    className="text-primary-orange hover:underline flex items-center gap-1"
                  >
                    Open <TrendingUp className="size-3.5" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
