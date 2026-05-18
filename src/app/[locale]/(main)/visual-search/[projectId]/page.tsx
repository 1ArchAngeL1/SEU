'use client';

import { use, useState, useRef, useCallback, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Loader2, ZoomIn, ZoomOut, Maximize, ChevronLeft, ChevronRight } from 'lucide-react';
import BackButton from '@/components/BackButton';
import ContactForm from '@/components/ContactForm';
import ContactPanel from '@/components/ContactPanel';
import { Link, useRouter } from '@/i18n/navigation';
import { useProject } from '@/hooks/queries/use-projects';
import { useBuildingsByProject } from '@/hooks/queries/use-buildings';
import { ApartmentTypesSection } from '@/components/visual-search/ApartmentTypesSection';
import { ProjectVideoSection } from '@/components/visual-search/ProjectVideoSection';
import { pickLocale, type Locale } from '@/lib/i18n-helpers';
import { fileUrl } from '@/lib/file-url';
import type { Building, PolygonPoint } from '@/model/types/api';

/** Convert percentage-based polygon points (0-100) directly to SVG points string. */
function toSvgPoints(polygon: PolygonPoint[]): string {
  return polygon.map((pt) => `${pt.x},${pt.y}`).join(' ');
}

/**
 * Hook for mobile pan & pinch-zoom — uses direct DOM manipulation for smooth 60fps.
 * Image keeps its natural aspect ratio. Container wraps the image at 1x scale.
 * Clamping uses the base (unscaled) size captured on image load.
 */
