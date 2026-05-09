'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { HeaderTextLink } from '@/components/header/HeaderTextLink';
import { SeuLogoLink } from '@/components/header/SeuLogoLink';
import { LanguageSwitcher } from '@/components/header/LanguageSwitcher';
import { HeaderContactUs } from '@/components/header/HeaderContactUs';
import { MobileMenuSheet } from '@/components/header/MobileMenuSheet';

export type HeaderVariant = 'dark' | 'light';

export default function SeuHeader() {
  const pathname = usePathname();
  const t = useTranslations('header');
  const [sheetOpen, setSheetOpen] = useState(false);

  const variant: HeaderVariant = 'dark';

  const isContact = pathname === '/contact';

  const leftLinks = [
    { label: t('visualSearch'), href: '/visual-search' as const },
    { label: t('searchApartment'), href: '/search' as const },
    { label: t('seuCard'), href: '/card' as const },
  ];

  const rightLinks = [
    { label: t('news'), href: '/news' as const },
    { label: t('about'), href: '/about' as const },
  ];

  const mobileLinks = [
    { label: t('searchApartment'), href: '/search' as const },
    { label: t('seuCard'), href: '/card' as const },
    { label: t('news'), href: '/news' as const },
    { label: t('about'), href: '/about' as const },
    { label: t('contactUs'), href: '/contact' as const },
  ];

  return (
    <div className="sticky top-0 z-50">
      <header
        className={`w-full flex items-center justify-between px-3 lg:px-10 h-20 lg:h-32 transition-colors duration-300 ${
          isContact ? 'bg-transparent! lg:bg-dark-green!' : variant === 'light' ? 'bg-pale-gray' : 'bg-dark-green'
        }`}
      >
        {/* Mobile: logo left */}
        <Link href="/" className="lg:hidden">
          <div className={'flex gap-2'}>
            <Image
              src="/common/svgs/header-logo-mobile.svg"
              alt="SEU Development"
              width={52}
              height={46}
            />
            <div className={'flex flex-col justify-between py-1'}>
              <p
                className={`font-[--font-bodoni] font-normal text-seu-body leading-5.5 tracking-[0.169rem] ${variant === 'light' ? 'text-dark-green' : 'text-pale-gray'}`}
              >
                SEU
              </p>
              <p className="font-montserrat font-normal text-seu-caption-sm leading-[0.9375rem] text-secondary-grey">
                Development
              </p>
            </div>
          </div>
        </Link>

        {/* Desktop nav links left */}
        <div className="hidden lg:contents">
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
        </div>

        {/* Desktop center logo */}
        <div className="hidden lg:block">
          <SeuLogoLink variant={variant} />
        </div>

        {/* Desktop nav links right */}
        <div className="hidden lg:contents">
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
        </div>

        {/* Desktop contact + lang */}
        <div className="hidden lg:flex items-center justify-center gap-8">
          <HeaderContactUs variant={variant} />
          <LanguageSwitcher variant={variant} />
        </div>

        {/* Mobile hamburger — Sheet trigger */}
        <MobileMenuSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          links={mobileLinks}
          contactLabel={t('contactUs')}
        />
      </header>
    </div>
  );
}
