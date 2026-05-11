'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function FooterUpper() {
  const t = useTranslations('footer');

  const links = [
    { label: t('projects'), href: '#' },
    { label: t('seuCard'), href: '/card' },
    { label: t('privacyPolicy'), href: '/policy' },
    { label: t('news'), href: '#' },
    { label: t('about'), href: '#' },
  ];

  return (
    <nav className="w-full py-10 lg:py-0 lg:h-30 bg-site-footer-bg lg:bg-site-bg lg:border-t lg:border-b lg:border-site-border flex items-center">
      <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-0 justify-evenly w-full">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="font-montserrat font-medium text-seu-body leading-[1.375rem] tracking-[0.169rem] text-site-fg hover:text-site-fg-muted transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
