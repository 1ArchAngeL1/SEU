'use client';

import { use, useState } from 'react';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  BedDouble,
  ChefHat,
  DoorOpen,
  Droplets,
  FileText,
  Package,
  Sofa,
  Sun,
  Waves,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { DUMMY_APARTMENTS } from '@/components/search/dummyApartments';
import { RoomDetailIcon } from '@/components/search/ApartmentCardGridView';

type ViewMode = '3D' | '2D' | 'Plan';

function RoomIcon({ type }: { type: RoomDetailIcon }) {
  const cls = 'w-5 h-5 text-pale-gray/50 flex-shrink-0';
  switch (type) {
    case 'bedroom':
      return <BedDouble className={cls} />;
      {
        /* PLACEHOLDER ICON */
      }
    case 'hall':
      return <DoorOpen className={cls} />;
      {
        /* PLACEHOLDER ICON */
      }
    case 'balcony':
      return <Sun className={cls} />;
      {
        /* PLACEHOLDER ICON */
      }
    case 'bathroom':
      return <Droplets className={cls} />;
      {
        /* PLACEHOLDER ICON */
      }
    case 'kitchen':
      return <ChefHat className={cls} />;
      {
        /* PLACEHOLDER ICON */
      }
    case 'storage':
      return <Package className={cls} />;
      {
        /* PLACEHOLDER ICON */
      }
    case 'living':
      return <Sofa className={cls} />;
      {
        /* PLACEHOLDER ICON */
      }
    case 'wc':
      return <Waves className={cls} />;
      {
        /* PLACEHOLDER ICON */
      }
  }
}

