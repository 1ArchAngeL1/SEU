'use client';

import { use, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ApartmentDetailView } from '@/components/search/ApartmentDetailView';
import { Benefits } from '@/components/search/Benefits';
import { SimilarApartments } from '@/components/search/SimilarApartments';
import { SearchContactForm } from '@/components/search/SearchContactForm';
import { useUnit } from '@/hooks/queries/use-units';
import { useActiveProjectIds } from '@/hooks/queries/use-projects';
import { useBuilding } from '@/hooks/queries/use-buildings';
import { unitsService } from '@/service/units.service';
import { pickLocalized, type Locale } from '@/lib/i18n-helpers';
import { fileUrl } from '@/lib/file-url';
import { isUnitVisible, refId } from '@/lib/visibility';

export default function ApartmentDetailPage({
  params,
}: {
  params: Promise<{ apartment: string }>;
}) {
  const { apartment: id } = use(params);
  const locale = useLocale() as Locale;
  const tCommon = useTranslations('common');
  const unitQ = useUnit(id);
  const {
    ids: activeProjectIds,
    isLoading: projectsLoading,
    isResolved,
  } = useActiveProjectIds();

  const unit = unitQ.data;
  const buildingId = refId(unit?.building);
  // `unit.building` may be a bare id, which carries no Active flag — fetch the
  // block so a deactivated one is caught on a direct link too.
  const buildingQ = useBuilding(buildingId);

  // Gone from the public site once the unit, its block or its project is
  // switched off in the admin panel.
  const hidden =
    (unit != null && isResolved && !isUnitVisible(unit, activeProjectIds)) ||
    (buildingQ.isSuccess && buildingQ.data.isActive === false);
  // Visibility is still being decided — don't count a view we may reject.
  const undecided = projectsLoading || buildingQ.isLoading;

  useEffect(() => {
    if (!id || !unit || hidden || undecided) return;
    unitsService.trackView(id).catch(() => {});
  }, [id, unit, hidden, undecided]);

  if (unitQ.isLoading || undecided) {
    return (
      <div className="bg-site-bg min-h-screen flex items-center justify-center">
        <span className="font-montserrat text-seu-body text-site-fg">
          {tCommon('loading')}
        </span>
      </div>
    );
  }

  if (!unit || hidden) notFound();

  const projectObj =
    typeof unit.project === 'string' ? null : unit.project;

  return (
    <div className="bg-site-bg min-h-screen py-10">
      <div className="flex flex-col mx-auto">
        <ApartmentDetailView
          apartment={{
            id: unit.id,
            complex: projectObj ? pickLocalized(projectObj.nameEn, projectObj.nameKa, locale) : '',
            block: unit.block,
            floor: unit.floorNumber,
            apartmentNumber: unit.unitNumber,
            totalSize: unit.totalSize,
            mainSize: unit.livableArea ?? unit.totalSize,
            openSpace: unit.balconySize ?? 0,
            rooms: unit.bedrooms ?? 0,
            roomDetails: (Array.isArray(unit.rooms) ? unit.rooms : [])
              .filter((r): r is NonNullable<typeof r> => r != null && typeof r === 'object')
              .map((r) => {
                const name = pickLocalized(r.nameEn, r.nameKa, locale);
                return {
                  ...(name && { name }),
                  type: r.type,
                  size: r.size ?? 0,
                };
              }),
            floorPlanImages: {
              plan: unit.mainImage
                ? fileUrl(unit.mainImage)
                : unit.floorPlanImage
                  ? fileUrl(unit.floorPlanImage)
                  : null,
              twoD: unit.twoDContent ? fileUrl(unit.twoDContent) : null,
              threeD: unit.threeDContent ? fileUrl(unit.threeDContent) : null,
            },
          }}
        />
        <Benefits />
        <SimilarApartments
          buildingId={buildingId}
          currentApartmentId={unit.id}
        />
        <SearchContactForm />
      </div>
    </div>
  );
}
