'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAllProjects } from '@/hooks/queries/use-projects';
import { pickLocale } from '@/lib/i18n-helpers';
import type { Project } from '@/model/types/api';

import HeroSlideshow from './hero/HeroSlideshow';
import HeroSlideCounter from './hero/HeroSlideCounter';
import HeroProjectMeta from './hero/HeroProjectMeta';
import HeroSearchCard from './hero/HeroSearchCard';
import HeroMobileContent from './hero/HeroMobileContent';

const AUTO_CYCLE_MS = 6500;

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
  const t = useTranslations('landing');
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

  const onPrev = () => go(-1);
  const onNext = () => go(1);

  return (
    <section
      className="relative h-dvh lg:h-[48rem] bg-dark-green overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <HeroSlideshow
        gallery={gallery}
        active={active}
        projectId={project?.id}
        projectName={project ? pickLocale(project.name) : undefined}
      />

      {/* Empty / loading state */}
      {!project && (
        <div className="relative z-10 h-full flex items-center justify-center">
          <span className="font-montserrat text-seu-body text-pale-gray/60">
            {projectsQ.isLoading
              ? t('loadingDevelopments')
              : t('noProjects')}
          </span>
        </div>
      )}

      {project && (
        <>
          <HeroSlideCounter active={active} total={gallery.length} />

          {/* Mobile: Visual search button — centered */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center lg:hidden animate-[fadeInUp_0.9s_cubic-bezier(0.16,1,0.3,1)_0.5s_both]">
            <Link
              href="/visual-search"
              className="flex flex-col items-center gap-2"
            >
              <span className="font-montserrat font-medium text-seu-caption text-pale-gray">
                {t('visualSearch')}
              </span>
              <div className="size-16 rounded-full border border-pale-gray/30 bg-dark-green/50 backdrop-blur flex items-center justify-center">
                <Image
                  src="/common/svgs/Group 169.svg"
                  alt="Visual search"
                  width={32}
                  height={28}
                />
              </div>
            </Link>
          </div>

          <HeroProjectMeta
            project={project}
            gallery={gallery}
            active={active}
            onDotClick={pick}
            onPrev={onPrev}
            onNext={onNext}
          />

          <HeroSearchCard />

          <HeroMobileContent
            project={project}
            gallery={gallery}
            active={active}
            onDotClick={pick}
            onPrev={onPrev}
            onNext={onNext}
          />
        </>
      )}
    </section>
  );
}
