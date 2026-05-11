'use client';

import Image from 'next/image';
import { User } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import { useTranslations } from 'next-intl';

const TEAM_MEMBERS = [
  { name: 'Kate Asyeladze', position: 'Marketing Lead' },
  { name: 'Kate Asyeladze', position: 'Marketing Lead' },
];

export default function AboutTeam() {
  const t = useTranslations('about');
  return (
    <div className="relative py-20 lg:py-28 overflow-hidden">
      {/* PLACEHOLDER: IMAGE - Team section background */}
      <div className="absolute inset-x-0 top-0 bottom-16 bg-secondary-black/60 flex items-center justify-center">
        <Image
          src="/common/svgs/SEUcolored.svg"
          alt="Team background"
          width={120}
          height={120}
          className="opacity-30"
        />
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
            {TEAM_MEMBERS.map((member, index) => (
              <FadeIn key={index} delay={index * 150} direction="up">
                <div className="w-40 lg:w-56 rounded-lg bg-site-bg overflow-hidden hover-lift">
                  {/* PLACEHOLDER: IMAGE - Team member photo */}
                  <div className="w-full h-44 lg:h-64 bg-secondary-black/40 flex items-center justify-center">
                    <User className="w-12 h-12 text-site-fg-dim" />
                  </div>
                  <div className="px-4 py-4 text-center">
                    <p className="font-montserrat font-semibold text-seu-caption text-site-fg uppercase tracking-wider">
                      {member.name}
                    </p>
                    <p className="font-montserrat font-normal text-seu-caption-sm text-site-fg-dim mt-1">
                      {member.position}
                    </p>
                  </div>
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
