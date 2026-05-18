'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowUpRight, Maximize2, Building2, Layers, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/navigation';
import { pickLocale } from '@/lib/i18n-helpers';
import { fileUrl } from '@/lib/file-url';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Unit, UnitStatus } from '@/model/types/api';

export type ApartmentCardProps = {
  className?: string;
  data: Unit;
  onClick?: () => void;
};

function statusBadgeClass(s: UnitStatus): string {
  if (s === 'available')
    return 'bg-primary-orange text-white border-primary-orange';
  if (s === 'reserved')
    return 'bg-amber-500/90 text-white border-amber-500';
  if (s === 'sold') return 'bg-rose-500/90 text-white border-rose-500';
  return 'bg-secondary-grey/40 text-pale-gray border-secondary-grey/60';
}

export default function ApartmentCard({
  className,
  data,
  onClick,
}: ApartmentCardProps) {
  const t = useTranslations('search');
  const projectName =
    typeof data.project === 'string' ? '' : pickLocale(data.project.name);

  function statusLabel(s: UnitStatus): string {
    if (s === 'available') return t('available');
    if (s === 'reserved') return t('reserved');
    if (s === 'sold') return t('sold');
    return t('notForSale');
  }
  const image = fileUrl(data.mainImage);

  return (
    <Link
      href={`/search/${data.id}`}
      onClick={onClick}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange/50 rounded-2xl"
    >
      <Card
        className={cn(
          'relative w-full h-[400px] lg:h-[480px] overflow-hidden p-0 rounded-2xl border border-site-border-soft bg-site-bg-card shadow-none transition-all duration-300 text-site-fg-strong flex flex-col site-card-glow',
          'hover:border-primary-orange/50 hover:shadow-lg hover:shadow-primary-orange/10 hover:-translate-y-1',
          className
        )}
      >
        {/* Top row: unit number + arrow */}
        <div className="relative z-10 flex items-start justify-between p-6">
          <div>
            <p className="font-montserrat text-seu-caption text-site-fg-dim uppercase tracking-wider mb-1.5">
              {t('apartment')}
            </p>
            <p className="font-bodoni text-seu-heading-lg text-site-fg-strong leading-none">
              #{data.unitNumber}
            </p>
          </div>
          <span className="size-11 rounded-full bg-site-bg-hover backdrop-blur-md border border-site-border-soft flex items-center justify-center text-site-fg-strong transition-all group-hover:bg-primary-orange group-hover:border-primary-orange group-hover:scale-110">
            <ArrowUpRight className="size-5" />
          </span>
        </div>

        {/* Centered floor-plan / main image */}
        <div className="relative flex-1 flex items-center justify-center px-6 pb-2 min-h-0">
          {image ? (
            <>
              <Image
                src={image}
                alt={`Apartment ${data.unitNumber}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
              />
              {/* Soft edge fade into card background */}
              <div className="site-vignette absolute inset-0 shadow-[inset_0_0_30px_12px_var(--site-bg-card)]" />
            </>
          ) : (
            <div className="size-32 rounded-full bg-site-bg-hover border border-site-border-soft flex items-center justify-center text-site-fg-dim">
              <ImageIcon className="size-10" />
            </div>
          )}
        </div>

        {/* Bottom block: project + block + availability + floor + size */}
        <div className="relative z-10 p-6 flex flex-wrap items-center gap-2">
          {projectName && (
            <Badge
              variant="outline"
              className="border-site-border-soft bg-site-bg-hover text-site-fg-strong normal-case tracking-normal text-seu-caption px-3 py-1"
            >
              {projectName}
            </Badge>
          )}
          <Badge
            variant="outline"
            className="border-site-border-soft bg-site-bg-hover text-site-fg-strong normal-case tracking-normal gap-1.5 text-seu-caption px-3 py-1 [&>svg]:size-4"
          >
            <Building2 />
            {t('block')} {data.block}
          </Badge>
          <Badge
            className={cn(
              'normal-case tracking-normal font-medium text-seu-caption px-3 py-1',
              statusBadgeClass(data.status)
            )}
          >
            {statusLabel(data.status)}
          </Badge>
          <Badge
            variant="outline"
            className="border-site-border-soft bg-site-bg-hover text-site-fg-strong normal-case tracking-normal gap-1.5 text-seu-caption px-3 py-1 [&>svg]:size-4"
          >
            <Layers />
            {data.floorNumber}
          </Badge>
          <Badge
            variant="outline"
            className="border-site-border-soft bg-site-bg-hover text-site-fg-strong normal-case tracking-normal gap-1.5 text-seu-caption px-3 py-1 [&>svg]:size-4"
          >
            <Maximize2 />
            {data.totalSize} m²
          </Badge>
        </div>
      </Card>
    </Link>
  );
}
