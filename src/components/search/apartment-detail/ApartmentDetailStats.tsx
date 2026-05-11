'use client';

import { useTranslations } from 'next-intl';

interface ApartmentDetailStatsProps {
  totalSize: number;
  mainSize: number;
  openSpace: number;
  rooms: number;
}

interface StatCellProps {
  label: string;
  value: string | number;
}

function StatCell({ label, value }: StatCellProps) {
  return (
    <div className="flex flex-col">
      <p className="font-montserrat text-seu-caption text-site-fg-dim mb-1.5">
        {label}
      </p>
      <p className="font-montserrat font-medium text-seu-body-lg text-site-fg">
        {value}
      </p>
    </div>
  );
}

export function ApartmentDetailStats({
  totalSize,
  mainSize,
  openSpace,
  rooms,
}: ApartmentDetailStatsProps) {
  const t = useTranslations('search');
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-6 mb-8">
      <StatCell label={t('totalSize')} value={`${totalSize} ${t('sqm')}`} />
      <StatCell label={t('mainSize')} value={`${mainSize} ${t('sqm')}`} />
      <StatCell label={t('openSpace')} value={`${openSpace} ${t('sqm')}`} />
      <StatCell label={t('bedroom')} value={rooms} />
    </div>
  );
}
