'use client';

import { useLocale, useTranslations } from 'next-intl';
import { OngoingProjectCard } from '@/components/landing/OngoingProjectCard';
import { useProjectsList } from '@/hooks/queries/use-projects';
import { pickLocalized, type Locale } from '@/lib/i18n-helpers';
import { fileUrl } from '@/lib/file-url';
import FadeIn from '@/components/FadeIn';

export default function OngoingSection() {
  const t = useTranslations('landing');
  const locale = useLocale() as Locale;
  const projectsQ = useProjectsList(
    { status: 'under_construction', isActive: true },
    { page: 1, limit: 12 }
  );

  const projects = projectsQ.data?.items ?? [];

  if (projectsQ.isLoading) return null;
  if (projects.length === 0) return null;

  return (
    <section className="relative bg-site-bg py-20 site-noise">
      <div className="max-w-[1920px] mx-auto px-5 lg:px-10">
        {/* Title */}
        <FadeIn>
          <h2 className="font-bodoni text-seu-heading lg:text-seu-title text-site-fg-strong mb-8 lg:mb-12">{t('ongoing')}</h2>
        </FadeIn>

        {/* Project Cards */}
        <div className="flex flex-col gap-8">
          {projects.map((project, i) => (
            <FadeIn key={project.id} delay={i * 150} duration={800}>
              <OngoingProjectCard
                name={pickLocalized(project.nameEn, project.nameKa, locale)}
                location={
                  pickLocalized(project.location?.districtEn, project.location?.districtKa, locale) ||
                  pickLocalized(project.location?.cityEn, project.location?.cityKa, locale) ||
                  pickLocalized(project.location?.addressEn, project.location?.addressKa, locale)
                }
                image={fileUrl(project.mainImage) || undefined}
                badge={project.isFeatured ? 'FEATURED' : undefined}
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
