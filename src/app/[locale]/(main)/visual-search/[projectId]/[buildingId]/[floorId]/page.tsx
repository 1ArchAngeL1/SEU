'use client';

import { use, useState, useMemo, useCallback, type SyntheticEvent } from 'react';
import { notFound } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import BackButton from '@/components/BackButton';
import SeuLoader from '@/components/common/SeuLoader';
import ContactForm from '@/components/ContactForm';
import ContactPanel from '@/components/ContactPanel';
import { Link, useRouter } from '@/i18n/navigation';
import {
  usePublicBuilding,
  useActiveBuildingsByProject,
} from '@/hooks/queries/use-buildings';
import { useFloor, useFloorsByBuilding } from '@/hooks/queries/use-floors';
import { useProject } from '@/hooks/queries/use-projects';
import { usePublicUnitsList } from '@/hooks/queries/use-units';
import { pickLocalized, type Locale } from '@/lib/i18n-helpers';
import { fileUrl } from '@/lib/file-url';
import { bedroomCount } from '@/lib/room-counts';
import { STATUS_COLORS } from '@/lib/unit-status';
import { cn } from '@/lib/utils';
import { isBuildingVisible, isProjectVisible, visibleUnits } from '@/lib/visibility';
import { isNotFoundError } from '@/lib/api-client';
import type { PolygonPoint, Unit } from '@/model/types/api';

function toSvgPoints(polygon: PolygonPoint[]): string {
  return polygon.map((pt) => `${pt.x},${pt.y}`).join(' ');
}

function getPolygonCenter(polygon: PolygonPoint[]): { x: number; y: number } {
  const cx = polygon.reduce((sum, pt) => sum + pt.x, 0) / polygon.length;
  const cy = polygon.reduce((sum, pt) => sum + pt.y, 0) / polygon.length;
  return { x: cx, y: cy };
}

