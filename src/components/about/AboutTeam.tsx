'use client';

import Image from 'next/image';
import FadeIn from '@/components/FadeIn';
import { useTranslations } from 'next-intl';

// TEMPORARY: team members hidden — render logo-only cards until real
// member photos/names/positions are provided.
const TEAM_MEMBERS = [{}, {}];

export default function AboutTeam() {
  const t = useTranslations('about');
  return (
    <div className="relative py-20 lg:py-28 overflow-hidden">
      {/* Team section background */}
      <div className="absolute inset-x-0 top-0 bottom-16">
        <Image
          src="/about/ourteam.jpg"
          alt="Team background"
          fill
          className="object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-secondary-black/60" />
      </div>

      {/* Fade gradient on top */}
      <div className="absolute inset-x-0 top-0 h-10 z-[1] bg-gradient-to-b from-site-bg to-transparent" />
      {/* Fade gradient on bottom */}
      <div className="absolute inset-x-0 bottom-16 h-10 z-[1] bg-gradient-to-t from-site-bg to-transparent" />

      <div className="relative z-10 h-full max-w-[1920px] mx-auto px-5 lg:px-10 flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left - Text */}
          <FadeIn direction="left" className="flex-1 max-w-xl">
            <h2 className="font-[--font-bodoni] font-normal text-seu-title text-site-fg-strong uppercase mb-4">
              {t('ourTeam')}
            </h2>
            <p className="font-[--font-bodoni] font-normal text-seu-body-lg text-site-fg-dim italic">
              {t('meetOurLeaders')}
            </p>
          </FadeIn>

          {/* Right - Team Members */}
          <div className="flex-1 flex gap-4 lg:gap-6 justify-center lg:justify-end">
            {TEAM_MEMBERS.map((_, index) => (
              <FadeIn key={index} delay={index * 150} direction="up">
                {/* TEMPORARY: logo-only card (no name/position) */}
                <div className="w-40 lg:w-56 h-52 lg:h-80 rounded-lg bg-site-bg overflow-hidden hover-lift flex items-center justify-center p-8">
                  <Image
                    src="/common/pngs/seu-logo-green.png"
                    alt="SEU Development"
                    width={140}
                    height={140}
                    className="w-20 h-20 lg:w-28 lg:h-28 object-contain opacity-90"
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        <p className="font-montserrat font-semibold text-seu-caption text-site-fg-muted leading-relaxed mt-6 mb-16 max-w-xl">
          {t('teamDescription')}
        </p>
      </div>
    </div>
  );
}
