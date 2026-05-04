'use client';

import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

export function ApartmentDetailHeader() {
  return (
    <div className="flex items-center justify-between mb-12">
      <Link href="/search">
        <Button
          type="button"
          variant="outline"
          className="gap-2 rounded-full border border-pale-gray/30 bg-transparent text-pale-gray font-montserrat text-seu-caption px-5 h-9 hover:bg-pale-gray/10 hover:border-pale-gray hover:text-pale-gray"
        >
          <ArrowLeft className="size-3" />
          Back
        </Button>
      </Link>

      <span className="font-montserrat text-seu-caption text-pale-gray/40 tracking-[0.2rem] uppercase">
        Floor Plan
      </span>

      <Button
        type="button"
        className="gap-2.5 rounded-lg bg-navy-green hover:bg-navy-green/80 border border-pale-gray/20 text-pale-gray font-montserrat text-seu-caption px-5 h-10"
      >
        <FileText className="size-4" />
        SEE PRESENTATION
      </Button>
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
      <div className="flex items-baseline gap-12 mb-8">
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
