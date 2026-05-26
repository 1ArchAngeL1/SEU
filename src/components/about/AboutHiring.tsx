'use client';

import FadeIn from '@/components/FadeIn';
import { useTranslations } from 'next-intl';

export default function AboutHiring() {
  const t = useTranslations('about');
  return (
    <div className="bg-pale-gray py-20 lg:py-28">
      <div className="max-w-[1920px] mx-auto px-5 lg:px-10">
        <div className="flex flex-col lg:flex-row gap-0">
          {/* Left - Title & Info Box */}
          <FadeIn direction="left" className="w-full lg:w-1/2 flex flex-col justify-between pr-0 lg:pr-20">
            <div>
              <h2 className="font-[--font-bodoni] font-normal text-seu-title text-dark-green uppercase mb-4">
                {t('weAreHiring')}
              </h2>
              <p className="font-[--font-bodoni] font-normal text-seu-body-lg text-dark-green/50 italic">
                {t('benefitsWorking')}
              </p>
            </div>

            {/* PLACEHOLDER: IMAGE - Hiring section image */}
            <div className="w-40 h-40 lg:w-52 lg:h-52 rounded-full bg-dark-green/10 flex items-center justify-center my-8 mx-auto lg:mx-0">
              <span className="text-dark-green/30 font-montserrat text-seu-caption">Image</span>
            </div>

            {/* Dark info box */}
            <div className="mt-auto -ml-5 lg:-ml-10 -mr-0 lg:-mr-20 bg-dark-green px-5 lg:px-10 py-16">
              <p className="font-montserrat font-medium text-seu-body text-pale-gray leading-relaxed">
                {t('hiringDescription')}
              </p>
            </div>
          </FadeIn>

          {/* Right - Job Listing */}
          <FadeIn direction="right" delay={200} className="w-full lg:w-1/2 bg-white/60 border border-dark-green/10 rounded-lg p-10">
            <h3 className="font-[--font-bodoni] font-normal text-seu-heading text-dark-green uppercase mb-2">
              {t('marketing')}
            </h3>
            <p className="font-montserrat font-semibold text-seu-caption-sm text-secondary-grey leading-tight mb-4">
              {t('marketingDesc1')}
            </p>

            <hr className="border-dark-green/15 mb-6" />

            <div className="space-y-5 font-montserrat font-normal text-seu-caption text-secondary-grey leading-relaxed">
              <p>{t('marketingText1')}</p>

              <p>{t('marketingText2')}</p>

              <p>{t('marketingText3')}</p>

              <p>{t('marketingText4')}</p>

              <p>{t('marketingText5')}</p>
            </div>

            <button className="mt-8 bg-primary-green text-white font-montserrat font-medium text-seu-caption px-8 py-2 rounded-lg hover:bg-primary-green/85 transition-colors uppercase">
              {t('sendResume')}
            </button>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