export default function VisualSearchFloorPage({
  params,
}: {
  params: Promise<{ projectId: string; buildingId: string; floorId: string }>;
}) {
  const { projectId, buildingId, floorId } = use(params);
  const locale = useLocale() as Locale;
  const t = useTranslations('visualSearch');
  const router = useRouter();

  // The public read: a block the admin switched off answers 404, taking this
  // floor and every unit on it with it.
  const buildingQ = usePublicBuilding(buildingId);
  const floorQ = useFloor(floorId);
  const floorsQ = useFloorsByBuilding(buildingId);
  const projectQ = useProject(projectId);
  const buildingsQ = useActiveBuildingsByProject(projectId);

  const building = buildingQ.data;
  const floor = floorQ.data;
  const allFloors = floorsQ.data ?? [];
  const project = projectQ.data;
  const allBuildings = buildingsQ.data;

  const sortedFloors = useMemo(
    () => [...allFloors].sort((a, b) => a.floorNumber - b.floorNumber),
    [allFloors]
  );

  const currentFloorIndex = sortedFloors.findIndex((f) => f.id === floorId);

  const unitsQ = usePublicUnitsList(
    { building: buildingId, floorNumber: floor?.floorNumber },
    { page: 1, limit: 100 }
  );
  // Deactivated units are dropped; the block and project above them are gated
  // below, so the whole floor disappears with either of those.
  const units = useMemo(
    () => visibleUnits(unitsQ.data?.items ?? []),
    [unitsQ.data]
  );
  const isLoading = buildingQ.isLoading || floorQ.isLoading || unitsQ.isLoading;

  const renderImage =
    fileUrl(floor?.renderImage) || fileUrl(floor?.floorImageId);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'floor-plan' | 'grid'>(
    'floor-plan'
  );
  const [imgNatural, setImgNatural] = useState<{ w: number; h: number } | null>(null);
  // The query resolving is not the same as the plan being on screen — the image
  // still has to download. Unit polygons wait for it rather than landing on a
  // blank box. Both breakpoints share the flag: same file, so the second <img>
  // comes from cache.
  const [imgLoaded, setImgLoaded] = useState(false);

  // Reads the event target rather than a ref: the mobile and desktop plans are
  // separate <img> elements, so a single shared ref would only ever point at
  // whichever mounted last.
  const handleImgLoad = useCallback((e: SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget;
    setImgNatural({ w: el.naturalWidth, h: el.naturalHeight });
    setImgLoaded(true);
  }, []);

  const unitsWithPolygons = units.filter(
    (u) => u.polygon && u.polygon.length >= 3
  );


  // Only sellable apartments open a detail view. Sold units and any
  // non-living unit (commercial, parking, storage) are not clickable.
  function canOpenUnit(unit: Unit): boolean {
    return unit.status !== 'sold' && unit.type === 'living';
  }

  function handleUnitClick(unit: Unit) {
    if (!canOpenUnit(unit)) return;
    router.push(`/search/${unit.id}`);
  }

  function goToFloor(direction: 'up' | 'down') {
    const nextIndex =
      direction === 'up' ? currentFloorIndex + 1 : currentFloorIndex - 1;
    if (nextIndex >= 0 && nextIndex < sortedFloors.length) {
      router.push(
        `/visual-search/${projectId}/${buildingId}/${sortedFloors[nextIndex].id}`
      );
    }
  }

  function goToBuilding(bId: string) {
    router.push(`/visual-search/${projectId}/${bId}`);
  }

  // Hidden when either the block or its project is switched off in the admin
  // panel.
  if (projectQ.isSuccess && !isProjectVisible(project)) notFound();
  if (isNotFoundError(buildingQ.error)) notFound();
  if (buildingQ.isSuccess && !isBuildingVisible(building)) notFound();

  const location = project?.location;

  return (
    <main className="bg-site-bg">
      <div className="max-w-[1920px] mx-auto px-5 lg:px-10 pt-6 lg:pt-8 pb-16 lg:pb-24">

        {/* ===== MOBILE HEADER ===== */}
        <div className="lg:hidden">
          {/* Back + Block + Floor nav row */}
          <div className="flex items-center justify-between mb-4">
            <BackButton href={`/visual-search/${projectId}/${buildingId}`} />

            {building && (
              <h1 className="font-bodoni text-seu-body-lg text-site-fg-strong">
                {t('block')} {building.block}
              </h1>
            )}

            {/* Horizontal floor selector */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => goToFloor('down')}
                disabled={currentFloorIndex <= 0}
                className="size-8 rounded-full border border-site-border-soft flex items-center justify-center text-site-fg-dim disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="size-4" />
              </button>
              <div className="flex flex-col items-center min-w-[2.5rem]">
                <span className="font-bodoni text-seu-subheading text-site-fg-strong leading-none">
                  {floor?.floorNumber ?? '—'}
                </span>
                <span className="font-montserrat text-[0.6rem] text-site-fg-muted uppercase tracking-wider">
                  {t('floor')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => goToFloor('up')}
                disabled={currentFloorIndex >= sortedFloors.length - 1}
                className="size-8 rounded-full border border-site-border-soft flex items-center justify-center text-site-fg-dim disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          {/* Block pills — if multiple blocks */}
          {allBuildings.length > 1 && (
            <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar">
              {allBuildings.map((b) => {
                const isActive = b.id === buildingId;
                return (
                  <button
                    key={b.id}
                    onClick={() => goToBuilding(b.id)}
                    className={cn(
                      'shrink-0 px-4 py-1.5 rounded-full font-montserrat text-seu-caption-sm transition-colors border',
                      isActive
                        ? 'bg-primary-green border-primary-green text-white'
                        : 'border-site-border-soft text-site-fg-muted'
                    )}
                  >
                    {b.block}
                  </button>
                );
              })}
            </div>
          )}

          {/* Tabs */}
          <div className="flex items-center gap-6 mb-4 border-b border-site-border-soft pb-3">
            <button
              onClick={() => setActiveTab('floor-plan')}
              className={cn(
                'font-montserrat font-medium text-seu-caption uppercase tracking-wider transition-colors',
                activeTab === 'floor-plan'
                  ? 'text-site-fg'
                  : 'text-site-fg-muted'
              )}
            >
              {t('floorPlan')}
            </button>
            <button
              onClick={() => setActiveTab('grid')}
              className={cn(
                'font-montserrat font-medium text-seu-caption uppercase tracking-wider transition-colors',
                activeTab === 'grid'
                  ? 'text-site-fg'
                  : 'text-site-fg-muted'
              )}
            >
              {t('gridView')}
            </button>
          </div>
        </div>

        {/* ===== DESKTOP HEADER ===== */}
        <div className="hidden lg:block">
          <BackButton href={`/visual-search/${projectId}/${buildingId}`} />

          {/* Tabs */}
          <div className="flex items-center justify-center gap-8 mt-6 mb-8">
            <button
              onClick={() => setActiveTab('floor-plan')}
              className={cn(
                'font-montserrat font-medium text-seu-caption uppercase tracking-wider pb-1 transition-colors',
                activeTab === 'floor-plan'
                  ? 'text-site-fg underline underline-offset-4 decoration-site-fg'
                  : 'text-site-fg-muted hover:text-site-fg-dim'
              )}
            >
              {t('floorPlan')}
            </button>
            <button
              onClick={() => setActiveTab('grid')}
              className={cn(
                'font-montserrat font-medium text-seu-caption uppercase tracking-wider pb-1 transition-colors',
                activeTab === 'grid'
                  ? 'text-site-fg underline underline-offset-4 decoration-site-fg'
                  : 'text-site-fg-muted hover:text-site-fg-dim'
              )}
            >
              {t('gridView')}
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-32">
            <SeuLoader size="lg" />
          </div>
        )}

        {/* ===== MOBILE CONTENT ===== */}
        {!isLoading && (
          <div className="lg:hidden flex flex-col">
            {activeTab === 'floor-plan' && (
              <>
                {renderImage ? (
                  <div
                    className="relative w-full mx-auto shadow-[0_0_30px_8px_var(--site-bg)]"
                    style={{
                      maxHeight: '70vh',
                      ...(imgNatural
                        ? { aspectRatio: `${imgNatural.w} / ${imgNatural.h}` }
                        : { minHeight: '50vh' }),
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={renderImage}
                      alt={floor ? t('floorN', { n: floor.floorNumber }) : t('alt.floorPlan')}
                      className={`w-full h-full object-contain block rounded-lg transition-opacity duration-700 ease-out ${
                        imgLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={handleImgLoad}
                    />
                    {!imgLoaded && <SeuLoader overlay size="md" />}
                    {imgLoaded && (
                    <svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="absolute inset-0 w-full h-full animate-polygons-in"
                    >
                      <defs>
                        <filter id="glow-m">
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
                            className={canOpenUnit(unit) ? 'cursor-pointer' : 'cursor-default'}
                            onClick={() => handleUnitClick(unit)}
                          >
                            <polygon
                              points={toSvgPoints(unit.polygon!)}
                              fill={isHovered ? 'rgba(46,204,113,0.5)' : 'rgba(13,20,29,0.45)'}
                              stroke="none"
                              filter={isHovered ? 'url(#glow-m)' : undefined}
                              className="transition-all duration-500 ease-out"
                            />
                          </g>
                        );
                      })}
                    </svg>
                    )}
                    {/* Apartment number (+ status) centered on each unit */}
                    {imgLoaded && unitsWithPolygons.map((unit) => {
                      const center = getPolygonCenter(unit.polygon!);
                      const isAvailable = unit.status === 'available';
                      const colors = STATUS_COLORS[unit.status] ?? STATUS_COLORS.available;
                      return (
                        <div
                          key={`label-m-${unit.id}`}
                          className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
                          style={{ left: `${center.x}%`, top: `${center.y}%` }}
                        >
                          <span className="font-bodoni leading-none tracking-wide text-seu-body-lg text-pale-gray flex items-center justify-center h-10 min-w-10 px-2.5 rounded-full border border-pale-gray/25 bg-dark-green/65 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                            {unit.unitNumber}
                          </span>
                          {!isAvailable && (
                            <span
                              className={cn(
                                'rounded-full px-2 py-0.5 font-montserrat text-[0.5rem] font-medium uppercase tracking-wider shadow-sm',
                                colors.bg,
                                colors.text
                              )}
                            >
                              {t(`status.${unit.status}`)}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-site-fg-muted font-montserrat text-seu-body text-center py-16">
                    {t('noFloorPlan')}
                  </p>
                )}
                {(location?.addressEn || location?.addressKa) && (
                  <p className="font-montserrat text-seu-caption text-site-fg-muted mt-4 tracking-wider text-center">
                    {pickLocalized(location.addressEn, location.addressKa, locale)}
                    {(location.cityEn || location.cityKa) &&
                      ` · ${pickLocalized(location.cityEn, location.cityKa, locale)}`}
                  </p>
                )}
              </>
            )}

            {activeTab === 'grid' && (
              <>
                {units.length === 0 ? (
                  <p className="text-site-fg-muted font-montserrat text-seu-body text-center py-16">
                    {t('noUnits')}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {units.map((unit) => {
                      const colors = STATUS_COLORS[unit.status] ?? STATUS_COLORS.available;
                      return (
                        <button
                          key={unit.id}
                          onClick={() => handleUnitClick(unit)}
                          className="bg-site-bg-hover border border-site-border-soft rounded-xl p-4 text-left hover:border-primary-green/40 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-montserrat font-semibold text-seu-body-sm text-site-fg-strong">
                              {t('unit')} {unit.unitNumber}
                            </span>
                            <span
                              className={cn(
                                'rounded-full px-2 py-0.5 font-montserrat text-[0.6rem] font-medium',
                                colors.bg,
                                colors.text
                              )}
                            >
                              {t(`status.${unit.status}`)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 font-montserrat text-seu-caption-sm">
                            <span className="text-site-fg-muted">{unit.totalSize} m²</span>
                            {bedroomCount(unit) > 0 && (
                              <span className="text-site-fg-dim">
                                {t('beds', { count: bedroomCount(unit) })}
                              </span>
                            )}
                          </div>
                          {/* Prices are hidden across the public site */}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ===== DESKTOP CONTENT ===== */}
        {!isLoading && (
          <div className="hidden lg:flex items-start gap-6">
            {/* Left column — Block title + Floor selector */}
            <div className="flex flex-col items-start shrink-0 w-24">
              {building && (
                <h1 className="font-bodoni text-seu-heading text-site-fg-strong mb-6 whitespace-nowrap">
                  {t('block')} {building.block}
                </h1>
              )}

              {/* Floor selector */}
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToFloor('up')}
                  disabled={currentFloorIndex >= sortedFloors.length - 1}
                  className="text-site-fg-dim hover:text-site-fg disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronUp className="size-5" />
                </button>
                <div className="flex flex-col items-center">
                  <span className="font-bodoni text-seu-title text-site-fg-strong leading-none">
                    {floor?.floorNumber ?? '—'}
                  </span>
                  <span className="font-montserrat text-seu-caption-sm text-site-fg-muted mt-1">
                    {t('floor')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => goToFloor('down')}
                  disabled={currentFloorIndex <= 0}
                  className="text-site-fg-dim hover:text-site-fg disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronDown className="size-5" />
                </button>
              </div>
            </div>

            {/* Center — content area */}
            <div className="flex-1 flex flex-col items-center min-w-0">
              {activeTab === 'floor-plan' && (
                <>
                  {renderImage ? (
                    <div
                      className="relative w-full max-w-3xl mx-auto shadow-[0_0_30px_8px_var(--site-bg)]"
                      style={{
                        maxHeight: '70vh',
                        ...(imgNatural
                          ? { aspectRatio: `${imgNatural.w} / ${imgNatural.h}` }
                          : { minHeight: '55vh' }),
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={renderImage}
                        alt={floor ? t('floorN', { n: floor.floorNumber }) : t('alt.floorPlan')}
                        className={`w-full h-full object-contain block transition-opacity duration-700 ease-out ${
                          imgLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={handleImgLoad}
                      />

                      {!imgLoaded && <SeuLoader overlay size="lg" />}

                      {imgLoaded && (
                      <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        className="absolute inset-0 w-full h-full animate-polygons-in"
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
                              className={canOpenUnit(unit) ? 'cursor-pointer' : 'cursor-default'}
                              onMouseEnter={() => setHoveredId(unit.id)}
                              onMouseLeave={() => setHoveredId(null)}
                              onClick={() => handleUnitClick(unit)}
                            >
                              <polygon
                                points={toSvgPoints(unit.polygon!)}
                                fill={isHovered ? 'rgba(46,204,113,0.5)' : 'rgba(13,20,29,0.45)'}
                                stroke="none"
                                filter={isHovered ? 'url(#glow)' : undefined}
                                className="transition-all duration-500 ease-out"
                              />
                            </g>
                          );
                        })}
                      </svg>
                      )}

                      {/* Apartment number (+ status) centered on each unit */}
                      {imgLoaded && unitsWithPolygons.map((unit) => {
                        const center = getPolygonCenter(unit.polygon!);
                        const isHovered = hoveredId === unit.id;
                        const isAvailable = unit.status === 'available';
                        const colors =
                          STATUS_COLORS[unit.status] ?? STATUS_COLORS.available;
                        return (
                          <div
                            key={`label-${unit.id}`}
                            className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5"
                            style={{
                              left: `${center.x}%`,
                              top: `${center.y}%`,
                            }}
                          >
                            <span
                              className={cn(
                                'font-bodoni leading-none tracking-wide transition-all duration-500 ease-out flex items-center justify-center h-14 min-w-14 px-3 rounded-full border backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.5)]',
                                isHovered
                                  ? 'text-seu-heading-lg text-white scale-105 bg-primary-green/40 border-white/50'
                                  : 'text-seu-heading text-pale-gray bg-dark-green/65 border-pale-gray/25'
                              )}
                            >
                              {unit.unitNumber}
                            </span>
                            {!isAvailable && (
                              <span
                                className={cn(
                                  'rounded-full px-2.5 py-0.5 font-montserrat text-[0.6rem] font-medium uppercase tracking-wider shadow-sm',
                                  colors.bg,
                                  colors.text
                                )}
                              >
                                {t(`status.${unit.status}`)}
                              </span>
                            )}
                          </div>
                        );
                      })}

                      {/* Hovered unit info. Pinned to whichever half of the
                          plan the unit sits in — top for an upper apartment,
                          bottom for a lower one — so the card stays near what
                          you are pointing at instead of always cutting across
                          the foot of the drawing. */}
                      {hoveredId &&
                        (() => {
                          const u = units.find((x) => x.id === hoveredId);
                          if (!u?.polygon || u.polygon.length < 3) return null;
                          // Polygon coordinates are percentages of the plan box,
                          // so the midpoint is the half it belongs to.
                          const isUpper = getPolygonCenter(u.polygon).y < 50;
                          return (
                            <div
                              className={cn(
                                'absolute left-6 right-6 flex justify-center pointer-events-none',
                                isUpper ? 'top-6' : 'bottom-6'
                              )}
                            >
                              <div className="bg-site-bg/90 backdrop-blur-md border border-success-green/30 rounded-xl px-6 py-4 shadow-lg">
                                <p className="font-montserrat font-semibold text-seu-body text-site-fg-strong">
                                  {t('unit')} {u.unitNumber}
                                </p>
                                <div className="flex items-center gap-4 font-montserrat text-seu-caption mt-1">
                                  <span className="text-site-fg-muted">
                                    {u.totalSize} m²
                                  </span>
                                  {bedroomCount(u) > 0 && (
                                    <span className="text-site-fg-dim">
                                      {t('beds', { count: bedroomCount(u) })}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                    </div>
                  ) : (
                    <p className="text-site-fg-muted font-montserrat text-seu-body text-center py-20">
                      {t('noFloorPlan')}
                    </p>
                  )}

                  {/* Location text */}
                  {(location?.addressEn || location?.addressKa) && (
                    <p className="font-montserrat text-seu-caption text-site-fg-muted mt-6 tracking-wider">
                      {pickLocalized(location.addressEn, location.addressKa, locale)}
                      {(location.cityEn || location.cityKa) &&
                        ` · ${pickLocalized(location.cityEn, location.cityKa, locale)}`}
                    </p>
                  )}
                </>
              )}

              {activeTab === 'grid' && (
                <>
                  {floor && (
                    <h2 className="font-bodoni text-seu-heading text-site-fg-strong mb-6 self-start">
                      {t('floorN', { n: floor.floorNumber })}
                    </h2>
                  )}
                  {units.length === 0 ? (
                    <p className="text-site-fg-muted font-montserrat text-seu-body text-center py-20">
                      {t('noUnits')}
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                      {units.map((unit) => {
                        const colors =
                          STATUS_COLORS[unit.status] ?? STATUS_COLORS.available;
                        return (
                          <button
                            key={unit.id}
                            onClick={() => handleUnitClick(unit)}
                            className="bg-site-bg-hover border border-site-border-soft rounded-xl p-5 text-left hover:border-primary-green/40 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-montserrat font-semibold text-seu-body text-site-fg-strong">
                                {t('unit')} {unit.unitNumber}
                              </span>
                              <span
                                className={cn(
                                  'rounded-full px-2.5 py-0.5 font-montserrat text-[0.65rem] font-medium',
                                  colors.bg,
                                  colors.text
                                )}
                              >
                                {t(`status.${unit.status}`)}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 font-montserrat text-seu-caption">
                              <span className="text-site-fg-muted">
                                {unit.totalSize} m²
                              </span>
                              {bedroomCount(unit) > 0 && (
                                <span className="text-site-fg-dim">
                                  {t('beds', { count: bedroomCount(unit) })}
                                </span>
                              )}
                            </div>
                            {/* Prices are hidden across the public site */}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Right column — Blocks sidebar */}
            {allBuildings.length > 1 && (
              <div className="shrink-0 w-40">
                <h3 className="font-bodoni text-seu-body text-site-fg mb-4 text-right">
                  {t('blocks')}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {allBuildings.map((b) => {
                    const isActive = b.id === buildingId;
                    return (
                      <button
                        key={b.id}
                        onClick={() => goToBuilding(b.id)}
                        className={cn(
                          'px-3 py-2 rounded-md font-montserrat text-seu-caption-sm transition-colors border',
                          isActive
                            ? 'bg-site-bg-hover border-site-border-soft text-site-fg-strong'
                            : 'border-site-border-soft text-site-fg-muted hover:border-site-border hover:text-site-fg'
                        )}
                      >
                        {b.block}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contact section */}
      <div className="bg-site-bg px-5 lg:px-10 py-12 lg:py-20">
        <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <ContactForm className="max-w-2xl" />
          <ContactPanel className="max-w-2xl lg:justify-self-end" />
        </div>
      </div>
    </main>
  );
}
