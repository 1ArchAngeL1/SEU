'use client';

import { useTranslations } from 'next-intl';
import { Handshake } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import { useAllPartners } from '@/hooks/queries/use-partners';
import { fileUrl } from '@/lib/file-url';
import type { Partner } from '@/model/types/api';

function PartnerTile({ partner }: { partner: Partner }) {
  const src = fileUrl(partner.logoId);
  return (
    <div className="flex-shrink-0 mx-3">
      <div className="w-[213px] h-[100px] flex items-center justify-center border border-white/10 rounded-xl bg-dark-green px-6">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={partner.name}
            className="max-h-[60px] max-w-full object-contain opacity-80 hover:opacity-100 transition-opacity"
          />
        ) : (
          <div className="flex items-center gap-2 text-secondary-grey">
            <Handshake className="size-5" />
            <span className="font-montserrat text-seu-caption-sm truncate max-w-[140px]">
              {partner.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SeuPartners() {
  const t = useTranslations('landing');
  const { data, isLoading } = useAllPartners();
  const partners = data ?? [];

  if (!isLoading && partners.length === 0) return null;

  // Need at least a few tiles to make the loop look continuous on wide screens
  const minTiles = 8;
  const reps = Math.max(1, Math.ceil(minTiles / Math.max(partners.length, 1)));
  const looped: Partner[] = [];
  for (let i = 0; i < reps; i++) looped.push(...partners);

  return (
    <section className="relative bg-site-bg py-20 overflow-hidden">
      <FadeIn className="max-w-[1920px] mx-auto px-5 lg:px-10 mb-8 lg:mb-12">
        <h2 className="font-bodoni text-seu-heading lg:text-seu-title text-site-fg-strong uppercase tracking-wide">
          {t('partners')}
        </h2>
      </FadeIn>

      {/* Infinite scroll container */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 lg:w-40 bg-gradient-to-r from-site-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 lg:w-40 bg-gradient-to-l from-site-bg to-transparent z-10 pointer-events-none" />
        <div className="flex animate-infinite-scroll hover:paused will-change-transform backface-hidden">
          {/* First set */}
          {looped.map((partner, index) => (
            <PartnerTile key={`first-${partner.id}-${index}`} partner={partner} />
          ))}
          {/* Duplicate set for seamless loop */}
          {looped.map((partner, index) => (
            <PartnerTile key={`second-${partner.id}-${index}`} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
}
