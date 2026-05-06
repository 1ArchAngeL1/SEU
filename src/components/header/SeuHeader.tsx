'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { HeaderTextLink } from '@/components/header/HeaderTextLink';
import { SeuLogoLink } from '@/components/header/SeuLogoLink';
import { LanguageSwitcher } from '@/components/header/LanguageSwitcher';
import { HeaderContactUs } from '@/components/header/HeaderContactUs';

export type HeaderVariant = 'dark' | 'light';

const lightPages = ['/search'];

export default function SeuHeader() {
  const pathname = usePathname();
  const t = useTranslations('header');

  const variant: HeaderVariant = lightPages.some((p) => pathname.startsWith(p))
    ? 'light'
    : 'dark';

  const leftLinks = [
    { label: t('visualSearch'), href: '/visual-search' as const },
    { label: t('searchApartment'), href: '/search' as const },
    { label: t('seuCard'), href: '/card' as const },
  ];

  const rightLinks = [
    { label: t('news'), href: '/news' as const },
    { label: t('about'), href: '/about' as const },
  ];

  return (
    <header
      className={`w-full flex items-center justify-between px-10 h-40 transition-colors duration-300 ${
        variant === 'light' ? 'bg-pale-gray' : 'bg-dark-green'
      }`}
    >
      {leftLinks.map((link) => (
        <HeaderTextLink
          key={link.href}
          href={link.href}
          pathName={pathname}
          variant={variant}
        >
          {link.label}
        </HeaderTextLink>
      ))}

      <SeuLogoLink variant={variant} />

      {rightLinks.map((link) => (
        <HeaderTextLink
          key={link.href}
          href={link.href}
          pathName={pathname}
          variant={variant}
        >
          {link.label}
        </HeaderTextLink>
      ))}

      <div className={'flex items-center justify-center gap-8'}>
        <HeaderContactUs variant={variant} />
        <LanguageSwitcher variant={variant} />
      </div>
    </header>
  );
}
