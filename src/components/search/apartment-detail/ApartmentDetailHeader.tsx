'use client';

import { ArrowLeft, FileText } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';

export function ApartmentDetailHeader() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-8 lg:mb-12">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 rounded-full border border-pale-gray/30 bg-transparent text-pale-gray font-montserrat text-seu-caption px-4 lg:px-5 h-9 hover:bg-pale-gray/10 hover:border-pale-gray transition-colors"
      >
        <ArrowLeft className="size-3" />
        <span className="hidden sm:inline">Back</span>
      </button>

      <span className="hidden sm:block font-montserrat text-seu-caption text-pale-gray/40 tracking-[0.2rem] uppercase">
        Floor Plan
      </span>

      <button
        type="button"
        className="inline-flex items-center gap-2 lg:gap-2.5 rounded-lg bg-navy-green hover:bg-navy-green/80 border border-pale-gray/20 text-pale-gray font-montserrat text-seu-caption-sm lg:text-seu-caption px-3 lg:px-5 h-9 lg:h-10 transition-colors"
      >
        <FileText className="size-4" />
        <span className="hidden sm:inline">SEE PRESENTATION</span>
        <span className="sm:hidden">PDF</span>
      </button>
    </div>
  );
}

interface ApartmentMetaHeaderProps {
  block: string;
  floor: number;
  apartmentNumber: string | number;
}

export function ApartmentMetaHeader({
  block,
  floor,
  apartmentNumber,
}: ApartmentMetaHeaderProps) {
  return (
    <>
      {/* Block & Floor — inline label + serif value */}
      <div className="flex items-baseline gap-8 lg:gap-12 mb-6 lg:mb-8">
        <div className="flex items-baseline gap-3">
          <span className="font-montserrat text-seu-body text-pale-gray/50">
            Block
          </span>
          <span className="font-[--font-bodoni] font-normal text-seu-heading-lg text-pale-gray leading-none">
            {block}
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="font-montserrat text-seu-body text-pale-gray/50">
            Floor
          </span>
          <span className="font-[--font-bodoni] font-normal text-seu-heading-lg text-pale-gray leading-none">
            {floor}
          </span>
        </div>
      </div>

      {/* Apartment Number — larger serif */}
      <div className="flex items-baseline gap-4 mb-10">
        <span className="font-montserrat text-seu-body text-pale-gray/50">
          Apartment N
        </span>
        <span className="font-[--font-bodoni] font-normal text-seu-title text-pale-gray leading-none">
          {apartmentNumber}
        </span>
      </div>
    </>
  );
}
