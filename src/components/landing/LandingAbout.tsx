'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import FadeIn from '@/components/FadeIn';

export default function LandingAbout() {
  const t = useTranslations('landing');
  return (
    <section className="bg-site-bg-alt py-16 lg:py-24">
      <div className="max-w-[1920px] mx-auto px-5 lg:px-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          {/* Left - Text Content */}
          <FadeIn direction="left" className="flex-1 max-w-xl">
            <h2 className="font-bodoni text-seu-title lg:text-seu-title-lg text-site-fg mb-8">
              {t('aboutSeu')}
            </h2>

            <div className="space-y-6 text-seu-body text-site-fg-muted leading-relaxed">
              <p>
                {t('aboutText1')}
              </p>

              <p>
                {t('aboutText2')}
              </p>

              <p>
                {t('aboutText3')}
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-block mt-10 bg-primary-orange text-white font-montserrat font-medium text-seu-body px-16 py-3 rounded-lg hover:bg-primary-orange/85 transition-colors"
            >
              {t('contact')}
            </Link>
          </FadeIn>

          {/* Right - Logo */}
          <FadeIn direction="right" delay={200} className="flex-1 flex items-center justify-center lg:justify-end lg:mr-52">
            <Image
              src="/common/svgs/SEUcolored.svg"
              alt="SEU Development Logo"
              width={400}
              height={400}
              className="w-[300px] h-[300px] lg:w-[400px] lg:h-[400px]"
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
