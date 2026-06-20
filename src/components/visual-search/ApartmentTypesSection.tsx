'use client';

import { ChevronRight, ImageIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useApartmentTypesByProject } from '@/hooks/queries/use-apartment-types';
import { pickLocalized, type Locale } from '@/lib/i18n-helpers';
import { fileUrl } from '@/lib/file-url';
import type { ApartmentType } from '@/model/types/api';

function formatSize(from: number, to: number): string {
  if (from === to) return `${from} M2`;
  return `${from}-${to} M2`;
}

function searchHref(projectId: string, t: ApartmentType): string {
  const params = new URLSearchParams();
  params.set('project', projectId);
  params.set('bedrooms', String(t.bedrooms));
  if (t.bedrooms === 0) params.set('type', 'living');
  return `/search?${params.toString()}`;
}

interface ApartmentTypesSectionProps {
  projectId: string;
}

export function ApartmentTypesSection({ projectId }: ApartmentTypesSectionProps) {
  const locale = useLocale() as Locale;
  const tSearch = useTranslations('search');
  const { data, isLoading } = useApartmentTypesByProject(projectId);

  const items = (data ?? []).filter((t) => t.isActive !== false);

  if (!isLoading && items.length === 0) return null;

  function defaultName(t: ApartmentType): string {
    if (t.bedrooms === 0) return tSearch('studio');
    const key = t.bedrooms === 1 ? 'bedroomOne' : 'bedroomMany';
    return tSearch(key, { count: t.bedrooms });
  }

  return (
    <div className="bg-dark-green px-5 lg:px-10 py-12 lg:py-20">
      <div className="max-w-[1920px] mx-auto">
        <h2 className="font-bodoni text-seu-subheading lg:text-seu-heading text-pale-gray mb-8 lg:mb-12">
          {tSearch('apartmentTypes')}
        </h2>

        <ul className="divide-y divide-pale-gray/10">
          {items.map((type) => {
            const image = fileUrl(type.image);
            const label = pickLocalized(type.nameEn, type.nameKa, locale) || defaultName(type);
            const size = formatSize(type.sizeFrom, type.sizeTo);
            const href = searchHref(projectId, type);

            return (
              <li key={type.id}>
                <Link
                  href={href}
                  className="group grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_1fr_auto] items-center gap-4 sm:gap-8 py-4 sm:py-5"
                >
                  <div className="size-16 sm:size-20 rounded-md bg-secondary-black/50 border border-pale-gray/10 overflow-hidden flex items-center justify-center shrink-0">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image}
                        alt={label}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="size-6 text-secondary-grey/60" strokeWidth={1.5} />
                    )}
                  </div>

                  <p className="font-montserrat text-seu-body-sm sm:text-seu-body text-pale-gray sm:text-center">
                    {label}
                  </p>

                  <p className="hidden sm:block font-montserrat text-seu-body-sm sm:text-seu-body text-pale-gray text-center">
                    {size}
                  </p>

                  <span className="size-10 rounded-full border border-secondary-grey/40 flex items-center justify-center text-pale-gray group-hover:border-pale-gray group-hover:bg-pale-gray/5 transition-colors shrink-0">
                    <ChevronRight className="size-4" />
                  </span>
                </Link>
                <p className="sm:hidden font-montserrat text-seu-caption text-secondary-grey -mt-3 mb-3 pl-20">
                  {size}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
