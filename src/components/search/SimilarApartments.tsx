'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ApartmentCard from '@/components/search/ApartmentCard';
import { usePublicUnitsList } from '@/hooks/queries/use-units';
import { visibleUnits } from '@/lib/visibility';
import { LIST, trackViewItemList } from '@/lib/analytics/events';

interface SimilarApartmentsProps {
  buildingId?: string;
  currentApartmentId?: string;
}

export function SimilarApartments({
  buildingId,
  currentApartmentId,
}: SimilarApartmentsProps) {
  const t = useTranslations('search');
  // Public list — nothing from a deactivated block or project comes back.
  const unitsQ = usePublicUnitsList(
    { building: buildingId, status: 'available' },
    { page: 1, limit: 9 }
  );

  const apartments = visibleUnits(unitsQ.data?.items ?? [])
    .filter((u) => u.id !== currentApartmentId)
    .slice(0, 8);

  const ids = apartments.map((a) => a.id).join(',');
  useEffect(() => {
    if (apartments.length > 0) trackViewItemList(apartments, LIST.similar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids]);

  if (!buildingId || apartments.length === 0) return null;

  return (
    <div className="mt-16 lg:mt-32 px-5 lg:px-10 pb-12 lg:pb-20">
      <h2 className="font-[--font-bodoni] font-normal text-seu-subheading text-site-fg mb-8">
        {t('similarApartments')}
      </h2>

      <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar">
        {apartments.map((apartment, i) => (
          <div key={apartment.id} className="shrink-0 w-64 lg:w-80">
            <ApartmentCard data={apartment} list={LIST.similar} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}
