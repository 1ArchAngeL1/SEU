'use client';

import FadeIn from '@/components/FadeIn';
import PartnerCard from '@/components/card/PartnerCard';
import { useTranslations } from 'next-intl';
import { useAllPartners } from '@/hooks/queries/use-partners';

export default function AboutPartners() {
  const t = useTranslations('about');
  const { data: partners = [], isLoading } = useAllPartners();

  return (
    <div>
      {/* Light header area */}
      <div className="bg-pale-gray pt-12 lg:pt-16 pb-0">
        <div className="max-w-[1920px] mx-auto px-5 lg:px-10">
          <FadeIn direction="left">
            <h2 className="font-[--font-bodoni] font-normal text-seu-title text-dark-green uppercase">
              {t('partners')}
            </h2>
          </FadeIn>
        </div>
      </div>

      {/* Dark area */}
      <div className="bg-dark-green pt-3 pb-12 lg:pb-16">
        <div className="max-w-[1920px] mx-auto px-5 lg:px-10">
          <p className="font-montserrat font-normal text-seu-body text-secondary-grey mb-12">
            {t('partnersCount')}
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-56 rounded-2xl bg-white/5 animate-pulse"
                />
              ))}
            </div>
          ) : partners.length === 0 ? null : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {partners.map((partner, i) => (
                <FadeIn key={partner.id} delay={(i % 4) * 80} duration={500}>
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
    </div>
  );
}
