'use client';

import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export function ApartmentDetailHeader() {
  return (
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
      {/* Block & Floor */}
      <div className="flex items-baseline gap-16 mb-6">
        <div className="flex items-baseline gap-3">
          <span className="font-montserrat text-seu-body text-pale-gray/50">
            Block
          </span>
          <span className="font-[--font-bodoni] font-normal text-seu-title-xl text-pale-gray leading-none">
            {block}
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="font-montserrat text-seu-body text-pale-gray/50">
            Floor
          </span>
          <span className="font-[--font-bodoni] font-normal text-seu-title-xl text-pale-gray leading-none">
            {floor}
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
    </>
  );
}
