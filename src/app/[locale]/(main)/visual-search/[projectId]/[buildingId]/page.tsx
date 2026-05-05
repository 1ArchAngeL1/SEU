'use client';

import { use, useState } from 'react';
import { useLocale } from 'next-intl';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link, useRouter } from '@/i18n/navigation';
import { useBuilding } from '@/hooks/queries/use-buildings';
import { useFloorsByBuilding } from '@/hooks/queries/use-floors';
import { pickLocale, type Locale } from '@/lib/i18n-helpers';
import { fileUrl } from '@/lib/file-url';
import type { PolygonPoint } from '@/model/types/api';

function toSvgPoints(polygon: PolygonPoint[]): string {
  return polygon.map((pt) => `${pt.x},${pt.y}`).join(' ');
}

export default function VisualSearchBuildingPage({
  params,
}: {
  params: Promise<{ projectId: string; buildingId: string }>;
}) {
  const { projectId, buildingId } = use(params);
  const locale = useLocale() as Locale;
  const router = useRouter();

  const buildingQ = useBuilding(buildingId);
  const floorsQ = useFloorsByBuilding(buildingId);

  const building = buildingQ.data;
  const floors = floorsQ.data ?? [];
  const isLoading = buildingQ.isLoading || floorsQ.isLoading;

  const renderImage = fileUrl(building?.renderImage);

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const floorsWithPolygons = floors.filter(
    (f) => f.polygon && f.polygon.length >= 3
  );

  function handleFloorClick(floorId: string) {
    router.push(`/visual-search/${projectId}/${buildingId}/${floorId}`);
  }

  if (!isLoading && !renderImage) {
    return (
      <main className="bg-dark-green min-h-dvh py-20">
        <div className="max-w-[1920px] mx-auto px-10">
          <Link
            href={`/visual-search/${projectId}`}
            className="inline-flex items-center gap-2 font-montserrat text-seu-caption text-secondary-grey hover:text-pale-gray transition-colors mb-10"
          >
            <ArrowLeft className="size-4" />
            Back to project
          </Link>
          {building && (
            <h1 className="font-bodoni text-seu-title text-white mb-16">
              {pickLocale(building.name, locale)}
            </h1>
          )}
          <p className="text-secondary-grey font-montserrat text-seu-body text-center py-32">
            No render image available for this building.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-dark-green min-h-dvh py-20">
      <div className="max-w-[1920px] mx-auto px-10">
        <Link
          href={`/visual-search/${projectId}`}
          className="inline-flex items-center gap-2 font-montserrat text-seu-caption text-secondary-grey hover:text-pale-gray transition-colors mb-10"
        >
          <ArrowLeft className="size-4" />
          Back to project
        </Link>

        {building && (
          <div className="mb-10">
            <h1 className="font-bodoni text-seu-title text-white mb-2">
              {pickLocale(building.name, locale)}
            </h1>
            <p className="font-montserrat text-seu-body text-secondary-grey">
              Block {building.block}
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
              alt={building ? pickLocale(building.name, locale) : 'Building render'}
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
              {floorsWithPolygons.map((floor) => {
                const isHovered = hoveredId === floor.id;
                return (
                  <g
                    key={floor.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredId(floor.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => handleFloorClick(floor.id)}
                  >
                    <polygon
                      points={toSvgPoints(floor.polygon!)}
                      fill={isHovered ? 'rgba(255,107,53,0.2)' : 'transparent'}
                      stroke={isHovered ? '#FF6B35' : 'transparent'}
                      strokeWidth={isHovered ? 1.5 : 0}
                      vectorEffect="non-scaling-stroke"
                      filter={isHovered ? 'url(#glow)' : undefined}
                      className="transition-all duration-300 ease-out"
                    />
                    {isHovered && (
                      <polygon
                        points={toSvgPoints(floor.polygon!)}
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
          </div>
        )}
      </div>
    </main>
  );
}
