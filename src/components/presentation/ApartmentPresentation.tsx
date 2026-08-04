'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Phone, Mail, MapPin } from 'lucide-react';
import type { Project, Unit, RoomType, Floor, PolygonPoint } from '@/model/types/api';
import { pickLocalized, type Locale } from '@/lib/i18n-helpers';
import { fileUrl } from '@/lib/file-url';

interface ApartmentPresentationProps {
  unit: Unit;
  project: Project | null | undefined;
  floor?: Floor | null;
}

/**
 * Single A4 sales presentation for one apartment, mirroring the design in
 * `public/presentation sample/`. Rendered on a standalone printable page so the
 * browser "Save as PDF" produces the downloadable presentation. Every dynamic
 * value (apartment specs, floor plan image, project render, location) is pulled
 * from the unit + its project.
 */
export function ApartmentPresentation({ unit, project, floor }: ApartmentPresentationProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations('presentation');
  const ts = useTranslations('search');
  const tr = useTranslations('roomTypes');
  const tb = useTranslations('benefitsList');
  const tc = useTranslations('contact');

  // QR points at the public apartment page. Built client-side to use the live
  // origin. NOTE: uses the free api.qrserver.com renderer — swap for a bundled
  // generator if offline printing is ever required.
  const [qrUrl, setQrUrl] = useState<string>('');
  useEffect(() => {
    const target = `${window.location.origin}/${locale}/search/${unit.id}`;
    setQrUrl(
      `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=0&data=${encodeURIComponent(target)}`
    );
  }, [locale, unit.id]);

  const projectName = project
    ? pickLocalized(project.nameEn, project.nameKa, locale)
    : typeof unit.project === 'string'
      ? ''
      : pickLocalized(unit.project?.nameEn, unit.project?.nameKa, locale);

  const rooms = (Array.isArray(unit.rooms) ? unit.rooms : []).filter(
    (r): r is NonNullable<typeof r> => r != null && typeof r === 'object'
  );

  const roomCount =
    unit.bedrooms ??
    (rooms.filter((r) => r.type === 'bedroom').length || rooms.length);

  const m2 = ts('m2');

  const streetName = project
    ? pickLocalized(project.location?.districtEn, project.location?.districtKa, locale) ||
      pickLocalized(project.location?.addressEn, project.location?.addressKa, locale)
    : '';

  const address = project
    ? pickLocalized(project.location?.addressEn, project.location?.addressKa, locale)
    : tc('address');

  // Furnished 2D top-down render of the apartment. Shown top-right beside the
  // title/areas, mirroring the desktop presentation (`Desktop/პრეზენტაცია.pdf`)
  // — the same asset the visual-search detail page labels "2D".
  const twoDSrc = fileUrl(unit.twoDContent);

  const floorPlanSrc =
    fileUrl(unit.floorPlanImage) ||
    fileUrl(unit.mainImage);

  // Prefer showing the whole-floor plan with this apartment's position
  // highlighted (as in visual search) instead of the standalone unit plan.
  const floorImageSrc =
    fileUrl(floor?.renderImage) || fileUrl(floor?.floorImageId);
  const unitPolygon = Array.isArray(unit.polygon) ? unit.polygon : [];
  const showFloorHighlight = Boolean(floorImageSrc) && unitPolygon.length >= 3;

  const renderSrc = project
    ? fileUrl(project.renderImage) ||
      fileUrl(project.mainImage) ||
      fileUrl(project.images?.[0])
    : '';

  const benefits = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10'].map(
    (k) => tb(k)
  );

  return (
    <div className="presentation-sheet mx-auto w-[210mm] min-h-[297mm] bg-white text-dark-green flex flex-col overflow-hidden shadow-2xl">
      <div className="flex flex-1 flex-col px-[12mm] pt-[12mm]">
        {/* ── Header: logo + QR ── */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* PLACEHOLDER: LOGO - green SEU mark + composed wordmark (no combined asset available) */}
            <Image
              src="/common/pngs/seu-logo-green.png"
              alt="SEU Development"
              width={64}
              height={64}
              className="w-14 h-14 object-contain"
            />
            <div className="leading-none">
              <div className="font-montserrat font-bold text-dark-green text-[1.6rem] leading-none">
                {locale === 'ka' ? 'სეუ' : 'SEU'}
              </div>
              <div className="font-montserrat text-dark-green/60 text-[0.55rem] tracking-[0.25em] uppercase mt-1">
                {locale === 'ka' ? 'დეველოპმენტი' : 'Development'}
              </div>
            </div>
          </div>

          {qrUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrUrl} alt="QR" className="w-[18mm] h-[18mm]" />
          ) : (
            <div className="w-[18mm] h-[18mm] bg-dark-green/5" />
          )}
        </div>

        <div className="mt-3 border-t-2 border-dark-green" />

        {/* ── Title + areas (left) beside the 2D top-view render (right),
             mirroring the desktop presentation. When no 2D asset exists the
             left column simply spans full width, like the blank template. ── */}
        <div className="mt-6 flex items-start gap-8">
          <div className="flex-1 min-w-0">
            {/* ── Title ── */}
            <h1 className="font-montserrat font-bold text-dark-green text-[1.9rem] leading-tight">
              {projectName}
            </h1>

            <h2 className="mt-5 font-montserrat font-bold text-dark-green text-[1.5rem] leading-none">
              {t('apartmentNo')} {unit.unitNumber}
            </h2>

            <div className="mt-3 flex items-center gap-3 font-montserrat text-dark-green/70 text-[0.85rem]">
              <span>{t('roomApartment', { count: roomCount })}</span>
              <span className="w-px h-4 bg-dark-green/30" />
              <span>
                {ts('block')} {unit.block}
              </span>
              <span className="w-px h-4 bg-dark-green/30" />
              <span>
                {ts('floor')} {unit.floorNumber}
              </span>
            </div>

            {/* ── Areas ── */}
            <div className="mt-7 font-montserrat text-dark-green">
              <div className="flex items-baseline justify-between text-[1.05rem]">
                <span>{ts('totalSize')}</span>
                <span className="font-semibold">
                  {unit.totalSize} {m2}
                </span>
              </div>
              <div className="mt-2 border-t border-dark-green/25" />

              <div className="mt-3 space-y-1.5 text-[0.95rem]">
                {unit.livableArea != null && (
                  <Row label={ts('mainSize')} value={`${unit.livableArea} ${m2}`} />
                )}
                {unit.balconySize != null && (
                  <Row label={ts('openSpace')} value={`${unit.balconySize} ${m2}`} />
                )}
              </div>

              {rooms.length > 0 && (
                <>
                  <div className="mt-3 border-t border-dark-green/25" />
                  <div className="mt-3 space-y-1.5 text-[0.95rem]">
                    {rooms.map((r, i) => (
                      <Row
                        key={i}
                        label={
                          pickLocalized(r.nameEn, r.nameKa, locale) ||
                          tr(r.type as RoomType)
                        }
                        value={`${r.size ?? 0} ${m2}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── 2D top-view render (furnished, top-down) ── */}
          {twoDSrc ? (
            <div className="w-[72mm] shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={twoDSrc}
                alt={`${projectName} — ${t('apartmentNo')} ${unit.unitNumber} — 2D`}
                className="w-full max-h-[82mm] object-contain object-top"
              />
            </div>
          ) : (
            // PLACEHOLDER: IMAGE - 2D top-view apartment render (unit has no twoDContent)
            null
          )}
        </div>

        {/* ── Street band ── */}
        <div className="mt-7 bg-dark-green flex items-center gap-4 px-5 py-2.5 print-exact">
          <span className="flex-1 border-t border-dashed border-white/40" />
          <span className="font-montserrat text-white text-[0.8rem] tracking-wide whitespace-nowrap">
            {streetName}
          </span>
          <span className="flex-1 border-t border-dashed border-white/40" />
        </div>

        {/* ── Floor plan: whole floor with this apartment highlighted.
             Dark panel (like the site's floor viewer) so the white floor
             renders stay visible on the white sheet. ── */}
        <div className="flex-1 flex py-6 min-h-[60mm]">
          <div className="flex-1 flex items-center justify-center rounded-lg bg-dark-green p-4 print-exact">
            {showFloorHighlight ? (
              <FloorPlanWithUnit
                src={floorImageSrc}
                polygon={unitPolygon}
                label={`${projectName} — ${ts('floor')} ${unit.floorNumber} — ${t('apartmentNo')} ${unit.unitNumber}`}
              />
            ) : floorPlanSrc ? (
              // Fallback: standalone unit plan when the floor image / position
              // isn't available.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={floorPlanSrc}
                alt={`${projectName} — ${t('apartmentNo')} ${unit.unitNumber}`}
                className="max-h-[95mm] w-auto max-w-full object-contain"
              />
            ) : (
              // PLACEHOLDER: IMAGE - apartment floor plan
              <span className="font-montserrat text-white/40 text-sm">
                {ts('floorPlan')}
              </span>
            )}
          </div>
        </div>

        {/* ── Amenities + project render ── */}
        <div className="mt-2 border-t-2 border-dark-green pt-5 grid grid-cols-2 gap-6 items-center">
          <ul className="space-y-2">
            {benefits.map((b, i) => (
              <li
                key={i}
                className="flex items-start gap-2 font-montserrat text-dark-green text-[0.72rem] leading-snug"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-green shrink-0 print-exact" />
                {b}
              </li>
            ))}
          </ul>

          <div className="rounded-lg overflow-hidden h-[52mm] bg-dark-green/5">
            {renderSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={renderSrc}
                alt={projectName}
                className="w-full h-full object-cover"
              />
            ) : (
              // PLACEHOLDER: IMAGE - project aerial render
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-montserrat text-dark-green/40 text-xs">
                  {projectName}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer contact band ── */}
      <div className="mt-5 bg-dark-green px-[12mm] py-3.5 flex items-center justify-between font-montserrat text-white text-[0.75rem] print-exact">
        <span className="flex items-center gap-2">
          <Phone className="size-3.5 shrink-0" />
          {tc('phone')}
        </span>
        <span className="flex items-center gap-2">
          <Mail className="size-3.5 shrink-0" />
          {tc('email')}
        </span>
        <span className="flex items-center gap-2">
          <MapPin className="size-3.5 shrink-0" />
          {address}
        </span>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function toSvgPoints(polygon: PolygonPoint[]): string {
  return polygon.map((p) => `${p.x},${p.y}`).join(' ');
}

/**
 * Whole-floor plan image with the current apartment's position filled in.
 * The wrapper shrink-wraps the image so the overlaid SVG (0–100 normalized
 * coordinates, `preserveAspectRatio="none"`) lines up exactly with it.
 */
function FloorPlanWithUnit({
  src,
  polygon,
  label,
}: {
  src: string;
  polygon: PolygonPoint[];
  label: string;
}) {
  return (
    <div className="presentation-floor relative inline-block max-w-full print-exact">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={label} className="block max-h-[95mm] w-auto max-w-full" />
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full print-exact"
      >
        <polygon
          points={toSvgPoints(polygon)}
          fill="rgba(46,204,113,0.45)"
          stroke="rgb(46,204,113)"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