export default function ApartmentDetailPage({
  params,
}: {
  params: Promise<{ apartment: string }>;
}) {
  const { apartment: id } = use(params);
  const [viewMode, setViewMode] = useState<ViewMode>('Plan');

  const apartment = DUMMY_APARTMENTS.find((a) => a.id === Number(id));
  if (!apartment) notFound();

  const { apartmentNumber } = apartment;

  const floorPlanSrc =
    viewMode === 'Plan'
      ? apartment.floorPlanImages.plan
      : viewMode === '2D'
        ? apartment.floorPlanImages.twoD
        : apartment.floorPlanImages.threeD;

  return (
    <div className="bg-dark-green min-h-screen py-10 px-16">
      <div className="max-w-[1920px] mx-auto">
        {/* Top bar: Back | Floor Plan label | SEE PRESENTATION */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/search">
            <button className="flex items-center gap-2 border border-pale-gray/30 rounded-full px-5 py-2 font-montserrat text-seu-caption text-pale-gray hover:border-pale-gray transition-colors cursor-pointer">
              <ArrowLeft className="w-3 h-3" />
              Back
            </button>
          </Link>

          <span className="font-montserrat text-seu-caption text-pale-gray/40 tracking-[0.2rem] uppercase">
            Floor Plan
          </span>

          <button className="flex items-center gap-2.5 bg-navy-green border border-pale-gray/20 rounded-lg px-5 py-2.5 font-montserrat text-seu-caption text-pale-gray hover:bg-navy-green/70 transition-colors cursor-pointer">
            {/* PLACEHOLDER ICON */}
            <FileText className="w-4 h-4" />
            SEE PRESENTATION
          </button>
        </div>

        {/* Main two-column layout */}
        <div className="flex gap-14 items-start">
          {/* ── Left: Info Panel ── */}
          <div className="w-[42%] flex-none">
            {/* Block & Floor */}
            <div className="flex items-baseline gap-16 mb-6">
              <div className="flex items-baseline gap-3">
                <span className="font-montserrat text-seu-body text-pale-gray/50">
                  Block
                </span>
                <span className="font-[--font-bodoni] font-normal text-seu-title-xl text-pale-gray leading-none">
                  {apartment.block}
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-montserrat text-seu-body text-pale-gray/50">
                  Floor
                </span>
                <span className="font-[--font-bodoni] font-normal text-seu-title-xl text-pale-gray leading-none">
                  {apartment.floor}
                </span>
              </div>
            </div>

            {/* Apartment Number */}
            <div className="flex items-baseline gap-3 mb-10">
              <span className="font-montserrat text-seu-body text-pale-gray/50">
                Apartment N
              </span>
              <span className="font-[--font-bodoni] font-normal text-seu-title-xl text-pale-gray leading-none">
                {apartmentNumber}
              </span>
            </div>

            {/* Stats Row */}
            <div className="flex gap-10 mb-8">
              <div>
                <p className="font-montserrat text-seu-caption text-pale-gray/50 mb-1">
                  Total Size
                </p>
                <p className="font-montserrat font-medium text-seu-body-lg text-pale-gray">
                  {apartment.totalSize} SQ.M
                </p>
              </div>
              <div>
                <p className="font-montserrat text-seu-caption text-pale-gray/50 mb-1">
                  Main Size
                </p>
                <p className="font-montserrat font-medium text-seu-body-lg text-pale-gray">
                  {apartment.mainSize} SQ.M
                </p>
              </div>
              <div>
                <p className="font-montserrat text-seu-caption text-pale-gray/50 mb-1">
                  Open Space
                </p>
                <p className="font-montserrat font-medium text-seu-body-lg text-pale-gray">
                  {apartment.openSpace} SQ.M
                </p>
              </div>
              <div>
                <p className="font-montserrat text-seu-caption text-pale-gray/50 mb-1">
                  Bedroom
                </p>
                <p className="font-montserrat font-medium text-seu-body-lg text-pale-gray">
                  {apartment.rooms}
                </p>
              </div>
            </div>

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

            {/* Room details — 3-column grid */}
            <div className="grid grid-cols-3 gap-x-6 gap-y-5">
              {apartment.roomDetails.map((room, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <RoomIcon type={room.icon} />
                  <div className="min-w-0">
                    <span className="font-montserrat text-seu-caption text-pale-gray">
                      {room.name}
                    </span>
                    <span className="font-montserrat text-seu-caption text-pale-gray/50 ml-1.5">
                      {room.size} M2
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Floor Plan Card ── */}
          <div className="flex-1 bg-white rounded-2xl overflow-hidden flex flex-col min-h-[640px]">
            {/* Tabs + Compass */}
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex gap-2">
                {(['3D', '2D', 'Plan'] as ViewMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-6 py-1.5 rounded-lg font-montserrat text-seu-body-sm transition-colors cursor-pointer ${
                      viewMode === mode
                        ? 'bg-dark-green text-white'
                        : 'border border-secondary-grey text-dark-green hover:bg-pale-gray'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* PLACEHOLDER: IMAGE - Compass rose */}
              <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                className="flex-shrink-0"
              >
                <circle
                  cx="22"
                  cy="22"
                  r="20"
                  fill="none"
                  stroke="#ccc"
                  strokeWidth="1"
                />
                <polygon points="22,5 19,22 25,22" fill="#E84B3A" />
                <polygon points="22,39 19,22 25,22" fill="#bbb" />
                <text
                  x="22"
                  y="4.5"
                  textAnchor="middle"
                  fill="#888"
                  fontSize="7"
                  fontFamily="sans-serif"
                  fontWeight="600"
                >
                  N
                </text>
                <text
                  x="22"
                  y="43"
                  textAnchor="middle"
                  fill="#888"
                  fontSize="7"
                  fontFamily="sans-serif"
                >
                  S
                </text>
                <text
                  x="2.5"
                  y="24"
                  textAnchor="middle"
                  fill="#888"
                  fontSize="7"
                  fontFamily="sans-serif"
                >
                  W
                </text>
                <text
                  x="41.5"
                  y="24"
                  textAnchor="middle"
                  fill="#888"
                  fontSize="7"
                  fontFamily="sans-serif"
                >
                  E
                </text>
              </svg>
            </div>

            {/* Floor plan area */}
            <div className="flex-1 flex items-center justify-center p-8">
              {floorPlanSrc ? (
                /* Real floor plan image — swap placeholder paths in floorPlanImages */
                <img
                  src={floorPlanSrc}
                  alt={`${viewMode} floor plan — Apt ${apartmentNumber}`}
                  className="max-h-[480px] object-contain"
                />
              ) : (
                /* PLACEHOLDER: IMAGE - Apartment {viewMode} floor plan for {apartment.complex} block {apartment.block} apt {apartmentNumber} */
                <div className="w-full h-full min-h-[480px] border-2 border-dashed border-secondary-grey/25 rounded-xl flex flex-col items-center justify-center gap-3">
                  <FileText className="w-10 h-10 text-secondary-grey/30" />
                  <p className="font-montserrat text-seu-body-sm text-secondary-grey/40">
                    {viewMode} Floor Plan
                  </p>
                  <p className="font-montserrat text-seu-caption-sm text-secondary-grey/30">
                    {apartment.complex} · Block {apartment.block} · Apt{' '}
                    {apartmentNumber}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
