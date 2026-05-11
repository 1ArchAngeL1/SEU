'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import FadeIn from '@/components/FadeIn';

const PARTNERS = [
  { name: 'Bank of Georgia', logo: '/common/svgs/bog.svg' },
  { name: 'Bank of Georgia', logo: '/common/svgs/bog.svg' },
  { name: 'Bank of Georgia', logo: '/common/svgs/bog.svg' },
  { name: 'Bank of Georgia', logo: '/common/svgs/bog.svg' },
  { name: 'Bank of Georgia', logo: '/common/svgs/bog.svg' },
  { name: 'Bank of Georgia', logo: '/common/svgs/bog.svg' },
  { name: 'Bank of Georgia', logo: '/common/svgs/bog.svg' },
  { name: 'Bank of Georgia', logo: '/common/svgs/bog.svg' },
  { name: 'Bank of Georgia', logo: '/common/svgs/bog.svg' },
];

export default function SeuPartners() {
  const t = useTranslations('landing');
  return (
    <section className="bg-site-bg py-20 overflow-hidden">
      <FadeIn className="max-w-[1920px] mx-auto px-5 lg:px-10 mb-8 lg:mb-12">
        <h2 className="font-bodoni text-seu-heading lg:text-seu-title text-site-fg-strong uppercase tracking-wide">
          {t('partners')}
        </h2>
      </FadeIn>

      {/* Infinite scroll container */}
      <div className="relative">
        <div className="flex animate-infinite-scroll hover:paused will-change-transform backface-hidden">
          {/* First set of partners */}
          {PARTNERS.map((partner, index) => (
            <div key={`first-${index}`} className="flex-shrink-0 mx-3">
              <div className="w-[213px] h-[100px] flex items-center justify-center border border-site-border rounded-xl bg-site-bg px-6">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={180}
                  height={60}
                  className="object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {PARTNERS.map((partner, index) => (
            <div key={`second-${index}`} className="flex-shrink-0 mx-3">
              <div className="w-[213px] h-[100px] flex items-center justify-center border border-site-border rounded-xl bg-site-bg px-6">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={180}
                  height={60}
                  className="object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
