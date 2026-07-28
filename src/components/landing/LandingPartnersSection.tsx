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
}: {
  partner: LandingPartner;
  locale: Locale;
}) {
  const src = fileUrl(partner.logoId);
  const name = pickLocalized(partner.nameEn, partner.nameKa, locale);

  const inner = (
    <div className="w-full h-[120px] flex items-center justify-center border border-white/10 rounded-xl bg-dark-green px-6 transition-colors hover:border-white/25">
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
      className="block"
    >
      {inner}
    </a>
  ) : (
    inner
  );
}

export default function LandingPartnersSection() {
  const t = useTranslations('landingPartners');
  const locale = useLocale() as Locale;
  const { data, isLoading } = useAllLandingPartners();
  const partners = data ?? [];

  if (!isLoading && partners.length === 0) return null;

  return (
    <section className="relative bg-site-bg py-20 overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-5 lg:px-10">
        <FadeIn className="mb-8 lg:mb-12">
          <h2 className="font-bodoni text-seu-heading lg:text-seu-title text-site-fg-strong uppercase tracking-wide">
            {t('title')}
          </h2>
          <p className="mt-3 font-montserrat text-seu-body text-site-fg-muted max-w-2xl">
            {t('subtitle')}
          </p>
        </FadeIn>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-[120px] rounded-xl bg-site-bg-hover animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {partners.map((partner, i) => (
              <FadeIn key={partner.id} delay={(i % 5) * 80} duration={500}>
                <PartnerTile partner={partner} locale={locale} />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
