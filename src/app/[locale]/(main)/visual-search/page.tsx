'use client';

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import ContactForm from '@/components/ContactForm';
import ContactPanel from '@/components/ContactPanel';
import { useProjectsList } from '@/hooks/queries/use-projects';
import { type Locale, pickLocale } from '@/lib/i18n-helpers';
import { fileUrl } from '@/lib/file-url';

export default function VisualSearchPage() {
  const locale = useLocale() as Locale;
  const t = useTranslations('landing');
  const tStatus = useTranslations('status');
  const projectsQ = useProjectsList({ isActive: true }, { page: 1, limit: 50 });

  const projects = projectsQ.data?.items ?? [];

  return (
    <main className="bg-dark-green min-h-screen">
      {/* Page title */}
      <div className="px-5 lg:px-10 pt-6 lg:pt-8 pb-1 lg:pb-2 max-w-[1920px] mx-auto">
        <h1 className="font-bodoni text-seu-heading lg:text-seu-title text-pale-gray uppercase tracking-wide">
          Choose Project
        </h1>
      </div>

      {projectsQ.isLoading && (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="size-8 text-primary-orange animate-spin" />
        </div>
      )}

      {!projectsQ.isLoading && projects.length === 0 && (
        <p className="text-secondary-grey font-montserrat text-seu-body py-32 text-center">
          No projects available.
        </p>
      )}

      {/* Project cards — full width, stacked */}
      <div className="flex flex-col">
        {projects.map((project) => {
          const image = fileUrl(project.mainImage);
          const name = pickLocale(project.name, locale);
          const location =
            project.location?.district ||
            project.location?.city ||
            '';
          const totalUnits = project.totalUnits;
          const availableUnits = project.availableUnits;
          const totalBuildings = project.totalBuildings;

          return (
            <Link
              key={project.id}
              href={`/visual-search/${project.id}`}
              className="group relative block w-full h-[60vh] lg:h-[85vh] overflow-hidden"
            >
              {/* Full-bleed image */}
              {image ? (
                <Image
                  src={image}
                  alt={name}
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-secondary-black via-dark-green to-navy-green" />
              )}

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
              {/* Smooth fade edges into dark-green background */}
              <div className="absolute inset-x-0 top-0 h-32 lg:h-40 bg-gradient-to-b from-dark-green via-dark-green/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-32 lg:h-40 bg-gradient-to-t from-dark-green via-dark-green/60 to-transparent" />
              <div className="absolute inset-y-0 left-0 w-16 lg:w-24 bg-gradient-to-r from-dark-green to-transparent" />
              <div className="absolute inset-y-0 right-0 w-16 lg:w-24 bg-gradient-to-l from-dark-green to-transparent" />

              {/* Status badge — top left */}
              <div className="absolute top-5 left-5 lg:top-8 lg:left-10 z-10">
                <span className="inline-block font-montserrat font-medium text-seu-caption-sm lg:text-seu-caption text-pale-gray bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5 uppercase tracking-wider">
                  {tStatus(project.status)}
                </span>
              </div>

              {/* Bottom content bar */}
              <div className="absolute bottom-0 left-0 right-0 px-5 lg:px-10 pb-6 lg:pb-10 flex items-end justify-between gap-4">
                {/* Left — project name */}
                <div>
                  <h2 className="font-bodoni text-seu-body-lg lg:text-seu-heading-lg text-pale-gray leading-none uppercase">
                    {name}
                  </h2>
                </div>

                {/* Right — project info */}
                <div className="flex items-center gap-6 lg:gap-10 shrink-0">
                  {location && (
                    <div className="hidden sm:block">
                      <p className="font-montserrat text-[0.65rem] lg:text-seu-caption-sm text-secondary-grey uppercase tracking-wider mb-0.5">
                        Location
                      </p>
                      <p className="font-montserrat font-medium text-seu-caption-sm lg:text-seu-caption text-pale-gray uppercase">
                        {location}
                      </p>
                    </div>
                  )}
                  {project.minSizeApartment != null && (
                    <div className="hidden sm:block">
                      <p className="font-montserrat text-[0.65rem] lg:text-seu-caption-sm text-secondary-grey uppercase tracking-wider mb-0.5">
                        Sizes
                      </p>
                      <p className="font-montserrat font-medium text-seu-caption-sm lg:text-seu-caption text-pale-gray">
                        {project.minSizeApartment}–{project.maxSizeApartment ?? '?'} m²
                      </p>
                    </div>
                  )}
                  {totalBuildings != null && totalBuildings > 0 && (
                    <div className="hidden lg:block">
                      <p className="font-montserrat text-[0.65rem] lg:text-seu-caption-sm text-secondary-grey uppercase tracking-wider mb-0.5">
                        Buildings
                      </p>
                      <p className="font-montserrat font-medium text-seu-caption-sm lg:text-seu-caption text-pale-gray">
                        {totalBuildings}
                      </p>
                    </div>
                  )}
                  {totalUnits != null && totalUnits > 0 && (
                    <div className="hidden lg:block">
                      <p className="font-montserrat text-[0.65rem] lg:text-seu-caption-sm text-secondary-grey uppercase tracking-wider mb-0.5">
                        Apartments
                      </p>
                      <p className="font-montserrat font-medium text-seu-caption-sm lg:text-seu-caption text-pale-gray">
                        {availableUnits != null
                          ? `${availableUnits} / ${totalUnits}`
                          : totalUnits}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Contact section */}
      <div className="bg-dark-green px-5 lg:px-10 py-12 lg:py-20">
        <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <ContactForm className="max-w-xl" />
          <ContactPanel className="max-w-xl lg:justify-self-end" />
        </div>
      </div>
    </main>
  );
}
