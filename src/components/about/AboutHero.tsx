'use client';

import Image from 'next/image';
import FadeIn from '@/components/FadeIn';
import { useTranslations } from 'next-intl';

export default function AboutHero() {
  const t = useTranslations('about');
  return (
    <div className="relative h-[calc(100dvh-5rem)] lg:h-[calc(100dvh-10rem)] overflow-hidden">
      {/* PLACEHOLDER: IMAGE - Office/lounge interior with SEU logo on wall */}
      <div className="absolute inset-0 bg-secondary-black/60 flex items-center justify-center">
        <Image
          src="/common/svgs/SEUcolored.svg"
          alt="SEU Development Office"
          width={120}
          height={120}
          className="opacity-30"
        />
      </div>

      {/* Fade gradient on top */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-site-bg to-transparent" />
      {/* Fade gradient on bottom */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-site-bg to-transparent" />

      {/* Content overlaid on image */}
      <div className="relative z-10 max-w-[1920px] mx-auto px-5 lg:px-10 pt-16 lg:pt-24">
        <FadeIn direction="left" duration={900}>
          <p className="font-montserrat font-medium text-seu-body-sm lg:text-seu-body text-site-fg mb-2">
            {t('companyTeam')}
          </p>
          <h1 className="font-[--font-bodoni] font-normal text-seu-heading lg:text-seu-title-lg text-site-fg">
            {t('seuDevelopment')}
          </h1>
        </FadeIn>
      </div>
    </div>
  );
}
