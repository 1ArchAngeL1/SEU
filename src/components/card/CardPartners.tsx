'use client';

import PartnerCard from './PartnerCard';
import FadeIn from '@/components/FadeIn';
import { useLocale, useTranslations } from 'next-intl';
import { useAllPartners } from '@/hooks/queries/use-partners';
import { pickLocalized, type Locale } from '@/lib/i18n-helpers';

export default function CardPartners() {
  const t = useTranslations('card');
  const locale = useLocale() as Locale;
  const { data: partners = [], isLoading } = useAllPartners();

  return (
    <div className="py-20">
      <div className="max-w-[1920px] mx-auto px-5 lg:px-10">
        <FadeIn>
          <h2 className="font-[--font-bodoni] font-normal text-seu-heading lg:text-seu-title-lg leading-tight lg:leading-[4.1875rem] text-dark-green mb-8 lg:mb-12">
            {t('partners')}
          </h2>
        </FadeIn>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-site-bg rounded-lg p-6 h-40 animate-pulse"
              />
            ))}
          </div>
        ) : partners.length === 0 ? null : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {partners.map((partner, i) => (
              <FadeIn key={partner.id} delay={(i % 3) * 100} duration={600}>
                <PartnerCard
                  name={pickLocalized(partner.nameEn, partner.nameKa, locale)}
                  logoId={partner.logoId}
                  description={pickLocalized(partner.descriptionEn, partner.descriptionKa, locale)}
                  mail={partner.mail}
                  phone={partner.phone}
                  address={pickLocalized(partner.addressEn, partner.addressKa, locale)}
                  facebookLink={partner.facebookLink}
                  discountPercentage={partner.discountPercentage}
                />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
