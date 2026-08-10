'use client';

import { use, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Download } from 'lucide-react';
import { ApartmentPresentation } from '@/components/presentation/ApartmentPresentation';
import { useUnit } from '@/hooks/queries/use-units';
import { useProject } from '@/hooks/queries/use-projects';
import { useBuilding } from '@/hooks/queries/use-buildings';
import { useFloor } from '@/hooks/queries/use-floors';
import { pickLocalized, type Locale } from '@/lib/i18n-helpers';
import { isProjectVisible, isUnitVisible, refId } from '@/lib/visibility';

export default function ApartmentPresentationPage({
  params,
}: {
  params: Promise<{ apartment: string }>;
}) {
  const { apartment: id } = use(params);
  const locale = useLocale() as Locale;
  const t = useTranslations('presentation');
  const tc = useTranslations('common');

  const unitQ = useUnit(id);
  const unit = unitQ.data;

  const projectId = unit
    ? typeof unit.project === 'string'
      ? unit.project
      : unit.project?.id
    : undefined;
  const projectQ = useProject(projectId);

  const floorId = unit
    ? typeof unit.floor === 'string'
      ? unit.floor
      : unit.floor?.id
    : undefined;
  const floorQ = useFloor(floorId);

  // `unit.building` may be a bare id, which carries no Active flag — fetch the
  // block so a deactivated one is caught on a direct link too.
  const buildingQ = useBuilding(refId(unit?.building));

  // Give the saved PDF a meaningful filename.
  useEffect(() => {
    if (!unit) return;
    const name = projectQ.data
      ? pickLocalized(projectQ.data.nameEn, projectQ.data.nameKa, locale)
      : '';
    document.title = `SEU — ${name} — ${t('apartmentNo')} ${unit.unitNumber}`.trim();
  }, [unit, projectQ.data, locale, t]);

  if (
    unitQ.isLoading ||
    (projectId && projectQ.isLoading) ||
    (floorId && floorQ.isLoading) ||
    buildingQ.isLoading
  ) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-neutral-200">
        <span className="font-montserrat text-seu-body text-dark-green">
          {tc('loading')}
        </span>
      </div>
    );
  }

  if (!unit) notFound();

  // Gone from the public site once the unit, its block or its project is
  // switched off in the admin panel.
  if (!isUnitVisible(unit)) notFound();
  if (projectQ.isSuccess && !isProjectVisible(projectQ.data)) notFound();
  if (buildingQ.isSuccess && buildingQ.data.isActive === false) notFound();

  return (
    <div className="presentation-screen min-h-dvh bg-neutral-300 py-8">
      {/* Print/download control — hidden on the printed page */}
      <button
        type="button"
        onClick={() => window.print()}
        className="no-print fixed top-5 right-5 z-10 inline-flex items-center gap-2 rounded-lg bg-dark-green hover:bg-dark-green/90 text-white font-montserrat font-medium text-seu-caption px-5 h-11 shadow-lg transition-colors"
      >
        <Download className="size-4" />
        {t('download')}
      </button>

      <ApartmentPresentation unit={unit} project={projectQ.data} floor={floorQ.data} />

      <style>{`
        @page { size: A4; margin: 0; }
        .print-exact {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print { display: none !important; }
          .presentation-screen {
            background: #fff !important;
            padding: 0 !important;
            min-height: 0 !important;
          }
          .presentation-sheet {
            box-shadow: none !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
