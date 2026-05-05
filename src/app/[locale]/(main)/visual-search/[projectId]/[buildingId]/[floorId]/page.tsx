'use client';

import { use, useState } from 'react';
import { useLocale } from 'next-intl';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link, useRouter } from '@/i18n/navigation';
import { useBuilding } from '@/hooks/queries/use-buildings';
import { useFloor } from '@/hooks/queries/use-floors';
import { useUnitsList } from '@/hooks/queries/use-units';
import { pickLocale, type Locale } from '@/lib/i18n-helpers';
import { fileUrl } from '@/lib/file-url';
import type { PolygonPoint, Unit } from '@/model/types/api';

function toSvgPoints(polygon: PolygonPoint[]): string {
  return polygon.map((pt) => `${pt.x},${pt.y}`).join(' ');
}

export default function VisualSearchFloorPage({
  params,
}: {
  params: Promise<{ projectId: string; buildingId: string; floorId: string }>;
}) {
  const { projectId, buildingId, floorId } = use(params);
  const locale = useLocale() as Locale;
  const router = useRouter();

  const buildingQ = useBuilding(buildingId);
  const floorQ = useFloor(floorId);
  const building = buildingQ.data;
  const floor = floorQ.data;

  // Fetch units for this floor
  const unitsQ = useUnitsList(
    { building: buildingId, floorNumber: floor?.floorNumber },
    { page: 1, limit: 100 }
  );
  const units = unitsQ.data?.items ?? [];
  const isLoading = buildingQ.isLoading || floorQ.isLoading || unitsQ.isLoading;

  // Use floor's render image, fall back to floor plan image
  const renderImage = fileUrl(floor?.renderImage) || fileUrl(floor?.floorImageId);

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const unitsWithPolygons = units.filter(
    (u) => u.polygon && u.polygon.length >= 3
  );

  function handleUnitClick(unit: Unit) {
    router.push(`/search/${unit.id}`);
  }

  if (!isLoading && !renderImage) {
    return (
      <main className="bg-dark-green min-h-dvh py-20">
        <div className="max-w-[1920px] mx-auto px-10">
          <Link
            href={`/visual-search/${projectId}/${buildingId}`}
            className="inline-flex items-center gap-2 font-montserrat text-seu-caption text-secondary-grey hover:text-pale-gray transition-colors mb-10"
          >
            <ArrowLeft className="size-4" />
            Back to building
          </Link>
          {building && floor && (
            <h1 className="font-bodoni text-seu-title text-white mb-16">
              {pickLocale(building.name, locale)} — Floor {floor.floorNumber}
            </h1>
          )}
          <p className="text-secondary-grey font-montserrat text-seu-body text-center py-32">
            No floor plan image available.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-dark-green min-h-dvh py-20">
      <div className="max-w-[1920px] mx-auto px-10">
        <Link
          href={`/visual-search/${projectId}/${buildingId}`}
          className="inline-flex items-center gap-2 font-montserrat text-seu-caption text-secondary-grey hover:text-pale-gray transition-colors mb-10"
        >
          <ArrowLeft className="size-4" />
          Back to building
        </Link>

        {building && floor && (
          <div className="mb-10">
            <h1 className="font-bodoni text-seu-title text-white mb-2">
              {pickLocale(building.name, locale)}
            </h1>
            <p className="font-montserrat text-seu-body text-secondary-grey">
              Floor {floor.floorNumber} — {units.length} unit{units.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="size-8 text-primary-orange animate-spin" />
          </div>
        )}

        {renderImage && (
          <div className="relative w-full rounded-2xl overflow-hidden border border-pale-gray/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={renderImage}
              alt={floor ? `Floor ${floor.floorNumber}` : 'Floor plan'}
              className="w-full h-auto block"
            />

            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full"
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="0.4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {unitsWithPolygons.map((unit) => {
                const isHovered = hoveredId === unit.id;
                return (
                  <g
                    key={unit.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredId(unit.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => handleUnitClick(unit)}
                  >
                    <polygon
                      points={toSvgPoints(unit.polygon!)}
                      fill={isHovered ? 'rgba(255,107,53,0.2)' : 'transparent'}
                      stroke={isHovered ? '#FF6B35' : 'transparent'}
                      strokeWidth={isHovered ? 1.5 : 0}
                      vectorEffect="non-scaling-stroke"
                      filter={isHovered ? 'url(#glow)' : undefined}
                      className="transition-all duration-300 ease-out"
                    />
                    {isHovered && (
                      <polygon
                        points={toSvgPoints(unit.polygon!)}
                        fill="transparent"
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth={0.5}
                        vectorEffect="non-scaling-stroke"
                        strokeDasharray="2 2"
                        className="animate-[dash_8s_linear_infinite]"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Hovered unit info tooltip */}
            {hoveredId && (
              <div className="absolute bottom-6 left-6 right-6 flex justify-center pointer-events-none">
                {(() => {
                  const u = units.find((u) => u.id === hoveredId);
                  if (!u) return null;
                  return (
                    <div className="bg-dark-green/90 backdrop-blur-md border border-primary-orange/40 rounded-xl px-6 py-4 shadow-lg">
                      <p className="font-montserrat font-semibold text-seu-body text-white">
                        Unit {u.unitNumber}
                      </p>
                      <div className="flex items-center gap-4 font-montserrat text-seu-caption mt-1">
                        <span className="text-secondary-grey">
                          {u.totalSize} m²
                        </span>
                        {u.bedrooms !== undefined && (
                          <span className="text-pale-gray/70">
                            {u.bedrooms} bed{u.bedrooms !== 1 ? 's' : ''}
                          </span>
                        )}
                        <span className="text-primary-orange font-medium">
                          {u.price.currency} {u.price.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
