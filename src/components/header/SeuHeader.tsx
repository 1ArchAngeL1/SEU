'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { HeaderTextLink } from '@/components/header/HeaderTextLink';
import { SeuLogoLink } from '@/components/header/SeuLogoLink';
import { LanguageSwitcher } from '@/components/header/LanguageSwitcher';
import { HeaderContactUs } from '@/components/header/HeaderContactUs';

export default function SeuHeader() {
  const pathname = usePathname();
  const t = useTranslations('header');

  const leftLinks = [
    { label: t('searchApartment'), href: '/search' as const },
    { label: t('visualSearch'), href: '/visual-search' as const },
    { label: t('seuCard'), href: '/card' as const },
  ];

  const rightLinks = [
    { label: t('news'), href: '/news' as const },
    { label: t('about'), href: '/about' as const },
  ];

  return (
    <header className="w-full flex items-center justify-between px-10 h-40 bg-dark-green">
      {leftLinks.map((link) => (
        <HeaderTextLink key={link.href} href={link.href} pathName={pathname}>
          {link.label}
        </HeaderTextLink>
      ))}

      <SeuLogoLink />

      {rightLinks.map((link) => (
        <HeaderTextLink key={link.href} href={link.href} pathName={pathname}>
          {link.label}
        </HeaderTextLink>
      ))}

      <div className={"flex items-center justify-center gap-8"}>
        <HeaderContactUs />
        <LanguageSwitcher />
      </div>
    </header>
  );
}
