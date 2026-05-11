'use client';

import FadeIn from '@/components/FadeIn';
import { useTranslations } from 'next-intl';

export default function AboutMission() {
  const t = useTranslations('about');
  return (
    <div className="py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-5 lg:px-10 text-center">
        <FadeIn>
          <h2 className="font-[--font-bodoni] font-normal text-seu-title text-white mb-4">
            {t('ourMission')}
          </h2>
          <p className="font-[--font-bodoni] font-normal text-seu-body-lg text-pale-gray/70 italic mb-12">
            {t('realEstateSince')}
          </p>
        </FadeIn>

        <FadeIn delay={150} className="space-y-8 font-montserrat font-normal text-seu-body text-secondary-grey leading-relaxed">
          <p>{t('missionText1')}</p>

          <p>{t('missionText2')}</p>

          <p>{t('missionText3')}</p>

          <p>{t('missionText4')}</p>
        </FadeIn>
      </div>
    </div>
  );
}
