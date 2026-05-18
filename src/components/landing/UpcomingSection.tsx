'use client';

import { useLocale, useTranslations } from 'next-intl';
import UpcomingProjectCard from './UpcomingProjectCard';
import { useProjectsList } from '@/hooks/queries/use-projects';
import { pickLocale, type Locale } from '@/lib/i18n-helpers';
import { fileUrl } from '@/lib/file-url';

function formatStartDate(iso: string | null | undefined): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export default function UpcomingSection() {
  const t = useTranslations('landing');
  const locale = useLocale() as Locale;
  const projectsQ = useProjectsList(
    { status: 'planning', isActive: true },
    { page: 1, limit: 12 }
  );

  const projects = projectsQ.data?.items ?? [];

  if (projectsQ.isLoading) return null;
  if (projects.length === 0) return null;

  return (
    <section className="relative bg-site-bg py-20 site-noise">
      <div className="max-w-[1920px] mx-auto px-5 lg:px-10">
        {/* Title */}
        <h2 className="font-bodoni text-seu-title text-site-fg-strong mb-12">
          {t('upcoming')}
        </h2>

        {/* Project Cards - Staggered Layout */}
        <div className="flex flex-col gap-12">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
            >
              <UpcomingProjectCard
                name={pickLocale(project.name, locale)}
                startDate={formatStartDate(
                  project.startDate ?? project.expectedCompletionDate
                )}
                image={fileUrl(project.mainImage) || undefined}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
