'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useProjectsList } from '@/hooks/queries/use-projects';
import { pickLocalized, type Locale } from '@/lib/i18n-helpers';
import { fileUrl } from '@/lib/file-url';
import FadeIn from '@/components/FadeIn';
import type { Project } from '@/model/types/api';

function FinishedTile({ project, locale }: { project: Project; locale: Locale }) {
  const t = useTranslations('landing');
  const name = pickLocalized(project.nameEn, project.nameKa, locale);
  const location =
    pickLocalized(project.location?.districtEn, project.location?.districtKa, locale) ||
    pickLocalized(project.location?.cityEn, project.location?.cityKa, locale) ||
    pickLocalized(project.location?.addressEn, project.location?.addressKa, locale);
  const image = fileUrl(project.mainImage) || undefined;

  return (
    <div className="group relative w-full aspect-[4/3] rounded-xl lg:rounded-2xl overflow-hidden border border-site-border-soft hover:border-primary-green/20 hover-lift transition-colors duration-500">
      {/* Rectangular image */}
      {image ? (
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-black via-site-bg to-navy-green" />
      )}

      {/* Legibility overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

      {/* Featured badge */}
      {project.isFeatured && (
        <div className="absolute top-3 right-3 lg:top-4 lg:right-4">
          <span className="px-2.5 py-0.5 lg:px-3 lg:py-1 bg-primary-green text-white text-seu-caption-sm font-montserrat font-medium rounded">
            FEATURED
          </span>
        </div>
      )}

      {/* Name + location */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 lg:p-6">
        <h3 className="font-bodoni text-seu-body sm:text-seu-subheading lg:text-seu-heading text-white leading-tight line-clamp-2">
          {name}
        </h3>
        {location && (
          <p className="mt-1 font-montserrat text-seu-caption-sm lg:text-seu-caption">
            <span className="text-secondary-grey">{t('locationLabel')} - </span>
            <span className="text-primary-green">{location}</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default function FinishedSection() {
  const t = useTranslations('landing');
  const locale = useLocale() as Locale;
  const projectsQ = useProjectsList(
    { status: 'completed', isActive: true },
    { page: 1, limit: 12 }
  );

  const projects = projectsQ.data?.items ?? [];

  if (projectsQ.isLoading) return null;
  if (projects.length === 0) return null;

  // Split into two columns (even indexes → left, odd → right). The right column
  // is nudged down so the tiles alternate in height like a chessboard.
  const left = projects.filter((_, i) => i % 2 === 0);
  const right = projects.filter((_, i) => i % 2 === 1);

  return (
    <section className="relative bg-site-bg py-20 site-noise">
      <div className="max-w-[1920px] mx-auto px-5 lg:px-10">
        {/* Title */}
        <FadeIn>
          <h2 className="font-bodoni text-seu-heading lg:text-seu-title text-site-fg-strong mb-8 lg:mb-12">
            {t('finished')}
          </h2>
        </FadeIn>

        {/* Chessboard / staggered grid of rectangular tiles */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
            {left.map((project, i) => (
              <FadeIn key={project.id} delay={i * 120} duration={700}>
                <FinishedTile project={project} locale={locale} />
              </FadeIn>
            ))}
          </div>
          <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-14 lg:mt-24">
            {right.map((project, i) => (
              <FadeIn key={project.id} delay={i * 120} duration={700}>
                <FinishedTile project={project} locale={locale} />
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
