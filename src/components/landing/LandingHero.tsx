'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import ChooseApartment from '../ChooseApartment';
import { useAllProjects } from '@/hooks/queries/use-projects';
import { pickLocale } from '@/lib/i18n-helpers';
import { fileUrl } from '@/lib/file-url';
import { cn } from '@/lib/utils';
import type { Project } from '@/model/types/api';

const AUTO_CYCLE_MS = 6500;

const STATUS_LABELS: Record<string, string> = {
  planning: 'Planning',
  presale: 'Pre-sale',
  under_construction: 'Under construction',
  completed: 'Completed',
  sold_out: 'Sold out',
  archived: 'Archived',
};

/**
 * Pick the project that should headline the hero.
 *
 * 1. The first active, non-archived, **featured** project.
 * 2. Otherwise, the first active, non-archived project.
 * 3. Otherwise, undefined (renders the empty state).
 */
function pickHeroProject(projects: Project[] | undefined): Project | undefined {
  if (!projects || projects.length === 0) return undefined;
  const visible = projects.filter(
    (p) => p.isActive && p.status !== 'archived'
  );
  return visible.find((p) => p.isFeatured) ?? visible[0];
}

/**
 * Combine `mainImage` + `images[]` into a single, ordered gallery.
 * `mainImage` is always first; `images[]` is appended in declared order.
 * Empty / duplicate values are filtered out.
 */
function buildGallery(project: Project | undefined): string[] {
  if (!project) return [];
  const ordered = [project.mainImage, ...(project.images ?? [])].filter(
    (v): v is string => Boolean(v && v.trim())
  );
  return Array.from(new Set(ordered));
}

export default function LandingHero() {
  const router = useRouter();
  const projectsQ = useAllProjects();

  const project = useMemo(
    () => pickHeroProject(projectsQ.data),
    [projectsQ.data]
  );
  const gallery = useMemo(() => buildGallery(project), [project]);

  const [rawActive, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Derived: clamp to a valid index when the gallery changes.
  const active =
    gallery.length === 0
      ? 0
      : ((rawActive % gallery.length) + gallery.length) % gallery.length;

  // Auto-cycle through gallery images.
  useEffect(() => {
    if (paused || gallery.length <= 1) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % gallery.length);
    }, AUTO_CYCLE_MS);
    return () => window.clearInterval(id);
  }, [paused, gallery.length]);

  function go(delta: number) {
    if (gallery.length === 0) return;
    setPaused(true);
    setActive((i) => (i + delta + gallery.length) % gallery.length);
  }

  function pick(i: number) {
    setPaused(true);
    setActive(i);
  }

  function handleSearch() {
    router.push('/search');
  }

  return (
    <section
      className="relative h-[44rem] lg:h-[48rem] bg-dark-green overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background slideshow — one project, cycling through its images */}
      <div className="absolute inset-0">
        {gallery.map((src, i) => {
          const url = fileUrl(src);
          const isActive = i === active;
          return (
            <div
              key={`${project?.id ?? 'p'}-${i}`}
              className={cn(
                'absolute inset-0 transition-opacity duration-[1200ms] ease-out',
                isActive ? 'opacity-100' : 'opacity-0'
              )}
              aria-hidden={!isActive}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={
                  project
                    ? `${pickLocale(project.name)} — image ${i + 1}`
                    : ''
                }
                className={cn(
                  'absolute inset-0 w-full h-full object-cover transition-transform duration-[8000ms] ease-out',
                  isActive ? 'scale-105' : 'scale-100'
                )}
              />
            </div>
          );
        })}

        {gallery.length === 0 && (
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-black via-dark-green to-black" />
        )}

        {/* Overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-green via-dark-green/55 to-dark-green/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-green/70 via-dark-green/30 to-transparent" />
      </div>

      {/* Empty / loading state */}
      {!project && (
        <div className="relative z-10 h-full flex items-center justify-center">
          <span className="font-montserrat text-seu-body text-pale-gray/60">
            {projectsQ.isLoading
              ? 'Loading developments…'
              : 'No projects available yet.'}
          </span>
        </div>
      )}

      {project && (
        <>
          {/* Top-right slide counter */}
          {gallery.length > 1 && (
            <div className="absolute top-8 right-8 lg:right-12 z-10 hidden md:flex items-center gap-3 font-montserrat text-seu-caption-sm text-pale-gray/85">
              <span className="font-[--font-bodoni] text-seu-heading text-pale-gray tabular-nums">
                {String(active + 1).padStart(2, '0')}
              </span>
              <span className="text-pale-gray/40">/</span>
              <span className="text-pale-gray/60 tabular-nums">
                {String(gallery.length).padStart(2, '0')}
              </span>
            </div>
          )}

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-8 lg:p-12">
            <div className="mx-auto flex flex-col lg:flex-row items-end justify-between gap-8">
              {/* Project meta */}
              <div className="flex flex-col gap-3 max-w-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-pale-gray/10 border border-pale-gray/20 backdrop-blur font-montserrat text-[0.7rem] uppercase tracking-wider text-pale-gray/85">
                    {STATUS_LABELS[project.status] ?? project.status}
                  </span>
                  {project.isFeatured && (
                    <span className="px-3 py-1 rounded-full bg-primary-orange/20 border border-primary-orange/40 backdrop-blur font-montserrat text-[0.7rem] uppercase tracking-wider text-pale-gray">
                      Featured
                    </span>
                  )}
                </div>

                <h1 className="font-[--font-bodoni] text-seu-title lg:text-seu-title-xl text-white leading-none uppercase">
                  {pickLocale(project.name)}
                </h1>

                <div className="flex items-center gap-2 mt-1 font-montserrat text-seu-caption text-pale-gray/85">
                  <MapPin className="size-4 shrink-0" />
                  <span className="truncate">
                    {project.location.address}
                    {project.location.city && ` · ${project.location.city}`}
                  </span>
                </div>

                {/* Pagination dots + arrows */}
                {gallery.length > 1 && (
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2">
                      {gallery.map((_src, index) => (
                        <button
                          key={`dot-${index}`}
                          onClick={() => pick(index)}
                          className={cn(
                            'h-1.5 rounded-full transition-all',
                            index === active
                              ? 'w-8 bg-primary-orange'
                              : 'w-2 bg-white/35 hover:bg-white/60'
                          )}
                          aria-label={`Show image ${index + 1}`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 ml-1">
                      <button
                        type="button"
                        onClick={() => go(-1)}
                        className="size-8 rounded-full border border-pale-gray/25 hover:border-pale-gray/60 hover:bg-pale-gray/10 grid place-items-center text-pale-gray/85 transition-colors"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => go(1)}
                        className="size-8 rounded-full border border-pale-gray/25 hover:border-pale-gray/60 hover:bg-pale-gray/10 grid place-items-center text-pale-gray/85 transition-colors"
                        aria-label="Next image"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Filter card */}
              <ChooseApartment
                onSearch={handleSearch}
                onReset={() => undefined}
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
