'use client';

import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Loader2, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useProjectsList } from '@/hooks/queries/use-projects';
import { pickLocale, type Locale } from '@/lib/i18n-helpers';
import { fileUrl } from '@/lib/file-url';

export default function VisualSearchPage() {
  const locale = useLocale() as Locale;
  const projectsQ = useProjectsList(
    { isActive: true },
    { page: 1, limit: 50 }
  );

  const projects = projectsQ.data?.items ?? [];

  return (
    <main className="bg-dark-green min-h-dvh py-20">
      <div className="max-w-[1920px] mx-auto px-10">
        <h1 className="font-bodoni text-seu-title text-white mb-4">
          Visual Search.
        </h1>
        <p className="font-montserrat text-seu-body text-secondary-grey mb-16 max-w-xl">
          Choose a project to explore its buildings and apartments visually.
        </p>

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

        <div className="flex flex-col gap-8">
          {projects.map((project) => {
            const image = fileUrl(project.mainImage);
            const name = pickLocale(project.name, locale);
            const location =
              project.location?.district ||
              project.location?.city ||
              project.location?.address ||
              '';

            return (
              <Link
                key={project.id}
                href={`/visual-search/${project.id}`}
                className="group block"
              >
                <div className="relative h-[500px] rounded-2xl overflow-hidden border border-pale-gray/10 hover:border-primary-orange/50 transition-all">
                  {/* Image or placeholder */}
                  {image ? (
                    <Image
                      src={image}
                      alt={name}
                      fill
                      sizes="100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary-black via-dark-green to-navy-green" />
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between">
                    <div>
                      {location && (
                        <p className="font-montserrat text-seu-caption text-secondary-grey mb-2">
                          {location}
                        </p>
                      )}
                      <h3 className="font-bodoni text-seu-heading-lg text-white">
                        {name}
                      </h3>
                    </div>
                    <span className="size-12 rounded-full border border-pale-gray/20 flex items-center justify-center text-pale-gray group-hover:bg-primary-orange group-hover:border-primary-orange group-hover:text-white transition-all shrink-0">
                      <ArrowRight className="size-5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
