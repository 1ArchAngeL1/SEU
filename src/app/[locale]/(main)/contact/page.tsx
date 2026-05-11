'use client';

import ContactForm from '@/components/ContactForm';
import ContactPanel from '@/components/ContactPanel';
import { useTranslations } from 'next-intl';

const ContactPage = () => {
  const t = useTranslations('contact');
  return (
    <>
      {/* ===== MOBILE ===== */}
      <div className="lg:hidden flex flex-col flex-1">
        {/* Diagonal split section — form area */}
        <div className="relative flex-1 overflow-hidden">
          {/* Light bg (top-left triangle) */}
          <div
            className="absolute inset-0 bg-site-bg-alt"
            style={{ clipPath: 'polygon(0 0, 100% 0, 0 65%)' }}
          />
          {/* Dark bg (bottom-right triangle) */}
          <div
            className="absolute inset-0 bg-site-bg"
            style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%, 0 65%)' }}
          />

          {/* Content */}
          <div className="relative z-10 px-5 pt-8 pb-10">
            <ContactForm className="max-w-xl" variant="mobile-diagonal" />
          </div>
        </div>

        {/* Contact info panel — dark section below */}
        <div className="bg-site-bg px-5 pt-6 pb-10">
          <ContactPanel className="max-w-xl" />
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
          className="absolute inset-0 bg-site-bg-alt"
          style={{ clipPath: 'polygon(90% 0, 100% 0, 100% 100%, 5% 100%)' }}
        />
        {/* Content layer */}
        <div className="relative z-10 h-full flex flex-row flex-1 overflow-hidden">
          <div className="flex-1 flex items-start justify-start pt-16 pl-10">
            <ContactForm className="max-w-2xl" />
          </div>
          <div className="flex-1 flex items-end justify-end pb-16 pr-10">
            <ContactPanel
              className="max-w-2xl"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
