'use client';

import { useLocale } from 'next-intl';
import { OngoingProjectCard } from '@/components/landing/OngoingProjectCard';
import { useProjectsList } from '@/hooks/queries/use-projects';
import { pickLocale, type Locale } from '@/lib/i18n-helpers';
import { fileUrl } from '@/lib/file-url';

export default function OngoingSection() {
  const locale = useLocale() as Locale;
  const projectsQ = useProjectsList(
    { status: 'under_construction', isActive: true },
    { page: 1, limit: 12 }
  );

  const projects = projectsQ.data?.items ?? [];

  if (projectsQ.isLoading) return null;
  if (projects.length === 0) return null;

  return (
    <section className="bg-dark-green py-20">
      <div className="max-w-[1920px] mx-auto px-10">
        {/* Title */}
        <h2 className="font-bodoni text-seu-title text-white mb-12">Ongoing</h2>

        {/* Project Cards */}
        <div className="flex flex-col gap-8">
          {projects.map((project) => (
            <OngoingProjectCard
              key={project.id}
              name={pickLocale(project.name, locale)}
              location={
                project.location?.district ||
                project.location?.city ||
                project.location?.address
              }
              image={fileUrl(project.mainImage) || undefined}
              badge={project.isFeatured ? 'FEATURED' : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
