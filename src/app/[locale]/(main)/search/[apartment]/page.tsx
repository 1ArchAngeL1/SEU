'use client';

import { use, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { ApartmentDetailView } from '@/components/search/ApartmentDetailView';
import { Benefits } from '@/components/search/Benefits';
import { SimilarApartments } from '@/components/search/SimilarApartments';
import { SearchContactForm } from '@/components/search/SearchContactForm';
import { useUnit } from '@/hooks/queries/use-units';
import { unitsService } from '@/service/units.service';
import { pickLocale } from '@/lib/i18n-helpers';
import { fileUrl } from '@/lib/file-url';

type RoomIcon =
  | 'bedroom'
  | 'hall'
  | 'balcony'
  | 'bathroom'
  | 'kitchen'
  | 'storage'
  | 'living'
  | 'wc';

function nameToIcon(name: string): RoomIcon {
  const n = name.toLowerCase();
  if (n.includes('bed')) return 'bedroom';
  if (n.includes('living')) return 'living';
  if (n.includes('kitchen')) return 'kitchen';
  if (n.includes('bath') || n.includes('wc')) return 'bathroom';
  if (n.includes('balcon') || n.includes('terrace')) return 'balcony';
  if (n.includes('hall') || n.includes('corridor')) return 'hall';
  if (n.includes('storage')) return 'storage';
  return 'bedroom';
}

export default function ApartmentDetailPage({
  params,
}: {
  params: Promise<{ apartment: string }>;
}) {
  const { apartment: id } = use(params);
  const unitQ = useUnit(id);

  useEffect(() => {
    if (id) {
      unitsService.trackView(id).catch(() => {});
    }
  }, [id]);

  if (unitQ.isLoading) {
    return (
      <div className="bg-dark-green min-h-screen flex items-center justify-center">
        <span className="font-montserrat text-seu-body text-pale-gray">
          Loading…
        </span>
      </div>
    );
  }

  const unit = unitQ.data;
  if (!unit) notFound();

  const buildingObj =
    typeof unit.building === 'string' ? null : unit.building;
  const projectObj =
    typeof unit.project === 'string' ? null : unit.project;
  const buildingId =
    typeof unit.building === 'string' ? unit.building : unit.building.id;

  return (
    <div className="bg-dark-green min-h-screen py-10">
      <div className="flex flex-col mx-auto">
        <ApartmentDetailView
          apartment={{
            id: unit.id,
            complex: projectObj ? pickLocale(projectObj.name) : '',
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
                const name = pickLocale(r.name ?? '');
                return {
                  name,
                  size: r.size ?? 0,
                  icon: nameToIcon(name),
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