function usePanZoom() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const baseSizeRef = useRef({ w: 0, h: 0 });

  const stateRef = useRef({
    scale: 1,
    tx: 0,
    ty: 0,
    isPanning: false,
    wasPanning: false,
    startX: 0,
    startY: 0,
    startTx: 0,
    startTy: 0,
    pinchDist: null as number | null,
    pinchScale: 1,
    pinchMidX: 0,
    pinchMidY: 0,
    pinchTx: 0,
    pinchTy: 0,
  });
  const [, forceRender] = useState(0);

  const measureBase = useCallback(() => {
    const content = contentRef.current;
    if (!content) return;
    const prev = content.style.transform;
    content.style.transform = 'none';
    baseSizeRef.current = { w: content.offsetWidth, h: content.offsetHeight };
    content.style.transform = prev;
  }, []);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    measureBase();
    const imgs = content.querySelectorAll('img');
    const onLoad = () => measureBase();
    imgs.forEach((img) => img.addEventListener('load', onLoad));
    return () => imgs.forEach((img) => img.removeEventListener('load', onLoad));
  }, [measureBase]);

  const clamp = useCallback((tx: number, ty: number, s: number) => {
    const { w: bw, h: bh } = baseSizeRef.current;
    if (bw === 0 || bh === 0) return { tx, ty };

    // At scale 1, no panning allowed. At higher scales, allow panning
    // up to the point where the edge of the scaled content meets the
    // edge of the base (unscaled) viewport.
    const overflowX = Math.max(0, (bw * s - bw) / 2);
    const overflowY = Math.max(0, (bh * s - bh) / 2);

    return {
      tx: Math.max(-overflowX, Math.min(overflowX, tx)),
      ty: Math.max(-overflowY, Math.min(overflowY, ty)),
    };
  }, []);

  const applyTransform = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    const { scale, tx, ty } = stateRef.current;
    el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const s = stateRef.current;

      if (e.touches.length === 2 && s.pinchDist !== null) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const newScale = Math.max(1, Math.min(5, s.pinchScale * (dist / s.pinchDist)));

        const ratio = newScale / s.pinchScale;
        const newTx = s.pinchMidX - ratio * (s.pinchMidX - s.pinchTx);
        const newTy = s.pinchMidY - ratio * (s.pinchMidY - s.pinchTy);

        const clamped = clamp(newTx, newTy, newScale);
        s.scale = newScale;
        s.tx = clamped.tx;
        s.ty = clamped.ty;
        applyTransform();
        return;
      }

      if (e.touches.length === 1 && s.isPanning) {
        const rawX = e.touches[0].clientX - s.startX + s.startTx;
        const rawY = e.touches[0].clientY - s.startY + s.startTy;
        const clamped = clamp(rawX, rawY, s.scale);
        s.tx = clamped.tx;
        s.ty = clamped.ty;
        s.wasPanning = true;
        applyTransform();
      }
    };

    container.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => container.removeEventListener('touchmove', onTouchMove);
  }, [clamp, applyTransform]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const s = stateRef.current;
    s.wasPanning = false;
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      s.pinchDist = Math.hypot(dx, dy);
      s.pinchScale = s.scale;
      s.isPanning = false;

      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        s.pinchMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left - rect.width / 2;
        s.pinchMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top - rect.height / 2;
      }
      s.pinchTx = s.tx;
      s.pinchTy = s.ty;
      return;
    }
    if (e.touches.length === 1) {
      s.isPanning = true;
      s.startX = e.touches[0].clientX;
      s.startY = e.touches[0].clientY;
      s.startTx = s.tx;
      s.startTy = s.ty;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    const s = stateRef.current;
    s.isPanning = false;
    if (s.pinchDist !== null) {
      s.pinchDist = null;
      if (s.scale < 1.05) {
        s.scale = 1;
        s.tx = 0;
        s.ty = 0;
        applyTransform();
      }
      forceRender((n) => n + 1);
    }
  }, [applyTransform]);

  /** Did the user drag (vs a simple tap)? */
  const wasPanning = useCallback(() => stateRef.current.wasPanning, []);

  const animateTo = useCallback(
    (targetScale: number, targetTx: number, targetTy: number) => {
      const s = stateRef.current;
      const startScale = s.scale;
      const startTx = s.tx;
      const startTy = s.ty;
      const start = performance.now();
      const duration = 250;

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const ease = 1 - Math.pow(1 - t, 3);
        s.scale = startScale + (targetScale - startScale) * ease;
        s.tx = startTx + (targetTx - startTx) * ease;
        s.ty = startTy + (targetTy - startTy) * ease;
        applyTransform();
        if (t < 1) requestAnimationFrame(tick);
        else forceRender((n) => n + 1);
      };
      requestAnimationFrame(tick);
    },
    [applyTransform]
  );

  const resetView = useCallback(() => {
    animateTo(1, 0, 0);
  }, [animateTo]);

  const zoomIn = useCallback(() => {
    const s = stateRef.current;
    const next = Math.min(5, s.scale + 0.5);
    const clamped = clamp(s.tx, s.ty, next);
    animateTo(next, clamped.tx, clamped.ty);
  }, [clamp, animateTo]);

  const zoomOut = useCallback(() => {
    const s = stateRef.current;
    const next = Math.max(1, s.scale - 0.5);
    const clamped = clamp(s.tx, s.ty, next);
    animateTo(next, clamped.tx, clamped.ty);
  }, [clamp, animateTo]);

  return {
    containerRef,
    contentRef,
    handleTouchStart,
    handleTouchEnd,
    wasPanning,
    resetView,
    zoomIn,
    zoomOut,
  };
}


