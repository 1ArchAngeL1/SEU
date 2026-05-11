'use client';

import {
  ApartmentDetailHeader,
  ApartmentMetaHeader,
} from './apartment-detail/ApartmentDetailHeader';
import { ApartmentDetailStats } from './apartment-detail/ApartmentDetailStats';
import {
  ApartmentRoomList,
  type RoomDetail,
} from './apartment-detail/ApartmentRoomList';
import { ApartmentFloorPlan } from './apartment-detail/ApartmentFloorPlan';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

interface Apartment {
  id: string | number;
  complex: string;
  block: string;
  floor: number;
  apartmentNumber: string | number;
  totalSize: number;
  mainSize: number;
  openSpace: number;
  rooms: number;
  roomDetails: RoomDetail[];
  floorPlanImages: {
    plan: string | null;
    twoD: string | null;
    threeD: string | null;
  };
}

interface ApartmentDetailViewProps {
  apartment: Apartment;
}

export function ApartmentDetailView({ apartment }: ApartmentDetailViewProps) {
  const t = useTranslations('search');
  return (
    <div className="px-5 sm:px-10 max-w-[1920px] mx-auto w-full">
      <ApartmentDetailHeader />

      <div className="flex flex-col lg:flex-row gap-10 xl:gap-14 items-start">
        {/* ── Left: Info Panel ── */}
        <div className="w-full lg:w-[42%] flex-none">
          <ApartmentMetaHeader
            block={apartment.block}
            floor={apartment.floor}
            apartmentNumber={apartment.apartmentNumber}
          />

          <ApartmentDetailStats
            totalSize={apartment.totalSize}
            mainSize={apartment.mainSize}
            openSpace={apartment.openSpace}
            rooms={apartment.rooms}
          />

          {/* Dashed separator */}
          <div className="border-t border-dashed border-pale-gray/25 mb-8" />

          {/* Request Call */}
          <Button
            type="button"
            size="lg"
            className="bg-primary-orange hover:bg-primary-orange/90 text-white font-montserrat font-medium text-seu-body px-10 h-12 rounded-lg shadow-sm shadow-primary-orange/20 mb-8"
          >
            {t('requestCall')}
          </Button>

          {/* Dashed separator */}
          <div className="border-t border-dashed border-pale-gray/25 mb-8" />

          {/* Details heading */}
          <h3 className="font-[--font-bodoni] font-normal text-seu-heading text-pale-gray mb-6 leading-none">
            {t('details')}
          </h3>

          <ApartmentRoomList roomDetails={apartment.roomDetails} />
        </div>

        {/* ── Right: Floor Plan Card ── */}
        <ApartmentFloorPlan
          floorPlanImages={apartment.floorPlanImages}
          apartmentNumber={apartment.apartmentNumber}
          complex={apartment.complex}
          block={apartment.block}
        />
      </div>
    </div>
  );
}
