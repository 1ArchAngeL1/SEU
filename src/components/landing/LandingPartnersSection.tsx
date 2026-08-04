'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Handshake } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import { useAllLandingPartners } from '@/hooks/queries/use-landing-partners';
import { fileUrl } from '@/lib/file-url';
import { pickLocalized, type Locale } from '@/lib/i18n-helpers';
import type { LandingPartner } from '@/model/types/api';

function PartnerTile({
  partner,
  locale,
  duplicate = false,
}: {
  partner: LandingPartner;
  locale: Locale;
  /** Second (visual-only) copy in the marquee — hidden from a11y + tab order. */
  duplicate?: boolean;
}) {
  const src = fileUrl(partner.logoId);
  const name = pickLocalized(partner.nameEn, partner.nameKa, locale);

  const inner = (
    <div className="w-[220px] h-[120px] flex items-center justify-center border border-white/10 rounded-xl bg-dark-green px-6 transition-colors hover:border-white/25">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className="max-h-[72px] max-w-full object-contain opacity-80 hover:opacity-100 transition-opacity"
        />
      ) : (
        /* PLACEHOLDER: LOGO - landing partner logo missing, showing name fallback */
        <div className="flex items-center gap-2 text-secondary-grey">
          <Handshake className="size-5" />
          <span className="font-montserrat text-seu-caption-sm truncate max-w-[140px]">
            {name}
          </span>
        </div>
      )}
    </div>
  );

  return partner.websiteLink ? (
    <a
      href={partner.websiteLink}
      target="_blank"
      rel="noreferrer"
      aria-label={name}
      aria-hidden={duplicate || undefined}
      tabIndex={duplicate ? -1 : undefined}
      className="flex-shrink-0 mx-3 block"
    >
      {inner}
    </a>
  ) : (
    <div aria-hidden={duplicate || undefined} className="flex-shrink-0 mx-3">
      {inner}
    </div>
  );
}

export default function LandingPartnersSection() {
  const t = useTranslations('landingPartners');
  const locale = useLocale() as Locale;
  const { data, isLoading } = useAllLandingPartners();
  const partners = data ?? [];

  if (!isLoading && partners.length === 0) return null;

  // Repeat the partners so a single set is wide enough to fill large screens;
  // the whole set is then rendered twice so the -50% keyframe loops seamlessly.
  const minTiles = 8;
  const reps = Math.max(1, Math.ceil(minTiles / Math.max(partners.length, 1)));
  const looped: LandingPartner[] = [];
  for (let i = 0; i < reps; i++) looped.push(...partners);

  return (
    <section className="relative bg-site-bg py-20 overflow-hidden">
      <FadeIn className="max-w-[1920px] mx-auto px-5 lg:px-10 mb-8 lg:mb-12">
        <h2 className="font-bodoni text-seu-heading lg:text-seu-title text-site-fg-strong uppercase tracking-wide">
          {t('title')}
        </h2>
      </FadeIn>

      {isLoading ? (
        <div className="flex gap-6 px-5 lg:px-10 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-[220px] h-[120px] shrink-0 rounded-xl bg-site-bg-hover animate-pulse"
            />
          ))}
        </div>
      ) : (
        /* Infinite auto-scrolling marquee */
        <div className="relative">
          {/* Fade edges so tiles ease in/out instead of hard-clipping */}
          <div className="absolute left-0 top-0 bottom-0 w-20 lg:w-40 bg-gradient-to-r from-site-bg to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 lg:w-40 bg-gradient-to-l from-site-bg to-transparent z-10 pointer-events-none" />
          <div className="flex animate-infinite-scroll hover:[animation-play-state:paused] motion-reduce:animate-none will-change-transform">
            {/* First set */}
            {looped.map((partner, index) => (
              <PartnerTile
                key={`first-${partner.id}-${index}`}
                partner={partner}
                locale={locale}
              />
            ))}
            {/* Duplicate set for the seamless loop */}
            {looped.map((partner, index) => (
              <PartnerTile
                key={`second-${partner.id}-${index}`}
                partner={partner}
                locale={locale}
                duplicate
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
