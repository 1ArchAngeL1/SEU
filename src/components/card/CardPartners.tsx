'use client';

import PartnerCard from './PartnerCard';
import FadeIn from '@/components/FadeIn';
import { useTranslations } from 'next-intl';
import { useAllPartners } from '@/hooks/queries/use-partners';

export default function CardPartners() {
  const t = useTranslations('card');
  const { data: partners = [], isLoading } = useAllPartners();

  return (
    <div className="py-20">
      <div className="max-w-[1920px] mx-auto px-5 lg:px-10">
        <FadeIn>
          <h2 className="font-[--font-bodoni] font-normal text-seu-heading lg:text-seu-title-lg leading-tight lg:leading-[4.1875rem] text-[#0D2F21] mb-8 lg:mb-12">
            {t('partners')}
          </h2>
        </FadeIn>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-dark-green rounded-lg p-6 h-40 animate-pulse"
              />
            ))}
          </div>
        ) : partners.length === 0 ? null : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {partners.map((partner, i) => (
              <FadeIn key={partner.id} delay={(i % 3) * 100} duration={600}>
                <PartnerCard
                  name={partner.name}
                  logoId={partner.logoId}
                  description={partner.description}
                  mail={partner.mail}
                  phone={partner.phone}
                  address={partner.address}
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