function BenefitsGallery({ benefits, images }: { benefits?: string; images: string[] }) {
  const [current, setCurrent] = useState(0);
  const galleryImages = images.map((img) => fileUrl(img)).filter(Boolean) as string[];
  const total = galleryImages.length;

  const benefitLines = benefits
    ? benefits.split(';').map((l) => l.trim()).filter(Boolean)
    : [];

  function prev() {
    setCurrent((c) => (c - 1 + total) % total);
  }
  function next() {
    setCurrent((c) => (c + 1) % total);
  }

  return (
    <div className="bg-dark-green px-5 lg:px-10 py-12 lg:py-20">
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Benefits list */}
        {benefitLines.length > 0 && (
          <div>
            <h2 className="font-bodoni text-seu-subheading lg:text-seu-heading text-pale-gray mb-6 lg:mb-8">
              Benefits
            </h2>
            <ul className="space-y-2">
              {benefitLines.map((line, i) => (
                <li
                  key={i}
                  className="font-montserrat text-seu-caption lg:text-seu-body-sm text-pale-gray"
                >
                  {line};
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Gallery carousel */}
        {total > 0 && (
          <div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.5),0_20px_60px_rgba(0,0,0,0.4),0_0_80px_rgba(0,0,0,0.3)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={galleryImages[current]}
                alt={`Gallery ${current + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Side fade overlays */}
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-dark-green/80 to-transparent" />
              <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-dark-green/80 to-transparent" />
              {/* Top/bottom fade */}
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-dark-green/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-dark-green/60 to-transparent" />
            </div>

            {/* Controls */}
            {total > 1 && (
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={prev}
                    className="size-9 rounded-full border border-secondary-grey/40 flex items-center justify-center text-pale-gray hover:border-pale-gray transition-colors"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    onClick={next}
                    className="size-9 rounded-full border border-secondary-grey/40 flex items-center justify-center text-pale-gray hover:border-pale-gray transition-colors"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
                <p className="font-montserrat text-seu-body-sm text-pale-gray tabular-nums">
                  {String(current + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function VisualSearchProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const locale = useLocale() as Locale;
  const router = useRouter();

  const projectQ = useProject(projectId);
  const buildingsQ = useBuildingsByProject(projectId);

  const project = projectQ.data;
  const buildings = buildingsQ.data ?? [];
  const isLoading = projectQ.isLoading || buildingsQ.isLoading;

  const renderImage = fileUrl(project?.renderImage);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const panZoom = usePanZoom();

  const buildingsWithPolygons = buildings.filter(
    (b) => b.polygon && b.polygon.length >= 3
  );

  function handleBuildingClick(building: Building) {
    router.push(`/visual-search/${projectId}/${building.id}`);
  }

  // Fallback: no render image → show grid cards
  if (!isLoading && !renderImage) {
    return (
      <main className="bg-dark-green min-h-screen pt-8 pb-16 lg:pt-12 lg:pb-24">
        <div className="max-w-[1920px] mx-auto px-5 lg:px-10">
          <BackButton href="/visual-search" className="mb-10" />
          {project && (
            <h1 className="font-bodoni text-seu-title text-pale-gray mb-16">
              {pickLocale(project.name, locale)}
            </h1>
          )}
          <p className="text-secondary-grey font-montserrat text-seu-body text-center py-32">
            No render image available for this project.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-dark-green min-h-screen">
      {/* Mobile: padded header */}
      <div className="lg:hidden px-5 pt-8 pb-4">
        <BackButton href="/visual-search" className="mb-4" />
        {project && (
          <h1 className="font-bodoni text-seu-heading text-pale-gray mb-2">
            {pickLocale(project.name, locale)}
          </h1>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="size-8 text-primary-orange animate-spin" />
        </div>
      )}

      {/* Render image with polygon overlays */}
      {renderImage && (
        <>
          {/* Mobile: zoomable viewport */}
          <div
            ref={panZoom.containerRef}
            className="lg:hidden relative w-full overflow-hidden border-y border-pale-gray/10 touch-none"
            onTouchStart={panZoom.handleTouchStart}
            onTouchEnd={panZoom.handleTouchEnd}
          >
            <div
              ref={panZoom.contentRef}
              className="relative w-full will-change-transform"
              style={{ transformOrigin: 'center center' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={renderImage}
                alt={project ? pickLocale(project.name, locale) : 'Project render'}
                className="w-full h-auto block"
                draggable={false}
              />
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full"
              >
                <defs>
                  <filter id="glow-mobile">
                    <feGaussianBlur stdDeviation="0.8" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {buildingsWithPolygons.map((building) => {
                  const isActive = activeId === building.id;
                  return (
                    <g
                      key={building.id}
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (panZoom.wasPanning()) return;
                        if (activeId === building.id) {
                          handleBuildingClick(building);
                        } else {
                          setActiveId(building.id);
                        }
                      }}
                    >
                      <polygon
                        points={toSvgPoints(building.polygon!)}
                        fill={isActive ? 'rgba(46,204,113,0.3)' : 'rgba(46,204,113,0.05)'}
                        stroke="none"
                        filter={isActive ? 'url(#glow-mobile)' : undefined}
                        className="transition-all duration-500 ease-out"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Zoom controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
              <button
                onClick={panZoom.zoomIn}
                className="size-10 rounded-full bg-dark-green/80 backdrop-blur border border-pale-gray/20 flex items-center justify-center text-pale-gray"
              >
                <ZoomIn className="size-5" />
              </button>
              <button
                onClick={panZoom.zoomOut}
                className="size-10 rounded-full bg-dark-green/80 backdrop-blur border border-pale-gray/20 flex items-center justify-center text-pale-gray"
              >
                <ZoomOut className="size-5" />
              </button>
              <button
                onClick={panZoom.resetView}
                className="size-10 rounded-full bg-dark-green/80 backdrop-blur border border-pale-gray/20 flex items-center justify-center text-pale-gray"
              >
                <Maximize className="size-5" />
              </button>
            </div>

            {/* Hint overlay */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-dark-green/80 backdrop-blur rounded-full px-4 py-2 pointer-events-none animate-[fadeOut_3s_2s_forwards] opacity-100">
              <p className="font-montserrat text-seu-caption-sm text-pale-gray whitespace-nowrap">
                Drag to explore · Tap building to select
              </p>
            </div>
          </div>

          {/* Mobile: selected building label */}
          {activeId && (
            <div className="lg:hidden flex items-center justify-between bg-secondary-black/50 px-4 py-3 border-b border-pale-gray/10">
              <p className="font-montserrat text-seu-body-sm text-pale-gray">
                {pickLocale(
                  buildings.find((b) => b.id === activeId)?.name ?? {},
                  locale
                )}
              </p>
              <button
                onClick={() => {
                  const building = buildings.find((b) => b.id === activeId);
                  if (building) handleBuildingClick(building);
                }}
                className="font-montserrat text-seu-caption text-primary-orange hover:underline"
              >
                View →
              </button>
            </div>
          )}

          {/* Desktop: full-bleed image — natural aspect ratio preserved for polygon coords */}
          <div
            className="hidden lg:block relative w-full overflow-hidden"
            onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={renderImage}
              alt={project ? pickLocale(project.name, locale) : 'Project render'}
              className="w-full h-auto block"
            />

            {/* Smooth fade edges into dark-green background */}
            <div className="absolute inset-x-0 top-0 h-32 lg:h-40 bg-gradient-to-b from-dark-green via-dark-green/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-32 lg:h-40 bg-gradient-to-t from-dark-green via-dark-green/60 to-transparent" />
            <div className="absolute inset-y-0 left-0 w-16 lg:w-24 bg-gradient-to-r from-dark-green to-transparent" />
            <div className="absolute inset-y-0 right-0 w-16 lg:w-24 bg-gradient-to-l from-dark-green to-transparent" />

            {/* SVG polygon overlays */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full"
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="0.8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {buildingsWithPolygons.map((building) => {
                const isHovered = hoveredId === building.id;
                return (
                  <g
                    key={building.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredId(building.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => handleBuildingClick(building)}
                  >
                    <polygon
                      points={toSvgPoints(building.polygon!)}
                      fill={isHovered ? 'rgba(46,204,113,0.25)' : 'rgba(46,204,113,0.04)'}
                      stroke="none"
                      filter={isHovered ? 'url(#glow)' : undefined}
                      className="transition-all duration-500 ease-out"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Top-left overlay — back button + project name */}
            <div className="absolute top-0 left-0 px-10 pt-8 z-10">
              <BackButton href="/visual-search" variant="gray" />
              {project && (
                <h1 className="font-bodoni text-seu-heading text-pale-gray leading-none uppercase mt-4">
                  {pickLocale(project.name, locale)}
                </h1>
              )}
            </div>

            {/* Top-right — choose block */}
            <div className="absolute top-0 right-0 px-10 pt-8 z-10">
              <h2 className="font-bodoni text-seu-heading text-pale-gray uppercase tracking-wide">
                Choose Block
              </h2>
            </div>

            {/* Mouse-following tooltip */}
            {hoveredId && (() => {
              const b = buildings.find((b) => b.id === hoveredId);
              if (!b) return null;
              return (
                <div
                  className="fixed z-50 pointer-events-none"
                  style={{ left: mousePos.x + 16, top: mousePos.y - 8 }}
                >
                  <div className="bg-dark-green/90 backdrop-blur-md border border-pale-gray/20 rounded-xl px-5 py-3 shadow-lg">
                    <p className="font-montserrat font-semibold text-seu-body-sm text-pale-gray whitespace-nowrap">
                      {pickLocale(b.name, locale)}
                    </p>
                    <div className="flex items-center gap-4 font-montserrat text-seu-caption mt-1">
                      {b.block && (
                        <span className="text-primary-orange font-medium">Block {b.block}</span>
                      )}
                      {b.totalUnits > 0 && (
                        <span className="text-secondary-grey">{b.totalUnits} apartments</span>
                      )}
                      {b.constructionProgress !== undefined && b.constructionProgress > 0 && (
                        <span className="text-secondary-grey">{b.constructionProgress}%</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Project info bar */}
          {project && (
            <div className="bg-dark-green border-t border-pale-gray/8">
              <div className="max-w-[1920px] mx-auto px-5 lg:px-10 py-6 lg:py-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 divide-x divide-secondary-grey/20">
                  {/* Location */}
                  <div className="flex flex-col items-center gap-2 lg:gap-3 px-3 lg:px-4">
                    <p className="font-montserrat text-[0.65rem] lg:text-seu-caption-sm text-secondary-grey tracking-wider">
                      Location
                    </p>
                    <span className="size-1.5 rounded-full bg-secondary-grey/50" />
                    <p className="font-montserrat font-medium text-seu-caption-sm lg:text-seu-body-sm text-pale-gray text-center">
                      {project.location?.district || project.location?.city || project.location?.address || '—'}
                    </p>
                  </div>

                  {/* Apartment Sizes */}
                  <div className="flex flex-col items-center gap-2 lg:gap-3 px-3 lg:px-4">
                    <p className="font-montserrat text-[0.65rem] lg:text-seu-caption-sm text-secondary-grey tracking-wider">
                      Apartment Sizes
                    </p>
                    <span className="size-1.5 rounded-full bg-secondary-grey/50" />
                    <p className="font-montserrat font-medium text-seu-caption-sm lg:text-seu-body-sm text-pale-gray text-center">
                      {project.minSizeApartment != null
                        ? `From ${project.minSizeApartment} m²  To ${project.maxSizeApartment ?? '—'} m²`
                        : '—'}
                    </p>
                  </div>

                  {/* Number of Buildings */}
                  <div className="flex flex-col items-center gap-2 lg:gap-3 px-3 lg:px-4">
                    <p className="font-montserrat text-[0.65rem] lg:text-seu-caption-sm text-secondary-grey tracking-wider">
                      Number of blocks
                    </p>
                    <span className="size-1.5 rounded-full bg-secondary-grey/50" />
                    <p className="font-montserrat font-medium text-seu-caption-sm lg:text-seu-body-sm text-pale-gray">
                      {project.totalBuildings ?? buildings.length}
                    </p>
                  </div>

                  {/* Total Apartments */}
                  <div className="flex flex-col items-center gap-2 lg:gap-3 px-3 lg:px-4">
                    <p className="font-montserrat text-[0.65rem] lg:text-seu-caption-sm text-secondary-grey tracking-wider">
                      Apartments
                    </p>
                    <span className="size-1.5 rounded-full bg-secondary-grey/50" />
                    <p className="font-montserrat font-medium text-seu-caption-sm lg:text-seu-body-sm text-pale-gray">
                      {project.totalUnits ?? '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Benefits + Gallery section */}
      {project && (project.benefits || (project.images && project.images.length > 0)) && (
        <BenefitsGallery benefits={project.benefits} images={project.images ?? []} />
      )}

      {/* Apartment Types section */}
      <ApartmentTypesSection projectId={projectId} />

      {/* SEU video */}
      <ProjectVideoSection />

      {/* Contact section */}
      <div className="bg-dark-green px-5 lg:px-10 py-12 lg:py-20">
        <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <ContactForm className="max-w-xl" />
          <ContactPanel className="max-w-xl lg:justify-self-end" />
        </div>
      </div>
    </main>
  );
}
