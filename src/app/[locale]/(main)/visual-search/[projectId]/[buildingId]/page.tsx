'use client';

import { use, useState, useMemo, useRef, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { Loader2, ChevronLeft, Building2 } from 'lucide-react';
import { Link, useRouter } from '@/i18n/navigation';
import { useBuilding } from '@/hooks/queries/use-buildings';
import { useFloorsByBuilding } from '@/hooks/queries/use-floors';
import { pickLocale, type Locale } from '@/lib/i18n-helpers';
import { fileUrl } from '@/lib/file-url';
import type { PolygonPoint } from '@/model/types/api';

function toSvgPoints(polygon: PolygonPoint[]): string {
  return polygon.map((pt) => `${pt.x},${pt.y}`).join(' ');
}

function getPolygonCenter(polygon: PolygonPoint[]): { x: number; y: number } {
  const cx = polygon.reduce((sum, pt) => sum + pt.x, 0) / polygon.length;
  const cy = polygon.reduce((sum, pt) => sum + pt.y, 0) / polygon.length;
  return { x: cx, y: cy };
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
  const [imgNatural, setImgNatural] = useState<{ w: number; h: number } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const handleImgLoad = useCallback(() => {
    const el = imgRef.current;
    if (el) setImgNatural({ w: el.naturalWidth, h: el.naturalHeight });
  }, []);

  const sortedFloors = useMemo(
    () => [...floors].sort((a, b) => a.floorNumber - b.floorNumber),
    [floors]
  );

  const floorsWithPolygons = floors.filter(
    (f) => f.polygon && f.polygon.length >= 3
  );

  function handleFloorClick(floorId: string) {
    router.push(`/visual-search/${projectId}/${buildingId}/${floorId}`);
  }

  if (!isLoading && !renderImage) {
    return (
      <main className="bg-site-bg pt-8 pb-16 lg:pt-12 lg:pb-24">
        <div className="max-w-[1920px] mx-auto px-5 lg:px-10">
          <Link
            href={`/visual-search/${projectId}`}
            className="inline-flex items-center gap-1.5 font-montserrat text-seu-caption text-site-fg border border-site-border-soft rounded-full px-4 py-1.5 hover:bg-site-bg-hover transition-colors mb-6 lg:mb-8"
          >
            <ChevronLeft className="size-3.5" />
            Back
          </Link>
          {building && (
            <h1 className="font-bodoni text-seu-title text-site-fg-strong mb-8 lg:mb-12">
              {pickLocale(building.name, locale)}
            </h1>
          )}
          <p className="text-site-fg-muted font-montserrat text-seu-body text-center py-32">
            No render image available for this building.
          </p>
        </div>
      </main>
    );
  }

  const hoveredFloor = hoveredId ? floors.find((f) => f.id === hoveredId) : null;

  return (
    <main className="relative bg-site-bg overflow-hidden">
      {/* Full-width blurred background cover */}
      {renderImage && (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={renderImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-30"
          />
          <div className="absolute inset-0 bg-site-bg/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-site-bg via-transparent to-site-bg" />
        </div>
      )}

      {/* Foreground content */}
      <div className="relative z-10 pt-6 pb-16 lg:pt-8 lg:pb-24">
        <div className="max-w-[1920px] mx-auto px-5 lg:px-10">
          {/* Header row */}
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <Link
              href={`/visual-search/${projectId}`}
              className="inline-flex items-center gap-1.5 font-montserrat text-seu-caption text-site-fg border border-site-border-soft rounded-full px-4 py-1.5 hover:bg-site-bg-hover transition-colors backdrop-blur-sm"
            >
              <ChevronLeft className="size-3.5" />
              Back
            </Link>

            {building && (
              <div className="text-right">
                <h1 className="font-bodoni text-seu-heading lg:text-seu-heading-lg text-site-fg-strong leading-none">
                  {pickLocale(building.name, locale)}
                </h1>
                <p className="font-montserrat text-seu-caption text-site-fg-muted mt-1">
                  Block {building.block} · {sortedFloors.length} floors
                </p>
              </div>
            )}
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="size-8 text-primary-orange animate-spin" />
            </div>
          )}

          {renderImage && (
            <div className="flex flex-col items-center">
                <div
                  className="relative mx-auto rounded-2xl overflow-hidden shadow-[0_0_60px_20px_var(--site-bg)] ring-1 ring-site-border-soft w-full"
                  style={{
                    maxHeight: '75vh',
                    maxWidth: imgNatural
                      ? `min(100%, calc(75vh * ${imgNatural.w} / ${imgNatural.h}))`
                      : '100%',
                    ...(imgNatural ? { aspectRatio: `${imgNatural.w} / ${imgNatural.h}` } : {}),
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={imgRef}
                    src={renderImage}
                    alt={building ? pickLocale(building.name, locale) : 'Building render'}
                    className="w-full h-full object-contain block"
                    onLoad={handleImgLoad}
                  />

                  {/* Soft vignette edges */}
                  <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_60px_20px_var(--site-bg)]" />

                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="absolute inset-0 w-full h-full"
                  >
                    <defs>
                      <filter id="glow-bldg">
                        <feGaussianBlur stdDeviation="0.8" result="blur" />
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
                            fill={isHovered ? 'rgba(46,204,113,0.25)' : 'rgba(46,204,113,0.04)'}
                            stroke="none"
                            filter={isHovered ? 'url(#glow-bldg)' : undefined}
                            className="transition-all duration-500 ease-out"
                          />
                        </g>
                      );
                    })}
                  </svg>

                  {/* Hovered floor tooltip */}
                  {hoveredFloor && hoveredFloor.polygon && hoveredFloor.polygon.length >= 3 && (() => {
                    const center = getPolygonCenter(hoveredFloor.polygon!);
                    return (
                      <div
                        className="absolute pointer-events-none -translate-x-1/2 -translate-y-full z-10"
                        style={{ left: `${center.x}%`, top: `${center.y}%` }}
                      >
                        <div className="bg-site-bg/90 backdrop-blur-md border border-success-green/30 rounded-xl px-4 py-2.5 shadow-lg mb-2">
                          <p className="font-montserrat font-semibold text-seu-body-sm text-site-fg-strong whitespace-nowrap">
                            Floor {hoveredFloor.floorNumber}
                          </p>
                          <p className="font-montserrat text-seu-caption text-success-green mt-0.5">
                            Click to explore
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Building stats bar */}
                {building && (
                  <div className="flex items-center justify-center gap-8 mt-6">
                    {building.totalSize && (
                      <div className="flex items-center gap-2">
                        <Building2 className="size-4 text-site-fg-muted" />
                        <span className="font-montserrat text-seu-caption text-site-fg-muted">
                          {building.totalSize.toLocaleString()} m²
                        </span>
                      </div>
                    )}
                    {building.constructionProgress !== undefined && building.constructionProgress > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-site-bg-hover rounded-full overflow-hidden">
                          <div
                            className="h-full bg-success-green rounded-full transition-all duration-700"
                            style={{ width: `${building.constructionProgress}%` }}
                          />
                        </div>
                        <span className="font-montserrat text-seu-caption text-site-fg-muted">
                          {building.constructionProgress}%
                        </span>
                      </div>
                    )}
                    {building.status && (
                      <span className="font-montserrat text-seu-caption text-site-fg-muted capitalize">
                        {building.status.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                )}

            </div>
          )}
        </div>
      </div>
    </main>
  );
}
