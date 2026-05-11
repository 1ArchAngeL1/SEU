'use client';

import { useTranslations } from 'next-intl';
import { ArrowLeft, FileText } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';

export function ApartmentDetailHeader() {
  const t = useTranslations('search');
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-8 lg:mb-12">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 rounded-full border border-site-border-soft bg-transparent text-site-fg font-montserrat text-seu-caption px-4 lg:px-5 h-9 hover:bg-site-bg-hover hover:border-site-fg transition-colors"
      >
        <ArrowLeft className="size-3" />
        <span className="hidden sm:inline">{t('back')}</span>
      </button>

      <span className="hidden sm:block font-montserrat text-seu-caption text-site-fg/40 tracking-[0.2rem] uppercase">
        {t('floorPlan')}
      </span>

      <button
        type="button"
        className="inline-flex items-center gap-2 lg:gap-2.5 rounded-lg bg-navy-green hover:bg-navy-green/80 border border-site-border-soft text-site-fg font-montserrat text-seu-caption-sm lg:text-seu-caption px-3 lg:px-5 h-9 lg:h-10 transition-colors"
      >
        <FileText className="size-4" />
        <span className="hidden sm:inline">{t('seePresentation')}</span>
        <span className="sm:hidden">{t('pdf')}</span>
      </button>
    </div>
  );
}

interface ApartmentMetaHeaderProps {
  block: string;
  floor: number;
  apartmentNumber: string | number;
}

export function ApartmentMetaHeader({
  block,
  floor,
  apartmentNumber,
}: ApartmentMetaHeaderProps) {
  const t = useTranslations('search');
  return (
    <>
      {/* Block & Floor — inline label + serif value */}
      <div className="flex items-baseline gap-8 lg:gap-12 mb-6 lg:mb-8">
        <div className="flex items-baseline gap-3">
          <span className="font-montserrat text-seu-body text-site-fg/50">
            {t('block')}
          </span>
          <span className="font-[--font-bodoni] font-normal text-seu-heading-lg text-site-fg leading-none">
            {block}
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="font-montserrat text-seu-body text-site-fg/50">
            {t('floor')}
          </span>
          <span className="font-[--font-bodoni] font-normal text-seu-heading-lg text-site-fg leading-none">
            {floor}
          </span>
        </div>
      </div>

      {/* Apartment Number — larger serif */}
      <div className="flex items-baseline gap-4 mb-10">
        <span className="font-montserrat text-seu-body text-site-fg/50">
          {t('apartmentN')}
        </span>
        <span className="font-[--font-bodoni] font-normal text-seu-title text-site-fg leading-none">
          {apartmentNumber}
        </span>
      </div>
    </>
  );
}
