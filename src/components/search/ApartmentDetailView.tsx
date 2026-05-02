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
  return (
    <div className={'px-10'}>
      <ApartmentDetailHeader />

      <div className="flex gap-14 items-start">
        {/* ── Left: Info Panel ── */}
        <div className="w-[42%] flex-none">
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

          {/* Separator */}
          <div className="border-t border-dashed border-pale-gray/20 mb-8" />

          {/* Request Call */}
          <button className="bg-primary-green text-white font-montserrat font-medium text-seu-body px-10 py-4 rounded-lg hover:bg-primary-green/90 transition-colors cursor-pointer mb-8">
            Request Call
          </button>

          {/* Separator */}
          <div className="border-t border-dashed border-pale-gray/20 mb-8" />

          {/* Details heading */}
          <h3 className="font-montserrat font-semibold text-seu-body-lg text-pale-gray mb-6">
            Details
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

      {/* Benefits Section */}
    </div>
  );
}
