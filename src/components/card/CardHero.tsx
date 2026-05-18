'use client';

import Image from 'next/image';
import FadeIn from '@/components/FadeIn';
import { useTranslations } from 'next-intl';

export default function CardHero() {
  const t = useTranslations('card');
  return (
    <div className="py-20">
      <div className="max-w-[1920px] mx-auto px-5 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left — Text */}
        <FadeIn direction="left">
          <h1 className="font-[--font-bodoni] font-normal text-seu-heading lg:text-seu-title-xl leading-tight lg:leading-[6rem] text-dark-green mb-4 lg:mb-8">
            {t('title')}
          </h1>
          <p className="font-montserrat font-normal text-seu-body lg:text-seu-subheading leading-relaxed lg:leading-[3.125rem] text-dark-green/60">
            {t('description')}
          </p>
        </FadeIn>

        {/* Right — Card Image */}
        <FadeIn direction="right" delay={200} className="flex flex-col items-center justify-center">
          <div className="relative">
            {/* Blurred background copy */}
            <Image
              src="/common/pngs/seu-card.png"
              alt=""
              width={363}
              height={514}
              aria-hidden
              className="absolute top-2 left-2 rounded-lg opacity-[0.46] blur-[37px] rotate-[5deg]"
            />
            {/* Card */}
            <Image
              src="/common/pngs/seu-card.png"
              alt="SEU Card"
              width={363}
              height={514}
              className="relative rounded-lg rotate-[5deg]"
            />
          </div>
          {/* Drop shadow — card projecting on floor */}
          <div className="w-[18rem] h-8 bg-dark-green/40 blur-[30px] mt-20 rounded-full" />
        </FadeIn>
      </div>
    </div>
  );
}
