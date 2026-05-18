'use client';

import Image from 'next/image';
import FadeIn from '@/components/FadeIn';
import { useTranslations } from 'next-intl';

export default function NewsHero() {
  const t = useTranslations('news');
  return (
    <div className="relative h-[50dvh] lg:h-[60dvh] overflow-hidden">
      <Image
        src="/common/pngs/seu_news.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-top"
      />
      {/* Darken overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-site-bg/85 via-site-bg/55 to-site-bg/20" />

      {/* Fade gradient on top */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-site-bg to-transparent" />
      {/* Fade gradient on bottom */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-site-bg to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-[1920px] mx-auto px-5 lg:px-10 pt-16 lg:pt-24">
        <FadeIn direction="left" duration={900}>
          <p className="font-montserrat font-medium text-seu-caption-sm lg:text-seu-caption text-site-fg-muted uppercase tracking-widest mb-3">
            {t('seuDevelopment')}
          </p>
          <h1 className="font-[--font-bodoni] font-normal text-seu-title lg:text-seu-title-xl text-site-fg-strong">
            {t('title')}
          </h1>
        </FadeIn>
      </div>
    </div>
  );
}
