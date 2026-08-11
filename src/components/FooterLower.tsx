'use client';

import Image from 'next/image';
import { Instagram } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function FooterLower() {
  const t = useTranslations('footer');
  return (
    <div className="relative w-full bg-site-footer-bg py-12 lg:py-0 lg:h-82 flex flex-col lg:grid lg:grid-cols-3 items-center gap-8 lg:gap-0 px-5 lg:px-10 site-noise">
      {/* Social Icons */}
      <div className="flex items-center gap-10 lg:gap-18 justify-self-start lg:order-none order-last">
        <a
          href="https://www.facebook.com/photo/?fbid=545516530942763&set=a.545516477609435"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="hover:opacity-80 transition-opacity"
        >
          <Image
            src="/common/svgs/facebook-icon.svg"
            alt="Facebook"
            width={48}
            height={48}
            className="w-8 h-8 lg:w-12 lg:h-12"
          />
        </a>
        {/* PLACEHOLDER: ICON - Instagram (no instagram-icon.svg asset; Lucide feather icon matches the grey stroke style) */}
        <a
          href="https://www.instagram.com/seudevelopment/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="hover:opacity-80 transition-opacity text-secondary-grey"
        >
          <span className="flex items-center justify-center w-8 h-8 lg:w-12 lg:h-12">
            <Instagram className="w-4 h-4 lg:w-6 lg:h-6" strokeWidth={2} />
          </span>
        </a>
        <a
          href="https://www.youtube.com/@seudevelopment9577"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
          className="hover:opacity-80 transition-opacity"
        >
          <Image
            src="/common/svgs/youtube-icon.svg"
            alt="YouTube"
            width={48}
            height={48}
            className="w-8 h-8 lg:w-12 lg:h-12"
          />
        </a>
      </div>

      {/* Center Text — hidden on mobile */}
      <div className="hidden lg:block text-center justify-self-center">
        <p className="font-montserrat font-normal text-seu-heading-lg leading-12.25 tracking-[0.375rem] text-site-fg-muted">
          {t('seu')}
        </p>
        <p className="font-montserrat font-normal text-seu-heading-lg leading-12.25 tracking-[0.375rem] text-site-fg-muted">
          {t('development')}
        </p>
      </div>

      {/* Logo — hidden on mobile */}
      <Image
        src="/common/svgs/seu-logo.svg"
        alt="SEU Development Logo"
        width={133}
        height={117}
        className="object-contain justify-self-end hidden lg:block"
      />
    </div>
  );
}
