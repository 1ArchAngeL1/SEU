'use client';

import ContactForm from '@/components/ContactForm';
import ContactPanel from '@/components/ContactPanel';
import FadeIn from '@/components/FadeIn';
import { useTranslations } from 'next-intl';

const ContactPage = () => {
  const t = useTranslations('contact');
  return (
    <>
      {/* ===== MOBILE ===== */}
      <div className="lg:hidden flex flex-col flex-1 bg-dark-green">
        {/* Form area */}
        <div className="px-5 pt-8 pb-10">
          <FadeIn direction="up" duration={800}>
            <ContactForm className="max-w-2xl" />
          </FadeIn>
        </div>

        {/* Contact info panel */}
        <div className="px-5 pt-6 pb-10">
          <FadeIn direction="up" delay={200} duration={800}>
            <ContactPanel className="max-w-2xl" />
          </FadeIn>
        </div>
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:flex relative flex-1 min-h-0 overflow-hidden">
        {/* Dark section — clipped diagonal */}
        <div
          className="absolute inset-0 bg-site-bg"
          style={{ clipPath: 'polygon(0 0, 90% 0, 5% 100%, 0 100%)' }}
        />
        {/* Light section — opposite diagonal */}
        <div
          className="absolute inset-0 bg-pale-gray"
          style={{ clipPath: 'polygon(90% 0, 100% 0, 100% 100%, 5% 100%)' }}
        />
        {/* Content layer */}
        <div className="relative z-10 h-full flex flex-row flex-1 overflow-hidden">
          <div className="flex-1 flex items-start justify-start pt-16 px-10">
            <FadeIn direction="left" duration={900} className="w-full max-w-2xl">
              <ContactForm />
            </FadeIn>
          </div>
          <div className="flex-1 flex items-end justify-end pb-16 px-10">
            <FadeIn direction="right" delay={300} duration={900} className="w-full max-w-2xl">
              <ContactPanel lightBg />
            </FadeIn>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
